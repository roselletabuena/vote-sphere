import { describe, expect, it } from "vitest";

import { sanitizeSlug, saveEventSchema } from "@/lib/validations/event";

describe("Event Zod Validations", () => {
  it("sanitizes event title to kebab-case slug", () => {
    expect(sanitizeSlug("Miss Luzon 2026!")).toBe("miss-luzon-2026");
    expect(sanitizeSlug("  Festival of Arts & Culture -- 2026  ")).toBe(
      "festival-of-arts-culture-2026",
    );
  });

  it("validates correct event input payload", () => {
    const validData = {
      title: "Miss Universe Philippines 2026",
      slug: "miss-universe-philippines-2026",
      description: "Official online voting for national pageant titleholder.",
      bannerUrl: "https://example.com/banner.jpg",
      startsAt: "2026-09-01T10:00:00.000Z",
      endsAt: "2026-09-05T22:00:00.000Z",
      publicationStatus: "PUBLISHED" as const,
      showResultsOnClose: true,
    };

    const result = saveEventSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects when endsAt is before or equal to startsAt", () => {
    const invalidData = {
      title: "Miss Luzon 2026",
      slug: "miss-luzon-2026",
      description: "Contest description with enough characters.",
      bannerUrl: "https://example.com/banner.jpg",
      startsAt: "2026-09-05T22:00:00.000Z",
      endsAt: "2026-09-01T10:00:00.000Z",
      publicationStatus: "PUBLISHED" as const,
    };

    const result = saveEventSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("rejects invalid slugs with uppercase or special characters", () => {
    const invalidData = {
      title: "Miss Luzon 2026",
      slug: "Miss_Luzon!_2026",
      description: "Contest description with enough characters.",
      bannerUrl: "https://example.com/banner.jpg",
      startsAt: "2026-09-01T10:00:00.000Z",
      endsAt: "2026-09-05T22:00:00.000Z",
      publicationStatus: "DRAFT" as const,
    };

    const result = saveEventSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
