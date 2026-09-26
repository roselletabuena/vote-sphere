# Quickstart Validation Guide: Contestant Profiles & Media Showcase

**Feature**: `002-contestant-profiles`  
**Status**: Ready for Validation

---

## 1. Prerequisites

- PostgreSQL / Supabase running locally or connected via `.env`
- Prisma migration applied: `npx prisma migrate dev`
- Seed script run: `npm run db:seed`

---

## 2. Automated Test Verification

Run all unit tests and schema validations for contestant profiles:

```bash
# Run feature-specific unit tests
npm run test:unit -- tests/unit/contestants/

# Verify type safety across entire codebase
npm run typecheck

# Verify linting
npm run lint
```

---

## 3. Manual / End-to-End Validation Scenarios

### Scenario A: Public Voter Experience

1. Open browser to `http://localhost:3000/events/mutya-ng-ilocandia-2026`.
2. Verify that candidates are rendered in high-resolution **4:5 vertical portrait cards** sorted by candidate number.
3. Click on **Division Tab** (e.g., "Female" or "Male") and verify roster filters instantly (< 100ms) without page refresh.
4. Click on **Category Tab** (e.g., "People's Choice") and verify only tagged contestants are shown.
5. Click on a contestant card to open the **Candidate Profile Modal**:
   - Swipe through the 10-photo carousel with thumbnail preview navigation.
   - Switch to the **Video Reel** tab and verify YouTube Shorts / TikTok / Instagram / Facebook video playback.
   - Verify bio dossier: Hometown, Height, Advocacy statement, and verified social links.

### Scenario B: Organizer Ingestion & Media Cropper

1. Login as organizer (`organizer@electa.ph`).
2. Navigate to Organizer Event Management → Contestant Roster.
3. Click **"Add Contestant"**:
   - Upload high-resolution photos and verify the client-side 4:5 crop canvas.
   - Paste a YouTube Shorts / TikTok / Facebook video URL and confirm real-time player preview.
   - Select Division and assign Award Categories.
   - Submit and verify the candidate appears immediately on both the dashboard and public roster.
4. Test Status modification: Set candidate status to `WITHDRAWN` and verify the candidate is immediately excluded from public voting.
