import { authenticator } from "otplib";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";
import {
  type TRPCContext,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { otpConfirmSchema, otpSchema } from "~/lib/schemas/otp";
import { type z } from "zod";
authenticator.options = { crypto };

export const verify = async ({
  input,
  ctx,
}: {
  input: z.infer<typeof otpSchema>;
  ctx: TRPCContext;
}) => {
  const session = ctx?.session;
  if (!session) return;
  const otpSecretKey = await ctx.db.otpSecret.findFirst({
    where: {
      userId: session.user.id,
    },
  });
  if (!otpSecretKey) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Та Two factor authentication-г идэвхжүүлэхгүй байна.",
    });
  }
  const secret = otpSecretKey?.secret;
  const isValid = authenticator.verify({
    token: input.otp,
    secret: secret,
  });

  if (!isValid) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Таны оруулсан код буруу байна.",
    });
  }
  return {
    isValid,
  };
};

export const otpRoute = createTRPCRouter({
  generateUrl: protectedProcedure.query(async ({ input, ctx }) => {
    const previousSecret = await ctx.db.otpSecret.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (previousSecret?.isVerified) {
      return {};
    }

    const email = ctx.session.user.email;
    const rawSecret = crypto
      .randomBytes(32)
      .toString("hex")
      .slice(0, 20)
      .toUpperCase();
    console.log("rawSecret", rawSecret);
    const secret = authenticator.encode(rawSecret);

    const qrUrl = authenticator.keyuri(
      email!,
      "Cloud Signature Mongolia",
      secret,
    );
    return {
      secret,
      qrUrl,
    };
  }),

  confirm: protectedProcedure
    .input(otpConfirmSchema)
    .mutation(async ({ input, ctx }) => {
      const secret = input.secret;
      const otp = input.otp;
      const isValid = authenticator.verify({
        token: otp,
        secret: secret,
      });
      if (!isValid) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Таны оруулсан код буруу байна.",
        });
      }

      const deleted = await ctx.db.otpSecret.deleteMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      const newSecret = await ctx.db.otpSecret.create({
        data: {
          secret: input.secret,
          userId: ctx.session.user.id,
          isVerified: true,
        },
      });

      return {
        deleted,
        newSecret,
      };
    }),

  verify: protectedProcedure.input(otpSchema).mutation(verify),
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    const session = ctx?.session;
    if (!session) return;
    const otpSecretKey = await ctx.db.otpSecret.findFirst({
      where: {
        userId: session.user.id,
      },
    });
    if (!otpSecretKey) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Та Two factor authentication-г идэвхжүүлэхгүй байна.",
      });
    }
    const deleted = await ctx.db.otpSecret.delete({
      where: {
        id: otpSecretKey.id,
      },
    });
    return {
      deleted,
    };
  }),
  ifActivated: protectedProcedure.query(async ({ ctx }) => {
    const session = ctx?.session;
    if (!session) return;
    const otpSecretKey = await ctx.db.otpSecret.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    return {
      isActivated: otpSecretKey?.isVerified === true,
    };
  }),
});
