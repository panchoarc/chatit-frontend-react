import { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

import PasswordInput from "@/shared/ui/PasswordInput";

import AuthService from "@/features/auth/services/AuthService";

import { registerSchema } from "@/features/auth/validations/RegisterSchema";
import type { RegisterForm } from "@/features/auth/validations/RegisterSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";

const Register: FC = () => {
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await AuthService.registerUser(data);

      toast.success(response);

      form.reset();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.errors?.message ??
        error?.message ??
        "Ocurrió un error inesperado";

      toast.error(errorMessage);
      console.error(error);
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg bg-white">
        <h2 className="text-2xl font-bold mb-4">Crear Cuenta</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre"
                      autoComplete="given-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apellido"
                      autoComplete="family-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Correo Electrónico"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Contraseña" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Registrarse</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
