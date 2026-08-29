"use server";

import { revalidatePath } from "next/cache";

import { saveEventSchema } from "@/lib/validations/event";
import { createAuditLogEntry } from "../utils/audit-logger";
import { deriveEventState } from "../utils/derive-event-state";
import type { EventAuditLogDto, PublicEventDto, SaveEventInput } from "../types";

export interface SaveEventResult {
  success: boolean;
  data?: PublicEventDto | undefined;
  auditLog?: EventAuditLogDto | undefined;
  error?: string | undefined;
}

/**
 * Server Action for saving event profile and applying forward-only window adjustments.
 */
export async function saveEventAction(
  input: SaveEventInput,
  currentEvent?: PublicEventDto,
  userId = "organizer_default",
): Promise<SaveEventResult> {
  const parsed = saveEventSchema.safeParse(input);

  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
    return { success: false, error: errorMsg };
  }

  const {
    title,
    slug,
    description,
    bannerUrl,
    startsAt,
    endsAt,
    publicationStatus,
    showResultsOnClose,
    reason,
  } = parsed.data;
  const now = new Date();

  // If modifying an existing published event, enforce forward-only rules
  if (currentEvent && currentEvent.operationalState !== "Draft") {
    const newStartsAt = new Date(startsAt);
    const newEndsAt = new Date(endsAt);

    // If currently Scheduled, startsAt must be in the future
    if (currentEvent.operationalState === "Scheduled" && newStartsAt < now) {
      return {
        success: false,
        error: "Cannot set event startsAt timestamp into the past for scheduled events",
      };
    }

    // If currently Active, endsAt must be in the future
    if (currentEvent.operationalState === "Active" && newEndsAt < now) {
      return {
        success: false,
        error: "Cannot set event deadline (endsAt) earlier than current time",
      };
    }
  }

  const derivedState = deriveEventState(
    {
      publicationStatus,
      startsAt,
      endsAt,
    },
    now,
  );

  const updatedEvent: PublicEventDto = {
    id: currentEvent?.id || `evt_${Date.now()}`,
    slug,
    title,
    description,
    bannerUrl,
    startsAt,
    endsAt,
    serverTime: now.toISOString(),
    operationalState: derivedState,
    showResultsOnClose,
    contestants: currentEvent?.contestants || [],
  };

  let auditLog: EventAuditLogDto | undefined;

  if (currentEvent) {
    auditLog = createAuditLogEntry({
      eventId: updatedEvent.id,
      action: "EVENT_PROFILE_UPDATED",
      changedBy: userId,
      previousVal: {
        startsAt: currentEvent.startsAt,
        endsAt: currentEvent.endsAt,
        operationalState: currentEvent.operationalState,
      },
      newVal: {
        startsAt: updatedEvent.startsAt,
        endsAt: updatedEvent.endsAt,
        operationalState: updatedEvent.operationalState,
      },
      reason,
    });
  }

  try {
    revalidatePath(`/events/${slug}`);
  } catch {
    // Ignored in unit testing environments outside Next.js server context
  }

  return {
    success: true,
    data: updatedEvent,
    auditLog,
  };
}
