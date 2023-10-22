import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { signUrlSchema } from "~/utils/schemas";
import { s3 } from "~/utils/aws";
import { signatureSchema } from "~/lib/schemas/signing";
import { type GetObjectRequest } from "aws-sdk/clients/s3";
import { downloadFileFromS3 } from "~/lib/awsHelper";
import crypto from "crypto";

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

      const privateKey = crypto.createPrivateKey({
        key: privateKeyFile.Body as Buffer,
        passphrase: input.passphrase,
      });

      const signer = crypto.createSign("RSA-SHA256");

      signer.update(s3Obj.Body as Buffer);

      const signature = signer.sign(privateKey, "hex");

      const createdDigest = await ctx.db.signatureDigest.create({
        data: {
          digest: signature,
          userId: ctx.session.user.id,
          fileName: fileData.fileName,
        },
      });

      return signature;
    }),
});
