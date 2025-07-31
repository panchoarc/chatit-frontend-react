import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import AuthService from "@/features/auth/services/AuthService";

const IDPLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (providerAlias: string) => {
    try {
      setLoading(true);
      // Solicitar la URL de autenticación del backend
      const response = await AuthService.loginWithProvider(providerAlias);
      const authUrl = response;

      // Abrir la ventana emergente
      const authWindow = window.open(authUrl, "_blank", "width=600,height=700");

      if (!authWindow) {
        console.error("No se pudo abrir la ventana emergente.");
        setLoading(false);
        return;
      }

      // Escuchar mensajes de la ventana emergente
      const messageListener = (event) => {
        if (event.origin !== window.location.origin) return; // Verificar que la fuente es confiable

        if (event.data && event.data.type === "AUTH_SUCCESS") {
          // Guardar los tokens recibidos directamente
          if (event.data.token) {
            localStorage.setItem("access_token", event.data.token);
          }

          if (event.data.refreshToken) {
            localStorage.setItem("refresh_token", event.data.refreshToken);
          }

          // Limpiar el listener
          window.removeEventListener("message", messageListener);

          // Redirigir al dashboard
          window.location.href = "/dashboard";
        }
      };

      // Agregar el listener para recibir el mensaje
      window.addEventListener("message", messageListener);

      // Timeout para evitar que el listener se quede indefinidamente
      setTimeout(() => {
        window.removeEventListener("message", messageListener);
        if (!authWindow.closed) {
          authWindow.close();
        }
        setLoading(false);
      }, 300000); // 5 minutos de timeout
    } catch (err) {
      console.error("Error en login:", err);
      setLoading(false);
    }
  };

  const providers = [
    {
      id: "google",
      name: "Google",
      icon: <FcGoogle size={20} />,
      className: "bg-white text-black border-gray-300 hover:bg-gray-100",
    },
    {
      id: "github",
      name: "GitHub",
      icon: <FaGithub size={20} />,
      className: "bg-black text-white hover:bg-gray-800",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <FaFacebook size={20} color="#ffffff" />,
      className: "bg-[#1877F2] text-white hover:bg-[#165dd5]",
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold">Inicia sesión con</h2>
      {providers.map((provider) => (
        <Button
          key={provider.id}
          onClick={() => handleLogin(provider.id)}
          variant="outline"
          className={`w-2/3 flex items-center space-x-2 mt-2 ${provider.className}`}
          disabled={loading}
        >
          {provider.icon}
          <span>{provider.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default IDPLogin;
