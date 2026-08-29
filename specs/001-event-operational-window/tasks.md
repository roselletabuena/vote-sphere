# Tasks: Event Profile & Operational Window

**Branch**: `001-event-operational-window` | **Date**: 2026-08-30 | **Spec**: [spec.md](file:///c:/Users/Roselle%20Tabuena/workspace/vote-sphere/specs/001-event-operational-window/spec.md) | **Plan**: [plan.md](file:///c:/Users/Roselle%20Tabuena/workspace/vote-sphere/specs/001-event-operational-window/plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, feature directory scaffolding, and shared types

- [x] T001 Scaffold feature directory structure in `src/features/events/` (`components/`, `hooks/`, `types/`, `utils/`)
- [x] T002 [P] Define core event TypeScript interfaces, enums, and DTOs in `src/features/events/types/index.ts`
- [x] T003 [P] Define Zod validation schemas for event metadata, slug sanitization, and date bounds in `src/lib/validations/event.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data layer, domain state derivation, and authoritative time utilities

⚠️ **CRITICAL**: No user story work can begin until this foundational phase is complete.

- [x] T004 Define `Event`, `Contestant`, and `EventAuditLog` Prisma models in `prisma/schema.prisma`
- [x] T005 [P] Implement pure operational state derivation function in `src/features/events/utils/derive-event-state.ts`
- [x] T006 [P] Create unit test suite for state transitions and boundaries in `tests/unit/events/derive-event-state.test.ts`
- [x] T007 [P] Create unit test suite for Zod event validation rules in `tests/unit/events/event-validation.test.ts`
- [x] T008 [P] Implement real-time countdown hook with server clock synchronization delta in `src/features/events/hooks/use-countdown.ts`
- [x] T009 Create mock event and contestant test seed fixtures in `src/features/events/utils/mock-data.ts`

**Checkpoint**: Core domain logic, validation schemas, and state calculation verified with passing unit tests.

---

## Phase 3: User Story 1 - Public Event Discovery & Live State-Driven Experience (Priority: P1) 🎯 MVP

**Goal**: Deliver the public-facing event contest page with real-time countdown, automatic zero-refresh state transitions (Scheduled → Active → Closed), and state-aware voting/payment controls.

**Independent Test**: Navigate to `/events/[slug]` across Scheduled, Active, and Closed time windows to verify metadata rendering, live timer countdown, automatic state flips, and button disablement.

### Tests for User Story 1

- [x] T010 [P] [US1] Unit test countdown timer hook tick and zero-transition callback in `tests/unit/events/use-countdown.test.ts`

### Implementation for User Story 1

- [x] T011 [P] [US1] Build `EventStateBadge` component for Scheduled, Active, Closed states in `src/features/events/components/EventStateBadge.tsx`
- [x] T012 [P] [US1] Build `EventBanner` component with title, slug, description, and responsive banner in `src/features/events/components/EventBanner.tsx`
- [x] T013 [P] [US1] Build `EventCountdown` component with accessible digit displays and live ticking in `src/features/events/components/EventCountdown.tsx`
- [x] T014 [P] [US1] Build `ContestantCard` and `ContestantGrid` with state-aware voting action buttons in `src/features/events/components/ContestantGrid.tsx`
- [x] T015 [US1] Implement `useEvent` TanStack Query hook with automated refetch on state boundary in `src/features/events/hooks/use-event.ts`
- [x] T016 [US1] Implement public Event REST Route Handler in `src/app/api/events/[slug]/route.ts`
- [x] T017 [US1] Build React Server Component (RSC) event page with Suspense loading skeleton in `src/app/(public)/events/[slug]/page.tsx` and `src/app/(public)/events/[slug]/loading.tsx`

**Checkpoint**: User Story 1 (MVP) is fully functional and testable independently.

---

## Phase 4: User Story 2 - Event Lifecycle Configuration & Operational Window Management (Priority: P2)

**Goal**: Allow organizers to configure and adjust event metadata, operational windows (`startsAt`, `endsAt`), and results visibility, with forward-only schedule adjustments and immutable audit logging.

**Independent Test**: Create and update an event through organizer endpoints, verify slug validation, date validation (`startsAt < endsAt`), and verify forward-only schedule updates write to `EventAuditLog`.

### Implementation for User Story 2

- [x] T018 [P] [US2] Implement audit log helper for recording operational window edits in `src/features/events/utils/audit-logger.ts`
- [x] T019 [US2] Implement organizer event creation and update Route Handlers in `src/app/api/events/route.ts` and `src/app/api/events/[slug]/route.ts`
- [x] T020 [US2] Implement Server Action for event profile saving and forward-only window adjustments in `src/features/events/actions/save-event.ts`
- [x] T021 [US2] Add unit tests for forward-only timeline adjustment validation and audit logging in `tests/unit/events/timeline-adjustment.test.ts`

**Checkpoint**: User Stories 1 and 2 are fully integrated and functional.

---

## Phase 5: User Story 3 - Draft State Protection & Organizer/Guest Preview (Priority: P3)

**Goal**: Restrict public access to `Draft` events by default (404), while granting preview access to authenticated organizers and guest reviewers holding a valid draft preview passphrase.

**Independent Test**: Visit a `Draft` event anonymously to verify 404/passphrase prompt, enter the valid passphrase to unlock preview session, and verify authenticated organizer access renders the draft watermark.

### Implementation for User Story 3

- [x] T022 [P] [US3] Implement draft preview passphrase verification Route Handler in `src/app/api/events/[slug]/preview-auth/route.ts`
- [x] T023 [P] [US3] Build `DraftPreviewBanner` component with watermark and status indicator in `src/features/events/components/DraftPreviewBanner.tsx`
- [x] T024 [P] [US3] Build `DraftPassphraseModal` component for guest reviewer unlock in `src/features/events/components/DraftPassphraseModal.tsx`
- [x] T025 [US3] Integrate draft authorization checks and preview token verification into `src/app/(public)/events/[slug]/page.tsx`
- [x] T026 [US3] Add unit tests for draft authentication and passphrase token signing in `tests/unit/events/draft-auth.test.ts`

**Checkpoint**: All user stories (P1, P2, P3) are fully operational and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Visual excellence, a11y audit, error boundary fallback, and end-to-end verification.

- [x] T027 [P] Create event page error boundary and not-found state in `src/app/(public)/events/[slug]/error.tsx` and `src/app/(public)/events/[slug]/not-found.tsx`
- [x] T028 [P] Verify WCAG accessibility and keyboard navigation on timer and contestant cards
- [x] T029 Execute end-to-end verification scenarios per `quickstart.md`
- [x] T030 Run full test suite (`npm run test`), lint (`npm run lint`), and typecheck (`npm run typecheck`)

---

## Dependencies & Execution Order

```mermaid
graph TD
  P1[Phase 1: Setup] --> P2[Phase 2: Foundational]
  P2 --> P3[Phase 3: US1 - Public Experience & Live State (MVP)]
  P2 --> P4[Phase 4: US2 - Organizer Lifecycle & Audit]
  P2 --> P5[Phase 5: US3 - Draft Protection & Passphrase]
  P3 --> P6[Phase 6: Polish & Quality Gates]
  P4 --> P6
  P5 --> P6
```

### Parallel Opportunities

- **Phase 1**: `T002` (Types) and `T003` (Validations) can run in parallel.
- **Phase 2**: `T005` (State logic), `T006` (State tests), `T007` (Validation tests), and `T008` (Countdown hook) can run in parallel.
- **Phase 3 (US1)**: `T011`, `T012`, `T013`, and `T014` (UI Components) can be built in parallel.
- **Phase 4 (US2)** & **Phase 5 (US3)**: Can proceed in parallel once Phase 2 and Phase 3 MVP foundations are in place.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete **Phase 1: Setup** (`T001` - `T003`)
2. Complete **Phase 2: Foundational** (`T004` - `T009`)
3. Complete **Phase 3: User Story 1** (`T010` - `T017`)
4. **Validate MVP**: Test public event page rendering across Scheduled, Active, and Closed mock states.
