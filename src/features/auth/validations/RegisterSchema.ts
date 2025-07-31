import { z } from "zod";

export const registerSchema = z.object({
  firstname: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastname: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  username: z
    .string()
    .min(6, "El usuario debe tener al menos 6 caracteres")
    .max(50),
  email: z.string().email("Correo inválido"),
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

// Inferir tipo basado en el esquema de Zod
export type RegisterForm = z.infer<typeof registerSchema>;
