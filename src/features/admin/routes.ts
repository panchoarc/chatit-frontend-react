import AdminDashboard from "./pages/Dashboard";
import type { Route } from "@/config/types";

const adminRoutes: Route[] = [
  {
    path: "/dashboard",
    component: AdminDashboard,
    protected: true,
    hasSidebar: true,
  },
];

export default adminRoutes;
