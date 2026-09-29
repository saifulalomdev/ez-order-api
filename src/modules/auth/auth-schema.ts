import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required." })
      .min(2, { message: "Name must be at least 2 characters long." }),

    email: z
      .email({ message: "Please enter a valid email address." })
      .trim(),

    password: z
      .string()
      .min(1, { message: "Password is required." })
      .min(6, { message: "Password must be at least 6 characters long." })
      .max(32, { message: "Password cannot exceed 32 characters." }),
  })
  .strict();

export const loginSchema = registerSchema.omit({ name: true });

export const resendVerificationSchema = loginSchema.omit({
  password: true
})