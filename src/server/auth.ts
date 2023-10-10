/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { type LoginInput } from "~/utils/schemas";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

type UserRole = "ADMIN" | "USER";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      role: UserRole;
      profile: string;
    };
  }

  interface User {
    // ...other properties
    role: UserRole;
    // profile: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // 30 minutes
    maxAge: 30 * 60,
  },
  secret: process.env.JWT_SECRET,
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          role: user.role,
          user: user,
          picture: user.image,
        };
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        return {
          ...session,
          user: token.user,
        } as any;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      // name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.

      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        console.log(req);

        if (!credentials?.email || !credentials?.password) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Имэйл эсвэл нууц үг хоосон байна",
          });
        }

        const userData = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!userData) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Хэрэглэгч олдсонгүй",
          });
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const passwordMatch = bcrypt.compare(
          credentials.password,
          userData.password ?? "",
        );

        if (userData && (await passwordMatch)) {
          return {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            picture: userData.image,
          };
        }

        return null;
      },
    }),

    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
