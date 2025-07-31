import ChatList from "@/features/chat/components/ChatList";
import ChatSidebarHeader from "@/features/chat/components/ChatSidebarHeader";
import type { Chat } from "@/features/chat/types/types";

type ChatSidebarProps = {
  chatList: Chat[];
  activeChat: Chat | null;
  onChatSelected: (chat: Chat) => void;
  onMarkAsRead: (chatId: number) => void;
};

const ChatSidebar = ({
  chatList,
  activeChat,
  onChatSelected,
  onMarkAsRead,
}: ChatSidebarProps) => {
  const handleSelect = (chat: Chat) => {
    if (!activeChat || activeChat.id !== chat.id) {
      onChatSelected(chat);
      onMarkAsRead(chat.id);
    }
  };

  return (
    <aside className="hidden sm:flex w-1/4 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col">
      <ChatSidebarHeader />

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
