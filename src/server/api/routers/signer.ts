/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { signUrlSchema } from "~/utils/schemas";
import { s3 } from "~/utils/aws";
import { signatureSchema } from "~/lib/schemas/signing";
import { type GetObjectRequest } from "aws-sdk/clients/s3";
import {
  downloadFileFromS3,
  s3OneTimeDownload,
  uploadFiletoS3,
} from "~/lib/awsHelper";
import crypto from "crypto";
import { plainAddPlaceholder } from "@signpdf/placeholder-plain";
import { P12Signer } from "@signpdf/signer-p12";
import signpdf from "@signpdf/signpdf";
import fs from "fs";
import { publicProcedure } from "../trpc";

export const signerRoute = createTRPCRouter({
  signDocument: protectedProcedure
    .input(signatureSchema)
    .mutation(async ({ input, ctx }) => {
      const fileData = await ctx.db.userUploadedFiles.findUnique({
        where: {
          id: input.file_id,
        },
      });

      if (!fileData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Файл олдсонгүй.",
        });
      }

      const s3Obj = await downloadFileFromS3(
        process.env.S3_BUCKET!,
        fileData.fileName,
      );

      if (!s3Obj) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Файл олдсонгүй.",
        });
      }

      const userKey = await ctx.db.userGeneratedKeys.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (!userKey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Танд түлхүүр үүсээгүй байна.",
        });
      }

      const privateKeyFile = await downloadFileFromS3(
        process.env.S3_BUCKET!,
        userKey.privateKeyLink,
      );

      if (!privateKeyFile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Танд түлхүүр үүсээгүй байна.",
        });
      }

      const certificateBuffer = fs.readFileSync(`public/certificate.p12`);

      const privateKey = crypto.createPrivateKey({
        key: privateKeyFile.Body as Buffer,
        passphrase: input.passphrase,
      });

      const pdfBuffer = s3Obj.Body as Buffer;
      const serverSigner = new P12Signer(certificateBuffer, {
        passphrase: "QWE!@#qwe123",
      });

      const pdfWithPlaceholder = plainAddPlaceholder({
        pdfBuffer,
        reason: "CloudSign.mn-г ашиглан энэ баримтыг баталгаажуулав.",
        contactInfo: ctx.session.user.email ?? "info@cloudsign.mn",
        name: ctx.session.user.name ?? "CloudSign.mn",
        location: "Ulaanbaatar, Mongolia",
      });

      const signedPdf = await signpdf.sign(pdfWithPlaceholder, serverSigner);

      const signer = crypto.createSign("RSA-SHA256");
      signer.update(signedPdf);

      const signature = signer.sign(privateKey, "hex");

      console.log("signature", signature);

      const createdDigest = await ctx.db.signatureDigest.create({
        data: {
          digest: signature,
          userId: ctx.session.user.id,
          fileName: fileData.fileName,
        },
      });

      const upload_key = "user_files/" + createdDigest.id + ".pdf";

      const uploaded = await uploadFiletoS3(
        process.env.S3_BUCKET!,
        upload_key,
        signedPdf,
      );

      const downloadUrl = await s3OneTimeDownload(
        process.env.S3_BUCKET!,
        upload_key,
        5,
      );

      return { signature, downloadUrl };
    }),

  // publicProcedure.
});
