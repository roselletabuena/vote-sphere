# Data Model: Event Profile & Operational Window

**Feature**: `001-event-operational-window`  
**Date**: 2026-08-30

## Entities & Schemas

### 1. Event Model (`prisma/schema.prisma`)

```prisma
enum EventPublicationStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model Event {
  id                  String                 @id @default(uuid())
  slug                String                 @unique
  title               String
  description         String                 @db.Text
  bannerUrl           String
  startsAt            DateTime
  endsAt              DateTime
  publicationStatus   EventPublicationStatus @default(DRAFT)
  draftPassphraseHash String?
  showResultsOnClose  Boolean                @default(true)
  organizerId         String
  createdAt           DateTime               @default(now())
  updatedAt           DateTime               @updatedAt

  contestants         Contestant[]
  auditLogs           EventAuditLog[]

  @@index([slug])
  @@index([organizerId])
  @@index([publicationStatus, startsAt, endsAt])
}
```

### 2. Contestant Model

```prisma
model Contestant {
  id               String   @id @default(uuid())
  eventId          String
  contestantNumber Int
  name             String
  bio              String   @db.Text
  avatarUrl        String
  voteCount        Int      @default(0)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  event            Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@unique([eventId, contestantNumber])
  @@index([eventId])
}
```

### 3. EventAuditLog Model

```prisma
model EventAuditLog {
  id          String   @id @default(uuid())
  eventId     String
  action      String   // e.g., "WINDOW_EXTENDED", "SCHEDULE_UPDATED", "STATUS_CHANGED"
  changedBy   String   // Cognito User ID / Admin ID
  previousVal Json
  newVal      Json
  reason      String?
  createdAt   DateTime @default(now())

  event       Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@index([eventId])
}
```

## Derived Operational State Logic

The runtime state of an event is computed as:

```ts
export type EventOperationalState = "Draft" | "Scheduled" | "Active" | "Closed";

export function deriveEventState(
  event: {
    publicationStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    startsAt: Date;
    endsAt: Date;
  },
  now: Date = new Date(),
): EventOperationalState {
  if (event.publicationStatus === "DRAFT") {
    return "Draft";
  }
  if (now < event.startsAt) {
    return "Scheduled";
  }
  if (now < event.endsAt) {
    return "Active";
  }
  return "Closed";
}
```

## Validation Rules (Zod)

- `slug`: `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase alphanumeric with single hyphens, 3 to 60 characters).
- `title`: String, min 3, max 120 characters.
- `description`: String, min 10, max 5000 characters.
- `bannerUrl`: Valid URL format.
- `startsAt`: Valid ISO-8601 DateTime string. Must precede `endsAt`.
- `endsAt`: Valid ISO-8601 DateTime string. Must be after `startsAt`.
- `draftPassphrase`: Optional string, min 4, max 64 characters.
- `showResultsOnClose`: Boolean (defaults to true).
