import aws from "aws-sdk";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { signUrlSchema } from "~/utils/schemas";
import { type PresignedPost } from "aws-sdk/clients/s3";

const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

aws.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.AWS_REGION,
});

interface GetSignedUrlInput {
  s3: aws.S3;
  params: aws.S3.PresignedPost.Params;
}

function getPresignUrlPromiseFunction(
  s3: aws.S3,
  s3Params: unknown,
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      s3.getSignedUrl("putObject", s3Params, function (err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    } catch (error) {
      return reject(error);
    }
  });
}

export const s3Router = createTRPCRouter({
  getSignedUrl: protectedProcedure
    .input(signUrlSchema)
    .mutation(async ({ input }) => {
      if (input.size > MAX_FILE_SIZE_BYTES) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Файлын хэмжээ ${MAX_FILE_SIZE_MB} MB-ээс их байна`,
        });
      }
      console.log(input);

      const s3 = new aws.S3();
      const params = {
        Bucket: process.env.S3_BUCKET,
        Fields: {
          key: input.filename,
        },
        Conditions: [
          ["content-length-range", 0, MAX_FILE_SIZE_BYTES],
          { "Content-Type": input.filetype },
        ],
        Expires: 120,
      };

      const s3Params = {
        Bucket: process.env.S3_BUCKET,
        Key: input.filename,
        Expires: 10,
        ContentType: input.filetype,
      };

      const signedUrl = await getPresignUrlPromiseFunction(s3, s3Params);
      return signedUrl;
    }),
});
