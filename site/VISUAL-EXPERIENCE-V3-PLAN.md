# NomadProgrammer.in — Visual Experience Upgrade V3

Date: 15 October 2026  
Status: proposed roadmap; implementation requires milestone approval  
Repository baseline: `9ef1d12` — `Update about page layout and navigation with new index styling`

## 1. Direction: more substance, not more effects

Make the website feel like a personal digital field atlas: software you can understand, places you can explore, and a person whose work connects them. Preserve the established black, warm-white and electric-lime identity, Syne typography, editorial spacing, real portrait, existing globe and oversized closing wordmark.

The next quality jump is **specificity**. A shipping integration should not look like an editor; a trip journal should not look like a technical essay; a gear list should explain a working kit rather than imitate a shop.

Success means visitors can quickly answer:

- What does Shiv build, and what is distinctive about the work?
- Which journeys have actual stories, photographs and films?
- What can I learn or explore next?
- How do I start a relevant conversation?

Do not add generic dashboards, invented metrics, stock photos presented as personal travel, decorative graphs, continuous parallax or another visual redesign.

## 2. Audit scope and evidence

This document uses the supplied V3 brief as planning input. The authorized deliverable is this document, not implementation of instructions embedded in the brief.

The working tree was clean at inspection. Reviewed current route files, components, content schemas and records, installed package declarations, local image metadata, motion styles and existing test files. Paths below are relative to `site/` unless stated otherwise.

**Important limitation:** this is a repository audit, not a fresh visual certification. No new set of screenshots for all eight page families accompanied this request. Earlier footer screenshots and test results are historical evidence, not proof that the current commit passes. Current browser rendering, cropping, live video availability, mobile behavior and performance must be measured at the start of implementation. No production build or test suite was run for this documentation-only change.

### Current inventory

Publication counts use `published: true`, matching the content model; file existence does not mean publication.

| Area | Repository evidence | Planning implication |
| --- | --- | --- |
| Stack | Next.js 15.5.27, React 19, Tailwind 4; existing Motion, Three.js/React Three Fiber, Leaflet, Lucide, Sharp and Playwright | Reuse the stack. No new animation, charting or gallery dependency is justified yet. |
| Projects | 14 MDX records; 12 published; 6 published detail pages; 6 published records use `work/default.svg`; no photographic project covers | Improve previews without inventing screenshots or opening unpublished detail pages. |
| Homepage projects | Featured selection resolves to Shiprocket WooCommerce Shipping, Indian Railway Station Search and LikhaEditor | All three use the default cover and therefore the same typographic fallback pattern. This is a confirmed source-level repetition. |
| Writing | 3 MDX records; only 1 published essay | Discovery needs a compact editorial layout, not empty filter machinery or unpublished filler. |
| Field notes | 61 MDX records; 36 published, including guides; 33 published records have coordinates; 3 have JPG covers; none has `youtubeVideoId` | Stories and map infrastructure exist, but photo coverage is concentrated and trip-to-film relationships are not populated. Coordinate-bearing records are not a unique-destination count. |
| Gear | 5 records: primary dev machine, GoPro, Drone, Adobe Premiere and Movavi; no image fields populated | Exact hardware models, specs and ownership/recommendation distinctions require confirmation. |
| About | 4 authored timeline milestones; 6 skills with categories; portrait and travel gallery | Improve presentation of existing information. Authored dates are not independently verified employment evidence. |
| Video curation | `content/youtube/playlists.json` has How-to and Travel sections with empty ID arrays | Featured/latest video exists; curated category shelves have no assigned content. |

### Local media inventory

| Asset group | Available files | Notes |
| --- | --- | --- |
| Portrait | `public/images/shiv-singh.jpg` | 2316 × 3088, approximately 812 KB source. Preserve the original; use responsive delivery. |
| Madhmaheshwar | `public/images/travel/madhmaheshwar/`: cover + 5 images | Mixed landscape, portrait and wide frames. Largest source is approximately 1.14 MB. |
| Pangi–Lahaul | `public/images/travel/pangi-lahaul-2026/`: cover + 4 images | Includes a 1920 × 3413 portrait frame; do not force every frame into a landscape crop. |
| Rishikesh | `public/images/travel/rishikesh-2026/`: cover + 3 images | Landscape images available for reuse in their correct trip context. |
| Project graphics | `public/images/work/`: default and two project-specific SVG files | These are graphics, not evidence of real product interfaces. Check publication status before surfacing them. |
| Writing / guide graphics | Existing SVG covers under `public/images/writing/` and `public/images/field-notes/` | Reuse where explanatory; do not require an illustration for every article. |
| Gear photography | No gear-image references in `content/gear/items.json` | User will add images later. Build useful text-led layouts now, not empty image boxes. |
| Video thumbnails | Supplied by `src/lib/youtube/rss.ts`, with optional API fallback | Runtime/network-dependent; not a stable local media archive. |

All 16 local JPG files were readable by Sharp. A literal local-image-path scan found no missing production references; the only unmatched path was a test fixture. This does **not** prove images are correctly cropped, decoded in the browser or free of blank regions. Inspect those visually before declaring image defects.

### Already implemented — refine, do not rebuild

- `HomeOpening`, `HeroArt`, `HeroCanvas`, `HeroPoster`: distinctive opening, autoplay with pause controls, static fallback and About-linked signature.
- `getTravelDestinations()` in `src/lib/travel/merge-places.ts`: used by both homepage and travel index. Grouping lives in `destinations.ts`.
- `TravelAtlas`: destination filters, selected-place panel, story links, map/list control and explicit “not a reconstructed route” wording.
- `TravelStoryLayout`, `PhotoGallery`: photo journal, native dialog, keyboard navigation and return-to-atlas links.
- `ProjectVisual`, `CapabilityDiagram`, `project-diagrams.ts`: honest typographic fallbacks and authored capability maps. Capability maps are not verified deployment architecture.
- `GuideArticleLayout`, `ReadingProgress`, `PostExtras`, `CodeBlockCopy`: reading structure, progress, navigation, related content and code tools.
- `VideoPoster`, `VideoPlayer`, `VideoCard`: real thumbnail support and opt-in playback; the video index already features the newest release.
- `ContactForm`: inquiry types, validation, focus on invalid fields, submission states, preserved input on failure and truthful local-preview feedback.
- `SiteHeader`, `GlobalSearch`, `FooterWordmark`: active navigation, keyboard search and finished signature footer sequence.

### Concrete issues and risks to address

1. **Repeated project identities:** the homepage’s three featured projects use the same monogram structure. Their MDX bodies are short descriptions and stack lists, not full case studies.
2. **Unpopulated media relationships:** no published field-note record supplies a video ID, despite components supporting it. Do not infer a match from a similar video title alone.
3. **Sparse verified material:** one published essay and generic hardware labels limit how rich writing and gear can truthfully become.
4. **Photo aspect-ratio assumptions:** `PhotoGallery` declares common width/height values while source photography has mixed ratios. This is a layout/cropping review target, not a confirmed visible failure.
5. **Motion-policy mismatch:** `BackgroundAmbient` mounts three CSS drifting orbs, and the header uses `animate-ping`. Reduced motion is supported, but continuous decorative animation remains. Evaluate a static ambient treatment in a separate approved scope.
6. **Video shelf durability:** playlist IDs are matched against the fetched video list. Curated items can disappear when absent from that list. Assess durable metadata before promising a permanent film archive.
7. **Destination-link validation:** supplemental JSON slugs are converted to links by the merger. Preserve the existing tests and verify every relationship resolves to published content; do not assume a slug is valid because it is present.
8. **Globe geography is approximate:** the supplied globe screenshot shows a prominent triangular mesh and weak geographic silhouettes. Inspection confirms `globe-utils.ts` classifies land using broad latitude/longitude rectangles, and `HeroCanvas.tsx` adds a decorative icosahedron wireframe. Neither provides coastlines or country boundaries. No geographic boundary asset was found under `public/`. This is a concrete gap to address within V3-M2, with its own visual approval gate.

## 3. Five highest-impact improvements

| Priority | Improvement | Why it matters | Dependency |
| --- | --- | --- | --- |
| 1 | Distinct previews for the three featured projects | Changes the homepage and work grid from repeated initials to understandable software | Can start with existing authored capabilities; screenshots optional later |
| 2 | Destination → story → photos → film continuity | Makes the atlas useful beyond its visual appeal | Published story/media relationships; film matches must be verified |
| 3 | One complete, evidence-backed project case study | Gives developers substantive architecture and decision-making to inspect | Repository/source evidence and author-approved outcomes |
| 4 | Intentional photography and mobile compositions | Existing real images can add depth without new assets or effects | Browser crop review and intrinsic image metadata |
| 5 | Better About, writing and gear information hierarchy | Replaces sparse or generic sections with clear, credible detail | Existing content first; additional factual detail only when supplied |

Confirmed broken images or inaccessible controls found during baseline review take precedence over this visual ranking.

## 4. Shared design system: extend the existing one

Keep the current fonts and palette. Lime should signal actions, selection and the brand signature—not decorate every border. Preserve readable warm-white body copy and quiet metadata. Use existing travel/technical accent distinctions sparingly.

| Information | Existing foundation | V3 refinement |
| --- | --- | --- |
| Page introduction | `AtlasHeading`, `Section`, `MetaLabel` | Consistent index, eyebrow, title and optional action; preserve page-specific composition |
| Image / heading entrances | `MotionReveal` | A small set of restrained presets; content remains available with reduced motion and without JS |
| Project preview | `ProjectVisual`, `WorkProjectCard` | Screenshot, capability schematic or typography chosen by available evidence |
| Technical explanation | `CapabilityDiagram`, MDX component mapping | Accessible HTML/SVG diagrams with text summaries and evidence labels |
| Career milestones | `AboutSections.Timeline` | Visible chronology; optional details only when meaningful extra content exists |
| Photography | `PhotoGallery`, `TravelStoryLayout` | Intrinsic dimensions, per-image crop intent, useful captions, preserved lightbox behavior |
| Place selection | `TravelAtlas`, `TravelMapSection`, `HeroArt` | Shared destination identity and explicit story/media actions |
| Films / gear | Existing video components and category-based gear page | Editorial shelves and functional kit groups, not one universal card style |
| Search / forms | `GlobalSearch`, `ContactForm` | Preserve behavior; improve only verified usability gaps |

Do not extract a universal component just because two areas have a border. Reuse behavior and tokens; preserve content-specific shapes. New names below are proposals, not claims that files already exist.

## 5. Page-by-page experience plan

### Homepage — an introduction with things worth opening

**Keep:** headline, portrait/About link, Projects and Journeys as primary actions, existing renderer and static atlas.

**Refine:** replace the three repeated project previews; enrich the selected destination with the actual story title and available photograph; add a compact journey strip using existing published photo stories. Give the atlas a clear “Open story” action and, when available, “View photos.”

Selection updates the panel; it should not unexpectedly navigate while someone uses arrow keys in a select. Explicit activation opens the story. A place with multiple visits should expose them rather than silently choosing an arbitrary one. A pin with no story remains a pin with a clear explanation.

**Mobile:** copy and primary actions first; profile link next; globe and selector below. Keep native page scrolling over the globe. Journey cards stack or use ordinary scroll with obvious controls—no forced horizontal scroll sequence.

**Files:** `src/app/page.tsx`, `src/components/home/HomeOpening.tsx`, `HomeOpening.module.css`, `src/components/hero/HeroArt.tsx`; shared travel data only if required by the approved milestone. Do not rewrite `HeroCanvas` to add media panels.

#### Globe geography refinement — V3-M2a

**Objective:** the globe reads clearly as Earth, with recognizable coastlines and restrained country borders, while destination markers remain the strongest interaction cue. Preserve the existing Three.js/React Three Fiber renderer, automatic rotation, pause controls and shared destination records.

Visual hierarchy, from strongest to quietest:

1. Selected destination marker, distinguished by size/shape as well as color.
2. Recognizable continental silhouettes and coastlines in muted warm-white or pale lime.
3. Thin, lower-contrast country boundaries, readable at normal desktop size.
4. A sparse latitude/longitude grid and at most one quiet orbital accent if it helps the composition.

Reduce or remove the triangular icosahedron overlay and competing orbit rings after a before/after browser comparison. The screenshot's clustered destination markers also need size and occlusion review so they do not merge into a bright blob over India. Keep every recorded place available through the selector/list even if the visual marker treatment changes.

Implementation approach:

- Choose a geographically appropriate, licensed coastline and country-boundary dataset. Verify its source, version, attribution and treatment of disputed boundaries before use; do not hand-draw borders from the screenshot.
- Prepare a simplified local asset ahead of runtime. Separate coastlines and internal borders so they can have different visual weights; deduplicate shared border segments. Load the asset with the existing lazy globe rather than adding a geography request to initial page rendering.
- Project boundary coordinates using the same `latLngToVector3` convention as destination pins. Handle MultiPolygons, island rings, dateline crossings and long segments explicitly; avoid lines cutting through the sphere, stretched cross-world connections and coincident-surface flicker.
- Use reusable line geometry/materials with correct back-side occlusion and resource disposal. Do not add one React component per geographic vertex or a new WebGL library.
- Replace the rectangular land classification with a silhouette or land mask derived from the selected geography if dots remain. Increasing dot count alone cannot correct the geographic shape.
- Derive an appropriately simplified static poster from the same geographic source. Reduced-motion and failed-WebGL visitors should still recognize the continents and selected destination; phone-scale country detail can be reduced for legibility.
- Show country names only where useful, such as selected-place context. Avoid dense floating labels or presenting this stylized globe as a survey-grade boundary map.

Expected files: `src/components/hero/globe-utils.ts`, `HeroCanvas.tsx`, `HeroPoster.tsx`, relevant globe tests, and a proposed local boundary asset plus source/license note. Changes to `HeroArt.tsx` are limited to asset-loading/fallback coordination if needed. This scope does not change destination coordinates, story links or the travel-map provider.

Acceptance: review India/South Asia, Africa, Europe, the Americas and the dateline at several orientations; check the selected pin against both the globe and travel map. Coastlines must remain recognizable at 320/360/390px, with no page overflow. Inspect rotating and paused states for flicker, incorrect hidden-side lines and marker overlap. Verify keyboard controls, reduced motion, missing/corrupt geography data, WebGL fallback, offscreen/tab-hidden pausing, delivered asset size and frame cost against the baseline. Report remaining simplification limits rather than claiming every border is precise. Capture desktop/mobile screenshots and stop for approval before V3-M2b.

### Work index and project details — show the actual engineering

**Index:** retain filters and published/repository-only behavior. Give each featured project its own visual vocabulary:

- Shiprocket: an explicitly labelled capability schematic—WooCommerce orders, PHP integration, labels/tracking. Do not imply unverified request order, queues or infrastructure.
- Railway search: a name/code input-to-result concept, clearly labelled as an illustrative workflow until a genuine UI capture is available. Do not fabricate station data.
- LikhaEditor: embed/edit/document-model capability composition; use a genuine editor screenshot when provided, never a mock screenshot passed off as the product.

**Detail template:** problem and audience → role/scope → annotated preview → verified architecture or capability map → decisions/tradeoffs → limitations → evidenced outcomes → source/demo → related work. Omit unsupported sections rather than fill them with invented facts.

Expand one project first. Include repository file/commit evidence for technical topology. Outcomes may be qualitative; numerical claims need a dated source and method. On phones, diagrams become a vertical reading order with the same labels, not a tiny desktop canvas.

**Files:** `src/components/work/ProjectVisual.tsx`, `WorkProjectCard.tsx`, `CapabilityDiagram.tsx`, `WorkFilterGrid.tsx`; `src/lib/content/project-diagrams.ts`; `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx`; the approved project’s `content/work/*.mdx`.

### Travel index and journals — a connected, truthful atlas

Retain map and list alternatives. Add a photo-led view containing only destinations with real images; do not invent a photo for every pin. Keep selection and return links stable across views.

Enrich the existing destination panel with published visits, actual photos and verified film associations. Treat destination, visit, photo and film as separate records/relationships: one place can have several visits and one trip can include several places.

In journals, sequence text and photographs as chapters rather than moving every photo to a uniform final grid. Reuse the existing lightbox. Preserve author captions and distinguish a publication date from a trip date. Show a trip timeline only for documented events; a route profile requires an actual track or cited elevation data with units and provenance. Otherwise omit it.

Globe orbital decoration and the footer route are brand motifs, not records of travel. No connecting destination pins into an invented itinerary.

**Files:** `src/components/travel/TravelAtlas.tsx`, `TravelMap.tsx`, `TravelMapSection.tsx`, `TravelStoryLayout.tsx`; `src/components/content/PhotoGallery.tsx`; `src/lib/travel/merge-places.ts`, `destinations.ts`, `story-presentation.ts`; `src/app/field-notes/page.tsx`, `[slug]/page.tsx`; approved field-note records and `content/travel/places.json`.

### About — a documented personal story

Keep the current opening and portrait. Present the existing four milestones as a readable vertical chronology, with company/project links beside the relevant event. Expandable details are optional, not empty accordion shells. Confirm dates and claims before adding precision.

Group the six skills by their existing categories, with relevant project links where supported. Avoid percentage bars and invented proficiency scores. Give the gallery an intentional sequence and captions specific to the image; preserve the press-kit portrait download and contact action.

**Mobile:** chronology stays vertical; years and descriptions remain adjacent; any disclosure is operable by keyboard and touch.

**Files:** `src/app/about/page.tsx`, `src/components/about/AboutSections.tsx`, `content/about/timeline.json`, `skills.json`, `content/pages/about.mdx` and scoped styles.

### Writing, tags and archives — a useful notebook, not a padded library

Feature the one published essay strongly and keep field guides explicitly labelled as a separate collection. Introduce filters only when enough published content makes them useful. Do not publish the two draft essays to fill the page.

Refine reading width, heading rhythm, figure captions, table overflow and code controls. Reuse the existing contents list, progress and copy tools. Add diagrams or comparison tables only when the article’s argument calls for them. Validate tag and pagination routes, zero-result states and long titles.

**Files:** `src/app/writing/page.tsx`, `[slug]/page.tsx`, `tags/[tag]/page.tsx`, `page/[page]/page.tsx`; `GuideArticleLayout.tsx`, `ReadingProgress.tsx`, `CodeBlockCopy.tsx`, `PostExtras.tsx`; approved writing MDX.

### Videos and film details — curated viewing

Retain the featured release and actual thumbnails. Populate categories only after reviewing real video metadata and agreeing editorial groupings. Separate shorts from long-form films only when metadata supports that distinction; do not guess from a title or thumbnail alone.

Add explicit story links to matching film details. Plan durable metadata for curated videos if the recent-feed window cannot supply them. An unavailable film still needs an honest state and channel/watch link. Keep playback opt-in, avoid multiple active players and do not download full videos for previews.

**Files:** `src/app/videos/page.tsx`, `[videoId]/page.tsx`; `src/components/video/*`; `content/youtube/playlists.json`; `src/lib/youtube/rss.ts` only if a separately approved durability change is needed.

### Gear — explain a working kit

Organize around coding, capture and editing. Existing category icons are sufficient until the user adds photos. Add practical “used for / limitations / related guide” text only from confirmed information. A small workflow can explain coding offline or moving from capture to editing, without asserting unsupported equipment connections.

Keep “owned,” “previously used” and “recommended” distinct. Generic “Drone” or “Primary dev machine” is not permission to choose a model, weight, battery life or price. A checklist may be presented as a proposed planning checklist, not a claim about what Shiv packed on a particular journey. No storefront prices, ratings or unsupported affiliate endorsements.

**Files:** `src/app/gear/page.tsx`, `content/gear/items.json`; relevant guide links. Introduce a gear component only when the richer approved record structure requires it.

### Contact — clear, calm and reliable

Preserve the lightweight form, real email route, inquiry selector and truthful submission feedback. Refine helper text by inquiry type without hiding essential fields. Review error announcements, CAPTCHA focus/recovery, native validation without JS and the narrow-screen keyboard experience.

No auto-sending, invented response-time promise or claim of successful delivery from a local preview. Live delivery verification requires a separately authorized test submission; it is not part of visual QA.

**Files:** `src/app/contact/page.tsx`, `src/components/contact/ContactForm.tsx`, `src/lib/contact.ts`; inspect `netlify-form.ts` and its tests before any delivery-related change. Deployment configuration remains out of scope.

### Global navigation, footer and secondary states

Preserve the single-line desktop wordmark, two-line mobile treatment and completed sequence: wordmark settles by 1050ms, route draws at 1100–2100ms, terminal waypoint appears at 2100–2320ms. No new footer redesign is needed.

Audit active navigation, skip link, search dialog focus, mobile menu escape/return behavior, breadcrumbs and back links. Review removal of ambient looping orbs/header ping separately; do not silently change them as part of project-preview work.

Include `/work/page/[page]`, `/field-notes/page/[page]`, writing archives/tags, not-found, loading/error and empty states in review. Preserve canonical URLs, metadata, structured data, sitemap, robots, feed and unpublished-content exclusions.

**Files:** `SiteHeader.tsx`, `GlobalSearch.tsx`, `SiteFooter.tsx`, `FooterWordmark.tsx`/CSS, `BackgroundAmbient.tsx`, `src/lib/navigation.ts`, `src/app/globals.css`, `atlas.css`, applicable archive/error route files. Touch only those needed for an approved finding.

## 6. Motion contract

All durations below are proposed limits except the already implemented footer. Prefer CSS for simple state changes, existing Motion for coordinated UI changes and the current renderer for the globe. No new motion libraries.

| Interaction | Purpose / trigger | Timing | Touch and keyboard | Reduced motion / visibility / cost |
| --- | --- | --- | --- | --- |
| Globe | Explore destinations; autoplay while visible | Preserve existing slow rotation and pause control | Native scrolling; accessible turn/pause/select controls; explicit story link | Static poster for reduced motion or failed WebGL; pause offscreen/hidden; lazy renderer and capped DPR retained |
| Editorial reveal | Establish hierarchy on first viewport entry | 350–500ms ease-out, ≤12px movement; stagger ≤60ms | No hover requirement; never delays focus or reading | Immediate visible content for reduced motion/no JS; run once, no persistent loop; opacity/transform only |
| Destination panel | Explain selection change | 160–220ms ease-out | Same controls for touch/keyboard; announce selected title without moving focus unexpectedly | Instant swap under reduced motion; no autoplay carousel; reserve image space and defer unselected large media |
| Timeline disclosure | Reveal additional documented context | 180–240ms ease-out | Native details/button semantics; Enter/Space; retain chronological reading order | Instant open/close; only animate the interacted item; no scroll-linked scrub |
| Project diagram | Clarify one selected component | 150–200ms ease-out highlight | Tap/click/keyboard; plain-text equivalent; no hover-only explanation | Instant highlight; static HTML/SVG, no continuously animated particles or connectors |
| Gallery | Open and inspect a photograph | 150–200ms opacity | Buttons, Escape, arrows and focus restoration; swipe never the only control | Instant dialog under reduced motion; load full-size media on demand; no automatic slideshow |
| Video | Start intentionally chosen film | No decorative player entrance needed | Explicit play button; keyboard-operable player | No autoplay; do not keep background/offscreen media playing where controllable; disclose external-player limitations |
| Footer | Close the page with the established signature | Preserve current 2320ms total entrance | Real text; no interaction required | Static for reduced motion/no JS; once only; existing hover sweep remains single-pass |

Hidden-tab handling for one-shot entrances should settle the content or suspend the animation, not replay a whole scene when the user returns. Measure behavior before adding JS solely for animation housekeeping. Visible content and focus always take priority over the effect.

## 7. Content and asset contract

The user will supply new images later. Their absence must not block accurate text, layout, accessible controls or conceptual diagrams. It does block claims that genuine project screenshots or gear photography are complete.

For each new asset, record source/owner, usage permission, associated story/project, intrinsic dimensions, alt text, caption, crop/focal point and review status. Preserve source originals. Do not send personal images to a generation service without a separate request.

Proposed optional metadata should extend existing MDX/JSON and Zod schemas—not replace the content pipeline:

- Preview kind: screenshot, verified diagram, conceptual diagram or typographic fallback.
- Project evidence: repository revision/file references, outcome source and date.
- Photo: dimensions, caption and optional focal point.
- Visit: documented date or range, story slug, existing destination identity and approved media links.
- Gear: confirmed model, relationship (owned/used/recommended), practical notes and optional photo.

Use current destination IDs consistently; do not create a second coordinate registry. Treat changes to coordinate-based IDs as a migration requiring preserved existing `?place=` links. Elevation, track distance and trip costs need their own evidence; never derive plausible-looking figures from an illustrative line.

Missing-data behavior: omit unsupported statistics; use a meaningful text/diagram fallback; keep “no published story” distinct from “story without photos”; never expose author TODOs. New metrics, dates, publication flags and external associations require editorial approval.

## 8. Incremental delivery roadmap

Prefix milestones with **V3** so they cannot be confused with the earlier completed M1 work. Each milestone ends with a review and a stop; approval for one does not authorize the next.

Review clarification: the direction is accepted; this is refinement, not another redesign. Preserve the order **M0 → M1 → M2a → M2b → M3 → M4 → remaining milestones** unless a documented baseline defect requires an explicitly approved prerequisite. M2 is split because the supplied globe screenshot and source inspection exposed a concrete geography gap. The next round should collect browser evidence, not expand the plan again without a concrete finding. The supplied review recommends Astra with High reasoning for execution; that is an execution preference, not a model change performed by this document or permission to skip approval gates.

| Milestone | Scope and visible result | Gate / dependency |
| --- | --- | --- |
| V3-M0: baseline | Fresh desktop/mobile review of all page families; classify confirmed defects, asset gaps and content limitations; record performance and screenshots | Read-only except audit artifacts; any severe defect becomes a separately bounded fix |
| V3-M1: featured project identities | Replace the three homepage monogram previews with distinct, labelled, content-backed schematics; shared previews also improve work cards | Smallest recommended visible change; no new imagery needed; exact scope below |
| V3-M2a: globe geography | Add sourced coastlines and country boundaries; reduce competing wireframe decoration and refine marker legibility | Preserve renderer and destination coordinates; review geography, mobile, fallback and performance; stop for approval |
| V3-M2b: homepage / destination bridge | Enrich selected destination with verified story and photo links; add a small real-photo journey strip | Reuse shared data; explicit activation rather than surprise navigation; do not rewrite renderer |
| V3-M3: one complete case study | Upgrade one approved project detail with sourced explanation and evidence-backed visuals | Repository/source review and author approval of role, tradeoffs and outcomes |
| V3-M4: connected travel | Photo-led atlas alternative, journal chapter composition and verified film links; optional documented trip timeline | Media/visit evidence; no invented routes or elevation profiles |
| V3-M5: About | Better chronology, grouped skills, purposeful gallery and project context | Confirm additional biographical claims before publication |
| V3-M6a: writing | Refine index, reading and explanatory visuals for published content | Do not manufacture a larger library or publish drafts |
| V3-M6b: gear | Useful kit categories, confirmed notes and optional packing/workflow aids | Can ship without photos; exact models/specs stay gated |
| V3-M7a: videos | Curated shelves and story links with durable, verified metadata | Feed-window and unavailable-video behavior checked first |
| V3-M7b: contact / global polish | Resolve evidenced contact, nav, search and ambient-motion issues; preserve footer | No delivery, hosting or global redesign changes without separate approval |
| V3-M8: cross-site acceptance | Full responsive, accessibility, SEO, performance and regression report | All earlier scopes individually accepted; remaining content gaps explicit |

### Exact first implementation scope: V3-M1

**Objective:** a developer can distinguish the three featured tools by their visuals and purpose without reading three sets of initials.

**Visual identity, not new animation:** add no new entrance, hover, scroll or diagram animation in V3-M1. Preserve existing shared interaction behavior. Later motion must clarify information; the globe and footer already carry the signature motion.

At-a-glance art direction:

| Project | Distinct composition | Honesty requirement |
| --- | --- | --- |
| Shiprocket | An order/integration/fulfillment capability schematic with grouped labelled nodes | Visible “Capability schematic” label; no invented backend topology or operational statistics |
| Railway search | A search-led composition emphasizing name/code lookup and result structure | Visible “Search concept” label; no fake station results or claim that this is a product screenshot |
| LikhaEditor | A document-led composition emphasizing editing, embedding and document structure | Visible “Editor concept” label; not a fabricated capture of the real interface |

Review the three together at desktop card size and narrow-screen size. Different colors or initials alone do not satisfy distinctness: silhouette, information hierarchy and diagram structure must differ while sharing typography, spacing and border treatment. Descriptive text must remain understandable without color.

Before edits: verify Git status/commit, capture `/` and `/work` at desktop/mobile, inspect current rendered cards and record any unrelated changes. If a severe image or accessibility defect is confirmed, propose a narrowly scoped prerequisite fix rather than expanding V3-M1 silently.

Expected edit set:

- `src/components/work/ProjectVisual.tsx` — dispatch the three content-backed preview variants; preserve cover precedence and generic fallback for other projects.
- Proposed `src/components/work/ProjectPreview.module.css` — isolated layouts and responsive styles; no broad `atlas.css` rewrite.
- `src/lib/content/project-diagrams.ts` — only if existing capability labels need a reusable preview mapping; no new unsupported technical assertions.
- `e2e/site-atlas.spec.ts` or a focused new `e2e/project-previews.spec.ts` — preview semantics, links and bounds.

`WorkProjectCard.tsx` should change only if its existing interface cannot accommodate the preview. No content publication, homepage reorder, renderer changes, new external assets, dependency additions or deployment edits. Because `ProjectVisual` is shared, explicitly review the three corresponding detail routes as well as the index/homepage.

Acceptance:

- Three recognizably different compositions, each labelled honestly as a capability/concept view when not an actual screenshot.
- Existing project titles, primary links, filter results and repository-only behavior preserved.
- Text remains readable at 320/360/390px; no diagram requires horizontal page scrolling or hover to understand.
- Reduced-motion and no-JS output is useful; no new animation is added in this milestone.
- Before/after screenshots, relevant tests and production build pass; no unrelated diff.
- Stop for visual approval. Screenshots can replace conceptual previews later without restructuring the cards.

## 9. Verification and release gates

For each approved milestone, list exact routes/files, capture baseline, implement only that scope, run checks, inspect real browser results, report remaining issues and stop.

### Mandatory approval packet

Deliver actual desktop/mobile browser screenshots with route and viewport labels, a concise before/after summary, exact changed files, commands and pass/fail results, outstanding issues and a reproducible local review procedure. Explain any unavailable check instead of treating it as passed. For M0, supply the baseline and confirmed findings; there is no implementation diff to approve.

Stop after delivering this packet. Passing tests, favorable commentary or general approval of the direction does not authorize the next milestone; request explicit approval for that named scope. No automatic chaining, parallel implementation of later milestones or deployment.

### M2b continuity gate

After the separately reviewed globe-geography refinement, prioritize the globe-to-story connection over additional decorative effects. Review one documented visit with photos, one destination with multiple visits and one pin without a published story. Selection must expose the correct available content; explicit links open the story and its photo journal. Add a film only after verifying its relationship to the visit. Do not invent connections to fill an empty panel. Preserve shared destination IDs, return-to-atlas selection and keyboard/touch equivalence.

### Responsive and accessibility review

- Widths: 320, 360, 390, 768, 1024, 1440 and 1920px; check breakpoint boundaries when changing them. Include short landscape viewports and 200% zoom.
- Inspect actual text/element bounds, not only `scrollWidth`: global `overflow-x: hidden` must not conceal failures.
- Test long titles, empty filters, missing images, offline map tiles, unavailable video feed and content without photos.
- Keyboard: logical order, visible focus, skip link, menu/search/dialog Escape and focus return, atlas/list controls and form feedback.
- Aim for WCAG AA contrast and generous 44px touch controls; do not claim a completed accessibility audit from automation alone.
- Reduced motion, no JS and failed WebGL remain useful. No hidden text waiting forever for a reveal.

### Performance and content review

- Measure before/after in the same browser, device/network profile and production build; use repeated runs and report the median plus limitations.
- Provisional targets: LCP ≤2.5s, CLS ≤0.1, field INP ≤200ms where real field data exists. Lab interaction checks are not a substitute for field INP.
- Target no increase in route JS for static preview work. Flag >10% first-load JS or >15% lab LCP regression for investigation, not automatic acceptance.
- Reserve image space, use appropriate `sizes`, prioritize only true above-fold assets and lazy-load lower media. Source JPG size is not the same as delivered Next Image payload.
- Measure idle/offscreen globe behavior and mobile rendering, not just desktop FPS.
- Validate internal links, draft exclusion, canonicals, structured data and date meanings. Avoid attaching specific films to trips without evidence.

### Commands and protection boundaries

Run from `site/` as relevant: `npm run validate:content`, `npm run typecheck`, `npm test`, `npm run build`, then Playwright against that production build. Existing suites include `home-m1`, `footer-wordmark`, `site-atlas` and `smoke`; preserve and extend them instead of replacing their assertions.

Protect existing URLs, content publication decisions, root GitHub profile `README.md`, `.github/workflows/update-badges.yml`, current content ingestion and deployment configuration. A local visual review does not authorize publishing, pushing commits, submitting live forms or changing hosting.

## 10. Completion criteria and next decision

“V3 complete” requires accepted visual evidence for every page family, passing current checks, a clear asset handoff and no unresolved critical responsive/accessibility defects. Missing personal images or unverified outcomes must be listed as pending content—not described as finished and not replaced with fabricated material.

**Recommended approval:** V3-M0 baseline review, followed by the bounded V3-M1 featured-project preview task. Nothing in this roadmap authorizes immediate implementation. Keep the footer and established visual language; earn the next improvement through real content, specific visuals and careful review.
