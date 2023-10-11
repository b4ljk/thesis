/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import forge from "node-forge";
import { PDFDocument, StandardFonts } from "pdf-lib";

export const signPDF = (pdfBuffer: Buffer, privateKey: string): string => {
  try {
    if (!(pdfBuffer instanceof Buffer)) {
      throw new Error("pdfBuffer must be a Buffer.");
    }

    if (typeof privateKey !== "string") {
      throw new Error("privateKey must be a string.");
    }

    const md = forge.md.sha256.create();
    md.update(pdfBuffer.toString("utf8"), "utf8");

    let key;
    try {
      key = forge.pki.privateKeyFromPem(privateKey);
    } catch (err) {
      throw new Error("Provided privateKey is not valid PEM format.");
    }

    const signature = key.sign(md);
    return forge.util.encode64(signature);
  } catch (err) {
    console.error(err);
    throw err; // re-throw the error to be handled by the calling function
  }
};

export const addSignatureToPDF = async (
  pdfBuffer: Buffer,
  signature: string,
): Promise<Buffer> => {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  if (!firstPage) {
    throw new Error("PDF has no pages");
  }
  const { width, height } = firstPage.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const form = pdfDoc.getForm();
  const signatureField = form.createTextField("signature");
  signatureField.setText(signature);
  signatureField.enableMultiline();
  signatureField.addToPage(firstPage, {
    x: 50,
    y: height / 2,
    width: width - 100,
    height: 100,
  });
  // set signature in metadata

  const modifiedPDFUint8Array = await pdfDoc.save();
  // Convert Uint8Array to Buffer
  const modifiedPDFBuffer = Buffer.from(modifiedPDFUint8Array);
  return modifiedPDFBuffer;
};
