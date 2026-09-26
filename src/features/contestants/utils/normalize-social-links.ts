export interface NormalizedSocialLinks {
  instagramUrl?: string | undefined;
  tiktokUrl?: string | undefined;
  facebookUrl?: string | undefined;
}

export function normalizeInstagramUrl(input?: string | null): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const cleanHandle = trimmed.replace(/^@/, "").replace(/\/$/, "");
  return `https://instagram.com/${cleanHandle}`;
}

export function normalizeTiktokUrl(input?: string | null): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const cleanHandle = trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
  return `https://tiktok.com/${cleanHandle.replace(/\/$/, "")}`;
}

export function normalizeFacebookUrl(input?: string | null): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const cleanHandle = trimmed.replace(/^@/, "").replace(/\/$/, "");
  return `https://facebook.com/${cleanHandle}`;
}

export function normalizeSocialLinks(links: {
  instagramUrl?: string | null | undefined;
  tiktokUrl?: string | null | undefined;
  facebookUrl?: string | null | undefined;
}): NormalizedSocialLinks {
  return {
    instagramUrl: normalizeInstagramUrl(links.instagramUrl),
    tiktokUrl: normalizeTiktokUrl(links.tiktokUrl),
    facebookUrl: normalizeFacebookUrl(links.facebookUrl),
  };
}
