import { useRef } from "react";
import WebSocketClientInstance from "@/features/chat/config/WebSocketClient";

export const useTypingIndicator = (
  chatId: number,
  senderId: string,
  senderName: string
) => {
  const lastSentRef = useRef<number>(0);

  const notifyTyping = () => {
    const now = Date.now();
    if (now - lastSentRef.current > 2000) {
      // solo se envía cada 2 segundos
      WebSocketClientInstance.sendMessage("/app/typing", {
        chatId,
        senderId,
        senderName,
      });
      lastSentRef.current = now;
    }
  };

  return { notifyTyping };
};
