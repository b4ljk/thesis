import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Имэйл хаяг буруу байна"),
  password: z
    .string()
    .min(8, "Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэх ёстой"),
});
export type LoginInput = z.infer<typeof loginSchema>;
