/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { pki } from "node-forge";

const mapEntityAtrributes = (attrs: any[]) =>
  attrs.reduce((agg: Record<string, any>, { name, value }: any) => {
    if (!name) return agg;
    agg[name] = value;
    return agg;
  }, {});

const extractSingleCertificateDetails = (cert: pki.Certificate) => {
  const { issuer, subject, validity } = cert;
  return {
    issuedBy: mapEntityAtrributes(issuer.attributes),
    issuedTo: mapEntityAtrributes(subject.attributes),
    validityPeriod: validity,
    pemCertificate: pki.certificateToPem(cert),
  };
};

export const extractCertificatesDetails = (certs: any[]) =>
  certs.map(extractSingleCertificateDetails).map((cert: any, i: any) => {
    if (i) return cert;
    return {
      clientCertificate: true,
      ...cert,
    };
  });

export default extractCertificatesDetails;
