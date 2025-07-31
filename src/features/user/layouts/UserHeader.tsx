import { useAuth } from "@/features/auth/hooks/AuthContext";
import { useUser } from "@/features/user/hooks/UserContext";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import BaseHeader from "@/shared/ui/header";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/shared/ui/sheet";
import { getDefaultRouteByRole } from "@/shared/utils/roleRedirect";
import { LogOut, Menu, Settings, User } from "lucide-react";
import { type FC } from "react";
import { Link } from "react-router";

const UserHeader: FC = () => {
  const { logout, isAuthenticated } = useAuth();
  const { profile } = useUser();
  const role = profile?.roles;
  const finalRedirectPath = role ? getDefaultRouteByRole(role) : "/";

  const CommonLinks = (
    <>
      <Link
        to={finalRedirectPath}
        className="text-gray-700 hover:text-primary transition-colors"
      >
        Inicio
      </Link>
    </>
  );

  const PublicLinks = (
    <>
      <Link
        to="/login"
        className="text-gray-700 hover:text-primary transition-colors"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="text-gray-700 hover:text-primary transition-colors"
      >
        Registro
      </Link>
    </>
  );

  const PrivateLinks = (
    <>
      <Link
        to="/profile"
        className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
      >
        <User className="h-4 w-4" />
        Perfil
      </Link>
      <Link
        to="/settings"
        className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors"
      >
        <Settings className="h-4 w-4" />
        Configuración
      </Link>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-left text-gray-700 hover:text-red-600 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </button>
    </>
  );

  return (
    <BaseHeader>
      <div className="flex justify-between w-full p-3 items-center bg-white">
        <div className="flex flex-row items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">
            CHATIT
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 ml-auto">
          {CommonLinks}
          {!isAuthenticated && PublicLinks}

          {isAuthenticated && profile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700">
                  Hola, {profile.firstName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menú">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-4/5 pt-8">
              <SheetHeader>
                <SheetTitle>Menú</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 pl-4 text-gray-800 mt-4">
                {CommonLinks}
                <hr />
                {isAuthenticated ? PrivateLinks : PublicLinks}
                <hr />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </BaseHeader>
  );
};

export default UserHeader;
