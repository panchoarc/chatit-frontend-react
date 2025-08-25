import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateChatModal from "@/features/chat/components/CreateChatModal";

const ChatSidebarHeader = ({ currentUserId }: string) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="p-4 flex items-center justify-between">
      <p className="font-bold text-xl">Chats</p>
      <div className="flex gap-2">
        <Button
          variant={"ghost"}
          className="rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Nuevo chat"
          onClick={() => setOpen(true)}
        >
          <Plus size={20} />
        </Button>
      </div>

      <CreateChatModal
        open={open}
        setOpen={setOpen}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default ChatSidebarHeader;
