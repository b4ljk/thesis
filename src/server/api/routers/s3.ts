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

function getPresignedPost({
  s3,
  params,
}: GetSignedUrlInput): Promise<PresignedPost> {
  return new Promise<PresignedPost>((resolve, reject) => {
    s3.createPresignedPost(params, function (err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

export const s3Router = createTRPCRouter({
  getSignedUrl: protectedProcedure
    .input(signUrlSchema)
    .mutation(async ({ input, ctx }) => {
      if (input.size > MAX_FILE_SIZE_BYTES) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Файлын хэмжээ ${MAX_FILE_SIZE_MB} MB-ээс их байна`,
        });
      }

      const s3 = new aws.S3();
      const fileKey = "user_files/" + input.filename;
      const params: PresignedPost.Params = {
        Bucket: process.env.S3_BUCKET,
        Fields: {
          key: fileKey,
          "Content-Type": input.filetype,
        },
        Conditions: [["content-length-range", 0, MAX_FILE_SIZE_BYTES]],
        Expires: 20,
      };

      const postPresignedUrl = await getPresignedPost({
        s3,
        params,
      });

      const dbResponse = await ctx.db.userUploadedFiles.create({
        data: {
          fileName: fileKey,
          filePath: postPresignedUrl.url,
          userId: ctx.session.user.id,
        },
      });

      console.log(dbResponse);

      return { ...postPresignedUrl, file_key: fileKey, db_id: dbResponse.id };
    }),
});
