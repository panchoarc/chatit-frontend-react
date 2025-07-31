import { useEffect, useState, useRef } from "react";
import WebSocketClientInstance from "@/features/chat/config/WebSocketClient";

type TypingMessage = {
  chatId: number;
  senderId: string;
  senderName: string;
};
export const useTypingStatus = (
  chatId: number,
  currentUserId: string,
  isGroup: boolean
) => {
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  const destination = `/topic/typing.${chatId}`;

  useEffect(() => {
    WebSocketClientInstance.subscribe(destination, (message: TypingMessage) => {
      const data: TypingMessage = message;
      const { senderId, senderName } = data;

      if (!isGroup && senderId === currentUserId) return;

      setTypingUsers((prev) => ({
        ...prev,
        [senderId]: senderName,
      }));

      // resetear timer para mantenerlo visible 3s desde el último mensaje
      if (timeoutRefs.current[senderId]) {
        clearTimeout(timeoutRefs.current[senderId]);
      }

      timeoutRefs.current[senderId] = setTimeout(() => {
        setTypingUsers((prev) => {
          const { [senderId]: _, ...rest } = prev;
          return rest;
        });
        delete timeoutRefs.current[senderId];
      }, 3000); // 3 segundos de visibilidad
    });

    return () => {
      WebSocketClientInstance.unsubscribe(destination);
      Object.values(timeoutRefs.current).forEach(clearTimeout);
    };
  }, [chatId, currentUserId]);

  return Object.values(typingUsers); // solo los nombres
};
