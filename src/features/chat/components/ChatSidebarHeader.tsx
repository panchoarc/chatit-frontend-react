import { Button } from "@/shared/ui/button"; // Asegúrate de tener un componente Button para manejar los clics
import { Plus } from "lucide-react";

const ChatSidebarHeader = () => {
  return (
    <div className="p-4 flex items-center justify-between">
      <p className="font-bold text-xl">Chats</p>
      <div className="flex gap-2">
        <Button
          variant={"ghost"}
          className="rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Nuevo chat"
        >
          <Plus size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebarHeader;
