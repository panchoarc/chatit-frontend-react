// CallContext.tsx
import IncomingCallModal from "@/features/call/components/IncomingCallModal";
import useWebRTC from "@/features/call/hooks/useWebRTC";
import { useUser } from "@/features/user/hooks/UserContext";
import { createContext, useContext } from "react";

interface CallMessage {
  senderId: string;
  receiverId: string;
  type: "offer" | "answer" | "ice-candidate" | "end";
  sdp?: string;
  candidate?: string;
  sdpMid?: string;
  sdpMLineIndex?: number;
}

interface CallContextType {
  startCall: (targetId: string) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  incomingCall: CallMessage | null;
  inCall: boolean;
  callerId: string | null;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) throw new Error("useCall must be used within a CallProvider");
  return context;
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { profile } = useUser();
  const currentUserId = profile?.keycloakId;
  const callerName = profile?.firstName + " " + profile?.lastName;

  const {
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    incomingCall,
    inCall,
    callerId,
    localVideoRef,
    remoteVideoRef,
  } = useWebRTC(currentUserId || "");

  // Renderizamos un solo modal si hay llamada entrante o en curso
  const showModal = incomingCall !== null || inCall;

  return (
    <CallContext.Provider
      value={{
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        incomingCall,
        inCall,
        callerId,
      }}
    >
      {children}

      {showModal && (
        <IncomingCallModal
          callerName={callerName || "Usuario"}
          onAccept={acceptCall}
          // Si está en llamada, onReject cierra la llamada, si está en llamada entrante, rechaza
          onReject={inCall ? endCall : rejectCall}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          inCall={inCall}
        />
      )}
    </CallContext.Provider>
  );
};
