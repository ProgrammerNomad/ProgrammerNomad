# M1 - Homepage opening / review handoff

Status: implemented locally. M2 has not started. No commit, push, deployment, dependency change, content rewrite, or deployment configuration change.

The Sites skill was used in local-only mode: preserve the existing checkout and brand, constrain the visual pass, and review real browser evidence before handoff.

## Baseline

- Checkout: `D:\Websites\ProgrammerNomad`, branch `main`.
- Before editing: clean working tree.
- Baseline commit: `1395e5db4fafc8df59653a4e4a65df20abf21aa9` (`Enhance HeroArt and HeroCanvas components with new visual elements`).
- Existing Next.js / React / Three.js / React Three Fiber stack retained.
- Baseline screenshots: `before-desktop.jpg` (1440 × 900) and `before-mobile.jpg` (390 × 844).
- Baseline issue: the globe's 520px minimum height combined with its aspect ratio forced an oversized grid column on mobile. The global overflow hiding concealed the clipping rather than solving it.
- Baseline unit tests: 2 passed; content validation passed.

## Three compositions considered before implementation

| Opening | Typography / portrait | Globe / negative space | Actions / mobile | Decision |
| --- | --- | --- | --- | --- |
| Editorial split | Large, left-aligned brand statement; real portrait as a personal signature | Contained atlas on the right, with independent breathing room | Projects and Journeys directly after the introduction; single-column flow on phones | Selected: clearest identity and exploration hierarchy, while keeping the globe meaningful |
| Centered atlas | Centered statement and portrait above a large globe | Symmetrical, immersive visual centerpiece | Centered actions; the tall stacked composition delays exploration on small screens | Strong spectacle, weaker first-screen hierarchy |
| Photographic opening | Text and portrait against existing travel photography | Landscape as the dominant image; a smaller inset globe | Overlay actions need image-specific contrast and crops | Warmest travel impression, but photography competes with the engineering/atlas identity |

Existing black/electric-lime identity, Syne/Inter/JetBrains typography, actual portrait, and the procedural globe are retained. No generated personal imagery or invented travel history.

## Implemented boundary

- New homepage opening only; existing lower homepage sections and their content order remain.
- Projects (`/work`) and Journeys (`/field-notes`) are the primary actions.
- Responsive minmax grid, fluid type, contained globe, and stacked narrow-phone actions.
- Shared destination records come from the existing published field notes plus `content/travel/places.json`, via the map merger. Repeat visits become one pin with their story links preserved. Current data: 31 unique places, rather than counting repeat visits as separate destinations.
- Existing R3F renderer preserved: globe, contours, grid, procedural dots, lighting and drag interaction. Duplicate hardcoded destinations and unverified flight routes removed. Procedural continent regions remain stylized, not survey-grade geography.
- Longitude conversion fixed so the existing procedural land dots can represent eastern as well as western regions.
- HTML/SVG fallback is server-rendered, uses the same destination coordinates, and is not dependent on Three.js. It stays visible until geometry has actually rendered.
- No WebGL2, renderer creation errors, context loss, and an eight-second initialization timeout retain the poster and normal links. With JavaScript disabled, the opening, poster and links remain available; the picker explains that interaction requires JavaScript.
- Reduced motion skips the 3D import/render path. Rotation is off by default, opt-in and pausable. Rendering pauses offscreen/when the document is hidden. Touch scrolling stays native; touch users have the picker and buttons.
- Keyboard-accessible destination selection, turn/play/pause buttons, visible focus, a skip link, and Escape-to-close mobile navigation with focus restoration.

## Exact changed files

| File under `site/` | Purpose |
| --- | --- |
| `src/app/page.tsx` | Compose the new opening; retain lower sections; supply destination data |
| `src/app/layout.tsx` | Focusable skip-link target |
| `src/components/home/HomeOpening.tsx` (new) | Editorial headline, primary actions and real portrait signature |
| `src/components/home/HomeOpening.module.css` (new) | Scoped visual tokens, responsive layout, focus and reduced-motion rules |
| `src/components/home/HighlightStrip.tsx` | Render stable, accurate counts before and after hydration; remove count-up animation |
| `src/components/ui/MotionReveal.tsx` | Correct the existing reduced-motion hydration mismatch found during the repeat browser run; homepage CSS keeps reduced-motion content visible before hydration |
| `src/components/hero/HeroArt.tsx` | Progressive enhancement, fallback lifecycle and accessible controls |
| `src/components/hero/HeroCanvas.tsx` | Retained renderer wired to shared data, deliberate rotation, readiness/error handling |
| `src/components/hero/HeroPoster.tsx` (new) | Server-rendered SVG atlas from real destination coordinates |
| `src/components/hero/globe-utils.ts` | Remove duplicated destinations/implied routes; correct longitude conversion |
| `src/components/layout/SiteHeader.tsx` | Skip link, menu Escape/focus behavior, active-route semantics, touch target and reduced-motion ping |
| `src/lib/travel/destinations.ts` (new) | Validate and group shared destination records |
| `src/lib/travel/merge-places.ts` | Expose grouped atlas records and consistent unique-place count; keep existing map records intact |
| `src/lib/travel/destinations.test.ts` (new) | Grouping, validation, published links and shared-data consistency |
| `src/components/hero/globe-utils.test.ts` (new) | Projection, hemisphere visibility and longitude coverage |
| `e2e/home-m1.spec.ts` (new) | Responsive, navigation, keyboard, renderer and fallback regression coverage |
| `e2e/smoke.spec.ts` | Update stale headline/published-route expectations and actually verify skip-link focus |
| `M1-REVIEW.md` (new) | This bounded milestone handoff |

No changes to other page templates, MDX, images, content schemas/loaders, RSS/video pipeline, package files, deployment settings, profile README, or badge workflows.

## Checks

- Unit tests: 10 passing across 3 test files.
- TypeScript: passing.
- Content validation: passing.
- Production build: passing, 77 pages generated; built-in lint/type checks pass. Existing edge-runtime static-generation advisory remains.
- Chromium production E2E: 19 passing, including the 4 existing smoke checks.
- Width checks: 320, 360, 390, 768, 1024, 1440 and 1920 pixels. Checks inspect element bounding boxes and headline width in addition to document scroll width, so global overflow hiding alone cannot pass.
- Primary links and destination story: exercised. Other primary routes return 200; published project returns 200; draft project remains 404.
- Reduced motion at load and toggled after load: exercised.
- WebGL unavailable, renderer failure after successful capability probe, and real context loss: exercised.
- No-JavaScript opening and navigation: exercised.
- Browser console regression assertion covers uncaught exceptions and hydration errors in the normal renderer flow.
- A repeat run exposed React hydration errors under reduced motion. The existing counter rendered different server/client text, and reveal wrappers changed their initial tree. Counts now render stable values without count-up animation; reveal preferences apply after hydration, with an immediate homepage CSS reduced-motion override. Responsive tests now also assert no hydration errors.
- Real-browser visual review: production desktop, 320/360/390 mobile, tablet, mobile atlas controls and lower homepage; screenshots saved outside the source tree.
- Windows sandbox blocked `realpath` for the local Node tools. The affected commands were rerun with explicit approval outside that sandbox; no dependency workaround or installation was used.

## Review it locally

From PowerShell:

```powershell
Set-Location 'D:\Websites\ProgrammerNomad\site'
npm run start -- --hostname 127.0.0.1 --port 3000
```

Open <http://127.0.0.1:3000/>. The production build is already generated. If source changes later, stop the server, run `npm run build`, and start it again. Ctrl+C stops your preview.

Review in this order:

1. At 1440px desktop, check the headline/atlas balance, portrait, and action hierarchy.
2. At 320, 360 and 390px, confirm complete labels, comfortable spacing, no clipped content and natural page scrolling. Scroll through the existing videos, projects, travel cards and footer.
3. Open Projects and Journeys; return home. Choose Bangkok in the atlas: it must show `13.76°N / 100.50°E` and link to its published field note.
4. Tab from the address bar: activate Skip to content, then inspect focus on links, atlas controls and the destination picker. On mobile, open the menu with Enter and close it with Escape.
5. Start/pause rotation. Enable the browser/OS reduced-motion preference and reload: the SVG atlas should remain usable without a canvas.
6. Review the screenshots and approve M1 visually before requesting any M2 work.

To rerun verification (stop any development server first):

```powershell
npm run test
npm run typecheck
npm run validate:content
npm run build
npx playwright test --workers=2
```

The browser-test runner starts/stops the production server when port 3000 is free. Screenshot test outputs are under the ignored `site/test-results/` directory.

## Screenshot evidence

Directory: `C:\Users\shivs\.codex\visualizations\2026\10\13\01a13577-9154-7f52-87be-3123ed65c8b3\m1-review`

- Before: `before-desktop.jpg`, `before-mobile.jpg`.
- After: `after-desktop.jpg`, `after-mobile.jpg`, `after-mobile-atlas.jpg`, `after-320.jpg`, `after-360.jpg`, `after-tablet.jpg`.

## Remaining issues / review limits

- Three existing YouTube thumbnails fail to load in the local preview. This was present in the baseline; video cards/routes were not rewritten. Investigate the existing image/RSS pipeline separately with approval.
- Lower-page card art, page-specific redesigns, search, full case studies, galleries and the broader master plan are not part of M1.
- Continental dots are inherited stylized regions. Only destination markers and coordinates represent the shared documented locations; orbital rings do not claim travel routes.
- Automated browser coverage is Chromium, plus the real in-app browser. Physical-device Safari/Firefox and assistive-technology audits have not been completed.
- No field Core Web Vitals claim: production LCP/INP/CLS and slower-device GPU performance still need real measurement. First-load homepage JS reported by this build is about 157kB; 3D is lazy-loaded.
- User visual approval is still required. Do not start M2 automatically.

## Rollback

All M1 changes are uncommitted and confined to the files above. Review the diff against the baseline commit before selectively discarding anything; do not reset the whole repository, especially if other changes are added later. Untracked screenshot/test artifacts are separate from production source.
