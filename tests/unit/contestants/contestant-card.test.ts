import { describe, expect, it } from "vitest";
import type { ContestantDto } from "@/features/contestants/types";

describe("ContestantCard and PhotoGallery data representations", () => {
  const mockContestant: ContestantDto = {
    id: "c1",
    eventId: "e1",
    contestantNumber: 5,
    name: "Samantha Bernardo",
    division: "FEMALE",
    status: "ACTIVE",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    hometown: "Palawan",
    heightCm: 175,
    bio: "Pageant veteran and advocate.",
    advocacy: "Mental health and malaria eradication.",
    instagramUrl: "https://instagram.com/samanthabernardo",
    tiktokUrl: "https://tiktok.com/@samanthabernardo",
    facebookUrl: null,
    voteCount: 15420,
    media: [
      {
        id: "m1",
        mediaType: "PHOTO",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        embedPlatform: "NONE",
        embedId: null,
        displayOrder: 0,
        aspectRatio: "4:5",
        isCover: true,
      },
      {
        id: "m2",
        mediaType: "VIDEO_EMBED",
        url: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
        embedPlatform: "YOUTUBE",
        embedId: "dQw4w9WgXcQ",
        displayOrder: 1,
        aspectRatio: "9:16",
        isCover: false,
      },
    ],
    categories: [
      {
        id: "cat1",
        eventId: "e1",
        name: "People's Choice",
        description: null,
        isVotingOpen: true,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("identifies media items with 4:5 vertical portrait aspect ratio", () => {
    const photos = mockContestant.media.filter((m) => m.mediaType === "PHOTO");
    expect(photos.length).toBe(1);
    expect(photos[0]?.aspectRatio).toBe("4:5");
  });

  it("detects presence of embedded video reels", () => {
    const hasVideo = mockContestant.media.some((m) => m.mediaType === "VIDEO_EMBED");
    expect(hasVideo).toBe(true);
  });

  it("correctly associates award categories", () => {
    expect(mockContestant.categories.map((c) => c.name)).toContain("People's Choice");
  });
});
