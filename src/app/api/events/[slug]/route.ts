import type { NextRequest, NextResponse } from "next/server";

import { getMockEventBySlug } from "@/features/events/utils/mock-data";
import { apiError, apiSuccess, type ApiResponse } from "@/lib/api/response";
import type { PublicEventDto } from "@/features/events/types";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteParams,
): Promise<NextResponse<ApiResponse<PublicEventDto>>> {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return apiError("Event slug parameter is required", 400);
    }

    const event = getMockEventBySlug(slug);

    if (!event) {
      return apiError("Event not found", 404);
    }

    // Mask vote counts if Scheduled or Active or if showResultsOnClose is false
    const sanitizedContestants = event.contestants.map((candidate) => ({
      ...candidate,
      voteCount:
        event.operationalState === "Closed" && event.showResultsOnClose
          ? candidate.voteCount
          : null,
    }));

    return apiSuccess({
      ...event,
      contestants: sanitizedContestants,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to retrieve event by slug:", error);
    return apiError("Internal server error while fetching event", 500);
  }
}
