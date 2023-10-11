/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from "next";
import { downloadFileFromS3 } from "~/lib/awsHelper";
import { addSignatureToPDF, signPDF } from "~/lib/signing";

const private_key = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDjszAP6THQVQAB
X58IDoYXbwkVT9HR4JI5gIXoT57CHhUX2GGPzvVeJ+DeJBh8ltqqaoazfIdmjWvW
7nkwacYdNOKIIuVOV77jxgdcHzfVYh8MGQ7cYGX4i0vcuxM/UAiz8aUkiiPNpUww
CSRaeFZmlB8sjrL1x9VPr0/lClVOwI7q7JvLnXNqk1XkbI9TZk4PEN5KeEM6Un7i
3iwlvH3y1kaH0J2RnlmxowJrIY9F5JcV3l1AwkQ64STI4SE80Hnt4+sqlZN3CxHy
jOztxoQ8c5Mx4gm4rvBh5cfN7knRLARWMQ1PfAmPUhVxHZYtK9sEI3S6L060ohZH
Jx6i2x43AgMBAAECggEARqOi7/S01wBfsY1kLWAwGloAk+OA4N8ODhfAsyrsQiWJ
/q1Kyw32EiFGAjRpglFcggztQAaMjPSntXSjFTFjXFE5S+mjgNP47PnU86/dpu27
Wwn1Eco4KEyymsZQuM4P/R8kz/qpE9XJlodnh0eY6lbeevjELTqzAvcMzq4PfA/s
DuclJmIp4MyJXBkH0dJXi7NP8kFMSh4LGDL8i4uhC1bMVMYF+KYdt+RFgI/aP4+F
z8k5juOhWXSF6Cjq4+SycJDJmHfcp9RZM8h1qoY5RdB86zMSKPpp3jD+acJqmrQx
86tdGvpeVmbFHXGIFwVzRLhX2fPBURoVyBckeubc1QKBgQD3CPedJIlyJnDHOqKC
FgHz5jztQeG7bpftknP2v652HdOA/zp88d9A1NZXzHoFCV3feeqfKU0E7ReNG8Tm
ywsO7QPv3wfYuPNxu3O6NO0YM6i5Roz8cEcbdozqeUWOvAbUP9LptHurM0aVOSHZ
74WzEPhzCXhd2nIA7KjE14oKrQKBgQDr9pdyb4JARgMdY+V2ycoMJ+XepKKcemQe
kQnoQfWr7beJVWky12lYguxEA+2YFOeAeWuGiZIQ1afOM1XyOR2SX4O6vH+ExH0W
DJtnyDF05ex+BPFszMB2vC6Odj+ga0QXWn0t8eaPClhNIHYAsVf8UaH/8VNVfxDa
Jz3bc9ps8wKBgFxLMF+4d9V7ASWeBXr+h+o8ucSWmaRyNDbhQYwNnzun9w45zPtD
TnqlShNxZKEfF8BXh03Bm3HctrDUkCL99vqzmIX02LSinOl/9EO8ZFxnaIEYF7J0
rExZZVpwxokGPLLtyXnhIVccCCHWP4xxzYzSKVCpWBwQcglgYclxEbTdAoGBAMb/
Ub3auLhH0zyoEM7bYyBZTY00v0bEGUeF/hr39Z4nfo+9jlioPlm9IFBEF84YYxyA
SeROhPbZmQlXVfZPoNbe4pNLgSeRJgTAYRdnR/5UIdwtgwXEr9Py5DiVFRfPHr+r
OsLSrSSZDtsMszfmWFOc7MiS1zrVTHsOeSZoUB9tAoGBAMa3oeh4smdpoGi4hZtb
0R0OXbvtqroAsF1t2wz8pzF3uPH44dyaJQwWhNOHI78VBYB2dTMLfxt3cKDOXMfH
a/tipAonLYAz7H0HfvMG0kBASDC4pqYuOVer7mp5q0YATWRcHScMuFIkS3dWEVPS
bKxB54qEbXKzCUMkMf2uBnZw
-----END PRIVATE KEY-----`;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const pdfBuffer = await downloadFileFromS3(
      process.env.S3_BUCKET!,
      "Дасгал ажил 5.pdf",
    );
    console.log(pdfBuffer);
    const signature = signPDF(pdfBuffer.Body as Buffer, private_key);
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
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=tailan-signed.pdf",
    );
    res.send(signedPDFBuffer);
  } catch (error: unknown) {
    res.status(500).json({ error: error?.toString() });
  }
};
