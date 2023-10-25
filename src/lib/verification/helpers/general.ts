/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { asn1, pkcs7, type util } from "node-forge";

const preparePDF = (
  pdf: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>,
) => {
  try {
    if (Buffer.isBuffer(pdf)) return pdf;
    return Buffer.from(pdf);
  } catch (error) {
    throw new VerifyPDFError("PDF expected as Buffer.", TYPE_INPUT);
  }
};

const checkForSubFilter = (pdfBuffer: { toString: () => string }) => {
  const matches = pdfBuffer.toString().match(/\/SubFilter\s*\/([\w.]*)/);
  const subFilter = Array.isArray(matches) && matches[1];
  if (!subFilter) {
    throw new VerifyPDFError("cannot find subfilter", TYPE_PARSE);
  }
  const supportedTypes = ["adbe.pkcs7.detached", "etsi.cades.detached"];
  if (!supportedTypes.includes(subFilter.trim().toLowerCase()))
    throw new VerifyPDFError(
      `subFilter ${subFilter} not supported`,
      UNSUPPORTED_SUBFILTER,
    );
};
const getMessageFromSignature = (signature: string | util.ByteStringBuffer) => {
  const p7Asn1 = asn1.fromDer(signature, false);
  // get certificate
  return pkcs7.messageFromAsn1(p7Asn1);
};

export const getCertificateFromSignature = (
  signature: string | util.ByteStringBuffer,
) => {
  const message = getMessageFromSignature(signature);
  const {
    rawCapture: { certificates },
  } = message;
  return certificates[0];
};

const getMetaRegexMatch = (keyName: string) => (str: string) => {
  const regex = new RegExp(`/${keyName}\\s*\\(([\\w.\\s@,]*)`, "g");
  const matches = [...str.matchAll(regex)];
  const meta = matches.length ? matches[matches.length - 1]![1] : null;

  return meta;
};

const getSignatureMeta = (signedData: any) => {
  const str = Buffer.isBuffer(signedData) ? signedData.toString() : signedData;
  return {
    reason: getMetaRegexMatch("Reason")(str),
    contactInfo: getMetaRegexMatch("ContactInfo")(str),
    location: getMetaRegexMatch("Location")(str),
    name: getMetaRegexMatch("Name")(str),
  };
};

export {
  checkForSubFilter,
  getSignatureMeta,
  getMessageFromSignature,
  preparePDF,
};

export default {
  checkForSubFilter,
  getSignatureMeta,
  getMessageFromSignature,
  preparePDF,
};
