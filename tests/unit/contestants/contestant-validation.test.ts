import { describe, expect, it } from "vitest";
import {
  createContestantSchema,
  updateContestantSchema,
  updateContestantStatusSchema,
} from "@/lib/validations/contestant";

describe("createContestantSchema", () => {
  it("passes with valid full payload", () => {
    const payload = {
      contestantNumber: 1,
      name: "Maria Clara Santos",
      division: "FEMALE",
      hometown: "Vigan, Ilocos Sur",
      heightCm: 175,
      bio: "Passionate youth leader and cultural heritage advocate.",
      advocacy: "Preserving indigenous textile traditions.",
      avatarUrl: "https://storage.electa.ph/contestants/maria-clara.webp",
      instagramUrl: "@mariaclara",
      tiktokUrl: "mariaclara_tok",
      facebookUrl: "https://facebook.com/mariaclara",
      categoryIds: ["cat-1", "cat-2"],
      media: [
        {
          mediaType: "PHOTO",
          url: "https://storage.electa.ph/contestants/maria-1.webp",
          displayOrder: 0,
          aspectRatio: "4:5",
          isCover: true,
        },
      ],
    };

    const result = createContestantSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("fails if contestant number is less than 1", () => {
    const payload = {
      contestantNumber: 0,
      name: "Jane Doe",
      avatarUrl: "https://storage.electa.ph/avatar.webp",
    };
    const result = createContestantSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("fails if name is empty", () => {
    const payload = {
      contestantNumber: 1,
      name: "",
      avatarUrl: "https://storage.electa.ph/avatar.webp",
    };
    const result = createContestantSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("fails if media items exceed 10", () => {
    const media = Array.from({ length: 11 }, (_, i) => ({
      mediaType: "PHOTO" as const,
      url: `https://storage.electa.ph/photo-${i}.webp`,
      displayOrder: i,
      aspectRatio: "4:5",
      isCover: i === 0,
    }));

    const payload = {
      contestantNumber: 1,
      name: "Jane Doe",
      avatarUrl: "https://storage.electa.ph/avatar.webp",
      media,
    };
    const result = createContestantSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("passes with optional empty strings for social handles", () => {
    const payload = {
      contestantNumber: 5,
      name: "Alex Reyes",
      division: "LGBTQ",
      avatarUrl: "https://storage.electa.ph/avatar.webp",
      instagramUrl: "",
      tiktokUrl: "",
      facebookUrl: "",
    };
    const result = createContestantSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });
});

describe("updateContestantSchema", () => {
  it("allows partial updates", () => {
    expect(updateContestantSchema.safeParse({ name: "New Name" }).success).toBe(true);
    expect(updateContestantSchema.safeParse({ heightCm: 178 }).success).toBe(true);
    expect(updateContestantSchema.safeParse({ status: "HIDDEN" }).success).toBe(true);
  });

  it("rejects invalid fields in partial updates", () => {
    expect(updateContestantSchema.safeParse({ heightCm: 260 }).success).toBe(false);
  });
});

describe("updateContestantStatusSchema", () => {
  it("accepts valid status transitions", () => {
    expect(updateContestantStatusSchema.safeParse({ status: "ACTIVE" }).success).toBe(true);
    expect(updateContestantStatusSchema.safeParse({ status: "HIDDEN" }).success).toBe(true);
    expect(updateContestantStatusSchema.safeParse({ status: "WITHDRAWN" }).success).toBe(true);
  });

  it("rejects invalid status", () => {
    expect(updateContestantStatusSchema.safeParse({ status: "DELETED" }).success).toBe(false);
  });
});
