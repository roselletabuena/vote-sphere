# Research & Architecture Decisions: Event Profile & Operational Window

**Feature**: `001-event-operational-window`  
**Date**: 2026-08-30

## Technical Decisions & Rationale

### 1. Database & Persistence Strategy

- **Decision**: Define the database schema immediately in `prisma/schema.prisma` (`Event`, `Contestant`, and `EventAuditLog` models), but decouple initial frontend and domain logic development using typed domain interfaces and mock fixture seeders.
- **Rationale**:
  - Having the Prisma schema defined early provides a single source of truth for TypeScript types across server components, route handlers, and validation schemas.
  - Development and unit tests can run immediately in-memory/with fixtures without blocking on remote Supabase connectivity, while ensuring the database structure is production-ready.
- **Alternatives Considered**:
  - _Pure client-side mock store (localStorage)_: Rejected because the feature requires strict server-authoritative time enforcement and protected route evaluation.
  - _In-memory mock API without Prisma_: Rejected because it creates type drift and requires duplicate refactoring once connecting to PostgreSQL.

### 2. Operational State Derivation & Server Time Synchronization

- **Decision**: Operational states (`Draft`, `Scheduled`, `Active`, `Closed`) will be computed dynamically based on the authoritative server timestamp (`now()`) and the event record fields (`status`, `startsAt`, `endsAt`).
- **Rationale**:
  - Eliminates the need for brittle cron jobs to update database status flags every second.
  - When a user views an event or submits an action, the server verifies `startsAt <= now < endsAt`.
  - Client countdown timers synchronize against server time upon hydration via an initial server-sent timestamp delta to prevent client clock skew.
- **Alternatives Considered**:
  - _Scheduled background worker mutating status column_: Rejected due to potential race conditions, cron latency jitter, and database write amplification.

### 3. Real-Time Countdown & Automatic State Transition

- **Decision**: Client-side countdown hook (`use-countdown.ts`) calculating remaining time against the server-synchronized deadline, triggering an optimistic state flip and background TanStack Query cache revalidation when the timer hits zero.
- **Rationale**:
  - Provides a seamless zero-refresh UI transition from `Scheduled` to `Active` and `Active` to `Closed`.
  - Immediately refetches fresh server state to lock or unlock interactive controls.
- **Alternatives Considered**:
  - _WebSocket / Server-Sent Events for status_: Overkill for deterministic timestamp transitions; time calculations on the client synchronized with server time achieve sub-second accuracy with zero socket overhead.

### 4. Draft State Security & Preview Gate

- **Decision**:
  - In Server Components (`src/app/events/[slug]/page.tsx`), if `derivedState === 'Draft'`:
    1. Check organizer Cognito session via `getSession()`. If user is the event owner/admin, allow preview with `DraftPreviewBanner`.
    2. If not authenticated as organizer, check signed HTTP-only preview cookie / query token for passphrase unlock.
    3. Otherwise, return `notFound()` (404) or render the passphrase unlock modal.
- **Rationale**:
  - Strict defense-in-depth: Prevents public indexing or leaking unpublished contestant profiles.
  - Enables external stakeholders (judges/sponsors) to audit drafts seamlessly.
- **Alternatives Considered**:
  - _Basic Auth header_: Poor UX on mobile devices; incompatible with custom branded design.

### 5. Results & Tally Visibility Control

- **Decision**: Add `showResultsOnClose` (boolean, default `true`) on the `Event` model. When `Closed`, the API and RSC sanitize vote totals unless `showResultsOnClose === true` or requester is the authorized organizer.
- **Rationale**:
  - Allows pageants and competitions to hide live vote numbers until stage coronation announcements.
