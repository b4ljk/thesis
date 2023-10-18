const crypto = require("crypto");
const { writeFileSync } = require("fs");

const passphrase = "your-secure-passphrase"; // set your passphrase here

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc", // cipher used to encrypt the private key
    passphrase: passphrase,
  },
});

// Save private and public key to PEM files
writeFileSync("private_key.pem", privateKey);
writeFileSync("public_key.pem", publicKey);
