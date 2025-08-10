import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import AuthService from "@/features/auth/services/AuthService";
import UserService from "@/features/user/services/UserService";
import { useLocation, useNavigate } from "react-router";

import { getDefaultRouteByRole } from "@/shared/utils/roleRedirect";
import { useUser } from "@/features/user/hooks/UserContext";
import WebSocketClientInstance from "@/features/chat/config/WebSocketClient";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setProfile } = useUser();
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const user = await UserService.getProfile();
          setProfile(user);
        } catch (err) {
          console.error("Error fetching profile:", err);
          logout();
        }
      }
    };
    fetchProfile();
  }, [token]);

  const login = async (username: string, password: string) => {
    const access_token = await AuthService.login({ username, password });

    setToken(access_token);
    localStorage.setItem("access_token", access_token);

    const profileResponse = await UserService.getProfile();
    const user = profileResponse;
    setProfile(user);
    const role = user.roles ?? "guest";
    WebSocketClientInstance.connect();
    const redirectPath = location.state?.from || getDefaultRouteByRole(role);

    navigate(`${redirectPath}`, { replace: true });
  };
  const logout = async () => {
    await AuthService.logout();
    WebSocketClientInstance.disconnect();
    setToken(null);
    setProfile(null);
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
