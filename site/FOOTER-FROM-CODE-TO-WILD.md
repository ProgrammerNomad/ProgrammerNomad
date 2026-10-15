# Footer — From Code to Wild

Local refinement of baseline commit `853ee8e`. Existing footer navigation, social/contact links and copyright are unchanged. No routes, content pipelines, dependencies or deployment configuration changed.

## Delivered

- Real HTML Syne wordmark: single-line desktop, intentionally stacked below 700px.
- Once-only clipped lettering entrance with a restrained light sweep.
- Custom SVG scene: code brackets and AI/ML nodes become mountains, pine trees, campsite, water/bridge and an adventure motorcycle.
- Motorcycle refined from the author's [Yezdi Adventure reference](https://www.bikedekho.com/yezdi-motorcycles/adventure#gallery): an original monochrome side-profile illustration with tall screen, front beak, stepped seat, tank, engine/crash bars and larger front wheel. Reference photographs are not copied or shipped as assets; the stylized illustration does not claim an exact model-year/accessory match.
- Drawn lime route, sequenced scene reveals, one water ripple, short motorcycle arrival and final waypoint. Approximately four seconds, no continuous animation.
- Keyboard-operable replay; focus stays on the button when the scene restarts.
- Separate simplified mobile illustration, full static no-JS and reduced-motion output. Decorative graphics are hidden from assistive technology; meaningful links remain unchanged.

The scene is symbolic, not a map, surveyed route or personal trip record. SVG/HTML/CSS use the existing stack, without WebGL, new libraries, heavy filters or remote assets. The wordmark remains the dominant element.

## Changed files

- `src/components/layout/FooterWordmark.tsx`: entrance/replay coordination and scene integration.
- `src/components/layout/FooterWordmark.module.css`: responsive illustration, lettering and motion styles.
- `src/components/layout/FooterLandscape.tsx`: custom desktop/mobile vector artwork.
- `e2e/footer-wordmark.spec.ts`: existing typography/navigation checks retained; landscape timing and keyboard replay checks added.
- This review document.

## Local review

From `D:/Websites/ProgrammerNomad/site`, run `npm run start -- --hostname 127.0.0.1 --port 3000`, open http://127.0.0.1:3000/ and scroll to the bottom. Watch the entrance, use “Replay the journey,” then test with reduced motion enabled. Repeat at 320/390px and desktop width. The task-owned preview server is stopped at handoff.

Checks and final screenshot paths are recorded below after visual verification. Browser evidence is Chromium/in-app-browser QA, not a comprehensive accessibility audit or physical-device/Safari/Firefox certification. No deployment or Git commit performed.

## Verification results

- Production build/type validation passed, 77 generated pages; 39 unit tests passed.
- Full serial browser suite: 52 passed, one optional performance benchmark skipped (`test-results/footer-wild`).
- After the final Yezdi silhouette revision: production build passed and all 13 footer checks passed (`test-results/footer-yezdi-final`).
- Font/layout checks: 320, 360, 390, 699, 700, 768, 1024, 1440 and 1920px; real Syne font, one/two-line composition and retained footer/email links.
- One-shot timing, route endpoint, finished animation states, keyboard replay/focus, reduced motion and no-JS fallback tested. An intermediate replay check timed out at five seconds under load; completion polling now allows eight seconds while still asserting finished states and one iteration (the design timing remains approximately four seconds).
- Real in-app browser review at 1440×1000 and 390×844; `git diff --check` passed.

Saved desktop/mobile previews and bike close-up: `C:/Users/shivs/.codex/visualizations/2026/10/13/01a13577-9154-7f52-87be-3123ed65c8b3/v3-review/footer-code-to-wild-desktop.png`, `footer-code-to-wild-mobile.png` and `footer-yezdi-detail.png` in that same folder.
