import { useEffect, useState } from "react";
import ConversationService from "@/features/chat/services/ConversationService";
import type { Member } from "@/features/chat/types/types";

export function useChatMembers(chatId: number) {
  const [members, setMembers] = useState<Member[]>([]);

  // 🚀 Fase 1: Carga inicial vía REST
  useEffect(() => {
    if (!chatId) return;

    const fetchMembers = async () => {
      try {
        const data = await ConversationService.getChatMembers(chatId);
        setMembers(data);
      } catch (err) {
        console.error("Error al obtener miembros:", err);
      }
    };

    fetchMembers();
  }, [chatId]);

  return { members };
}
