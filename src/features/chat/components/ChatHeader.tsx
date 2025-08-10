import MemberListModal from "@/features/chat/components/MemberListPopover";
import { useTypingStatus } from "../hooks/useTypingStatus";
import ChatCalls from "./ChatCalls";
import useUserStatus from "../hooks/useUserStatus";
import { formatLastSeen } from "@/features/chat/utils/dateUtils";

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

  const otherUser = members.find((m) => m.keycloakId !== currentUserId);
  const { status } = useUserStatus(otherUser?.keycloakId);

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-start md:items-center gap-2">
        <div>
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

          {/* Estado de conexión estilo WhatsApp */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {!isGroup &&
              (status?.online
                ? "Online"
                : status?.lastSeen
                ? `Última vez conectado: ${formatLastSeen(
                    new Date(status.lastSeen)
                  )}`
                : "Offline")}
          </p>

          {typingUsers.length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
              {typingUsers.join(", ")}{" "}
              {typingUsers.length === 1 ? "está" : "están"} escribiendo...
            </div>
          )}
        </div>

        {/* Derecha: Botones de llamada */}
        {!isGroup && otherUser && <ChatCalls {...otherUser} />}
      </div>
    </div>
  );
};

export default ChatHeader;
