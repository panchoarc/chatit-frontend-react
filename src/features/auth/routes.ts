import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import type { Route } from "@/config/types";

const authRoutes: Route[] = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
];

export default authRoutes;
