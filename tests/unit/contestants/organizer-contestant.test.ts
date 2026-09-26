import { describe, expect, it } from "vitest";
import { updateContestantSchema } from "@/lib/validations/contestant";

describe("Organizer Contestant Operations & Status Transitions", () => {
  it("validates partial updates during contestant curation", () => {
    const patch = {
      hometown: "Laoag City",
      advocacy: "Promoting youth education in rural communities.",
      status: "ACTIVE" as const,
    };
    const parsed = updateContestantSchema.safeParse(patch);
    expect(parsed.success).toBe(true);
  });

  it("allows changing status to WITHDRAWN", () => {
    const patch = {
      status: "WITHDRAWN" as const,
    };
    const parsed = updateContestantSchema.safeParse(patch);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.status).toBe("WITHDRAWN");
    }
  });

  it("allows changing status to HIDDEN", () => {
    const patch = {
      status: "HIDDEN" as const,
    };
    const parsed = updateContestantSchema.safeParse(patch);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.status).toBe("HIDDEN");
    }
  });

  it("validates division reassignment", () => {
    const patch = {
      division: "TEEN" as const,
    };
    const parsed = updateContestantSchema.safeParse(patch);
    expect(parsed.success).toBe(true);
  });
});
