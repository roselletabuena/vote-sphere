import type { EventOperationalState, EventPublicationStatus } from "../types";

export interface EventStateInput {
  publicationStatus: EventPublicationStatus;
  startsAt: string | Date;
  endsAt: string | Date;
}

/**
 * Pure function to derive runtime event operational state.
 * Evaluates strictly against authoritative server timestamp.
 */
export function deriveEventState(
  event: EventStateInput,
  now: Date | string | number = new Date(),
): EventOperationalState {
  if (event.publicationStatus === "DRAFT") {
    return "Draft";
  }

  const currentMs = typeof now === "number" ? now : new Date(now).getTime();
  const startsAtMs = new Date(event.startsAt).getTime();
  const endsAtMs = new Date(event.endsAt).getTime();

  if (currentMs < startsAtMs) {
    return "Scheduled";
  }

  if (currentMs < endsAtMs) {
    return "Active";
  }

  return "Closed";
}
