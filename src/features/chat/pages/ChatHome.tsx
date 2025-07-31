import ChatSidebar from "@/features/chat/components/ChatSidebar";
import ChatWindow from "@/features/chat/components/ChatWindow";
import { useChatList } from "@/features/chat/hooks/useChatList";

const ChatHome = () => {
  const { chatList, activeChat, setActiveChat, handleMarkAsRead } =
    useChatList();

  return (
    <div className="h-full lg:w-4/5 mx-auto flex py-3">
      <ChatSidebar
        chatList={chatList}
        activeChat={activeChat}
        onChatSelected={setActiveChat}
        onMarkAsRead={handleMarkAsRead}
      />
      {activeChat && <ChatWindow chat={activeChat} />}
    </div>
  );
};

export default ChatHome;
