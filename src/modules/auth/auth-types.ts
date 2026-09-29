import type { loginSchema, registerSchema, resendVerificationSchema } from "./auth-schema";
import type z from "zod";

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
