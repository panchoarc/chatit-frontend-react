import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react"; // O usa SVGs personalizados

import { Input } from "@/shared/ui/input";

type Props = {
  url: string;
  isMe: boolean; // para aplicar estilos de burbuja
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const CustomAudioPlayer = ({ url, isMe }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setProgress(newTime);
  };

  const bubbleClass = isMe
    ? "bg-blue-600 text-white"
    : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white";

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-full max-w-xs w-full ${bubbleClass}`}
    >
      <button
        onClick={togglePlay}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-blue-600"
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <Input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={progress}
        onChange={handleSeek}
        className="flex-1 h-1 accent-white"
      />

      <span className="text-xs min-w-[40px] text-right">
        {formatTime(duration - progress || 0)}
      </span>

      <audio ref={audioRef} src={url} preload="metadata" hidden />
    </div>
  );
};

export default CustomAudioPlayer;
