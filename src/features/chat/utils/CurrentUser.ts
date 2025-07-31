import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string;
  // También podrías extraer `preferred_username`, `email`, etc. si están presentes
};

export function getCurrentUserIdFromToken(): string {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.error("No se encontró el token de acceso");
    return "";
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sub;
  } catch (error) {
    console.error("Error al decodificar el token", error);
    return "";
  }
}
