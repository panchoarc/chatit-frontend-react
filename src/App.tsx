import { AuthProvider } from "@/features/auth/hooks/AuthContext";
import { BrowserRouter } from "react-router";
import { UserProvider } from "./features/user/hooks/UserContext";

import { Toaster } from "@/shared/ui/sonner";

import RoleBasedRoutes from "@/shared/utils/RoleBasedRoutes";

function App() {
  return (
      <BrowserRouter>
        <Toaster />
        <UserProvider>
          <AuthProvider>
            <RoleBasedRoutes />
          </AuthProvider>
        </UserProvider>
      </BrowserRouter>
  );
}

export default App;
