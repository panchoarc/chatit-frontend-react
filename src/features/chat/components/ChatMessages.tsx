import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { ScrollToBottomButton } from "@/features/chat/components/ScrollToBottomButton";
import { useScrollManager } from "@/features/chat/hooks/useScrollManager";
import type { Member, Message } from "@/features/chat/types/types";

type ChatMessagesProps = {
  messages: Message[];
  currentUserId: string;
  members: Member[];
  loadMore: () => void;
  hasMore: boolean;
};

const getSenderName = (
  senderId: string,
  currentUserId: string,
  members: Member[]
) => {
  if (senderId === currentUserId) return "Tú";
  const member = members.find((m) => String(m.keycloakId) === String(senderId));
  return member ? `${member.firstName} ${member.lastName}` : senderId;
};

export const ChatMessages = ({
  messages,
  currentUserId,
  members,
  loadMore,
  hasMore,
}: ChatMessagesProps) => {
  const { containerRef, bottomRef, autoScroll, handleScroll, scrollToBottom } =
    useScrollManager({ messages, loadMore, hasMore });

  return (
    <div className="relative h-full">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scroll-smooth scrollbar-hidden p-4 space-y-4 bg-white dark:bg-black"
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMe={msg.senderId === currentUserId}
            senderName={getSenderName(msg.senderId, currentUserId, members)}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {!autoScroll && <ScrollToBottomButton onClick={scrollToBottom} />}
    </div>
  );
};
export default ChatMessages;
