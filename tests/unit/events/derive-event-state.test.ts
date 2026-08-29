import { describe, expect, it } from "vitest";

import { deriveEventState } from "@/features/events/utils/derive-event-state";

describe("deriveEventState", () => {
  const baseEvent = {
    startsAt: "2026-09-01T10:00:00.000Z",
    endsAt: "2026-09-05T22:00:00.000Z",
    publicationStatus: "PUBLISHED" as const,
  };

  it("returns 'Draft' when publicationStatus is DRAFT regardless of time", () => {
    const draftEvent = { ...baseEvent, publicationStatus: "DRAFT" as const };
    const state = deriveEventState(draftEvent, "2026-09-02T12:00:00.000Z");
    expect(state).toBe("Draft");
  });

  it("returns 'Scheduled' when currentTime is before startsAt", () => {
    const state = deriveEventState(baseEvent, "2026-08-30T00:00:00.000Z");
    expect(state).toBe("Scheduled");
  });

  it("returns 'Active' exactly at startsAt", () => {
    const state = deriveEventState(baseEvent, "2026-09-01T10:00:00.000Z");
    expect(state).toBe("Active");
  });

  it("returns 'Active' during the operational window", () => {
    const state = deriveEventState(baseEvent, "2026-09-03T15:30:00.000Z");
    expect(state).toBe("Active");
  });

  it("returns 'Closed' exactly at endsAt cutoff", () => {
    const state = deriveEventState(baseEvent, "2026-09-05T22:00:00.000Z");
    expect(state).toBe("Closed");
  });

  it("returns 'Closed' after endsAt cutoff", () => {
    const state = deriveEventState(baseEvent, "2026-09-06T00:00:00.000Z");
    expect(state).toBe("Closed");
  });
});
