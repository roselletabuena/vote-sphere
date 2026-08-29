import type { NextRequest, NextResponse } from "next/server";

import { saveEventAction } from "@/features/events/actions/save-event";
import { saveEventSchema } from "@/lib/validations/event";
import { apiError, apiSuccess, type ApiResponse } from "@/lib/api/response";
import type { PublicEventDto, SaveEventInput } from "@/features/events/types";
import {
  mockScheduledEvent,
  mockActiveEvent,
  mockClosedEvent,
} from "@/features/events/utils/mock-data";

export async function GET(): Promise<NextResponse<ApiResponse<PublicEventDto[]>>> {
  return apiSuccess([mockScheduledEvent, mockActiveEvent, mockClosedEvent]);
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<PublicEventDto>>> {
  try {
    const body = (await request.json()) as SaveEventInput;
    const validation = saveEventSchema.safeParse(body);

    if (!validation.success) {
      return apiError(validation.error.issues.map((i) => i.message).join(", "), 400);
    }

    const result = await saveEventAction(validation.data);

    if (!result.success || !result.data) {
      return apiError(result.error || "Failed to create event", 400);
    }

    return apiSuccess(result.data, 201);
  } catch (error) {
    console.error("Error creating event:", error);
    return apiError("Internal server error while creating event", 500);
  }
}
