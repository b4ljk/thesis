import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { s3Router } from "./routers/s3";
import { secretKeyRoute } from "./routers/key";
import { signerRoute } from "./routers/signer";
import { otpRoute } from "./routers/otp";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // example: exampleRouter,
  auth_router: authRouter,
  s3_router: s3Router,
  key_router: secretKeyRoute,
  sign_router: signerRoute,
  otp_router: otpRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;
