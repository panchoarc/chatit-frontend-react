import ChatSidebar from "@/features/chat/components/ChatSidebar";
import ChatWindow from "@/features/chat/components/ChatWindow";
import { useChatList } from "@/features/chat/hooks/useChatList";
import { getCurrentUserIdFromToken } from "../utils/CurrentUser";

const ChatHome = () => {
  const currentUserId = getCurrentUserIdFromToken();
  const { chatList, activeChat, handleMarkAsRead } = useChatList(currentUserId);

  return (
    <div className="h-full lg:w-4/5 mx-auto flex py-3">
      <ChatSidebar
        chatList={chatList}
        activeChat={activeChat}
        onMarkAsRead={handleMarkAsRead}
        currentUserId={currentUserId}
      />
      {activeChat && (
        <ChatWindow chat={activeChat} currentUserId={currentUserId} />
      )}
    </div>
  );
};

export default ChatHome;
