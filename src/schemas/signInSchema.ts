import { z } from "zod";
import { userNameValidation } from "./signUpSchema";

export const signInSchema = z.object({
  identifier: z.string(),
  password: z
    .string()
    .min(4, { message: "Must be above 4 characters" })
    .max(20, { message: "Must be below 20 charaacters" }),
});
