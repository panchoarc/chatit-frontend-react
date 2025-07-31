import adminRoutes from "@/features/admin/routes";
import authRoutes from "@/features/auth/routes";
import chatRoutes from "@/features/chat/routes";
import Home from "@/features/user/pages/Home";

import AdminLayout from "@/features/admin/layouts/AdminLayout";
import UserLayout from "@/features/user/layouts/UserLayout";
import BaseLayout from "@/shared/layouts/BaseLayout";
import type { Route } from "@/config/types";

const guestRoutes: Route[] = [{ path: "/", component: Home }];

const routes = {
  admin: [...adminRoutes, ...authRoutes],
  user: [...chatRoutes, ...authRoutes],
  guest: [...guestRoutes, ...authRoutes],
  common: [...authRoutes],
};

const layouts = {
  admin: AdminLayout,
  user: UserLayout,
  guest: BaseLayout,
};

export { routes, layouts };
