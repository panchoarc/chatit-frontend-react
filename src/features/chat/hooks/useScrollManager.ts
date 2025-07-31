import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Message } from "../types/types";

export const useScrollManager = ({
  messages,
  loadMore,
  hasMore,
}: {
  messages: Message[];
  loadMore: () => void;
  hasMore: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const previousScrollHeightRef = useRef(0);
  const previousScrollTopRef = useRef(0);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isAtBottom);

    if (scrollTop === 0 && hasMore && !loadingMore) {
      previousScrollHeightRef.current = scrollHeight;
      previousScrollTopRef.current = scrollTop;
      setLoadingMore(true);
      loadMore();
    }
  };

  useLayoutEffect(() => {
    if (loadingMore && containerRef.current) {
      const container = containerRef.current;
      const newScrollHeight = container.scrollHeight;
      const heightDiff = newScrollHeight - previousScrollHeightRef.current;
      container.scrollTop = previousScrollTopRef.current + heightDiff;
      setLoadingMore(false);
    }
  }, [messages]);

  useEffect(() => {
    if (autoScroll && !loadingMore) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return {
    containerRef,
    bottomRef,
    autoScroll,
    handleScroll,
    scrollToBottom: () => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setAutoScroll(true);
    },
  };
};
