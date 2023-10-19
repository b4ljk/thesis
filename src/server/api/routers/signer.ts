import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { signUrlSchema } from "~/utils/schemas";
import { s3 } from "~/utils/aws";
import { signatureSchema } from "~/lib/schemas/signing";
import { type GetObjectRequest } from "aws-sdk/clients/s3";
import { downloadFileFromS3 } from "~/lib/awsHelper";

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
    }),
});
