import CryptoJS from "crypto-js";

export const encryptMessage = (message: string, key: string): string => {
  const keyHex = CryptoJS.enc.Utf8.parse(key);

  const encrypted = CryptoJS.AES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

export const decryptMessage = (ciphertext: string, key: string): string => {
  const keyHex = CryptoJS.enc.Utf8.parse(key);

  const decrypted = CryptoJS.AES.decrypt(ciphertext, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
