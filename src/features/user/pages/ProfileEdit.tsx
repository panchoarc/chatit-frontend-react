import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { useState } from "react";
import { useUser } from "../hooks/UserContext";
import UserService from "../services/UserService";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  username: z.string().min(3, "Username inválido"),
  email: z.string().email("Email inválido"),
  avatar: z.any().optional(), // Archivo opcional
});

export default function ProfileEditForm({
  onCancel,
}: {
  onCancel?: () => void;
}) {
  const { profile } = useUser();
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatarUrl || "");

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.firstName || "",
      username: profile?.userName || "",
      email: profile?.email || "",
      avatar: profile?.avatarUrl,
    },
  });

  const onSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            name: values.name,
            username: values.username,
            email: values.email,
          }),
        ],
        { type: "application/json" }
      )
    );
    if (values.avatar?.[0]) {
      formData.append("avatar", values.avatar[0]);
    }

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    // Aquí llamarías a tu API:
    const response = await UserService.updateProfile(formData);
    console.log("RESPONSE: ", response);

    toast.success("Se ha actualizado correctamente");

    if (onCancel) onCancel();
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("avatar", [file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-xl"
      >
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={avatarPreview} />
            <AvatarFallback>{profile?.name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <div>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre" {...field} />
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
                <Input placeholder="@usuario" {...field} />
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
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input placeholder="correo@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  );
}
