import { useRef, useEffect } from "react";

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sound/F1.mp3");
  }, []);

  const playSound = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.warn("No se pudo reproducir audio:", err);
      });
    }
  };

  return { playSound };
}
