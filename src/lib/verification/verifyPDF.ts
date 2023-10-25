/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import forge from "node-forge";
import {
  extractSignature,
  getMessageFromSignature,
  getClientCertificate,
  checkForSubFilter,
  preparePDF,
  isCertsExpired,
  sortCertificateChain,
} from "./helpers";

import extractCertificatesDetails from "./certificateDetails";
import { getCertificateFromSignature } from "./helpers/general";

const verify = (
  signature: any,
  signedData: Buffer,
  signatureMeta:
    | {
        reason: string | null | undefined;
        contactInfo:
          | string
          /* eslint-disable @typescript-eslint/no-unsafe-return */
          /* eslint-disable @typescript-eslint/no-unsafe-call */
          /* eslint-disable @typescript-eslint/no-unsafe-member-access */
          /* eslint-disable @typescript-eslint/no-unsafe-assignment */
          /* eslint-disable @typescript-eslint/no-explicit-any */
          | null
          | undefined;
        location: string | null | undefined;
        name: string | null | undefined;
      }
    | undefined,
) => {
  const message = getMessageFromSignature(signature);
  const {
    rawCapture: {
      signature: sig,
      authenticatedAttributes: attrs,
      digestAlgorithm,
    },
  } = message;
  const certificate = getCertificateFromSignature(signature);
  const hashAlgorithmOid = forge.asn1.derToOid(digestAlgorithm);
  const hashAlgorithm = forge.pki.oids[hashAlgorithmOid]!.toLowerCase() as any;
  const set = forge.asn1.create(
    forge.asn1.Class.UNIVERSAL,
    forge.asn1.Type.SET,
    true,
    attrs,
  );
  const clientCertificate: any = getClientCertificate(certificate);
  const digest = forge.md.sha256
    .create()
    .update(forge.asn1.toDer(set).data)
    .digest()
    .getBytes();
  const validAuthenticatedAttributes = clientCertificate.publicKey.verify(
    digest,
    sig,
  );
  if (!validAuthenticatedAttributes) {
    throw new Error("Authenticated attributes are not valid.");
  }
  const messageDigestAttr = forge.pki.oids.messageDigest;
  const fullAttrDigest = attrs.find(
    (attr: { value: { value: string | forge.util.ByteStringBuffer }[] }) =>
      forge.asn1.derToOid(attr.value[0]!.value) === messageDigestAttr,
  );
  const attrDigest = fullAttrDigest.value[1].value[0].value;
  const dataDigest = forge.md.sha256
    .create()
    .update(signedData.toString("latin1"))
    .digest()
    .getBytes();
  console.log("dataDigest", dataDigest);
  console.log("attrDigest", attrDigest);
  const integrity = dataDigest === attrDigest;
  const sortedCerts = sortCertificateChain(certificate);
  const parsedCerts = extractCertificatesDetails(sortedCerts);
  // const authenticity = authenticateSignature(sortedCerts);
  const expired = isCertsExpired(sortedCerts);
  return {
    verified: integrity && !expired,
    integrity,
    expired,
    meta: { certs: parsedCerts, signatureMeta },
  };
};

export const PDFresolver = (pdf: any) => {
  const pdfBuffer = preparePDF(pdf);
  checkForSubFilter(pdfBuffer);
  try {
    const { signatureStr, signedData, signatureMeta } =
      extractSignature(pdfBuffer);

    const signatures = signedData.map((signed, index) => {
      return verify(signatureStr[index], signed, signatureMeta[index]);
    });

    return {
      verified: signatures.every((o) => o.verified === true),
      // integrity: signatures.every((o) => o.integrity === true),
      // expired: signatures.some((o) => o.expired === true),
      // signatures,
    };
  } catch (error) {
    console.log(error);
    return { verified: false, message: "error.message", error };
  }
};
