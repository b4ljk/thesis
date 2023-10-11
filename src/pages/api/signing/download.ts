// pages/api/downloadFile.ts
//
import { type NextApiRequest, type NextApiResponse } from "next";
import aws from "aws-sdk";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const s3 = new aws.S3();

  const params: aws.S3.GetObjectRequest = {
    Bucket: process.env.S3_BUCKET!,
    Key: req.query.filename as string,
  };

  // Set the appropriate headers
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${req.query.filename}`,
  );

  // Use the S3.getObject().createReadStream() method to pipe file data directly into the response
  s3.getObject(params).createReadStream().pipe(res);
}
