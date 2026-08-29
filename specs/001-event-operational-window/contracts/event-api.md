# Interface Contracts: Event Profile & Operational Window API

**Feature**: `001-event-operational-window`  
**Base URL**: `/api/events`

## Endpoints

### 1. Get Event Public Profile

- **Path**: `GET /api/events/{slug}`
- **Authentication**: Optional (authenticated organizers get unredacted draft and tallies)
- **Response**: `ApiResponse<PublicEventResponse>`

#### Response Envelope (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "evt_123456",
    "slug": "miss-luzon-2026",
    "title": "Miss Luzon 2026",
    "description": "The premier beauty and advocacy pageant of Northern and Central Luzon.",
    "bannerUrl": "https://images.unsplash.com/photo-1511578314322-379afb476865",
    "startsAt": "2026-09-01T10:00:00.000Z",
    "endsAt": "2026-09-05T22:00:00.000Z",
    "serverTime": "2026-08-30T03:20:00.000Z",
    "operationalState": "Scheduled",
    "showResultsOnClose": true,
    "contestants": [
      {
        "id": "cst_1",
        "contestantNumber": 1,
        "name": "Maria Santos",
        "bio": "Advocate for marine conservation and STEM education.",
        "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        "voteCount": null
      }
    ]
  },
  "timestamp": "2026-08-30T03:20:00.000Z"
}
```

_Note: `voteCount` is `null` when state is `Scheduled` or `Active`, and only populated in `Closed` state if `showResultsOnClose: true` or requester is the authorized organizer._

---

### 2. Verify Draft Preview Passphrase

- **Path**: `POST /api/events/{slug}/preview-auth`
- **Body**:

```json
{
  "passphrase": "judge-preview-2026"
}
```

- **Response (200 OK)**:

```json
{
  "success": true,
  "data": {
    "previewToken": "jwt_or_encrypted_cookie_value",
    "expiresAt": "2026-09-01T10:00:00.000Z"
  }
}
```

---

### 3. Create / Update Event (Organizer Protected)

- **Path**: `POST /api/events` / `PATCH /api/events/{id}`
- **Authentication**: Required (Cognito JWT via `getSession()`)
- **Body**:

```json
{
  "title": "Miss Luzon 2026",
  "slug": "miss-luzon-2026",
  "description": "Official contest description...",
  "bannerUrl": "https://images.unsplash.com/...",
  "startsAt": "2026-09-01T10:00:00.000Z",
  "endsAt": "2026-09-05T22:00:00.000Z",
  "publicationStatus": "PUBLISHED",
  "draftPassphrase": "optional-passphrase",
  "showResultsOnClose": true,
  "reason": "Initial event schedule"
}
```

- **Response**: `ApiResponse<Event>`
