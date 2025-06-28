// hooks/useThrottleCallback.ts
import { useRef, useCallback } from 'react';

export function useThrottleCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 1000
): T {
  const lastCalled = useRef<number>(0);

  return useCallback(((...args: any[]) => {
    const now = Date.now();
    if (now - lastCalled.current >= delay) {
      lastCalled.current = now;
      callback(...args);
    }
  }) as T, [callback, delay]);
}
