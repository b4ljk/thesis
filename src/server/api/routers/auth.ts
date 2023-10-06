import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { loginSchema } from "~/utils/schemas";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    console.log(input);

    const userData = await ctx.db.user.findUnique({
      where: { email: input.email },
    });

    if (!userData) {
      throw new Error("User not found");
    }

    if (userData.password !== input.password) {
      throw new Error("Password is incorrect");
    }

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.emailVerified,
      input_email: input.email,
    };
  }),
});
