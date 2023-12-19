import { useEffect } from 'react';

export function useWindowListener(eventType: any, listener: () => any) {
  useEffect(() => {
    listener();
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}