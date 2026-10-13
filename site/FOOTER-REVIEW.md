# Living Wordmark — scoped review

Starting point: clean Git working tree at `364979d` (`Refactor layout components and enhance accessibility features`).

## Delivered

- Full-width closing wordmark in the existing Syne font, warm-white on black, with a thin lime route and two destination markers.
- Real HTML text: one line from 700px upward; two balanced lines below 700px. Sizing was adjusted against the loaded font in a real browser, not estimated from character count.
- A one-time clipping-mask entrance, followed by the route drawing. Hover sends a single light sweep across the two words; it does not loop. No new animation dependencies or WebGL were added to the footer.
- Reduced-motion users get static text and route. The text is visible without JavaScript or IntersectionObserver. Existing navigation, social links, email and copyright remain intact.
- The existing homepage globe now rotates automatically when motion is allowed. Pause, manual turn, destination selection, offscreen/tab-hidden suspension, and static WebGL-failure fallback are retained. Reduced motion still skips WebGL.
- The entire homepage portrait/name signature links to `/about`, with an arrow, hover treatment, and existing visible keyboard focus styling.

## Changed files

- `src/components/layout/FooterWordmark.tsx` — isolated one-time entrance observer and real text / route markup.
- `src/components/layout/FooterWordmark.module.css` — scoped typography, responsive sizing, reveal, route, hover and accessibility styles.
- `src/components/layout/SiteFooter.tsx` — retained footer content, quieter hierarchy, wordmark integration.
- `src/components/hero/HeroArt.tsx` — default rotation follows the motion preference.
- `src/components/home/HomeOpening.tsx` — portrait/name About link.
- `src/components/home/HomeOpening.module.css` — link fit, arrow, hover and focus treatment.
- `e2e/footer-wordmark.spec.ts` — 12 new browser checks.
- `e2e/home-m1.spec.ts` — updated two initial globe-control expectations for autoplay.
- `FOOTER-REVIEW.md` — this handoff.

No unrelated page content, renderer, destination data, content pipeline, dependency, route, or deployment configuration was changed.

## Verification

- `npm run typecheck` — passed.
- `npm test` — 22 tests passed (rerun with the required Windows filesystem permission after the sandbox blocked Vitest's module resolution).
- `npm run build` — passed, 77 pages generated; homepage first-load JS remains approximately 118 kB.
- `npx playwright test --workers=2` against the production server — 45 tests passed.
- Loaded-font bounds checked at 320, 360, 390, 699, 700, 768, 1024, 1440 and 1920px, including both sides of the line-break breakpoint.
- Tested one-time entrance/no scroll replay, finished hover sweep, runtime reduced-motion change, no-JS rendering, preserved footer links, keyboard and portrait-click About navigation, globe autoplay/pause and fallback.
- Existing all-page-family responsive, route, search, gallery, filters, video and contact regression checks passed.
- Real in-app browser visual review at 320px (development), and 390px, 768px and 1440px (production). Manually followed the signature link to About; verified the live atlas reports rotating without pressing Play.
- `git diff --check` — passed.

No known outstanding issues in this scope. Safari/Firefox and physical-device testing were not performed. Nothing was deployed and the agent did not create a commit. During final verification, commit `8775a35` appeared containing the main changes; it was preserved. A final route-stroke scaling correction, its regression assertion, and this review note were made afterward.

## Review locally

The task-owned preview server was stopped after verification. From PowerShell:

```powershell
Set-Location D:\Websites\ProgrammerNomad\site
npm run start -- --hostname 127.0.0.1 --port 3000
```

1. Open `http://127.0.0.1:3000/` and confirm the globe begins rotating when reduced motion is off and WebGL is available.
2. Pause it, then use the keyboard turn controls or destination selector.
3. Click the portrait/name card (or focus it with Tab and press Enter): it opens About.
4. Reload and scroll to the footer: watch the one-time reveal and route draw. Scroll away/back: it stays static. Hover the wordmark: one sweep, no looping.
5. Review at 320, 360, 390, 768 and 1440px. Enable reduced motion and reload: the footer is immediately visible and static, and the globe uses its static atlas.

Saved screenshots are in the task's visualization `site-review` folder: `footer-desktop.jpg`, `footer-mobile-390.jpg`, and `footer-tablet-768.jpg`. Automated PNGs are under ignored `test-results`.
