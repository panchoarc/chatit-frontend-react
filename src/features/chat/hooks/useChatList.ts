import { useEffect, useRef, useState } from "react";
import WebSocketClient from "@/features/chat/config/WebSocketClient";
import ConversationService from "@/features/chat/services/ConversationService";
import type { Chat } from "@/features/chat/types/types";
import { useChatContext } from "@/features/chat/context/ChatContext";
import { useNotificationSound } from "./useNotificationSound";

export const useChatList = (currentUserId: string) => {
  const { playSound } = useNotificationSound();
  const { activeChat } = useChatContext();
  const [chatList, setChatList] = useState<Chat[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cargar el sonido una sola vez
    audioRef.current = new Audio("/sound/F1.mp3");
  }, []);

  // 📨 Obtener lista de chats del usuario
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await ConversationService.getUserConversations();
        setChatList(response.data);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };

    fetchChats();
  }, []);

  // 📡 Subscripción WebSocket unificada
  useEffect(() => {
    const subscriptions: any[] = [];

    const initWebSocket = async () => {
      await WebSocketClient.connect();

      subscriptions.push(subscribeToChats());
      subscriptions.push(subscribeToChatUpdates());
      subscriptions.push(subscribeToChatRead());
    };

    initWebSocket();

    return () => {
      subscriptions.forEach((sub) => sub?.unsubscribe?.());
    };
  }, []);

  // ✅ Funciones desacopladas de subscripción
  const subscribeToChats = () => {
    WebSocketClient.subscribe("/user/queue/chats", (message: Chat) => {
      setChatList((prev) => [...prev, message]);
    });
  };

  const subscribeToChatUpdates = () => {
    WebSocketClient.subscribe(
      "/user/queue/chat-updates",
      (msg: { chatId: number; lastMessage: string; unreadCount: number }) => {
        console.log("🔔 Mensaje recibido:", msg);
        console.log("senderId:", msg.lastMessage.senderId);
        console.log("currentUserId:", currentUserId);
        setChatList((prevList) => {
          const updated = prevList.map((chat) =>
            chat.id === msg.chatId
              ? {
                  ...chat,
                  lastMessage: msg.lastMessage,
                  unreadCount: msg.unreadCount,
                }
              : chat
          );

          const updatedChat = updated.find((chat) => chat.id === msg.chatId);
          const rest = updated.filter((chat) => chat.id !== msg.chatId);

          return updatedChat ? [updatedChat, ...rest] : prevList;
        });

        // 🔊 Solo reproducir si el mensaje es de un chat que no está activo
        if (
          msg.chatId !== activeChat?.id &&
          msg.lastMessage.senderId !== currentUserId
        ) {
          playSound();
        }
      }
    );
  };

  const subscribeToChatRead = () => {
    WebSocketClient.subscribe(
      "/user/queue/chat-read",
      ({ chatId }: { chatId: number }) => {
        setChatList((prevList) =>
          prevList.map((chat) =>
            chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
          )
        );
      }
    );
  };

  // ✅ Función para marcar chat como leído
  const handleMarkAsRead = async (chatId: number) => {
    await WebSocketClient.connect();
    WebSocketClient.sendMessage(`/app/chat.${chatId}.read`, {});
  };

  return {
    chatList,
    activeChat,
    handleMarkAsRead,
  };
};
