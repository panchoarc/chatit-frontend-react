import { useEffect, useState } from "react";
import ConversationService from "@/features/chat/services/ConversationService";
import WebSocketClientInstance from "../config/WebSocketClient";

type Message = {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  timestamp: string;
};

export type OutgoingMessage = {
  content: string;
  senderId: string;
  type: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
  mentions?: string[];
};
export function useChatMessages(chatId: number | null, userId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    if (!chatId) return;

    const init = async () => {
      const { conversations, pagination } =
        await ConversationService.getChatMessages(chatId, 0);

      setMessages(conversations.reverse());
      setPage(pagination.page);
      setHasMore(!pagination.lastPage);
    };

    init();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    const destination = `/topic/chat.${chatId}`;

    const onMessageReceived = (incomingMessage: Message) => {
      console.log("✅ Mensaje recibido vía WebSocket:", incomingMessage);

      setMessages((prev) => {
        const exists = prev.find((m) => m.id === incomingMessage.id);
        if (exists) return prev;
        return [...prev, incomingMessage];
      });

      // 👇 Aquí marcamos como leído si el usuario está viendo el chat
      WebSocketClientInstance.sendMessage(`/app/chat.${chatId}.read`, {});
    };

    const setup = async () => {
      await WebSocketClientInstance.connect();
      WebSocketClientInstance.subscribe(destination, onMessageReceived);
    };

    setup();
  }, [chatId, userId]);

  const loadOlderMessages = async () => {
    if (!chatId || !hasMore) return;

    const nextPage = page + 1;
    const { conversations, pagination } =
      await ConversationService.getChatMessages(chatId, nextPage);

    setMessages((prev) => [...conversations.reverse(), ...prev]);
    setPage(pagination.page);
    setHasMore(!pagination.lastPage);
  };

  const sendChatMessage = async (message: OutgoingMessage) => {
    await WebSocketClientInstance.connect();
    WebSocketClientInstance.sendMessage(`/app/chat.${chatId}`, message);
    WebSocketClientInstance.sendMessage(`/app/chat.${chatId}.read`, {});
  };

  return {
    messages,
    sendChatMessage,
    loadOlderMessages,
    hasMore: hasMore,
  };
}
