# Implementation Plan: Contestant Profiles & Multi-Media Showcase

**Branch**: `002-contestant-profiles` | **Date**: 2026-09-26 | **Spec**: [spec.md](file:///c:/Users/Roselle%20Tabuena/workspace/vote-sphere-workspace/vote-sphere/specs/002-contestant-profiles/spec.md) | **Ticket**: `VS-19` (Epic `VS-20` / `VS-21`)

**Input**: Feature specification from `/specs/002-contestant-profiles/spec.md`

---

## Summary

Implement rich, luxury candidate profiles for Electa (`electa.ph`). This establishes the 4:5 vertical portrait roster cards, 10-photo gallery carousels with client-side aspect ratio cropping, multi-platform embedded video reels (YouTube Shorts/Videos, TikTok, Instagram Reels, Facebook Videos/Reels), bio and advocacy dossiers, verified social links, multi-division (Male, Female, LGBTQ+, Teen) and award category (e.g. _People's Choice_, _Best in Swimsuit_) filtering, and organizer roster curation with soft status lifecycle management (`ACTIVE`, `HIDDEN`, `WITHDRAWN`).

---

## Technical Context

**Language/Version**: TypeScript 5 (strict mode, no `any`, no non-null assertions)  
**Primary Dependencies**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Radix UI / Lucide React, TanStack Query v5, Zod, React Hook Form, `nuqs` (URL state sync)  
**Storage**: PostgreSQL via Supabase with Prisma ORM (`prisma/schema.prisma`, `src/lib/db.ts`), Supabase Storage bucket (`contestant-media`)  
**Testing**: Vitest (`tests/unit/contestants/`)  
**Target Platform**: Node.js 20+ Server (Next.js App Router / Edge runtime compatible)  
**Project Type**: Next.js 16 Web Application  
**Performance Goals**: Roster initial render < 1.0s; category filter switching < 100ms; gallery image delivery via WebP/CDN; embedded video player load < 1.5s  
**Constraints**: 4:5 Portrait Standard crop; client-side image compression prior to upload; strict schema boundary validation; organizer authentication via `getSession()`  
**Scale/Scope**: Up to 100 contestants per event, up to 10 photos per contestant, high-concurrency public traffic during coronation broadcasts

---

## Constitution Check

_GATE: Evaluated and Passed._

| Principle                                                 | Compliance Check                                                                                                                                                                                               |   Status   |
| :-------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------: |
| **I. Strict Type Safety & Boundary Validation**           | All API inputs, form schemas, and route parameters validated via Zod in `src/lib/validations/contestant.ts` and `src/features/contestants/types/`. Zero `any` or `!`.                                          | **Passed** |
| **II. Server-First & Boundary Isolation (Next.js 16)**    | Public contestant rosters fetch via RSC on the server. Interactive components (photo lightbox, video player, client cropper, category tabs) marked `"use client"` and wrapped in `<Suspense>`.                 | **Passed** |
| **III. Strict State Separation & Single Source of Truth** | Prisma schema is the single source of truth for `Contestant`, `ContestantMedia`, `AwardCategory`, `ContestantCategoryAssignment`. Server state managed by TanStack Query; URL filters synchronized via `nuqs`. | **Passed** |
| **IV. Secure-by-Design & Auth Integrity**                 | Organizer mutations and media uploads verified with AWS Cognito JWT via `getSession()`. Defense-in-depth handler checks and role verification.                                                                 | **Passed** |
| **V. Feature Colocation & Modular Architecture**          | Feature vertical slice in `src/features/contestants/` (`components/`, `hooks/`, `types/`, `utils/`). Shared UI in `src/components/ui/`. Named exports throughout.                                              | **Passed** |
| **VI. Test-First Quality Gates**                          | Unit tests in `tests/unit/contestants/` covering Zod validation, video embed parser, category filtering, and status transitions.                                                                               | **Passed** |

---

## Project Structure

### Documentation (this feature)

```text
specs/002-contestant-profiles/
├── plan.md              # This file
├── research.md          # Architecture decisions & video/image strategy
├── data-model.md        # Prisma models, relationships, and validation rules
├── quickstart.md        # Validation scenarios & test commands
├── contracts/
│   └── contestant-api.md # REST endpoints & component hierarchy
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── tasks.md             # Implementation tasks (/speckit-tasks output)
```

### Source Code (repository root)

```text
prisma/
└── schema.prisma                                     # Updated Contestant, ContestantMedia, AwardCategory models

src/
├── app/
│   ├── (public)/events/[slug]/
│   │   ├── page.tsx                                 # Public event page integrating ContestantRoster
│   │   └── contestants/[contestantId]/page.tsx      # Standalone candidate profile page (RSC)
│   └── api/events/[slug]/
│       ├── contestants/
│       │   ├── route.ts                             # GET (list) / POST (create)
│       │   └── [contestantId]/
│       │       ├── route.ts                         # GET / PATCH / DELETE
│       │       └── status/route.ts                  # PATCH (withdraw / hide)
│       └── categories/
│           └── route.ts                             # GET / POST award categories
│
├── features/contestants/
│   ├── components/
│   │   ├── ContestantRoster.tsx                     # Responsive grid with division & category filter tabs
│   │   ├── ContestantCard.tsx                       # 4:5 luxury portrait card with candidate number & vote CTA
│   │   ├── ContestantProfileModal.tsx               # Fullscreen modal with bio dossier & gallery
│   │   ├── PhotoGalleryCarousel.tsx                 # 10-photo swipeable carousel with thumbnail navigation
│   │   ├── VideoReelPlayer.tsx                      # YouTube Shorts / TikTok / IG / FB embedded player
│   │   ├── CategoryFilterBar.tsx                    # Division & award pill tabs (nuqs URL synced)
│   │   ├── ContestantFormModal.tsx                  # Organizer CRUD modal with image cropper
│   │   └── ImageCropper.tsx                         # Client-side 4:5 aspect ratio crop canvas
│   ├── hooks/
│   │   ├── use-contestants.ts                       # TanStack Query hook with filter state
│   │   ├── use-contestant-mutations.ts              # Create, update, delete, reorder mutations
│   │   └── use-video-embed.ts                       # Video URL normalization & embed parser
│   ├── types/
│   │   └── index.ts                                 # TypeScript types & DTOs
│   └── utils/
│       ├── parse-video-embed.ts                     # Multi-platform embed regex parser
│       └── normalize-social-links.ts                # Social handle & URL sanitization
│
├── lib/
│   └── validations/
│       └── contestant.ts                            # Zod schemas for contestant CRUD & media
│
└── tests/
    └── unit/
        └── contestants/
            ├── video-embed-parser.test.ts           # Video embed URL parser unit tests
            ├── contestant-validation.test.ts        # Zod schema unit tests
            └── category-filter.test.ts              # Filtering logic unit tests
```

---

## Complexity Tracking

> No constitutional violations or unwarranted complexity introduced.
