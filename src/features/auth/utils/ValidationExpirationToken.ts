import AuthService from "@/features/auth/services/AuthService";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

export const getValidAccessToken = async (): Promise<string> => {
  let token = localStorage.getItem("access_token");

  if (!token || isTokenExpired(token)) {
    try {
      token = await AuthService.refreshToken();
      localStorage.setItem("access_token", token);
    } catch (e) {
      console.error("Error refreshing token", e);
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      throw new Error("Redirecting to login");
    }
  }

  return token;
};
