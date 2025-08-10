import { useCall } from "@/features/call/context/CallContext";
import { Phone, Video } from "lucide-react";
import type { Member } from "../types/types";

const ChatCalls = (otherUser: Member) => {
  const { startCall } = useCall();
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => startCall(otherUser.keycloakId)}
        className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white"
      >
        <Phone size={16} />
      </button>
      <button
        onClick={() => startCall(otherUser.keycloakId)}
        className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
      >
        <Video size={16} />
      </button>
    </div>
  );
};

export default ChatCalls;
