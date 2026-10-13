# Add your images later

No visual redesign is needed when the images arrive. All paths below are relative to `site/`. Use real photos/screenshots that you have permission to publish; never add secrets or private customer information to screenshots.

## 1. Project screenshots - highest priority

- Put an optimized image in `public/images/work/<project-slug>/cover.webp` (roughly 1600×1000, 16:10).
- Set that project's MDX `cover` to `/images/work/<project-slug>/cover.webp`.
- The card and detail header automatically replace the typographic identity with this cover.
- For additional visuals inside the authored notes, use the existing `<Figure src="…" alt="…" caption="…" />` component. Add accurate descriptions.
- Do not label mockups as actual product screenshots. `project-diagrams.ts` remains conceptual unless replaced with documented architecture.

## 2. Travel photographs

- Folder: `public/images/travel/<story-slug>/`.
- Set MDX `cover` to the actual cover file. Recommended: 1800px wide, 16:9 or 4:3, composed for responsive cropping.
- Add `<Figure src="/images/travel/<story-slug>/01.webp" alt="Specific description" caption="A factual caption" />` lines to the story body.
- Existing self-closing Figure components are collected into the story's keyboard-accessible photo journal. Existing default width/height values are not required for gallery photographs.
- Replace `placeholder.svg` references; until then the UI displays a geographic identity, not a broken or misleading photograph.
- Leave `geo`, dates, route, costs and season unchanged unless you are correcting or supplying your own actual trip records. Geo uses decimal latitude/longitude. Do not infer every stop from a single pin.

## 3. Gear images

Add an optional `image` property to an existing item in `content/gear/items.json`:

```json
{
  "category": "Cameras",
  "name": "GoPro",
  "description": "Action and travel B-roll on treks and city walks.",
  "affiliateUrl": null,
  "image": "/images/gear/gopro.webp"
}
```

Place that file in `public/images/gear/`. Use roughly 1200×800 with a simple background. Only add exact models/specs if they are yours and verified. Affiliate URLs are explicitly labeled when present.

## 4. Portrait and about photographs

- Existing portrait: `public/images/shiv-singh.jpg`. Replacing this file updates the hero signature, about opening and portrait download.
- Additional about gallery entries are defined in `src/app/about/page.tsx` with `src` and factual `alt` text.
- A flattering portrait crop with room around the head works best for the current 4:5 arch crop.

## 5. Film relationships and curated lists

- For a genuinely related trip film, add its real `youtubeVideoId` to the relevant field-note frontmatter. The atlas/story displays a watch link; the video detail lists related notes when the film is in the current channel feed.
- Populate existing `content/youtube/playlists.json` sections with actual video IDs from the channel. The page shows only IDs found in the current RSS feed; empty sections are omitted.
- YouTube RSS only exposes a recent window. A historical video archive is not fabricated from missing metadata. Channel playlists remain reachable directly.

## Verify after adding assets

From `site/`, run `npm run validate:content`, `npm run typecheck`, `npm run test`, then `npm run build`. Review desktop and 320px/mobile crops. Keep alt text meaningful; avoid captions that claim an unverified place or date. Use compressed WebP/JPEG, normally under 300KB for card images and under 600KB for large covers where quality permits.
