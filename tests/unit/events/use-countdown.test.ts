import { describe, expect, it } from "vitest";

import { calculateTimeRemaining } from "@/features/events/hooks/use-countdown";

describe("calculateTimeRemaining", () => {
  it("calculates positive remaining days, hours, minutes, and seconds", () => {
    const currentMs = new Date("2026-09-01T10:00:00.000Z").getTime();
    // 2 days, 3 hours, 4 minutes, 5 seconds later
    const targetMs = currentMs + (2 * 24 * 60 * 60 + 3 * 60 * 60 + 4 * 60 + 5) * 1000;

    const remaining = calculateTimeRemaining(targetMs, currentMs);
    expect(remaining.days).toBe(2);
    expect(remaining.hours).toBe(3);
    expect(remaining.minutes).toBe(4);
    expect(remaining.seconds).toBe(5);
    expect(remaining.isZero).toBe(false);
  });

  it("returns zero and isZero: true when target date has passed", () => {
    const currentMs = new Date("2026-09-05T12:00:00.000Z").getTime();
    const targetMs = new Date("2026-09-01T10:00:00.000Z").getTime();

    const remaining = calculateTimeRemaining(targetMs, currentMs);
    expect(remaining.days).toBe(0);
    expect(remaining.hours).toBe(0);
    expect(remaining.minutes).toBe(0);
    expect(remaining.seconds).toBe(0);
    expect(remaining.isZero).toBe(true);
  });
});
