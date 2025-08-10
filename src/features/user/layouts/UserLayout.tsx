// src/features/user/layouts/UserLayout.tsx
import { type FC, type ReactNode } from "react";
import UserHeader from "@/features/user/layouts/UserHeader";
import { useUser } from "@/features/user/hooks/UserContext";
import { CallProvider } from "@/features/call/context/CallContext";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: FC<UserLayoutProps> = ({ children }) => {
  const { profile } = useUser();

  console.log("Profile: ", profile);

  const currentUserId = profile;
  const isLoading = !profile;

  if (isLoading) return <div className="p-4">Cargando usuario...</div>;

  if (!currentUserId) return <div className="p-4">Acceso no autorizado</div>;

  return (
    <CallProvider>
      <div className="flex flex-col h-full w-screen bg-gray-100 dark:bg-gray-900">
        <UserHeader />
        <main className="flex-1 overflow-y-auto relative">{children}</main>
      </div>
    </CallProvider>
  );
};

export default UserLayout;
