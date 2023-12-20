import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Имэйл хаяг буруу байна"),
  password: z
    .string()
    .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэх ёстой"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email("Имэйл хаяг буруу байна"),
  password: z
    .string()
    .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэх ёстой"),
  // name: z.string().min(4, "Нэр хамгийн багадаа 4 тэмдэгтээс бүрдэх ёстой"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const signUrlSchema = z.object({
  filename: z.string(),
  filetype: z.string().default("application/pdf"),
  size: z.number().optional().default(0),
  otp: z.string(),
  passphrase: z.string().optional(),
});
