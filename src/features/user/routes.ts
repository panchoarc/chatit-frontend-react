import type { Route } from "@/config/types";
import Profile from "./pages/Profile";
import ChatHome from "../chat/pages/ChatHome";

const userRoutes: Route[] = [
  { path: "/profile", component: Profile, protected: true },
  { path: "/", component: ChatHome, protected: true, hasSidebar: true },
];

export default userRoutes;
