import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.AWS_REGION,
});

export const s3 = new AWS.S3();

export default AWS;
