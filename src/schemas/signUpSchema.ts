import { z } from "zod";

// sirf ek field hai is liye
export const userNameValidation = z
  .string()
  .min(2, "Must be above 2 characters")
  .max(20, { message: "Must be below 20 characters" })
  .regex(/^[0-9a-zA-Z]+$/, "Username must contain only letters and numbers");

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(4, { message: "Must be above 4 characters" })
    .max(20, { message: "Must be below 20 charaacters" }),
});


