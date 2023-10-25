/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSignatureMeta, preparePDF } from "./general";

const DEFAULT_BYTE_RANGE_PLACEHOLDER = "**********";

const getByteRange = (pdfBuffer: any) => {
  const byteRangeStrings = pdfBuffer
    .toString()
    .match(
      /\/ByteRange\s*\[{1}\s*(?:(?:\d*|\/\*{10})\s+){3}(?:\d+|\/\*{10}){1}\s*\]{1}/g,
    );
  if (!byteRangeStrings) {
    throw new VerifyPDFError("Failed to locate ByteRange.", TYPE_PARSE);
  }

  const byteRangePlaceholder = byteRangeStrings.find((s: any) =>
    s.includes(`/${DEFAULT_BYTE_RANGE_PLACEHOLDER}`),
  );
  const strByteRanges = byteRangeStrings.map((brs: any) =>
    brs.match(/[^[\s]*(?:\d|\/\*{10})/g),
  );

  const byteRanges = strByteRanges.map((n: any) => n.map(Number));

  return {
    byteRangePlaceholder,
    byteRanges,
  };
};

const extractSignature = (pdfBuffer: Buffer) => {
  const { byteRanges } = getByteRange(pdfBuffer);
  const lastIndex = byteRanges.length - 1;
  const endOfByteRange = byteRanges[lastIndex][2] + byteRanges[lastIndex][3];

  if (pdfBuffer.length > endOfByteRange) {
    throw new Error("Signature contains extra data.");
  }

  const signatureStr: string[] = [];
  const signedData: Buffer[] = [];
  byteRanges.forEach((byteRange: any[]) => {
    signedData.push(
      Buffer.concat([
        pdfBuffer.slice(byteRange[0], byteRange[0] + byteRange[1]),
        pdfBuffer.slice(byteRange[2], byteRange[2] + byteRange[3]),
      ]),
    );

    const signatureHex = pdfBuffer
      .slice(byteRange[0] + byteRange[1] + 1, byteRange[2])
      .toString("latin1");
    signatureStr.push(Buffer.from(signatureHex, "hex").toString("latin1"));
  });

  const signatureMeta = signedData.map((sd) => getSignatureMeta(sd));

  return {
    byteRanges,
    signatureStr,
    signedData,
    signatureMeta,
  };
};

export default extractSignature;
