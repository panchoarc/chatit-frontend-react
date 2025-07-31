import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(6, "El username debe tener al menos 6 caracteres")
    .max(50),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100)
    .refine((password: string) => /[A-Z]/.test(password), {
      message: "La contraseña debe contener al menos una letra mayúscula",
    })
    .refine((password: string) => /[a-z]/.test(password), {
      message: "La contraseña debe contener al menos una letra minúscula",
    })
    .refine((password: string) => /\d/.test(password), {
      message: "La contraseña debe contener al menos un número",
    })
    .refine((password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
      message: "La contraseña debe contener al menos un carácter especial",
    }),
});

export type LoginData = z.infer<typeof loginSchema>;
