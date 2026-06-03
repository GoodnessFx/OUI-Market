import { useState, useCallback, useRef } from "react";

export function useRateLimit(limit: number, windowMs: number) {
  const [requests, setRequests] = useState<number[]>([]);

  const checkLimit = useCallback(() => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    setRequests((prev: number[]) => {
      const activeRequests = prev.filter((time: number) => time > windowStart);
      if (activeRequests.length >= limit) {
        return activeRequests;
      }
      return [...activeRequests, now];
    });

    return requests.filter((time: number) => time > windowStart).length < limit;
  }, [limit, windowMs, requests]);

  return { checkLimit, remaining: Math.max(0, limit - requests.length) };
}
