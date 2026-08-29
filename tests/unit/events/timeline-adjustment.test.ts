import { describe, expect, it } from "vitest";

import { saveEventAction } from "@/features/events/actions/save-event";
import { mockActiveEvent, mockScheduledEvent } from "@/features/events/utils/mock-data";

describe("Timeline Adjustments and Audit Logging", () => {
  it("allows forward-only extension of endsAt for an active event and produces an audit log", async () => {
    const futureExtension = new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(); // 3 days ahead

    const result = await saveEventAction(
      {
        title: mockActiveEvent.title,
        slug: mockActiveEvent.slug,
        description: mockActiveEvent.description,
        bannerUrl: mockActiveEvent.bannerUrl,
        startsAt: mockActiveEvent.startsAt,
        endsAt: futureExtension,
        reason: "Pageant broadcast extended due to live performance delay",
      },
      mockActiveEvent,
      "organizer_admin_01",
    );

    expect(result.success).toBe(true);
    expect(result.data?.endsAt).toBe(futureExtension);
    expect(result.auditLog).toBeDefined();
    expect(result.auditLog?.action).toBe("EVENT_PROFILE_UPDATED");
    expect(result.auditLog?.changedBy).toBe("organizer_admin_01");
    expect(result.auditLog?.reason).toBe(
      "Pageant broadcast extended due to live performance delay",
    );
  });

  it("rejects setting endsAt into the past for an active event", async () => {
    const pastTimestamp = new Date(Date.now() - 1000 * 60 * 10).toISOString(); // 10 mins ago

    const result = await saveEventAction(
      {
        title: mockActiveEvent.title,
        slug: mockActiveEvent.slug,
        description: mockActiveEvent.description,
        bannerUrl: mockActiveEvent.bannerUrl,
        startsAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        endsAt: pastTimestamp,
      },
      mockActiveEvent,
      "organizer_admin_01",
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("Cannot set event deadline");
  });

  it("rejects setting startsAt into the past for a scheduled event", async () => {
    const pastTimestamp = new Date(Date.now() - 1000 * 60 * 60).toISOString();

    const result = await saveEventAction(
      {
        title: mockScheduledEvent.title,
        slug: mockScheduledEvent.slug,
        description: mockScheduledEvent.description,
        bannerUrl: mockScheduledEvent.bannerUrl,
        startsAt: pastTimestamp,
        endsAt: mockScheduledEvent.endsAt,
      },
      mockScheduledEvent,
      "organizer_admin_01",
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("Cannot set event startsAt timestamp into the past");
  });
});
