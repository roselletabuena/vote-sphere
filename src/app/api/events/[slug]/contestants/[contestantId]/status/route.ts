import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSession } from "@/lib/auth/get-session";
import { updateContestantStatusSchema } from "@/lib/validations/contestant";

interface RouteParams {
  params: Promise<{
    slug: string;
    contestantId: string;
  }>;
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ORGANIZER" && !session.email.includes("organizer"))) {
      return apiError("Unauthorized: Only event organizers can update contestant status", 403);
    }

    const { contestantId } = await context.params;
    const body = await request.json();
    const parsed = updateContestantStatusSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Invalid status value. Must be ACTIVE, HIDDEN, or WITHDRAWN.", 400);
    }

    const updated = await db.contestant.update({
      where: { id: contestantId },
      data: { status: parsed.data.status },
      select: {
        id: true,
        contestantNumber: true,
        name: true,
        status: true,
      },
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error("Failed to update contestant status:", error);
    return apiError("Internal server error", 500);
  }
}
