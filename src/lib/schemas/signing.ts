import { z } from "zod";

export const signatureSchema = z.object({
  file_id: z.string(),
  passphrase: z.string(),
  file_key: z.string().optional(),
  file_url: z.string().optional(),
  owner: z.string().optional(),
  otp: z.string(),
});
export const verificationSchema = z.object({
  file_id: z.string(),
  file_key: z.string().optional(),
  file_url: z.string().optional(),
  owner: z.string().optional(),
});
