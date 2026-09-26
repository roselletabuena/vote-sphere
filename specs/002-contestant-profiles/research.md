# Architecture & Technical Research: Contestant Profiles & Multi-Media Showcase

**Feature**: `002-contestant-profiles`  
**Status**: Completed  
**Date**: 2026-09-26

---

## 1. High-Resolution Photo Gallery & Client-Side Cropping Strategy

### Decision

Use client-side Canvas / `react-easy-crop` (or lightweight native canvas crop utility) with **4:5 vertical portrait framing** (800×1000px output), WebP compression, and direct upload to Supabase Storage bucket (`contestant-media`) with CDN public distribution.

### Rationale

- **4:5 Aspect Ratio Standard**: Prevents cumulative layout shifts (CLS) on responsive mobile cards and matches professional pageant photography standards.
- **Client-Side Cropping & Compression**: Reduces upload payloads from ~8MB camera RAW/JPEGs down to ~250KB optimized WebP before network transfer, providing near-instant upload speeds on Philippine 4G/LTE connections.
- **Supabase Storage Integration**: Native integration with the existing Supabase infrastructure in `vote-sphere`, utilizing signed/public storage URLs with CDN caching headers (`Cache-Control: max-age=31536000, immutable`).

### Alternatives Considered

- _Server-Side Sharp Processing_: High compute load on Next.js serverless functions during bulk uploads; rejected in favor of client-side offload.
- _Cloudinary / Imgix SaaS_: External dependency incurring recurring monthly costs; Supabase Storage is already provisioned and free in tier.

---

## 2. Multi-Platform Short-Form Video Embedding (YouTube, TikTok, IG, Facebook)

### Decision

Implement a pure, client-side normalized parser (`parseVideoEmbedUrl`) that extracts platform provider and embed identifiers, rendering lightweight, privacy-conscious responsive `<iframe>` containers with lazy loading and facade poster placeholders.

### Embed Patterns:

1. **YouTube Shorts & Standard**:
   - URL: `https://youtube.com/shorts/{id}`, `https://youtu.be/{id}`, `https://youtube.com/watch?v={id}`
   - Embed: `https://www.youtube-nocookie.com/embed/{id}?autoplay=0&rel=0&modestbranding=1`
2. **TikTok**:
   - URL: `https://www.tiktok.com/@{user}/video/{id}`
   - Embed: Standard TikTok Embed iframe / oEmbed endpoint with responsive 9:16 vertical wrapper.
3. **Instagram Reels**:
   - URL: `https://www.instagram.com/reel/{id}/` or `https://instagram.com/p/{id}/`
   - Embed: `https://www.instagram.com/p/{id}/embed`
4. **Facebook Videos / Reels**:
   - URL: `https://www.facebook.com/watch/?v={id}`, `https://www.facebook.com/reel/{id}`
   - Embed: Facebook video plugin iframe: `https://www.facebook.com/plugins/video.php?href={encoded_url}&show_text=0`

### Rationale

- Privacy-friendly (`youtube-nocookie.com`, sandboxed iframe attributes).
- Facade thumbnail with play button avoids loading heavy third-party iframe scripts until the user explicitly clicks play or switches to the Video tab.

### Alternatives Considered

- _Direct MP4 video file hosting_: Incurs high bandwidth and storage egress costs and requires expensive video transcoding pipelines; rejected for v1.

---

## 3. Contestant Division & Award Category Schema Architecture

### Decision

Model contestant competition hierarchy with:

1. **Single Primary Division** on `Contestant`: Enum `ContestantDivision` (`FEMALE`, `MALE`, `LGBTQ`, `TEEN`).
2. **Compound Unique Index**: `@@unique([eventId, division, contestantNumber])`, allowing Candidate #1 in Female and Candidate #1 in Male within the same pageant.
3. **Many-to-Many Award Categories**: Explicit join model `ContestantCategoryAssignment` linking `Contestant` to `AwardCategory`.
4. **Soft Status Lifecycle**: `ContestantStatus` enum (`ACTIVE`, `HIDDEN`, `WITHDRAWN`) preventing hard deletion and protecting vote/payment ledger integrity.

### Rationale

- Accurately mirrors real-world pageant rules (e.g., _Mr. and Ms. University_, _Miss Earth with Eco-Hero title_).
- Preserves referential integrity for future voting engine (Spec 003) and payout ledgers (Spec 006).

---

## 4. State Synchronization & Filter Performance

### Decision

Use `nuqs` for URL-synchronized filter state (`?division=female&category=peoples-choice`) combined with TanStack Query caching and optimistic client-side array filtering for instantaneous (< 50ms) tab switching.

### Rationale

- Deep-linkable URLs: Fans and contestants can share direct links to their specific division or category roster.
- Fast, silky client filtering with Framer Motion layout animations.
