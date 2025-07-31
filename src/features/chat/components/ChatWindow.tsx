import ChatHeader from "@/features/chat/components/ChatHeader";
import ChatInput from "@/features/chat/components/ChatInput";
import ChatMessages from "@/features/chat/components/ChatMessages";
import { useChatMessages } from "@/features/chat/hooks/useChatMessages";
import { getCurrentUserIdFromToken } from "@/features/chat/utils/CurrentUser";
import type { Chat } from "@/features/chat/types/types";

import { type FC } from "react";
import { useChatMembers } from "@/features/chat/hooks/useChatMembers";

type ChatWindowProps = { chat: Chat };

const ChatWindow: FC<ChatWindowProps> = ({ chat }) => {
  const currentUserId = getCurrentUserIdFromToken();
  const { messages, sendChatMessage, loadOlderMessages, hasMore } =
    useChatMessages(chat.id, currentUserId);

  const { members } = useChatMembers(chat.id);

  const currentUser = members.find((m) => m.keycloakId === currentUserId);
  const currentUserName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Tú";

  return (
    <div className="flex-1 px-4 flex flex-col h-full">
      <div className="shrink-0">
        <ChatHeader
          chatId={chat.id}
          currentUserId={currentUserId}
          chatName={chat.name}
          isGroup={chat.type === "GROUP"}
          members={members}
        />
      </div>
      <div className="flex-1 min-h-0">
        <ChatMessages
          messages={messages}
          currentUserId={currentUserId}
          members={members}
          loadMore={loadOlderMessages}
          hasMore={hasMore}
        />
      </div>
      <div className="shrink-0">
        <ChatInput
          chatId={chat.id}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          onSendMessage={sendChatMessage}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
