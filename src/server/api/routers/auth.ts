/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { loginSchema } from "~/utils/schemas";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const userData = await ctx.db.user.findUnique({
      where: { email: input.email },
    });

    if (!userData) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(
      input.password,
      userData.password,
    );

    if (!isValidPassword) {
      throw new Error("Password is incorrect");
    }

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
    };
  }),

  register: publicProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
      const userData = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (userData) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Энэ имэйл хаяг ашиглагдаж байна",
        });
      }
      //   TODO: CRYPTOGRAPHY, HASH PASSWORD WITH SALT
      const hashedPassword = await bcrypt.hash(input.password, 10);

      const newUser = await ctx.db.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
        },
      });

      return {
        id: newUser.id,
        name: newUser.name,
      };
    }),
});
