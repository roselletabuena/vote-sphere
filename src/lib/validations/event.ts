import { z } from "zod";

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const eventSlugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .max(60, "Slug must not exceed 60 characters")
  .regex(slugRegex, "Slug must contain only lowercase letters, numbers, and single hyphens");

export const saveEventSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(120, "Title must not exceed 120 characters"),
    slug: eventSlugSchema,
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(5000, "Description must not exceed 5000 characters"),
    bannerUrl: z.string().url("Banner URL must be a valid URL"),
    startsAt: z.string().datetime({ message: "startsAt must be a valid ISO-8601 datetime string" }),
    endsAt: z.string().datetime({ message: "endsAt must be a valid ISO-8601 datetime string" }),
    publicationStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
    draftPassphrase: z
      .string()
      .min(4, "Passphrase must be at least 4 characters")
      .max(64, "Passphrase must not exceed 64 characters")
      .optional(),
    showResultsOnClose: z.boolean().default(true),
    reason: z.string().max(255).optional(),
  })
  .refine(
    (data) => {
      const starts = new Date(data.startsAt).getTime();
      const ends = new Date(data.endsAt).getTime();
      return starts < ends;
    },
    {
      message: "startsAt must strictly precede endsAt",
      path: ["endsAt"],
    },
  );

export const previewAuthSchema = z.object({
  passphrase: z.string().min(1, "Passphrase is required"),
});

export type SaveEventSchemaType = z.infer<typeof saveEventSchema>;
export type PreviewAuthSchemaType = z.infer<typeof previewAuthSchema>;
