/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from "next";
import { downloadFileFromS3 } from "~/lib/awsHelper";
import { addSignatureToPDF, signPDF } from "~/lib/signing";

const private_key = `-----BEGIN RSA PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFMqe4+wDWmewb
zrMCPpHLNp6Qh7wh0h7UmPf92A2W41r9TN0h7CtuVJoGhCwsytQeJXvSnlXXTPLd
tnvRkmA7JFvCRNoGymPBX6Lwe1NRi0P8mOQG8mreaJ4zbV2rd7TutOeGn766A7QB
u6JRO/UAgRfRFiSkQZiWZw8BI3+XHvaWks4AE5sowD02UfVWIRZ7A583nItzf3FI
RgW5CCc95Lzk5i/hYon01eAxV0Z6dlTq5Ri1txxo0GZY3p9hWk+PwethDRTntrNB
5y7a7Guy0A8JaRgliOfsgP4XBCngBzns+gi7FhIHPk2OaNbVHvPxahM7q0rnhSO9
NIMOshbJAgMBAAECggEAbGdTUloRdOd6pzKyr0osJXUqJ7OmVUVIE4Df2xi5J7hm
HZbyfSJyIZ26aligXCNIBiZ+8iJ+d/PiEsWtPWDlK73p/1qQLGl3+yaS0PZKsCoJ
vsNhnvwGiasjRIwbkRYmTY7/M79/PoyomMdIDLYUEinlKNiuXel9czjGQ8765dx1
kBaNZBA25pz5RwvWsZ6+W3/Z4s9eFjWzW4J+KKykPyd40LDHajFMYPiDh647O3Vh
WwKYQLfzyNJbvNzNNik8NmfGHLpGrHugF0t8B6E7XjAdqnICqLZQGC92NLsJgBbP
xl90r0Y2vdicmqsDQ21iREW6ctQkIZWJ2dTs7eJrsQKBgQDjUie76wK8KtCAppRv
55VGgNUjlEqal/6EDlzu3EccflpRIeO1sbfOyTZ0cM4c1znz3wzzHcNI0qwUWewY
VcjtIv3nVHqQygJoAvNHG34bwdSulYIB+rnBvG9AB0VsQpE94C/ct/gU/tW0/7j7
i7aIzKfIuTX8L7uFPOa4kMyMLQKBgQDeE5uZh0BjPvgvpYacDamtnKsCUPZXSH5d
U1YHyFylG8o7KDS8WSx//dV2w8Gj2FcR2XxqnBudhSwY3vXd4MuHRytJnkYMQ7fU
GpTOaGIaxAqiSKjBAaNzMlp5dC0tVqDTiA8niZZyDOlAAM0pTEnJpVS8cJNt3yJ3
fOFmrZ+qjQKBgQC/g8GyEmb1fOS43p8EQImFIplvJkpMQG3PeAJXwwGuQc15uSGN
PDLtZpwYMcmUhsdubKcOVC7otYUAiFnejrd/AhIDySqRvX+VfZbUe5cdb4ntpEwp
usCxNj5MJVQZx2NyS+RHAj9iAOivWxrP4n9gdXuOImwXEWfc8tg2+tc56QKBgAfB
pZCiMbSFsYNwg5gVvhRrQWnOTBxWUtuNmpag/+NgahrQ166waqZ5xifkxHGlj7z2
3KqYkzpYOWcQ+oNqY5FxAekLVyT8hIIq/4GKEcsfh8ONSB+doAjY/GH7lcxclzds
LCNUYeXP36G1pXTIzlb1qFUAlZWj0n9b5D+C1u3NAoGBALzSoKe3qvmZ0I58np7E
5DRGYIIPPen/6wMk+TWkOXJVmioNlqLwu0GFvayt2cd18X3VxKQWXf8R6iQ19AEj
fzmq7Gp+oAa+x8+pqQ7gTZ/DCM1Qd66P/0IxwnXekzL/HxHJeGb76ku0S3GDX2Xk
Cx60Ok555TA2YBLZKdzuJjSO
-----END RSA PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxTKnuPsA1pnsG86zAj6R
yzaekIe8IdIe1Jj3/dgNluNa/UzdIewrblSaBoQsLMrUHiV70p5V10zy3bZ70ZJg
OyRbwkTaBspjwV+i8HtTUYtD/JjkBvJq3mieM21dq3e07rTnhp++ugO0AbuiUTv1
AIEX0RYkpEGYlmcPASN/lx72lpLOABObKMA9NlH1ViEWewOfN5yLc39xSEYFuQgn
PeS85OYv4WKJ9NXgMVdGenZU6uUYtbccaNBmWN6fYVpPj8HrYQ0U57azQecu2uxr
stAPCWkYJYjn7ID+FwQp4Ac57PoIuxYSBz5NjmjW1R7z8WoTO6tK54UjvTSDDrIW
yQIDAQAB
-----END PUBLIC KEY-----`;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const fileName = "Дасгал ажил 5.pdf";
  try {
    const pdfBuffer = await downloadFileFromS3(
      process.env.S3_BUCKET!,
      fileName,
    );

    // print readable buffer
    console.log(pdfBuffer.Body?.toString("utf8"));

    const signature = signPDF(pdfBuffer.Body as Buffer, private_key, publicKey);
    if (!pdfBuffer || !signature) {
      throw new Error("PDF or signature is missing");
    }
    console.log(signature);
    const signedPDFBuffer = await addSignatureToPDF(
      pdfBuffer.Body as Buffer,
      signature,
    );

    // TODO: Upload the signed PDF back to S3 or send it to the client as needed
    res.setHeader("Content-Type", "application/pdf");

    // remove extension, and unwanted characters
    const fileNameSigned =
      fileName.split(".")?.[0]?.replace(/[^a-zA-Z0-9]/g, "_") + "_signed.pdf";

    console.log(fileNameSigned);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileNameSigned}`,
    );
    res.send(signedPDFBuffer);
  } catch (error: unknown) {
    res.status(500).json({ error: error?.toString() });
  }
};
