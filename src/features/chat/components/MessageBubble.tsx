import type { Message } from "@/features/chat/types/types";
import CustomAudioPlayer from "./CustomAudioPLayer";
import { useState } from "react";
import ImageViewerModal from "./ImageViewerModal";

type Props = {
  message: Message;
  isMe: boolean;
  senderName: string;
};

const nameColors = [
  "text-red-500",
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-purple-500",
  "text-pink-500",
  "text-orange-500",
  "text-cyan-500",
];

const getColorForName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % nameColors.length;
  return nameColors[index];
};

const cleanText = (text: string) => text.replace(/\n\s*\n/g, "\n");

export const MessageBubble = ({ message, isMe, senderName }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageClick = (url: string) => {
    setPreviewUrl(url);
    setModalOpen(true);
  };
  const bubbleStyles = isMe
    ? "bg-blue-600 text-white"
    : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white";

  const timeTextColor = isMe
    ? "text-white/70"
    : "text-gray-600 dark:text-gray-300";

  const renderMessageContent = () => {
    if (message.type === "TEXT") {
      return (
        <div className={`relative p-3 rounded-lg max-w-md ${bubbleStyles}`}>
          {!isMe && (
            <div className={`text-xs ${getColorForName(senderName)} mb-1`}>
              {senderName}
            </div>
          )}
          <div className="whitespace-pre-wrap text-sm break-words pr-10">
            {cleanText(message.content)}
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
          <div className={`text-xs ${getColorForName(senderName)}`}>
            {senderName}
          </div>
        )}

        {isImage && (
          <img
            src={message.content}
            alt="Imagen enviada"
            onClick={() => handleImageClick(message.content)}
            className="max-w-full max-h-60 sm:max-h-80 object-cover cursor-pointer hover:brightness-90 transition"
          />
        )}

        {isVideo && (
          <video controls className="rounded-md max-w-full">
            <source src={message.content} />
            Tu navegador no soporta video.
          </video>
        )}

        {/* <audio controls className="w-full">
            <source src={message.content} />
            Tu navegador no soporta audio.
          </audio> */}

        {isAudio && <CustomAudioPlayer url={message.content} isMe={isMe} />}

        {!isImage && !isVideo && !isAudio && (
          <a
            href={message.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline break-all"
          >
            Descargar archivo
          </a>
        )}

        <span className={`text-[10px] self-end ${timeTextColor}`}>
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
