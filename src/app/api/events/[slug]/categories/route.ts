import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/get-session";
import { z } from "zod";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().max(500).optional(),
  isVotingOpen: z.boolean().default(true),
});

export async function GET(_request: NextRequest, context: RouteParams) {
  try {
    const { slug } = await context.params;
    const event = await db.event.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!event) {
      return apiError("Event not found", 404);
    }

    const categories = await db.awardCategory.findMany({
      where: { eventId: event.id },
      orderBy: { name: "asc" },
    });

    return apiSuccess(categories);
  } catch (error) {
    console.error("Failed to list categories:", error);
    return apiError("Internal server error", 500);
  }
}

export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ORGANIZER" && !session.email.includes("organizer"))) {
      return apiError("Unauthorized", 403);
    }

    const { slug } = await context.params;
    const event = await db.event.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!event) {
      return apiError("Event not found", 404);
    }

    const body = await request.json();
    const parsed = createCategorySchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message || "Invalid category input", 400);
    }

    const category = await db.awardCategory.create({
      data: {
        eventId: event.id,
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        isVotingOpen: parsed.data.isVotingOpen,
      },
    });

    return apiSuccess(category, 201);
  } catch (error) {
    console.error("Failed to create award category:", error);
    return apiError("Internal server error", 500);
  }
}
