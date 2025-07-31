import { type FC } from "react";
import { Link } from "react-router";
import { useAuth } from "@/features/auth/hooks/AuthContext";
import { Button } from "@/shared/ui/button";
import BaseHeader from "@/shared/ui/header";
import { useUser } from "@/features/user/hooks/UserContext";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";
import { getDefaultRouteByRole } from "@/shared/utils/roleRedirect";

const AdminHeader: FC = () => {
  const { logout, isAuthenticated } = useAuth();
  const { profile } = useUser();

  const role: string = profile?.roles?.[0] ?? "";

  const redirectionToIndex = getDefaultRouteByRole(role);

  return (
    <BaseHeader>
      <div className="flex justify-between items-center px-2 py-2 w-full">
        <Link to="/dashboard" className="text-xl font-bold">
          Mi eCommerce
        </Link>
        <nav className="space-x-4 flex items-center">
          <Link to={`${redirectionToIndex}`} className="text-gray-700">
            Inicio
          </Link>

          {isAuthenticated && profile && (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-700">
                    Hola, {profile?.firstName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Configuración</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </nav>
      </div>
    </BaseHeader>
  );
};

export default AdminHeader;
