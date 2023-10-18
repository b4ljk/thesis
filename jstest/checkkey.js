const crypto = require("crypto");
const { readFileSync } = require("fs");

try {
  const passphrase = "your-secure-passphrase"; // same passphrase

  // Load PEM file containing the privateKey
  const pem = readFileSync("private_key.pem");

  //   console.log(pem);

  // Create privateKey object using the PEM and passphrase
  const privateKey = crypto.createPrivateKey({ key: pem, passphrase: passphrase });

  console.log(privateKey);

  // Some data to sign
  const data = "sample data to sign";

  // Create a sign object
  const sign = crypto.createSign("SHA256");

  sign.update(data);

  // Sign the data
  const signature = sign.sign(privateKey);

  console.log(signature.toString("hex"));
} catch (err) {
  console.log(err);
}
