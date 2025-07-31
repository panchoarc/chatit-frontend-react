import AdminSidebar from "@/features/admin/components/AdminSidebar";
import AdminHeader from "@/features/admin/layouts/AdminHeader";
import { SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar";
import { type FC, type ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="size-full h-screen overflow-y-auto">
      <AdminHeader />
      <SidebarProvider>
        <div className="flex w-full">
          <AdminSidebar />
          <SidebarTrigger />
          <main className="size-full">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
