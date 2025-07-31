import ChatHome from "@/features/chat/pages/ChatHome";
import type { Route } from "@/config/types";

const chatRoutes: Route[] = [
  { path: "/", component: ChatHome, protected: true, hasSidebar: true },
];

export default chatRoutes;
