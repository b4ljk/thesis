/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getError(error: unknown) {
  if (error instanceof TRPCError) {
    return error.message;
  }

  if (error instanceof TRPCClientError) {
    const errorObject = error?.data?.zodError;
    let combinedErrors = "";
    if (!errorObject) {
      return error?.message ?? "Алдаа гарлаа";
    }

    for (const field in errorObject.fieldErrors) {
      errorObject.fieldErrors[field].forEach((errorMessage: string) => {
        combinedErrors += errorMessage + " ";
      });
    }

    errorObject.formErrors.forEach((errorMessage: string) => {
      combinedErrors += errorMessage + " ";
    });

    if (combinedErrors.length > 0) {
      return (combinedErrors = combinedErrors.trim());
    }
  }

  return "Алдаа гарлаа";
}
