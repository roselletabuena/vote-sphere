export interface PreviewTokenPayload {
  slug: string;
  exp: number; // Unix timestamp in ms
}

const PREVIEW_SECRET = "vs_preview_secret_key_2026";

/**
 * Creates a signed preview token for draft event guest review.
 */
export function signPreviewToken(
  slug: string,
  ttlMs = 1000 * 60 * 60 * 24,
): { token: string; expiresAt: string } {
  const expiresAtMs = Date.now() + ttlMs;
  const payload: PreviewTokenPayload = {
    slug,
    exp: expiresAtMs,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = Buffer.from(`${payloadBase64}.${PREVIEW_SECRET}`).toString("base64url");
  const token = `${payloadBase64}.${signature}`;

  return {
    token,
    expiresAt: new Date(expiresAtMs).toISOString(),
  };
}

/**
 * Verifies if a given preview token is valid, matches the event slug, and has not expired.
 */
export function verifyPreviewToken(token: string | null | undefined, slug: string): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const payloadBase64 = parts[0];
  const providedSig = parts[1];

  if (!payloadBase64 || !providedSig) {
    return false;
  }

  const expectedSig = Buffer.from(`${payloadBase64}.${PREVIEW_SECRET}`).toString("base64url");

  if (providedSig !== expectedSig) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadBase64, "base64url").toString("utf8"),
    ) as PreviewTokenPayload;
    if (payload.slug !== slug) {
      return false;
    }
    if (Date.now() > payload.exp) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
