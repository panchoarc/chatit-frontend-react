import axios from "axios";
import { getValidAccessToken } from "@/features/auth/utils/ValidationExpirationToken";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_API_URL}/api`,
  withCredentials: true,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await getValidAccessToken();
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
