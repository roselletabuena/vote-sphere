# Feature Specification: Event Profile & Operational Window

**Feature Branch**: `001-event-operational-window`

**Created**: 2026-08-30

**Status**: Ready for Review

**Input**: User description: "1. Event Profile & Operational Window. Event Metadata: Title, unique custom URL slug (e.g., /events/miss-luzon-2026), high-resolution banner image, and official contest description. Voting Timeline: Explicit startsAt and endsAt dates and times. Draft State: The page is hidden or password-protected. Scheduled State: The page displays a live countdown timer with contestant bios, but payment and voting buttons remain disabled. Active State: Voting opens automatically at the specified second. Closed State: Voting cuts off immediately upon reaching the deadline, locking tallies."

## Clarifications

### Session 2026-08-30

- Q: How should access to an event in the `Draft` state be restricted and previewed before publication? → A: Organizer Login + Optional Passphrase: Authenticated organizers can preview automatically; organizers can optionally set a preview passphrase/secret link for external guest reviewers.
- Q: When an event enters the `Closed` state upon reaching `endsAt`, how should final vote tallies and contestant rankings be displayed to public visitors? → A: Organizer-Controlled Toggle: The organizer can configure whether final tallies/rankings are revealed immediately when closed or kept hidden until an official announcement.
- Q: Are organizers permitted to modify the operational window timestamps (`startsAt` / `endsAt`) after the event has entered `Scheduled` or `Active` states? → A: Flexible Forward-Only Adjustments: Organizers can update future timestamps (`startsAt` while Scheduled; `endsAt` to any future timestamp while Active); timestamps cannot be set into the past; adjustments are logged with audit history.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Public Event Discovery & Live State-Driven Experience (Priority: P1)

As a public visitor or voter, I want to access an event page via a clean, descriptive URL slug so that I can see event details, contestant profiles, countdown timers, or active voting controls tailored exactly to the event's current operational state (Scheduled, Active, or Closed).

**Why this priority**: Core value of the platform — driving audience engagement and ensuring voters can discover contests and understand current voting availability.

**Independent Test**: Can be tested by navigating to an event's URL slug across Scheduled, Active, and Closed time windows, verifying accurate metadata rendering, countdown behavior, and appropriate enabling/disabling of voting interactions.

**Acceptance Scenarios**:

1. **Given** an event is in the `Scheduled` state (`currentTime < startsAt`), **When** a visitor navigates to the event URL, **Then** the event banner, title, description, and contestant bios are displayed, a synchronized live countdown to `startsAt` is visible, and all voting and payment action buttons are visibly disabled.
2. **Given** an event is in the `Active` state (`startsAt <= currentTime < endsAt`), **When** a visitor views the event page, **Then** voting actions and payment checkout triggers are enabled, and an active timer/deadline indicator is displayed.
3. **Given** the clock reaches `startsAt` while a user is on a `Scheduled` event page, **When** the countdown reaches zero, **Then** the page transitions to `Active` without requiring a manual page refresh, enabling voting actions.
4. **Given** an event reaches `endsAt` with `showResultsOnClose: true`, **When** the operational window closes, **Then** voting actions are immediately disabled, in-flight voting attempts after the cutoff are rejected, and the page displays final locked tallies and contestant rankings.
5. **Given** an event reaches `endsAt` with `showResultsOnClose: false`, **When** the operational window closes, **Then** voting is immediately cut off and the page displays a "Voting Concluded — Results to be announced" notice without revealing tally numbers.

---

### User Story 2 - Event Lifecycle Configuration & Operational Window Management (Priority: P2)

As an event organizer, I want to configure and adjust event metadata, operational windows, and publication states so that I can manage contests reliably throughout their operational lifecycle.

**Why this priority**: Essential for administrators/organizers to set up contests, schedule operational windows ahead of launch, and adapt to live scheduling changes.

**Independent Test**: Can be tested by creating/editing an event with metadata, operational settings, and timestamps, and verifying that the system assigns the slug, validates time bounds, computes states, and logs changes.

**Acceptance Scenarios**:

1. **Given** an organizer enters valid event metadata (title, unique slug, banner image, description, optional draft preview passphrase, results visibility preference, and `startsAt` < `endsAt`), **When** the event is saved, **Then** the event is created and associated with the unique URL slug.
2. **Given** an organizer attempts to use an event slug that is already taken by another event, **When** they submit the form, **Then** the system presents a validation error indicating the slug is unavailable.
3. **Given** an organizer specifies an `endsAt` timestamp that is earlier than or equal to `startsAt`, **When** submitting, **Then** the system rejects the configuration with an explicit validation error.
4. **Given** an event is in `Scheduled` state, **When** the organizer adjusts `startsAt` to a different future timestamp, **Then** the system updates the schedule, recalculates countdowns, and logs the change.
5. **Given** an event is in `Active` state, **When** the organizer extends or shortens `endsAt` to a future timestamp, **Then** the system updates the deadline, syncs connected clients, and records an audit log entry.

---

### User Story 3 - Draft State Protection & Organizer/Guest Preview (Priority: P3)

As an event organizer or external reviewer, I want to review an event in `Draft` state privately via authenticated organizer access or an optional preview passphrase so that details and contestant rosters can be audited before going public.

**Why this priority**: Prevents premature leaks of contest details while enabling frictionless review for external judges, sponsors, and stakeholders.

**Independent Test**: Can be tested by visiting a `Draft` event as an unauthenticated user (404/passphrase gate), entering the valid preview passphrase, or visiting as an authenticated organizer.

**Acceptance Scenarios**:

1. **Given** an event is in `Draft` state with no preview passphrase configured, **When** an unauthenticated visitor attempts to access the URL slug, **Then** the system displays a 404 Not Found response.
2. **Given** an event is in `Draft` state and the user is authenticated as the event organizer, **When** they navigate to the event URL, **Then** the complete event preview is displayed with a "Draft Preview" watermark/indicator.
3. **Given** an event is in `Draft` state with a preview passphrase configured, **When** an external guest visits the URL and submits the valid passphrase, **Then** the event preview is unlocked for their session.

---

### Edge Cases

- **System Clock Skew / Client Time Manipulation**: A voter whose device clock is manually set forward or backward cannot bypass the operational window; all state transitions and vote validation strictly adhere to trusted synchronized server time.
- **Vote in Progress at the Exact Cutoff Second**: If a user initiates checkout/voting 1 second prior to `endsAt` but payment/vote processing arrives at the server at or after `endsAt`, the vote submission is rejected gracefully with an "Event Closed" notification, and no funds are captured.
- **Slug Formatting & Sanitization**: Slugs containing spaces, special characters, or uppercase characters are automatically converted to lowercase kebab-case (e.g., "Miss Luzon 2026!" becomes `miss-luzon-2026`).
- **Rapid Window Extension/Modification**: If an organizer extends `endsAt` while the event is Active, all connected clients dynamically receive the updated deadline without breaking active sessions.
- **Draft Preview Session Expiration**: A passphrase-unlocked preview session expires automatically when the organizer transitions the event from `Draft` to `Scheduled` or `Active`.
- **Preventing Retroactive Timeline Edits**: Organizers cannot update `startsAt` to the past once Active, nor set `endsAt` to a time earlier than the current server timestamp.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow organizers to define and store event metadata including title, unique URL slug, high-resolution banner image URL, official contest description, an optional draft preview passphrase, and a `showResultsOnClose` toggle (defaulting to true).
- **FR-002**: System MUST enforce uniqueness for event URL slugs across the platform.
- **FR-003**: System MUST require explicit `startsAt` and `endsAt` timestamps with timezone awareness, ensuring `startsAt` strictly precedes `endsAt`.
- **FR-004**: System MUST support forward-only timeline adjustments: allowing modifications to `startsAt` while `Scheduled` (to a future time) and adjustments to `endsAt` while `Active` (to a future time), logging all modifications with timestamp and organizer identity.
- **FR-005**: System MUST support four distinct event lifecycle states: `Draft`, `Scheduled`, `Active`, and `Closed`.
- **FR-006**: In `Draft` state, system MUST restrict public access by default (returning 404), allowing preview only to authenticated organizers or guest users providing a valid event preview passphrase.
- **FR-007**: In `Scheduled` state, the event page MUST be publicly discoverable, display all event metadata and contestant biographies, provide a real-time countdown to `startsAt`, and keep all voting and payment triggers disabled.
- **FR-008**: When server time reaches `startsAt`, the event MUST automatically transition to `Active` state without requiring manual organizer intervention, enabling voting and payment workflows.
- **FR-009**: When server time reaches `endsAt`, the event MUST immediately transition to `Closed` state, permanently disabling all vote submission endpoints, payment processing, and locking final vote tallies.
- **FR-010**: In `Closed` state, the event page MUST display final tallies and rankings if `showResultsOnClose` is true, or display a closed notice with tallies hidden if `showResultsOnClose` is false.
- **FR-011**: System MUST evaluate voting eligibility against synchronized server time, rejecting any vote received outside the `[startsAt, endsAt)` operational window.
- **FR-012**: Public event pages MUST display real-time countdown timers that gracefully transition states in the client interface upon reaching milestone thresholds (`startsAt` and `endsAt`).

### Key Entities

- **Event**: Core contest record containing title, slug, description, banner media, optional draft preview passphrase hash, `showResultsOnClose` boolean flag, status override (`Draft` / `Published`), and operational window (`startsAt`, `endsAt`).
- **Event Lifecycle State**: Derived operational state computed from the combination of organizer publication status and server timestamp (`Draft`, `Scheduled`, `Active`, `Closed`).
- **Event Audit Log**: Immutable record of administrative timeline and status changes (previous timestamp, updated timestamp, modifiedBy, reason).
- **Contestant Profile**: Associated participant profile within an event containing bio, photo, contestant number, and aggregated vote count.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Event state transitions (`Scheduled` → `Active` and `Active` → `Closed`) execute automatically within 1 second of the scheduled threshold across all active client views.
- **SC-002**: Zero unauthorized or uncounted votes are accepted after the `endsAt` cutoff timestamp (100% cutoff enforcement).
- **SC-003**: Visitors can navigate to any valid event slug and load complete event metadata, banner image, and contestant roster in under 1.5 seconds on standard 4G/broadband connections.
- **SC-004**: 100% of invalid event slug submissions (duplicates, improper formats) and invalid date ranges are caught prior to persistence with clear, descriptive feedback.
- **SC-005**: 100% of operational window timeline modifications are captured in the audit log with zero data loss or session disruption for active voters.

## Assumptions

- Timezone handling will store all timestamps in UTC while presenting localized date/time strings in the user's browser timezone alongside the event's official contest timezone.
- Real-time countdown updates on client browsers synchronize against the authoritative server clock on initial load to prevent client device clock drift.
- Payment gateway sessions initiated near the cutoff time will enforce a strict server-side deadline check before final vote ledger entry.
