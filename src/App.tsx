import { AuthProvider } from "@/features/auth/hooks/AuthContext";
import { ChatProvider } from "@/features/chat/context/ChatContext";
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
          <ChatProvider>
            <RoleBasedRoutes />
          </ChatProvider>
        </AuthProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
