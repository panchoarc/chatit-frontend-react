import { useUser } from "../hooks/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { useState } from "react";
import ProfileEditForm from "./ProfileEdit";

const sidebarOptions = [
  { label: "Mi perfil", value: "profile" },
  { label: "Editar perfil", value: "edit" },
  { label: "Configuración", value: "settings" },
  { label: "Cerrar sesión", value: "logout" },
];

export default function Profile() {
  const { profile } = useUser(); // logout si está disponible
  const [selected, setSelected] = useState("profile");

  const handleOptionClick = (option: string) => {
    setSelected(option);
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r p-6 space-y-2">
        <h2 className="text-xl font-semibold mb-4">Opciones</h2>
        {sidebarOptions.map((option) => (
          <Button
            key={option.value}
            variant={selected === option.value ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleOptionClick(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {selected === "profile" && (
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Mi Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profile?.avatarUrl} />
                  <AvatarFallback>{profile?.name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-medium">{profile?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{profile?.userName}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="space-y-1">
                <p>
                  <span className="font-semibold">Correo:</span>{" "}
                  {profile?.email}
                </p>
                <p>
                  <span className="font-semibold">ID de usuario:</span>{" "}
                  {profile?.id}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {selected === "edit" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>
            {/* Aquí iría un formulario con inputs de nombre, correo, etc. */}
            <ProfileEditForm onCancel={() => setSelected("profile")} />
          </div>
        )}

        {selected === "settings" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Configuración</h2>
            <p>Opciones avanzadas próximamente.</p>
          </div>
        )}
      </main>
    </div>
  );
}
