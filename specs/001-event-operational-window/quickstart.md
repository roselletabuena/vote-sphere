# Quickstart & Verification Guide: Event Profile & Operational Window

**Feature**: `001-event-operational-window`  
**Date**: 2026-08-30

## Prerequisites

- Node.js 20+
- Dependencies installed (`npm install`)
- Valid environment variables in `.env.local`

## Validation Scenarios

### Scenario 1: State Derivation & Countdown Mechanics (Automated Unit Tests)

Verify pure domain calculations for all 4 operational states (`Draft`, `Scheduled`, `Active`, `Closed`) and edge-case transitions.

```bash
npm run test -- tests/unit/events/derive-event-state.test.ts
```

### Scenario 2: Public Event Page Rendering & State Controls (Browser/Component Test)

1. Start development server:
   ```bash
   npm run dev
   ```
2. Navigate to `http://localhost:3000/events/miss-luzon-2026`
3. **Verify Scheduled State**:
   - Live banner, title, description, and contestant cards render properly.
   - Real-time countdown timer ticks down toward `startsAt`.
   - Voting and payment buttons are disabled with tooltip / badge: _"Voting opens in X days/hours"_.
4. **Verify Active State**:
   - Set test event `startsAt` to 5 seconds in the future.
   - Watch the countdown timer reach 0: The page automatically transitions to `Active` without full reload, and voting triggers become enabled.
5. **Verify Closed State**:
   - Advance time past `endsAt`: Voting triggers disable immediately; final tallies/rankings display according to `showResultsOnClose`.

### Scenario 3: Draft State & Passphrase Gate

1. Access a draft event at `/events/preview-draft-contest` as an anonymous user without credentials:
   - System displays a password prompt or 404 response.
2. Enter the valid draft preview passphrase:
   - System unlocks the preview session with a prominent `"Draft Preview"` banner.
