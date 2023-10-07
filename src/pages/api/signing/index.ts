import { type NextApiRequest, type NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { promises as fs } from "fs";
import { createHash, createSign } from "crypto";
import { PDFDocument, rgb, drawText, StandardFonts } from "pdf-lib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getToken({
    req: req,
    secret: process.env.JWT_SECRET,
  });
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed, please use POST" });
  }

  const file = req.body.file;
  let data;

  try {
    data = Buffer.from(file, "base64"); // convert file to buffer
  } catch (error) {
    return res.status(400).json({ error: "Invalid file data" });
  }

  try {
    // Create hash and sign the hash
    const hash = createHash("sha256");
    hash.update(data);
    const hashedData = hash.digest("hex");

    const sign = createSign("SHA256");
    sign.update(hashedData);
    const privateKey = fs.readFileSync("path/to/your/private_key.pem"); // Replace 'path/to/your/private_key.pem' with your private key path
    const signature = sign.sign(privateKey, "hex");

    // Load PDF document
    const pdfDoc = await PDFDocument.load(data);

    // Embed the signature into the PDF
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const textSize = 20;
    const textWidth = font.widthOfTextAtSize(signature, textSize);
    const textHeight = font.heightOfTextAtSize(textSize);
    firstPage.drawText(signature, {
      x: width / 2 - textWidth / 2,
      y: height - textHeight * 2,
      size: textSize,
      font,
      color: rgb(0, 0, 0),
    });

    // Save the PDF with the embedded signature
    const pdfBytes = await pdfDoc.save();

    // Response with the signed PDF
    res.status(200).json({ signedPdf: pdfBytes.toString("base64") });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing your file" });
  }

  res.status(200).json({ name: "John Doe" });
}
