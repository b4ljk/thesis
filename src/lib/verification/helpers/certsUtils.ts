/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
const issued = (cert: any) => (anotherCert: { issued: (arg0: any) => any }) =>
  cert !== anotherCert && anotherCert.issued(cert);

const getIssuer = (certsArray: any[]) => (cert: any) =>
  certsArray.find(issued(cert));

const inverse = (f: { (cert: any): any; (arg0: any): any }) => (x: any) =>
  !f(x);

const hasNoIssuer = (certsArray: any[]) => inverse(getIssuer(certsArray));

const getChainRootCertificateIdx = (certsArray: any[]) =>
  certsArray.findIndex(hasNoIssuer(certsArray));

const isIssuedBy =
  (cert: { issued: (arg0: any) => any }) => (anotherCert: any) =>
    cert !== anotherCert && cert.issued(anotherCert);

const getChildIdx = (certsArray: any[]) => (parent: any) =>
  certsArray.findIndex(isIssuedBy(parent));

const sortCertificateChain = (
  certs: Iterable<unknown> | ArrayLike<unknown>,
) => {
  const certsArray = Array.from(certs);
  const rootCertIndex = getChainRootCertificateIdx(certsArray);
  const certificateChain = certsArray.splice(rootCertIndex, 1);
  while (certsArray.length) {
    const lastCert = certificateChain[0];
    const childCertIdx = getChildIdx(certsArray)(lastCert);
    if (childCertIdx === -1) certsArray.splice(childCertIdx, 1);
    else {
      const [childCert] = certsArray.splice(childCertIdx, 1);
      certificateChain.unshift(childCert);
    }
  }
  return certificateChain;
};

const getClientCertificate = (certs: any) => sortCertificateChain(certs)[0];

export { sortCertificateChain, getClientCertificate };
