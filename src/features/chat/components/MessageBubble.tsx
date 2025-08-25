import type { Member, Message } from "@/features/chat/types/types";
import CustomAudioPlayer from "./CustomAudioPLayer";
import { useState } from "react";
import ImageViewerModal from "./ImageViewerModal";

type Props = {
  message: Message;
  isMe: boolean;
  senderName: string;
  membersMap: Record<string, Member>; // Mapa de keycloakId -> Member
};

export const MessageBubble = ({
  message,
  isMe,
  senderName,
  membersMap,
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageClick = (url: string) => {
    setPreviewUrl(url);
    setModalOpen(true);
  };

  const bubbleStyles = isMe
    ? "bg-green-100 text-black rounded-xl rounded-br-[6px] shadow-sm"
    : "bg-gray-100 text-black rounded-xl rounded-bl-[6px] shadow-sm";

  const timeTextColor = "text-gray-400";

  const renderTextWithMentions = (text: string, mentions?: string[]) => {
    if (!mentions || mentions.length === 0) return <>{text}</>;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    mentions.forEach((id) => {
      const member = membersMap[id];
      if (!member) return;

      const nameStr = `${member.firstName} ${member.lastName}`;
      let mentionIndex = text.indexOf(nameStr, lastIndex);

      if (mentionIndex >= 0) {
        // Revisar si hay @ justo antes del nombre
        if (mentionIndex > 0 && text[mentionIndex - 1] === "@") {
          mentionIndex = mentionIndex - 1; // Incluir el @
        }

        // Agregar texto anterior a la mención
        if (mentionIndex > lastIndex) {
          parts.push(text.slice(lastIndex, mentionIndex));
        }

        // Agregar mención estilizada (incluye @ si existía)
        parts.push(
          <span
            key={id}
            className="bg-blue-100 text-blue-600 px-1 rounded cursor-pointer hover:bg-blue-200 transition-colors"
            title={`${member.firstName} ${member.lastName}`}
          >
            {text.slice(
              mentionIndex,
              mentionIndex +
                nameStr.length +
                (text[mentionIndex] === "@" ? 1 : 0)
            )}
          </span>
        );

        // Avanzar el índice
        lastIndex =
          mentionIndex + nameStr.length + (text[mentionIndex] === "@" ? 1 : 0);
      }
    });

    // Agregar texto restante después de la última mención
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  const renderMessageContent = () => {
    if (message.type === "TEXT") {
      return (
        <div className={`relative p-3 max-w-xs ${bubbleStyles}`}>
          {!isMe && (
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {senderName}
            </div>
          )}
          <div className="whitespace-pre-wrap text-sm break-words pr-10">
            {renderTextWithMentions(message.content, message.mentions)}
          </div>
          <span
            className={`absolute bottom-1 right-2 text-[10px] ${timeTextColor}`}
          >
            {new Date(message.createdAt).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
        </div>
      );
    }

    // FILE type
    const isImage = /\.(png|jpe?g|gif|webp)$/i.test(message.content);
    const isVideo = /\.(mp4|webm|ogg)$/i.test(message.content);
    const isAudio = /\.(mp3|wav|ogg)$/i.test(message.content);

    return (
      <div className="flex flex-col gap-1 max-w-xs">
        {!isMe && (
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {senderName}
          </div>
        )}

        {isImage && (
          <img
            src={message.content}
            alt="Imagen enviada"
            onClick={() => handleImageClick(message.content)}
            className="max-w-full max-h-60 sm:max-h-80 object-cover cursor-pointer rounded-xl hover:brightness-90 transition"
          />
        )}

        {isVideo && (
          <video controls className="rounded-xl max-w-full">
            <source src={message.content} />
            Tu navegador no soporta video.
          </video>
        )}

        {isAudio && <CustomAudioPlayer url={message.content} isMe={isMe} />}

        {!isImage && !isVideo && !isAudio && (
          <a
            href={message.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline text-blue-600 hover:text-blue-800 break-all"
          >
            Descargar archivo
          </a>
        )}

        <span
          className={`text-[10px] self-${
            isMe ? "end" : "start"
          } ${timeTextColor}`}
        >
          {new Date(message.createdAt).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>

        <ImageViewerModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          imageUrl={previewUrl}
        />
      </div>
    );
  };

  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} mb-2`}>
      {renderMessageContent()}
    </div>
  );
};
