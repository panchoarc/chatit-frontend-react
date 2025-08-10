import { ScrollArea } from "@/shared/ui/scroll-area";
import type { Chat } from "@/features/chat/types/types";

type Props = {
  chatList: Chat[];
  onSelect: (chat: Chat) => void;
  activeChat: Chat | null;
};

const isFile = (content: string): boolean => {
  const extensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".mp4",
    ".webm",
    ".mp3",
    ".wav",
    ".ogg",
    ".m4a",
    ".pdf",
    ".docx",
    ".xlsx",
    "-",
  ];
  return extensions.some((ext) => content.toLowerCase().includes(ext));
};
const getPreviewText = (content: string): string => {
  if (!content) return "";

  if (isFile(content)) {
    if (content.match(/\.(jpg|jpeg|png|gif)$/i)) return "📷 Imagen";
    if (content.match(/\.(mp4|webm)$/i)) return "🎥 Video";
    if (content.match(/\.(mp3|wav|ogg|m4a)$/i)) return "🎙️ Audio";
    return "📎 Archivo";
  }

  return content.length > 20 ? `${content.slice(0, 20)}...` : content;
};

const ChatList = ({ chatList, onSelect, activeChat }: Props) => {
  return (
    <ScrollArea className="rounded-md">
      {chatList.map((chat) => (
        <li
          key={chat.id}
          onClick={() => onSelect(chat)}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 list-none"
        >
          <div className="flex items-center space-x-2">
            <img
              src={chat.avatarUrl || "/default-avatar.png"}
              alt={`${chat.name} avatar`}
              className="w-8 h-8 rounded-full ml-2"
            />
            <span className="font-medium">{chat.name}</span>
          </div>

          <div className="flex justify-between items-center mt-1 ml-2 mr-2">
            <span className="text-sm text-gray-500 truncate max-w-[70%]">
              {chat.lastMessage?.content
                ? getPreviewText(chat.lastMessage.content)
                : ""}
            </span>

            {chat.unreadCount !== 0 && activeChat?.id !== chat.id && (
              <span className="ml-2 bg-green-500 text-white text-xs font-semibold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {chat.unreadCount}
              </span>
            )}
          </div>
        </li>
      ))}
    </ScrollArea>
  );
};

export default ChatList;
