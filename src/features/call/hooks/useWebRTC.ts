// useWebRTC.ts - Corregido para manejar conexión WebSocket
import { useEffect, useRef, useState, useCallback } from "react";
import WebSocketClient from "@/features/chat/config/WebSocketClient";

type CallType = "offer" | "answer" | "ice-candidate" | "end";

interface CallMessage {
  senderId: string;
  receiverId: string;
  type: CallType;
  sdp?: string;
  candidate?: string;
  sdpMid?: string;
  sdpMLineIndex?: number;
}

export default function useWebRTC(currentUserId: string) {
  const [inCall, setInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<CallMessage | null>(null);
  const [callerId, setCallerId] = useState<string | null>(null);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const subscriptionRef = useRef<any>(null);

  // Cambiado: el destination debe ser para recibir mensajes, no para enviar
  const subscriptionDestination = "/user/queue/call";
  const sendDestination = "/app/call/send";

  const handleCallMessage = useCallback(
    (message: CallMessage) => {
      console.log("📞 Mensaje de llamada entrante:", message);

      // Verificar que el mensaje es para el usuario actual
      if (message.receiverId !== currentUserId) return;

      switch (message.type) {
        case "offer":
          if (!inCall && !incomingCall) {
            setIncomingCall(message);
            setCallerId(message.senderId);
          }
          break;
        case "answer":
          if (peerConnection.current && message.sdp) {
            peerConnection.current
              .setRemoteDescription(
                new RTCSessionDescription({ type: "answer", sdp: message.sdp })
              )
              .catch((err) =>
                console.error("Error setting remote description:", err)
              );
          }
          break;
        case "ice-candidate":
          if (peerConnection.current && message.candidate) {
            peerConnection.current
              .addIceCandidate({
                candidate: message.candidate,
                sdpMid: message.sdpMid,
                sdpMLineIndex: message.sdpMLineIndex,
              })
              .catch((err) =>
                console.error("Error adding ICE candidate:", err)
              );
          }
          break;
        case "end":
          endCall();
          break;
      }
    },
    [currentUserId, inCall, incomingCall]
  );

  // Función para establecer la suscripción
  const setupSubscription = useCallback(() => {
    if (!currentUserId || !isWebSocketConnected || subscriptionRef.current)
      return;

    try {
      console.log("🔗 Estableciendo suscripción WebSocket para llamadas...");
      subscriptionRef.current = WebSocketClient.subscribe(
        subscriptionDestination,
        handleCallMessage
      );
      console.log("✅ Suscripción establecida correctamente");
    } catch (error) {
      console.error("❌ Error al suscribirse:", error);
      subscriptionRef.current = null;
      // Reintentar después de un tiempo
      setTimeout(setupSubscription, 2000);
    }
  }, [
    currentUserId,
    isWebSocketConnected,
    subscriptionDestination,
    handleCallMessage,
  ]);

  // Función para limpiar la suscripción
  const cleanupSubscription = useCallback(() => {
    if (subscriptionRef.current) {
      try {
        console.log("🚫 Limpiando suscripción...");
        WebSocketClient.unsubscribe(subscriptionDestination);
        subscriptionRef.current = null;
        console.log("✅ Suscripción limpiada correctamente");
      } catch (error) {
        console.error("Error limpiando suscripción:", error);
        subscriptionRef.current = null;
      }
    }
  }, [subscriptionDestination]);

  // Manejar el estado de conexión del WebSocket
  useEffect(() => {
    if (!currentUserId) return;

    const checkConnection = () => {
      const connected = WebSocketClient.isConnected();
      setIsWebSocketConnected(connected);

      if (connected && !subscriptionRef.current) {
        console.log("✅ WebSocket conectado, estableciendo suscripción...");
        setupSubscription();
      } else if (!connected) {
        console.log("⚠️ WebSocket no conectado, intentando conectar...");
        cleanupSubscription();
        WebSocketClient.connect()
          .then(() => {
            setIsWebSocketConnected(true);
          })
          .catch((error) => {
            console.error("❌ Error conectando WebSocket:", error);
            // Reintentar después de 3 segundos
            setTimeout(checkConnection, 3000);
          });
      }
    };

    // Verificar conexión inicial
    checkConnection();

    // Configurar listener para cambios de estado de conexión
    const onConnectionChange = (connected: boolean) => {
      setIsWebSocketConnected(connected);
      if (connected && !subscriptionRef.current) {
        setupSubscription();
      } else if (!connected) {
        cleanupSubscription();
      }
    };

    // Si el WebSocketClient tiene eventos de conexión, suscribirse a ellos
    if (WebSocketClient.onConnectionChange) {
      WebSocketClient.onConnectionChange(onConnectionChange);
    }

    return () => {
      cleanupSubscription();
      if (WebSocketClient.offConnectionChange) {
        WebSocketClient.offConnectionChange(onConnectionChange);
      }
    };
  }, [currentUserId, setupSubscription, cleanupSubscription]);

  const sendMessage = useCallback(
    (message: CallMessage) => {
      if (!isWebSocketConnected) {
        console.error("❌ No se puede enviar mensaje: WebSocket desconectado");
        return;
      }

      try {
        console.log("📤 Enviando mensaje de llamada:", message);
        WebSocketClient.sendMessage(sendDestination, message);
      } catch (error) {
        console.error("❌ Error enviando mensaje:", error);
      }
    },
    [isWebSocketConnected, sendDestination]
  );

  const createPeerConnection = (targetUserId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage({
          senderId: currentUserId,
          receiverId: targetUserId,
          type: "ice-candidate",
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid!,
          sdpMLineIndex: event.candidate.sdpMLineIndex!,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("🎥 Recibido stream remoto");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("🔗 Estado de conexión P2P:", pc.connectionState);
      if (
        pc.connectionState === "failed" ||
        pc.connectionState === "disconnected"
      ) {
        console.log("❌ Conexión P2P falló, terminando llamada");
        endCall();
      }
    };

    return pc;
  };

  const startCall = async (targetUserId: string) => {
    if (!isWebSocketConnected) {
      console.error("❌ No se puede iniciar llamada: WebSocket desconectado");
      return;
    }

    if (inCall) {
      console.log("⚠️ Ya hay una llamada en curso");
      return;
    }

    try {
      console.log("📞 Iniciando llamada a:", targetUserId);
      setInCall(true);
      setCallerId(targetUserId);
      peerConnection.current = createPeerConnection(targetUserId);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      sendMessage({
        senderId: currentUserId,
        receiverId: targetUserId,
        type: "offer",
        sdp: offer.sdp,
      });

      console.log("📤 Oferta enviada");
    } catch (error) {
      console.error("❌ Error starting call:", error);
      setInCall(false);
      setCallerId(null);
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    }
  };

  const acceptCall = async () => {
    if (!incomingCall || !isWebSocketConnected) {
      console.error("❌ No se puede aceptar llamada");
      return;
    }

    try {
      console.log("✅ Aceptando llamada de:", incomingCall.senderId);
      setInCall(true);
      const pc = createPeerConnection(incomingCall.senderId);
      peerConnection.current = pc;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      if (incomingCall.sdp) {
        await pc.setRemoteDescription(
          new RTCSessionDescription({ type: "offer", sdp: incomingCall.sdp })
        );

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        sendMessage({
          senderId: currentUserId,
          receiverId: incomingCall.senderId,
          type: "answer",
          sdp: answer.sdp,
        });

        console.log("📤 Respuesta enviada");
      }

      setIncomingCall(null);
    } catch (error) {
      console.error("❌ Error accepting call:", error);
      endCall();
    }
  };

  const rejectCall = useCallback(() => {
    if (incomingCall && isWebSocketConnected) {
      sendMessage({
        senderId: currentUserId,
        receiverId: incomingCall.senderId,
        type: "end",
      });
    }

    setIncomingCall(null);
    setCallerId(null);
    console.log("❌ Llamada rechazada");
  }, [incomingCall, isWebSocketConnected, currentUserId, sendMessage]);

  const endCall = useCallback(() => {
    console.log("📞 Finalizando llamada...");

    // Enviar mensaje de fin de llamada si hay una conexión activa
    if (isWebSocketConnected && (callerId || incomingCall)) {
      const targetId = callerId || incomingCall?.senderId;
      if (targetId) {
        sendMessage({
          senderId: currentUserId,
          receiverId: targetId,
          type: "end",
        });
      }
    }

    // Limpiar estados
    setInCall(false);
    setIncomingCall(null);
    setCallerId(null);

    // Cerrar conexión peer
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // Limpiar streams de video local
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }

    // Limpiar streams de video remoto
    if (remoteVideoRef.current?.srcObject) {
      const stream = remoteVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }

    console.log("✅ Llamada finalizada");
  }, [
    currentUserId,
    callerId,
    incomingCall,
    isWebSocketConnected,
    sendMessage,
  ]);

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      endCall();
      cleanupSubscription();
    };
  }, []);

  return {
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    localVideoRef,
    remoteVideoRef,
    incomingCall,
    inCall,
    callerId,
    isWebSocketConnected,
  };
}
