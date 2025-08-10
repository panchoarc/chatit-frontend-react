import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { useState, useRef } from "react";
import type { OutgoingMessage } from "@/features/chat/hooks/useChatMessages";
import { useTypingIndicator } from "@/features/chat/hooks/useTypingIndicator";
import { Paperclip, Send, X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import FileService from "@/features/chat/services/FileService";

type Props = {
  chatId: number;
  currentUserId: string;
  onSendMessage: (content: OutgoingMessage) => void;
  currentUserName: string;
};

const ChatInput = ({
  chatId,
  currentUserId,
  onSendMessage,
  currentUserName,
}: Props) => {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { notifyTyping } = useTypingIndicator(
    chatId,
    currentUserId,
    currentUserName
  );

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const message: OutgoingMessage = {
      content: trimmed,
      senderId: currentUserId,
      type: "TEXT",
    };

    onSendMessage(message);
    setText("");
    textareaRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    notifyTyping();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    e.target.value = "";
  };

  const handleSendFile = async () => {
    if (!selectedFile) return;

    try {
      const response = await FileService.uploadFileToConversation(selectedFile);
      console.log("RESPONSE", response);

      const fileMessage: OutgoingMessage = {
        chatId,
        senderId: currentUserId,
        type: "FILE",
        content: response.data, // asegúrate que este campo venga del backend
      };

      onSendMessage(fileMessage);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error al subir archivo", error);
    }
  };

  const handleCancelFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2">
      {selectedFile && (
        <div className="border p-3 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedFile.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
                className="w-16 h-16 object-cover rounded-md"
              />
            ) : (
              <div className="text-sm">{selectedFile.name}</div>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSendFile}>
              Enviar
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancelFile}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          type="button"
          onClick={handleFileClick}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
        >
          <Paperclip />
        </Button>

        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          className="resize-none flex-1"
          rows={1}
        />

        <Button onClick={handleSend} variant="default" className="p-2">
          <Send className="h-4 w-4" />
        </Button>

        <Input
          ref={fileInputRef}
          type="file"
          accept="*/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ChatInput;
