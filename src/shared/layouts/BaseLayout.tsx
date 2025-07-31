import UserHeader from "@/shared/layouts/UserHeader";
import type { FC, ReactNode } from "react";

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="size-full h-screen overflow-y-auto">
      <UserHeader />
      <main className="size-full overflow-y-auto">{children}</main>
    </div>
  );
};

export default BaseLayout;
