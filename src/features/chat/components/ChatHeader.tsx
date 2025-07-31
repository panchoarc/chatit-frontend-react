import MemberListModal from "@/features/chat/components/MemberListPopover";
import { useTypingStatus } from "../hooks/useTypingStatus";

type Member = {
  id: number;
  firstName: string;
  lastName: string;
  keycloakId: string;
  avatarUrl: string | null;
};

type Props = {
  chatId: number;
  currentUserId: string;
  chatName: string;
  isGroup: boolean;
  members?: Member[];
};

const ChatHeader = ({
  chatId,
  currentUserId,
  chatName,
  isGroup,
  members = [],
}: Props) => {
  const typingUsers = useTypingStatus(chatId, currentUserId, isGroup);
  const visibleMembers = members.slice(0, 1);
  const remainingMembers = members.slice(1);

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <h2 className="font-semibold text-lg">{chatName}</h2>

      {isGroup && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Miembros:{" "}
          {visibleMembers.map((m, idx) => (
            <span key={idx}>
              {m.firstName} {m.lastName}
              {idx < visibleMembers.length - 1 ? ", " : ""}
            </span>
          ))}
          {remainingMembers.length > 0 && (
            <>
              {" "}
              <MemberListModal
                members={members}
                triggerLabel={`+${remainingMembers.length} más`}
              />
            </>
          )}
        </p>
      )}

      {typingUsers.length > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
          {typingUsers.join(", ")} {typingUsers.length === 1 ? "está" : "están"}{" "}
          escribiendo...
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
