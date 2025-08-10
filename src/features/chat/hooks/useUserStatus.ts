import { useEffect, useState } from "react";
import WebSocketClient from "@/features/chat/config/WebSocketClient";
import UserService from "@/features/user/services/UserService";

interface UserStatus {
  online: boolean;
  lastSeen?: string;
}

export default function useUserStatus(username: string) {
  const [status, setStatus] = useState<UserStatus | null>(null);

  // se ejecuta solo al montar

  // 2) Estado inicial vía REST cuando cambie username
  useEffect(() => {
    if (!username) return;

    async function fetchStatus() {
      console.log("SE EJECUTA FETCH STATUS");
      const res = await UserService.getUserStatus(username);
      setStatus(res);
    }

    fetchStatus();
  }, [username]);

  // 1) Suscripción a presencia (solo una vez)
  useEffect(() => {
    if (!username) return;
    let subscription: any;

    async function setupWebSocket() {
      await WebSocketClient.connect();

      subscription = WebSocketClient.subscribe(
        "/topic/presence",
        (msg: any) => {
          console.log("MSG: ", msg);
          console.log("USERNAME: ", username);
          if (msg.userId === username) {
            setStatus({
              online: msg.online,
              lastSeen: msg.lastSeen,
            });
          }
        }
      );
    }

    setupWebSocket();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [username]);

  return { status };
}
