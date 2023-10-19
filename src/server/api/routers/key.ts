import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  downloadFileFromS3,
  s3OneTimeDownload,
  uploadFiletoS3,
} from "~/lib/awsHelper";
import crypto from "crypto";
import { createKeySchema } from "~/lib/schemas/key";
import { create } from "domain";

export const secretKeyRoute = createTRPCRouter({
  createKey: protectedProcedure
    .input(createKeySchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const existingPublicKey = await ctx.db.userGeneratedKeys.findFirst({
        where: {
          userId,
        },
      });
      if (existingPublicKey)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Танд үүссэн түлхүүр байна.",
        });

      const passphrase = input.secretPassphrase;

      const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
          cipher: "aes-256-cbc",
          passphrase: passphrase,
        },
      });

      const publicKeyLocation = `public/${userId}.pem`;
      const privateKeyLocation = `private/${userId}.pem`;

      const publicUploaded = uploadFiletoS3(
        process.env.S3_BUCKET!,
        publicKeyLocation,
        Buffer.from(publicKey),
      );
      const privateUploaded = uploadFiletoS3(
        process.env.S3_BUCKET!,
        privateKeyLocation,
        Buffer.from(privateKey),
      );

      const [publicKeyUrl, privateKeyUrl] = await Promise.all([
        publicUploaded,
        privateUploaded,
      ])
        .then((res) => {
          return res.map((r) => r);
        })
        .catch((err) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Түлхүүр үүсгэхэд алдаа гарлаа",
          });
        });

      const createdKey = await ctx.db.userGeneratedKeys.create({
        data: {
          publicKeyLink: publicKeyLocation,
          privateKeyLink: privateKeyLocation,
          userId,
        },
      });
      const downloadUrl = await s3OneTimeDownload(
        process.env.S3_BUCKET!,
        privateKeyLocation,
      );

      console.log("downloadUrl", downloadUrl);

      return {
        ...createdKey,
        downloadUrl,
      };
    }),
});
