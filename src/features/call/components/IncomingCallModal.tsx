import React, { useEffect } from "react";
import { Rnd } from "react-rnd";
import { X, Phone, PhoneOff } from "lucide-react"; // Iconos modernos (lucide-react recomendado)

interface IncomingCallModalProps {
  callerName: string;
  onAccept: () => void;
  onReject: () => void;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  inCall: boolean;
}

const IncomingCallModal = ({
  callerName,
  onAccept,
  onReject,
  localVideoRef,
  remoteVideoRef,
  inCall,
}: IncomingCallModalProps) => {
  useEffect(() => {
    if (
      remoteVideoRef?.current &&
      remoteVideoRef.current.srcObject instanceof MediaStream
    ) {
      console.log("🎥 Stream remoto ya está presente");
    }
  }, [remoteVideoRef]);

  return (
    <Rnd
      default={{
        x: window.innerWidth / 2 - 250,
        y: window.innerHeight / 2 - 200,
        width: 500,
        height: "auto",
      }}
      minWidth={350}
      minHeight={300}
      maxWidth={window.innerWidth}
      maxHeight={window.innerHeight}
      bounds="window"
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      dragHandleClassName="drag-handle"
      className="z-50"
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 drag-handle">
          <h2 className="text-md font-semibold text-gray-800 dark:text-gray-200">
            {inCall ? "En llamada" : "Llamada entrante"}
          </h2>
          <button
            onClick={onReject}
            className="text-gray-500 hover:text-red-500 transition"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-4">
          {!inCall ? (
            <>
              <p className="text-lg text-center font-medium text-gray-700 dark:text-gray-200">
                📞 {callerName} te está llamando...
              </p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={onAccept}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
                >
                  <Phone size={18} />
                  Aceptar
                </button>
                <button
                  onClick={onReject}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
                >
                  <PhoneOff size={18} />
                  Rechazar
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                En llamada con <strong>{callerName}</strong>
              </p>
              <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-32 h-32 rounded-md absolute bottom-2 right-2 border-2 border-white shadow-md object-cover"
                />
              </div>
              <div className="flex justify-center">
                <button
                  onClick={onReject}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
                >
                  <PhoneOff size={18} />
                  Finalizar llamada
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Rnd>
  );
};

export default IncomingCallModal;
