"use client";

import { useEffect, useState } from "react";

export interface TimeRemaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isZero: boolean;
}

export function calculateTimeRemaining(targetTimeMs: number, currentTimeMs: number): TimeRemaining {
  const diff = targetTimeMs - currentTimeMs;

  if (diff <= 0) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isZero: true,
    };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return {
    totalMs: diff,
    days,
    hours,
    minutes,
    seconds,
    isZero: false,
  };
}

export interface UseCountdownOptions {
  targetDate: string | Date;
  serverTime?: string | Date | undefined;
  onZero?: (() => void) | undefined;
}

export function useCountdown({
  targetDate,
  serverTime,
  onZero,
}: UseCountdownOptions): TimeRemaining {
  const targetMs = new Date(targetDate).getTime();
  const initialCurrentMs = serverTime ? new Date(serverTime).getTime() : targetMs;

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(targetMs, initialCurrentMs),
  );

  useEffect(() => {
    const timeOffset = serverTime ? new Date(serverTime).getTime() - Date.now() : 0;

    const tick = (): void => {
      const nowSynced = Date.now() + timeOffset;
      const remaining = calculateTimeRemaining(targetMs, nowSynced);
      setTimeRemaining(remaining);

      if (remaining.isZero && onZero) {
        onZero();
      }
    };

    tick();
    const timerId = setInterval(tick, 1000);

    return () => clearInterval(timerId);
  }, [targetMs, serverTime, onZero]);

  return timeRemaining;
}
