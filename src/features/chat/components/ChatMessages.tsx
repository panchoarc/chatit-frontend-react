import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { ScrollToBottomButton } from "@/features/chat/components/ScrollToBottomButton";
import { useScrollManager } from "@/features/chat/hooks/useScrollManager";
import type { Member, Message } from "@/features/chat/types/types";

import { formatDateKey, humanizeDate } from "@/features/chat/utils/dateUtils";

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

const ChatMessages = ({
  messages,
  currentUserId,
  members,
  loadMore,
  hasMore,
}: ChatMessagesProps) => {
  const { containerRef, bottomRef, autoScroll, handleScroll, scrollToBottom } =
    useScrollManager({ messages, loadMore, hasMore });

  let lastDate: string | null = null;

  const membersMap: Record<string, Member> = {};
  members.forEach((m) => {
    membersMap[m.keycloakId] = m;
  });
  return (
    <div className="relative h-full">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scroll-smooth scrollbar-hidden p-4 space-y-4 bg-white dark:bg-black"
      >
        {messages.map((msg) => {
          const dateKey = formatDateKey(msg.createdAt);
          const showDateSeparator = dateKey !== lastDate;
          lastDate = dateKey;

          return (
            <div key={msg.id}>
              {showDateSeparator && (
                <div className="text-center my-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 shadow-sm">
                    {humanizeDate(msg.createdAt)}
                  </span>
                </div>
              )}

              <MessageBubble
                message={msg}
                isMe={msg.senderId === currentUserId}
                senderName={getSenderName(msg.senderId, currentUserId, members)}
                membersMap={membersMap}
              />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {!autoScroll && <ScrollToBottomButton onClick={scrollToBottom} />}
    </div>
  );
};

export default ChatMessages;
