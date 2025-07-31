import type { ReactNode } from "react";

export interface RouteProps {
  [key: string]: ReactNode;
}

export interface Route {
  path: string;
  component: React.ComponentType<RouteProps>;
  protected?: boolean;
  hasSidebar?: boolean;
}
