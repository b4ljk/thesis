import forge from "node-forge";

export function generateRSAkeys(bitSize = 1024) {
  // Generate a random seed

  // Create a random byte buffer with the seed
  const random = forge.random.createInstance();

  // Generate an RSA key pair with a random seed
  const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair({
    bits: bitSize,
    // prng: random,
  });

  return { publicKey: publicKey, privateKey: privateKey };
}
