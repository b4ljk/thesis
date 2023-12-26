import { type KMS } from "aws-sdk";
import aws from "./aws";

const kms = new aws.KMS();

const params: KMS.Types.CreateKeyRequest = {
  Description: "Your_Key_Description",
  KeyUsage: "ENCRYPT_DECRYPT",
  CustomerMasterKeySpec: "SYMMETRIC_DEFAULT",
};

export const createKey = async (
  params: KMS.Types.CreateKeyRequest,
): Promise<KMS.Types.CreateKeyResponse> => {
  return new Promise((resolve, reject) => {
    kms.createKey(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

export const encrypt = async (
  params: KMS.Types.EncryptRequest,
): Promise<KMS.Types.EncryptResponse> => {
  return new Promise((resolve, reject) => {
    kms.encrypt(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

export const decrypt = async (
  params: KMS.Types.DecryptRequest,
): Promise<KMS.Types.DecryptResponse> => {
  return new Promise((resolve, reject) => {
    kms.decrypt(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
