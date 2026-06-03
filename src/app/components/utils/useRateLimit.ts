import { useState, useCallback, useRef } from "react";

export function useRateLimit(limit: number, windowMs: number) {
  const [requests, setRequests] = useState<number[]>([]);

  const checkLimit = useCallback(() => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    setRequests((prev) => {
      const activeRequests = prev.filter((time) => time > windowStart);
      if (activeRequests.length >= limit) {
        return activeRequests;
      }
      return [...activeRequests, now];
    });

    return requests.filter((time) => time > windowStart).length < limit;
  }, [limit, windowMs, requests]);

  return { checkLimit, remaining: Math.max(0, limit - requests.length) };
}
