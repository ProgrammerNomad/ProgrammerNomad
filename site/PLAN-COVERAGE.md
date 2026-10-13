# Nomad Dev Atlas - implementation and review ledger

## Scope and baseline

The latest approval expands the earlier M1-only boundary to the remaining site design and functionality. Images will be supplied later by the owner. Work remains local; nothing has been deployed, pushed, or committed by this implementation.

- Baseline: clean `main` at `253aa4632d251c788cc1968330b2da5055b03665` (M1 already committed before this continuation).
- Existing M1 composition and alternatives remain recorded in `M1-REVIEW.md`.
- Before-edit browser review: projects on desktop; Madhmaheshwar on mobile.
- Verified source inventory: 14 work files / 12 published / 6 detail pages; 3 writing files / 1 published; 61 field notes / 36 published (33 travel, 3 field guides); 31 unique shared destinations.
- Existing portrait and 3 photographed trips retained. No generated personal imagery, invented journey coordinates, project metrics, or equipment specifications.

## Design decisions

Continue the selected editorial Nomad Dev Atlas direction. The homepage retains the typography / portrait / interactive globe composition selected in M1. Below it, engineering, travel, writing, film, and collaboration use different spatial rhythms.

| Layer            | Concrete implementation                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| Identity         | Existing black `#0b0c0b`, lime `#b5ff43`, Syne display, Inter body, JetBrains Mono metadata                           |
| Supporting tones | Warm travel `#e8b86d`; quiet technical blue `#92c8e5`; readable muted ink `#adb4a7`                                   |
| Layout           | Existing 1152px container; fluid display scale; body reading width 68ch; minimum-zero grid tracks                     |
| Surfaces         | Editorial rules and open space; project grid-paper identities; geographic contour fallbacks; quiet reading canvas     |
| Controls         | Native links, selects, buttons and modal dialogs; visible focus; 44–48px primary controls; pressed filter states      |
| Mobile           | Stacked openings, simplified header, single-column articles / kit / contact; map list remains independently available |
| Motion           | Brief color/border transitions; inherited globe opt-in rotation; no scroll hijacking; reduced-motion global override  |

Tokens and visual component rules are in `src/app/atlas.css`, with the existing base tokens preserved in `globals.css`. M1’s CSS remains homepage-opening scoped.

## Requirement-to-implementation coverage

| Experience                           | Implemented                                                                                                                                    | Evidence / remaining editorial input                                                                                                       |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Homepage `/`                         | Preserved hero + shared-data globe / static fallback; narrative sequence identity → projects → travel → writing → films → collaboration        | M1 tests retained; new lower-page desktop review                                                                                           |
| Projects `/work`                     | Software-lab opening, search + stack filters, counts, reset / empty state, distinct typographic identities                                     | All 12 published projects; six repository-only entries still go directly to GitHub                                                         |
| Project details `/work/[slug]`       | Breadcrumbs, project identity / real-cover slot, technical stack, interactive capability map, readable authored notes, related projects        | All six detail pages. Diagrams explicitly conceptual and grounded in existing MDX. No invented outcomes or production architecture         |
| Travel `/field-notes`                | Shared destination records, region + experience + text filters, selected photo/story panel, map/list alternative, multiple visits per pin      | Existing Leaflet renderer preserved. Coordinates are recorded points, not inferred itinerary paths                                         |
| Travel details `/field-notes/[slug]` | Photo-led narrative, recorded route / budget / season panel, chapters, gallery, related notes, exact return-to-map selection                   | 33 travel posts use this template. Missing data gets honest unavailable states; source TODOs remain editable                               |
| Field guides                         | Separate warm-accent reading template, TOC, progress, related reading, code-copy controls and field-kit links                                  | Three existing guides; no content rewriting                                                                                                |
| Writing `/writing` and details       | Editorial essay index, technical-blue reading variant, readable prose / code, heading navigation, copy-link feedback                           | Existing article and tag routes retained; tag/archive pages use quieter list layout                                                        |
| Videos `/videos` and details         | Featured release, corrected real thumbnail parsing, recent films, configured playlist groups, failure poster, opt-in embed, related-story hook | RSS remains the source. Empty playlist IDs are not invented; direct channel-playlist navigation stays available                            |
| Gear `/gear`                         | Illustrated workflow sections using actual inventory; optional per-item image support; related guides; affiliate labels only if a link exists  | Exact supplied names retained. Owner can add imagery without redesigning layout                                                            |
| About `/about`                       | Portrait editorial opening, original biography, documented milestone timeline, companies + open source, accessible gallery                     | Broken ZIP removed; working portrait download + media-kit request replaces it                                                              |
| Contact `/contact`                   | Collaboration types, accessible inline validation, pending / success / failure / retry states, direct email fallback                           | Existing Netlify form contract preserved. Local preview never reports a message as delivered. Live delivery needs post-deploy verification |
| Global search                        | Published projects / writing / guides / journeys / destinations, category filters, no-results state, Ctrl/Cmd+K, Escape and focus restoration  | Native dialog handles focus containment; draft data never enters the index                                                                 |
| Shared recovery                      | Footer navigation, visible breadcrumbs, genuine 404, unpublished / repository-only detail routes remain 404                                    | Archive page numbers reject decimals; archive/tag canonical metadata added                                                                 |
| Preservation                         | Existing URLs, schemas, MDX loader, draft flags, globe renderer, deployment config, SEO JSON-LD/feed/sitemap logic, README/badge workflows     | No dependencies added; no content files or deployment files changed                                                                        |

## Incremental visual passes

1. **M1 retained** - homepage opening, responsiveness, shared destinations, reliable static globe fallback.
2. **Shared + home pass** - search, tokens, footer and lower-page narrative. Reviewed homepage travel section at desktop and search at narrow mobile before moving on.
3. **Projects + travel pass** - reviewed JodKit capability interaction, atlas region filtering with photo/story selection, and Madhmaheshwar mobile opening before wider rollout.
4. **Remaining routes pass** - reviewed videos, portrait/about, field kit, contact and mobile writing. Archive/tag/detail routes use the same relevant page-family components.
5. **Verification pass** - production build, automated responsive/interaction tests, all published route/link checks, final production screenshots.

These are reviewable file groups, not new Git commits. To roll back, review the working diff against the baseline and revert only this implementation's selected hunks; do not reset unrelated work.

## Signature interaction specification

| Interaction    | Trigger and response                                                  | Cost / keyboard / reduced motion                                                                                   |
| -------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Globe          | Drag or turn buttons; destination selection; explicit rotation toggle | Existing lazy Three renderer; static SVG for reduced motion / failure; retained M1 controls and tests              |
| Travel atlas   | Select pin/list row or filter → matching place and published visits   | Existing dynamic Leaflet; instant nonanimated map recenter; buttons + native selects; list works without map tiles |
| Capability map | Select a labeled node → factual capability explanation                | React text state only; native buttons; no animation or fabricated runtime simulation                               |
| Photo journal  | Open photo → native dialog; previous/next or arrow keys               | Existing images, responsive sizes; Escape + focus return; instant changes, no autoplay                             |
| Search         | Header button or Ctrl/Cmd+K → dialog and immediate local results      | Small published metadata index, no external service; tab navigation; Escape closes even from the search input      |
| Video          | Explicit play button → YouTube no-cookie iframe                       | No iframe until requested; poster reserves ratio; normal keyboard activation                                       |
| Feedback       | Form/copy action → pending, confirmed success or actionable failure   | Live status text; failed form retains entered values; no network request for local inquiry previews                |

Normal scrolling stays native. Micro-transitions are 180–200ms where introduced, not scroll-linked timelines. Motion reduction removes nonessential animation and transforms.

## Still requiring real owner content (not implementation defects)

Images can be added later as requested; follow `ASSET-HANDOFF.md`.

- 30 travel posts lack actual route and cost notes. The UI is complete but cannot recover personal trip facts from a placeholder. It reports these as not recorded and never synthesizes connecting routes.
- Six project descriptions contain no measured outcomes or detailed engineering tradeoff evidence. Capability maps and source links are provided; deeper case studies should be authored only when those facts exist.
- Laptop / camera / drone model numbers are not supplied. The kit uses the existing names without adding specs or purchase links.
- No trip has a `youtubeVideoId`, and curated playlist ID lists are empty. Both association hooks render when supplied. No film is falsely assigned to a journey.
- The downloadable full media kit does not exist. The real headshot download works; a contact link requests other assets.
- Existing published flags and dates are intentionally preserved, including the already-published guide dated October 15, 2026. Publishing-policy changes were not inferred from this visual request.

## Quality gates and release boundary

Implementation checks and final results are recorded in `SITE-REVIEW.md`. Passing local tests does not prove deployed contact delivery, all third-party embed availability, complete screen-reader compatibility, or real-user Core Web Vitals.

Before any later release: review screenshots and diff; add priority imagery/factual content if desired; run the recorded checks; verify the real Netlify form on the authorized deployment; check canonical/indexing context; measure LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at the 75th percentile when real-user data is available. These remain measurement targets, not claims of achieved field performance.
