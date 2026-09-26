import type { EmbedPlatform } from "../types";

export interface ParsedVideoEmbed {
  platform: EmbedPlatform;
  embedId: string;
  embedUrl: string;
}

export function parseVideoEmbedUrl(rawUrl: string): ParsedVideoEmbed | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();

  // 1. YouTube (Shorts, Watch, Shortlink)
  const ytShortsMatch = trimmed.match(
    /(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/i,
  );
  if (ytShortsMatch && ytShortsMatch[1]) {
    const id = ytShortsMatch[1];
    return {
      platform: "YOUTUBE",
      embedId: id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0&modestbranding=1`,
    };
  }

  // 2. TikTok
  const tiktokMatch =
    trimmed.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/i) ||
    trimmed.match(/vm\.tiktok\.com\/([a-zA-Z0-9]+)/i);
  if (tiktokMatch && tiktokMatch[1]) {
    const id = tiktokMatch[1];
    return {
      platform: "TIKTOK",
      embedId: id,
      embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
    };
  }

  // 3. Instagram Reels / Posts
  const igMatch = trimmed.match(/instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)/i);
  if (igMatch && igMatch[1]) {
    const id = igMatch[1];
    return {
      platform: "INSTAGRAM",
      embedId: id,
      embedUrl: `https://www.instagram.com/p/${id}/embed`,
    };
  }

  // 4. Facebook Videos / Reels
  const fbReelMatch = trimmed.match(/facebook\.com\/reel\/(\d+)/i);
  const fbWatchMatch = trimmed.match(/facebook\.com\/watch\/\?v=(\d+)/i);
  const fbVideoMatch = trimmed.match(/facebook\.com\/[^/]+\/videos\/(\d+)/i);
  const fbId = fbReelMatch?.[1] || fbWatchMatch?.[1] || fbVideoMatch?.[1];
  if (fbId) {
    return {
      platform: "FACEBOOK",
      embedId: fbId,
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=0`,
    };
  }

  return null;
}
