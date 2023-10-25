/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import tls from "tls";
import forge from "node-forge";

const isCertsExpired = (certs: any) =>
  !!certs.find(
    ({
      validity: { notAfter, notBefore },
    }: {
      validity: { notAfter: Date; notBefore: Date };
    }) => notAfter.getTime() < Date.now() || notBefore.getTime() > Date.now(),
  );

export default isCertsExpired;
