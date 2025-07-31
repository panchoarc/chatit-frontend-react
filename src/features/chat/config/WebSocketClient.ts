import { getValidAccessToken } from "@/features/auth/utils/ValidationExpirationToken";
import { Client } from "@stomp/stompjs";

let isConnectedPromise: Promise<void> | null = null;
let resolveConnected: (() => void) | null = null;
let currentToken: string | null = null;

type SubscriptionEntry = {
  stompSubscription: any;
  callback: Function;
};

const subscriptions: Record<string, SubscriptionEntry> = {};

const client = new Client({
  brokerURL: "ws://localhost:8080/api/ws",
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,

  beforeConnect: () => {
    if (!currentToken) {
      console.error("No token available at beforeConnect");
      throw new Error("No token available");
    }
    client.connectHeaders = {
      Authorization: `Bearer ${currentToken}`,
    };
  },

  debug: (msg: string) => {
    if (import.meta.env.DEV) {
      console.log("[STOMP DEBUG]", msg);
    }
  },

  onConnect: () => {
    console.log("✅ WebSocket connected");

    // Re-suscribir todos los destinos registrados
    Object.entries(subscriptions).forEach(([destination, { callback }]) => {
      const stompSubscription = client.subscribe(destination, (message) => {
        callback(JSON.parse(message.body));
      });
      subscriptions[destination].stompSubscription = stompSubscription;
    });

    if (resolveConnected) resolveConnected();
  },

  onStompError: (frame) => {
    console.error("❌ Broker reported error: " + frame.headers["message"]);
    console.error("Additional details: " + frame.body);
  },

  onWebSocketClose: async (event) => {
    console.warn("🔌 WebSocket connection closed", event);

    if (event.code === 1002 || event.reason.includes("token")) {
      console.log(
        "⚠️ Posible token expirado. Reintentando conexión con nuevo token..."
      );
      if (client.active) {
        await client.deactivate();
      }
      await connectWithFreshToken(); // reconectar y re-suscribir
    }
  },

  onWebSocketError: (error) => {
    console.error("WebSocket error: ", error);
  },
});

/**
 * Función que prepara token fresco y activa conexión
 */
async function connectWithFreshToken() {
  currentToken = await getValidAccessToken();
  if (!currentToken) {
    console.error(
      "❌ No valid access token found. Cannot connect to WebSocket."
    );
    return Promise.reject(new Error("No valid token"));
  }

  if (!client.active) {
    isConnectedPromise = new Promise<void>((resolve) => {
      resolveConnected = resolve;
    });
    client.activate();
  }
  return isConnectedPromise ?? Promise.resolve();
}

const WebSocketClient = {
  connect: () => {
    return connectWithFreshToken();
  },
  disconnect: () => {
    if (client.active) {
      client.deactivate();
    }
  },
  isConnected: () => {
    return client.active;
  },
  sendMessage: async (destination: string, body: any) => {
    try {
      if (!client.connected) {
        console.warn(
          "⏳ Esperando conexión WebSocket antes de enviar mensaje..."
        );
        await WebSocketClient.connect(); // espera reconexión
      }
      console.log("Se envía mensaje con body: ", body, destination);

      client.publish({
        destination,
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error("❌ No se pudo enviar el mensaje:", err);
    }
  },
  subscribe: async (destination: string, callback: Function) => {
    if (subscriptions[destination]) {
      return subscriptions[destination].stompSubscription;
    }

    const stompSubscription = client.subscribe(destination, (message) => {
      callback(JSON.parse(message.body));
    });

    subscriptions[destination] = {
      stompSubscription,
      callback,
    };

    return stompSubscription;
  },
  unsubscribe: (destination: string) => {
    if (subscriptions[destination]) {
      subscriptions[destination].stompSubscription.unsubscribe();
      delete subscriptions[destination];
      console.log("🚫 Desuscrito de", destination);
    } else {
      console.warn("⚠️ No hay suscripción activa para", destination);
    }
  },
};

const WebSocketClientInstance = Object.freeze(WebSocketClient);
export default WebSocketClientInstance;
