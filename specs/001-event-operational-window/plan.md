# Implementation Plan: Event Profile & Operational Window

**Branch**: `001-event-operational-window` | **Date**: 2026-08-30 | **Spec**: [spec.md](file:///c:/Users/Roselle%20Tabuena/workspace/vote-sphere/specs/001-event-operational-window/spec.md)

**Input**: Feature specification from `/specs/001-event-operational-window/spec.md`

## Summary

Implement Event Profile and Operational Window management in VoteSphere. This establishes the public-facing contest page (`/events/[slug]`), real-time synchronized countdown timers, automatic zero-refresh lifecycle transitions across 4 operational states (`Draft`, `Scheduled`, `Active`, `Closed`), draft preview authorization (organizer login + optional passphrase), and immutable administrative timeline adjustment audit logging.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode, no `any`, no non-null assertions)  
**Primary Dependencies**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Radix UI / Lucide React, TanStack Query v5, Zod, React Hook Form  
**Storage**: PostgreSQL via Supabase with Prisma ORM (`prisma/schema.prisma`, `src/lib/db.ts`)  
**Testing**: Vitest (`tests/unit/`)  
**Target Platform**: Node.js 20+ Server (Next.js App Router / Edge runtime compatible)  
**Project Type**: Next.js 16 Web Application  
**Performance Goals**: Event public page initial render < 1.5s; state transitions synchronized within 1.0s of threshold; zero vote acceptance past `endsAt` cutoff  
**Constraints**: Server-authoritative time evaluation; strict defense-in-depth security on draft routes and closed vote submissions; accessible WCAG-compliant countdown timers  
**Scale/Scope**: Support high-concurrency public pageant visitors, up to 100 contestants per event, and sub-second operational state transitions

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                                                 | Compliance Check                                                                                                                                                                                                                 | Status |
| :-------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----- |
| **I. Strict Type Safety & Zod Boundary Validation**       | All API inputs/outputs, form fields, and route params validated via Zod schemas in `src/lib/validations/event.ts` and `src/features/events/types/`. No `any` or `!`.                                                             | Passed |
| **II. Server-First & Boundary Isolation (Next.js 16)**    | `/events/[slug]/page.tsx` is an RSC fetching authoritative event data. Client interactivity (live countdown, optimistic state flip) isolated into `"use client"` components wrapped in `<Suspense>`. Dynamic params are awaited. | Passed |
| **III. Strict State Separation & Single Source of Truth** | Prisma schema in `prisma/schema.prisma` is the source of truth for `Event`, `Contestant`, `EventAuditLog`. Server state managed by TanStack Query.                                                                               | Passed |
| **IV. Secure-by-Design & Auth Integrity**                 | Organizer mutations and draft access verified with Cognito JWT via `getSession()`. Defense-in-depth middleware + handler session verification.                                                                                   | Passed |
| **V. Feature Colocation & Modular Architecture**          | Vertical slice in `src/features/events/` (`components/`, `hooks/`, `types/`). Shared UI primitives in `src/components/ui/`. Named exports used throughout.                                                                       | Passed |
| **VI. Test-First Quality Gates**                          | Unit tests in `tests/unit/events/` covering `deriveEventState`, Zod schemas, countdown logic, and cutoff boundary checks.                                                                                                        | Passed |

## Project Structure

### Documentation (this feature)

```text
specs/001-event-operational-window/
├── plan.md              # This file
├── research.md          # Architecture decisions & persistence strategy
├── data-model.md        # Prisma entities, state machine, and validation rules
├── quickstart.md        # Validation scenarios & test commands
├── contracts/
│   └── event-api.md     # Public & organizer REST endpoint specifications
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── tasks.md             # Implementation tasks (/speckit-tasks output)
```

### Source Code (repository root)

```text
prisma/
└── schema.prisma                                 # Event, Contestant, EventAuditLog models

src/
├── app/
│   ├── (public)/events/[slug]/
│   │   ├── page.tsx                             # RSC public event page
│   │   └── loading.tsx                          # Skeleton fallback
│   └── api/events/
│       ├── route.ts                             # GET (list) / POST (create)
│       └── [slug]/
│           ├── route.ts                         # GET / PATCH / DELETE
│           └── preview-auth/route.ts            # Draft passphrase verification
│
├── features/events/
│   ├── components/
│   │   ├── EventBanner.tsx                      # Banner image & header
│   │   ├── EventCountdown.tsx                   # Live synchronized timer
│   │   ├── EventStateBadge.tsx                  # Scheduled/Active/Closed badge
│   │   ├── ContestantGrid.tsx                   # Contestant list & bios
│   │   ├── DraftPreviewBanner.tsx               # Watermark/badge for draft mode
│   │   └── DraftPassphraseModal.tsx             # Unlock modal for guest reviewers
│   ├── hooks/
│   │   ├── use-event.ts                         # TanStack query hook
│   │   └── use-countdown.ts                     # Real-time ticking hook
│   ├── types/
│   │   └── index.ts                             # TypeScript types & DTOs
│   └── utils/
│       └── derive-event-state.ts                # Pure state calculation logic
│
├── lib/
│   └── validations/
│       └── event.ts                             # Zod schemas for create/update/slug
│
└── tests/
    └── unit/
        └── events/
            ├── derive-event-state.test.ts       # State transition unit tests
            └── event-validation.test.ts         # Zod schema unit tests
```

**Structure Decision**: Clean vertical slice in `src/features/events/` with Next.js 16 App Router pages in `src/app/(public)/events/[slug]/` and API route handlers in `src/app/api/events/`.

## Complexity Tracking

> No constitutional violations or unwarranted complexity introduced.
