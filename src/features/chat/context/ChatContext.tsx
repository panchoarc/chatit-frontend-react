import { createContext, useContext, useState } from "react";
import type { Chat } from "@/features/chat/types/types";

type ChatContextType = {
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  return (
    <ChatContext.Provider value={{ activeChat, setActiveChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext debe usarse dentro de un ChatProvider");
  }
  return context;
};
