import { describe, expect, it } from "vitest";
import { parseVideoEmbedUrl } from "@/features/contestants/utils/parse-video-embed";
import {
  normalizeInstagramUrl,
  normalizeTiktokUrl,
  normalizeFacebookUrl,
  normalizeSocialLinks,
} from "@/features/contestants/utils/normalize-social-links";

describe("parseVideoEmbedUrl", () => {
  it("correctly parses YouTube Shorts URLs", () => {
    const parsed = parseVideoEmbedUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ");
    expect(parsed).not.toBeNull();
    expect(parsed?.platform).toBe("YOUTUBE");
    expect(parsed?.embedId).toBe("dQw4w9WgXcQ");
    expect(parsed?.embedUrl).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });

  it("correctly parses standard YouTube watch and youtu.be URLs", () => {
    const watchParsed = parseVideoEmbedUrl("https://youtube.com/watch?v=dQw4w9WgXcQ");
    expect(watchParsed?.platform).toBe("YOUTUBE");
    expect(watchParsed?.embedId).toBe("dQw4w9WgXcQ");

    const shortlinkParsed = parseVideoEmbedUrl("https://youtu.be/dQw4w9WgXcQ");
    expect(shortlinkParsed?.platform).toBe("YOUTUBE");
    expect(shortlinkParsed?.embedId).toBe("dQw4w9WgXcQ");
  });

  it("correctly parses TikTok URLs", () => {
    const parsed = parseVideoEmbedUrl(
      "https://www.tiktok.com/@mariaclara/video/7123456789012345678",
    );
    expect(parsed).not.toBeNull();
    expect(parsed?.platform).toBe("TIKTOK");
    expect(parsed?.embedId).toBe("7123456789012345678");
    expect(parsed?.embedUrl).toContain("tiktok.com/embed/v2/7123456789012345678");
  });

  it("correctly parses Instagram Reel and Post URLs", () => {
    const reelParsed = parseVideoEmbedUrl("https://www.instagram.com/reel/C3b885ea271/");
    expect(reelParsed).not.toBeNull();
    expect(reelParsed?.platform).toBe("INSTAGRAM");
    expect(reelParsed?.embedId).toBe("C3b885ea271");
    expect(reelParsed?.embedUrl).toBe("https://www.instagram.com/p/C3b885ea271/embed");
  });

  it("correctly parses Facebook Video / Reel URLs", () => {
    const fbParsed = parseVideoEmbedUrl("https://www.facebook.com/reel/123456789");
    expect(fbParsed).not.toBeNull();
    expect(fbParsed?.platform).toBe("FACEBOOK");
    expect(fbParsed?.embedId).toBe("123456789");
    expect(fbParsed?.embedUrl).toContain("facebook.com/plugins/video.php");
  });

  it("returns null for invalid or empty URLs", () => {
    expect(parseVideoEmbedUrl("")).toBeNull();
    expect(parseVideoEmbedUrl("https://example.com/not-a-video")).toBeNull();
    expect(parseVideoEmbedUrl(null as unknown as string)).toBeNull();
  });
});

describe("normalizeSocialLinks", () => {
  it("normalizes handles and full URLs for Instagram", () => {
    expect(normalizeInstagramUrl("@maria_clara")).toBe("https://instagram.com/maria_clara");
    expect(normalizeInstagramUrl("maria_clara")).toBe("https://instagram.com/maria_clara");
    expect(normalizeInstagramUrl("https://instagram.com/maria_clara")).toBe(
      "https://instagram.com/maria_clara",
    );
    expect(normalizeInstagramUrl("")).toBeUndefined();
  });

  it("normalizes TikTok handles and URLs", () => {
    expect(normalizeTiktokUrl("maria_official")).toBe("https://tiktok.com/@maria_official");
    expect(normalizeTiktokUrl("@maria_official")).toBe("https://tiktok.com/@maria_official");
    expect(normalizeTiktokUrl("https://tiktok.com/@maria_official")).toBe(
      "https://tiktok.com/@maria_official",
    );
  });

  it("normalizes Facebook handles and URLs", () => {
    expect(normalizeFacebookUrl("mariaclarapage")).toBe("https://facebook.com/mariaclarapage");
    expect(normalizeFacebookUrl("https://facebook.com/mariaclarapage")).toBe(
      "https://facebook.com/mariaclarapage",
    );
  });

  it("normalizes a full set of links simultaneously", () => {
    const normalized = normalizeSocialLinks({
      instagramUrl: "@clara",
      tiktokUrl: "clara_tok",
      facebookUrl: "https://facebook.com/clarafb",
    });
    expect(normalized.instagramUrl).toBe("https://instagram.com/clara");
    expect(normalized.tiktokUrl).toBe("https://tiktok.com/@clara_tok");
    expect(normalized.facebookUrl).toBe("https://facebook.com/clarafb");
  });
});
