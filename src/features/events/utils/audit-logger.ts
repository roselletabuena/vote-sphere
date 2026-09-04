import type { EventAuditLogDto } from "../types";

export interface CreateAuditLogParams {
  eventId: string;
  action: string;
  changedBy: string;
  previousVal: Record<string, unknown>;
  newVal: Record<string, unknown>;
  reason?: string | undefined;
}

export function createAuditLogEntry(params: CreateAuditLogParams): EventAuditLogDto {
  const uniqueId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;

  return {
    id: `log_${uniqueId}`,
    eventId: params.eventId,
    action: params.action,
    changedBy: params.changedBy,
    previousVal: params.previousVal,
    newVal: params.newVal,
    reason: params.reason ?? null,
    createdAt: new Date().toISOString(),
  };
}
