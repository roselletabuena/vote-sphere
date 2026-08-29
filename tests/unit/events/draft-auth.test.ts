import { describe, expect, it } from "vitest";

import { signPreviewToken, verifyPreviewToken } from "@/features/events/utils/preview-token";

describe("Draft Preview Token Authentication", () => {
  const testSlug = "preview-draft-contest";

  it("successfully signs and verifies a valid preview token", () => {
    const { token, expiresAt } = signPreviewToken(testSlug);

    expect(token).toBeDefined();
    expect(new Date(expiresAt).getTime()).toBeGreaterThan(Date.now());

    const isValid = verifyPreviewToken(token, testSlug);
    expect(isValid).toBe(true);
  });

  it("rejects preview token if slug does not match", () => {
    const { token } = signPreviewToken(testSlug);

    const isValid = verifyPreviewToken(token, "different-event-slug");
    expect(isValid).toBe(false);
  });

  it("rejects preview token if signature is tampered", () => {
    const { token } = signPreviewToken(testSlug);
    const [payload] = token.split(".");
    const tamperedToken = `${payload}.invalidSignatureValue123`;

    const isValid = verifyPreviewToken(tamperedToken, testSlug);
    expect(isValid).toBe(false);
  });

  it("rejects expired preview token", () => {
    // Generate token with negative TTL (already expired)
    const { token } = signPreviewToken(testSlug, -1000);

    const isValid = verifyPreviewToken(token, testSlug);
    expect(isValid).toBe(false);
  });

  it("handles null, undefined, and malformed tokens safely", () => {
    expect(verifyPreviewToken(null, testSlug)).toBe(false);
    expect(verifyPreviewToken(undefined, testSlug)).toBe(false);
    expect(verifyPreviewToken("", testSlug)).toBe(false);
    expect(verifyPreviewToken("not-a-valid-token", testSlug)).toBe(false);
  });
});
