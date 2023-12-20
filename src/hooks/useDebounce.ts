import { useEffect, useRef, useState } from "react";

export const useDebounce = (callback: (t?: any) => void, delay: number, param?: any) => {
  const latestCallback = useRef<(t?: any) => void>();
  const [lastCalledAt, setLastCalledAt] = useState<number | null>(null);

  useEffect(() => {
    latestCallback.current = callback;
  }, [callback]);

  // watch for change also clear when it's done
  useEffect(() => {
    if (lastCalledAt) {
      const fire = () => {
        setLastCalledAt(null);
        if (latestCallback.current) {
          latestCallback.current(param);
        }
      };
      const fireAt = lastCalledAt + delay;
      const id = setTimeout(fire, fireAt - Date.now());
      return () => clearTimeout(id);
    }
  }, [lastCalledAt, param, delay]);

  return () => setLastCalledAt(Date.now());
};