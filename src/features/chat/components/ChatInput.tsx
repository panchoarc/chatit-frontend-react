import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { useState, useRef } from "react";
import type { OutgoingMessage } from "@/features/chat/hooks/useChatMessages";
import { useTypingIndicator } from "@/features/chat/hooks/useTypingIndicator";
import { Paperclip, Send, X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import FileService from "@/features/chat/services/FileService";
import type { Member } from "@/features/chat/types/types";

type Props = {
  chatId: number;
  currentUserId: string;
  onSendMessage: (content: OutgoingMessage) => void;
  currentUserName: string;
  members: Member[];
};

const ChatInput = ({
  chatId,
  currentUserId,
  onSendMessage,
  currentUserName,
  members,
}: Props) => {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mentionSuggestions, setMentionSuggestions] = useState<Member[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [selectedMentions, setSelectedMentions] = useState<string[]>([]);

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
      senderId: currentUserId,
      type: "TEXT",
      content: trimmed,
      mentions: selectedMentions,
    };

    onSendMessage(message);
    setText("");
    setShowSuggestions(false);
    setSelectedMentions([]);
    textareaRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    notifyTyping();

    const selectionStart = e.target.selectionStart;
    const lastAt = value.lastIndexOf("@", selectionStart - 1);

    if (lastAt >= 0) {
      const query = value.slice(lastAt + 1, selectionStart);
      const filtered = members.filter((m) =>
        `${m.firstName} ${m.lastName}`
          .toLowerCase()
          .startsWith(query.toLowerCase())
      );
      setMentionSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setCursorPosition(lastAt);
    } else {
      setShowSuggestions(false);
      setCursorPosition(null);
    }
  };

  const handleSelectMention = (member: Member) => {
    if (cursorPosition === null) return;

    const before = text.slice(0, cursorPosition);
    const after = text.slice(cursorPosition).replace(/^@[\w\s]*/, "");
    const newText = `${before}@${member.firstName} ${member.lastName} ${after}`;

    setText(newText);
    setSelectedMentions((prev) => [...prev, member.keycloakId]);
    setShowSuggestions(false);
    setCursorPosition(null);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileClick = () => fileInputRef.current?.click();

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

      const fileMessage: OutgoingMessage = {
        senderId: currentUserId,
        type: "FILE",
        content: response.data,
      };

      onSendMessage(fileMessage);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error al subir archivo", error);
    }
  };

  const handleCancelFile = () => setSelectedFile(null);

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2 relative">
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

      <div className="flex items-end gap-2 relative">
        <Button
          variant="ghost"
          type="button"
          onClick={handleFileClick}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
        >
          <Paperclip />
        </Button>

        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="resize-none flex-1"
            rows={1}
          />

          {showSuggestions && (
            <div className="absolute bottom-full mb-1 bg-white dark:bg-gray-800 border rounded shadow-md z-50 max-h-40 overflow-y-auto w-full">
              {mentionSuggestions.map((m) => (
                <div
                  key={m.keycloakId}
                  className="px-2 py-1 hover:bg-blue-100 cursor-pointer flex items-center gap-2"
                  onClick={() => handleSelectMention(m)}
                >
                  {m.avatarUrl && (
                    <img
                      src={m.avatarUrl}
                      alt="avatar"
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span>
                    {m.firstName} {m.lastName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

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
