import { z } from "zod";

export const otpSchema = z.object({
  otp: z.string(),
});

export const otpConfirmSchema = otpSchema.extend({
  secret: z.string(),
});

export const createKeySchema = z.object({
  name: z.string(),
});
