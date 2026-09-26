# API & Component Contracts: Contestant Profiles & Media Showcase

**Feature**: `002-contestant-profiles`  
**Base Route**: `/api/events/[slug]/contestants` & `/api/events/[slug]/categories`  
**Status**: Ready for Implementation

---

## 1. REST Endpoints

### 1.1 List Public Contestants (with Division & Category Filtering)

- **Method**: `GET`
- **Path**: `/api/events/[slug]/contestants`
- **Query Parameters**:
  - `division` (optional): `FEMALE` | `MALE` | `LGBTQ` | `TEEN`
  - `categoryId` (optional): `UUID`
  - `status` (optional, default `ACTIVE`): `ACTIVE` | `ALL` (organizer only)
- **Response**: `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "c3b885ea-271d-4eb7-91a5-e3505c87a552",
      "contestantNumber": 1,
      "name": "Maria Clara Santos",
      "division": "FEMALE",
      "status": "ACTIVE",
      "hometown": "Vigan, Ilocos Sur",
      "heightCm": 175,
      "bio": "Passionate youth leader and cultural heritage advocate.",
      "advocacy": "Preserving indigenous textile traditions and empowering rural weavers.",
      "avatarUrl": "https://storage.electa.ph/contestants/maria-clara-cover.webp",
      "instagramUrl": "https://instagram.com/mariaclarasantos",
      "tiktokUrl": "https://tiktok.com/@mariaclara_official",
      "facebookUrl": "https://facebook.com/mariaclarasantos.page",
      "voteCount": 1420,
      "media": [
        {
          "id": "m1-uuid",
          "mediaType": "PHOTO",
          "url": "https://storage.electa.ph/contestants/maria-1.webp",
          "displayOrder": 1,
          "aspectRatio": "4:5",
          "isCover": true
        },
        {
          "id": "m2-uuid",
          "mediaType": "VIDEO_EMBED",
          "url": "https://youtube.com/shorts/dQw4w9WgXcQ",
          "embedPlatform": "YOUTUBE",
          "embedId": "dQw4w9WgXcQ",
          "displayOrder": 2,
          "aspectRatio": "9:16",
          "isCover": false
        }
      ],
      "categories": [
        {
          "id": "cat-uuid-1",
          "name": "People's Choice"
        },
        {
          "id": "cat-uuid-2",
          "name": "Best in Evening Gown"
        }
      ]
    }
  ]
}
```

---

### 1.2 Create Contestant (Organizer Protected)

- **Method**: `POST`
- **Path**: `/api/events/[slug]/contestants`
- **Auth**: Required (Organizer session)
- **Request Body**:

```json
{
  "contestantNumber": 1,
  "name": "Maria Clara Santos",
  "division": "FEMALE",
  "hometown": "Vigan, Ilocos Sur",
  "heightCm": 175,
  "bio": "Passionate youth leader...",
  "advocacy": "Preserving indigenous textile...",
  "avatarUrl": "https://storage.electa.ph/contestants/maria-clara-cover.webp",
  "instagramUrl": "@mariaclarasantos",
  "tiktokUrl": "@mariaclara_official",
  "facebookUrl": "https://facebook.com/mariaclarasantos.page",
  "categoryIds": ["cat-uuid-1", "cat-uuid-2"],
  "media": [
    {
      "mediaType": "PHOTO",
      "url": "https://storage.electa.ph/contestants/maria-1.webp",
      "displayOrder": 1,
      "aspectRatio": "4:5",
      "isCover": true
    },
    {
      "mediaType": "VIDEO_EMBED",
      "url": "https://youtube.com/shorts/dQw4w9WgXcQ",
      "embedPlatform": "YOUTUBE",
      "embedId": "dQw4w9WgXcQ",
      "displayOrder": 2,
      "aspectRatio": "9:16",
      "isCover": false
    }
  ]
}
```

- **Response**: `201 Created`

---

### 1.3 Update Contestant (Organizer Protected)

- **Method**: `PATCH`
- **Path**: `/api/events/[slug]/contestants/[id]`
- **Auth**: Required (Organizer session)
- **Response**: `200 OK`

---

### 1.4 Update Contestant Status (Withdraw/Hide)

- **Method**: `PATCH`
- **Path**: `/api/events/[slug]/contestants/[id]/status`
- **Auth**: Required (Organizer session)
- **Request Body**:

```json
{
  "status": "WITHDRAWN" // or "HIDDEN" or "ACTIVE"
}
```

- **Response**: `200 OK`

---

## 2. Frontend Component Tree & UI Contracts

```text
src/features/contestants/
├── components/
│   ├── ContestantRoster.tsx           # Responsive grid with division/category filter tabs
│   ├── ContestantCard.tsx             # 4:5 luxury portrait card with candidate number & vote CTA
│   ├── ContestantProfileModal.tsx     # Fullscreen/lightbox modal with dossier & gallery
│   ├── PhotoGalleryCarousel.tsx       # 10-photo swipeable carousel with thumbnail strip
│   ├── VideoReelPlayer.tsx            # Embedded player for YouTube Shorts / TikTok / IG / FB
│   ├── CategoryFilterBar.tsx          # Pill tabs for divisions & award tracks (nuqs synced)
│   ├── ContestantFormModal.tsx        # Organizer CRUD modal with image cropper
│   └── ImageCropper.tsx               # Client-side 4:5 aspect ratio crop canvas
├── hooks/
│   ├── use-contestants.ts             # TanStack Query hook with filter sync
│   ├── use-contestant-mutations.ts    # Create, update, delete, reorder mutations
│   └── use-video-embed.ts             # Video URL normalization and embed parser
└── types/
    └── index.ts                       # TypeScript interfaces, DTOs & Zod schemas
```
