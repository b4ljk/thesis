import forge from "node-forge";

export function generateRSAkeys(bitSize = 1024) {
  const random = forge.random.createInstance();

  const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair({
    bits: bitSize,
  });

  return { publicKey: publicKey, privateKey: privateKey };
}
