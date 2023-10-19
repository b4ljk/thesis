import { z } from "zod";

export const createKeySchema = z.object({
  secretPassphrase: z.string(),
});
