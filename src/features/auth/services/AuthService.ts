import axios from "axios";

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_API_URL}/api`,
  withCredentials: true,
});

export const login = async (data: LoginData): Promise<string> => {
  try {
    const response = await instance.post("/auth/login", data);
    return response.data.data.access_token;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await instance.post("/auth/logout");
  } catch (error) {
    return Promise.reject(error);
  }
};

export const loginWithProvider = async (provider: string): Promise<string> => {
  try {
    const response = await instance.get(`/auth/provider/${provider}`);
    return response.data.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const registerUser = async (data: RegisterData): Promise<string> => {
  try {
    const response = await instance.post("/auth/register", data);
    console.log("RESPONSE", response.data);
    return response.data.data.message;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const refreshToken = async (): Promise<string> => {
  try {
    const response = await instance.get("/auth/refresh-token");
    return response.data.data.access_token;
  } catch (error) {
    console.error("Error refreshing token", error.response);
    return Promise.reject(error);
  }
};

const AuthService = {
  login,
  logout,
  loginWithProvider,
  registerUser,
  refreshToken,
};

export default AuthService;
