export type EventPublicationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type EventOperationalState = "Draft" | "Scheduled" | "Active" | "Closed";

export interface ContestantDto {
  id: string;
  contestantNumber: number;
  name: string;
  bio: string;
  avatarUrl: string;
  voteCount: number | null;
}

export interface PublicEventDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  bannerUrl: string;
  startsAt: string;
  endsAt: string;
  serverTime: string;
  operationalState: EventOperationalState;
  showResultsOnClose: boolean;
  contestants: ContestantDto[];
}

export interface EventAuditLogDto {
  id: string;
  eventId: string;
  action: string;
  changedBy: string;
  previousVal: Record<string, unknown>;
  newVal: Record<string, unknown>;
  reason: string | null;
  createdAt: string;
}

export interface SaveEventInput {
  title: string;
  slug: string;
  description: string;
  bannerUrl: string;
  startsAt: string;
  endsAt: string;
  publicationStatus?: EventPublicationStatus | undefined;
  draftPassphrase?: string | undefined;
  showResultsOnClose?: boolean | undefined;
  reason?: string | undefined;
}

export interface PreviewAuthInput {
  passphrase: string;
}

export interface PreviewAuthResponse {
  previewToken: string;
  expiresAt: string;
}
