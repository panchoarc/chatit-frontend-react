import UserHeader from "@/features/user/layouts/UserHeader";
import type { FC, ReactNode } from "react";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-full w-screen bg-gray-100 dark:bg-gray-900">
      <UserHeader />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default UserLayout;

