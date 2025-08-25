import ChatList from "@/features/chat/components/ChatList";
import ChatSidebarHeader from "@/features/chat/components/ChatSidebarHeader";
import type { Chat } from "@/features/chat/types/types";
import { useChatContext } from "@/features/chat/context/ChatContext";

type ChatSidebarProps = {
  chatList: Chat[];
  activeChat: Chat | null;
  onMarkAsRead: (chatId: number) => void;
  currentUserId: string;
};

const ChatSidebar = ({
  chatList,
  activeChat,
  onMarkAsRead,
  currentUserId,
}: ChatSidebarProps) => {
  const { setActiveChat } = useChatContext();
  const handleSelect = (chat: Chat) => {
    if (!activeChat || activeChat.id !== chat.id) {
      setActiveChat(chat);
      onMarkAsRead(chat.id);
    }
  };

  return (
    <aside className="hidden sm:flex w-1/4 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col">
      <ChatSidebarHeader currentUserId={currentUserId} />

      <div className="flex-1 overflow-y-auto scrollbar-hidden">
        <ChatList
          activeChat={activeChat}
          chatList={chatList}
          onSelect={handleSelect}
        />
      </div>
    </aside>
  );
};

export default ChatSidebar;
