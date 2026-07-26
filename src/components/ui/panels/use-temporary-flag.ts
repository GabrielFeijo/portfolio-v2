import { useEffect, useRef, useState } from 'react';

export function useTemporaryFlag(durationMs: number, onExpire?: () => void) {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const trigger = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    setActive(true);
    timeoutRef.current = window.setTimeout(() => {
      setActive(false);
      timeoutRef.current = null;
      onExpire?.();
    }, durationMs);
  };

  return { active, trigger };
}
