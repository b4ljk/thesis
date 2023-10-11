import { type PresignedPost } from "aws-sdk/clients/s3";
import { s3 } from "~/utils/aws";

export const uploadToSignedUrl = async ({
  signedUploadUrl,
  file,
}: {
  signedUploadUrl: PresignedPost;
  file: File;
}) => {
  const form = new FormData();

  Object.keys(signedUploadUrl.fields).forEach((key) =>
    form.append(key, signedUploadUrl.fields[key]!),
  );
  form.append("file", file);

  const response = await fetch(signedUploadUrl.url, {
    method: "POST",
    body: form,
  });
  console.log(response);
};

export const downloadFileFromS3 = async (
  bucketName: string,
  fileName: string,
) => {
  console.log("downloadFileFromS3", bucketName, fileName);

  const params = {
    Bucket: bucketName,
    Key: fileName,
  };
  try {
    const data = await s3.getObject(params).promise();
    return data;
  } catch (error) {
    throw new Error(`Could not retrieve file from S3: ${error as string}`);
  }
};
