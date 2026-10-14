# NomadProgrammer.in - deployment & launch

## Netlify (primary)

1. Import the **ProgrammerNomad** GitHub repository in [Netlify](https://app.netlify.com).
2. **Which `netlify.toml` applies**
   - **UI Base directory empty:** repo root [`netlify.toml`](../netlify.toml) (`base = "site"`, `npm run build`, plugin, Node 20).
   - **UI Base directory = `site`:** Netlify reads [`site/netlify.toml`](netlify.toml) (not the root file). Keep build/plugin settings there.

### Publish directory (required for `@netlify/plugin-nextjs`)

Publish must **not** equal Base (`site`). If the UI has Publish = `site`, the plugin fails after a successful `npm run build`:

`Your publish directory cannot be the same as the base directory of your site.`

**Fix in repo (overrides UI):** [`site/netlify.toml`](netlify.toml) sets `publish = ".next"` (relative to base → `site/.next`). After push, the deploy log should show `publishOrigin: config` and publish ending in `.next`.

**Fix in Netlify UI (recommended in addition):**

1. **Site configuration → Build & deploy → Build settings → Edit settings**
2. **Base directory:** `site` (or empty if you rely only on root `netlify.toml`)
3. **Publish directory:** **blank** (remove `site`, `.`, and `.next`)
4. **Build command:** `npm run build`
5. Save → **Deploys → Trigger deploy → Clear cache and deploy site**

**Verify in the deploy log (Resolved config):**

- `publish` must **not** equal `base` (`publish: .../site/.next` with `publishOrigin: config` is OK).
- `(build.command completed in …)` then **Plugin "@netlify/plugin-nextjs"** succeeds (no exit code 2).

3. **Environment variables** (see [`.env.example`](.env.example))

   | Variable | Purpose |
   |----------|---------|
   | `SITE_ENV` | `production` on main (optional if `CONTEXT=production`) |
   | `YOUTUBE_CHANNEL_ID` | Channel ID for RSS (defaults in code to @NomadProgrammer if unset) |
   | `YOUTUBE_API_KEY` | **Recommended** — Data API fallback when RSS fails; also home video count |
   | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible analytics |
   | `NEWSLETTER_EMBED_URL` | iframe URL for contact page newsletter |

   - Preview/PR deploys: Netlify sets `CONTEXT=deploy-preview` - site emits **noindex** and `robots.txt` disallow.

   **Netlify Forms (AJAX on `/contact`):** Follow [Netlify Forms setup](https://docs.netlify.com/manage/forms/setup/) and the [OpenNext forms workaround](https://opennext.js.org/netlify/forms).

   1. Netlify UI → **Forms** → **Enable form detection** (or **Forms → Form detection → Enable** if it was disabled).
   2. Redeploy after any change to [`public/__forms.html`](public/__forms.html) or [`ContactForm`](src/components/contact/ContactForm.tsx) field names.
   3. Confirm **Forms → collab** appears after deploy; test submit from live `/contact` (check **Spam** tab if missing).
   4. Optional: **Forms → Submission notifications** for email/webhook alerts.

   Implementation notes:

   - Deploy-time blueprint: [`public/__forms.html`](public/__forms.html) (hidden `form-name`, matching field names, honeypot, reCAPTCHA div).
   - Client POST: `POST /__forms.html` with `Content-Type: application/x-www-form-urlencoded` and body from `FormData` via [`src/lib/netlify-form.ts`](src/lib/netlify-form.ts) (not JSON).
   - Local `npm run dev` does not submit (`NETLIFY` unset); production uses `NETLIFY=true`.

   **reCAPTCHA (Netlify-managed, default):** Per [spam filters](https://docs.netlify.com/manage/forms/spam-filters/) — `data-netlify-recaptcha="true"` on the form plus an empty widget `div` in the blueprint and live form. No Google keys in the repo; Netlify injects the widget on the published site.

   **reCAPTCHA (your own Google v2 keys, optional):** [Google reCAPTCHA Admin](https://www.google.com/admin/recaptcha) → Netlify env:

   | Variable | Scope | Purpose |
   |----------|--------|---------|
   | `SITE_RECAPTCHA_KEY` | Builds + Runtime | Site key |
   | `SITE_RECAPTCHA_SECRET` | Runtime only | Secret for Netlify validation |

   Troubleshooting: [Forms troubleshooting](https://docs.netlify.com/manage/forms/troubleshooting-tips/).

4. After any config change: **Deploys → Trigger deploy → Clear cache and deploy site**.

5. **Custom domain**

   - Primary: **`www.nomadprogrammer.in`**
   - Also add apex `nomadprogrammer.in`; redirect apex → **www** in Netlify domain settings.
   - Enable HTTPS on both.

6. **Rollback**: Netlify → Deploys → select previous production deploy → **Publish deploy**.

## Google Search Console (Phase 6)

1. Verify property for `https://www.nomadprogrammer.in` (DNS TXT or HTML file).
2. Submit sitemap: `https://www.nomadprogrammer.in/sitemap.xml`.
3. Validate rich results for `Person`, `WebSite`, `BlogPosting`, and `VideoObject` in Search Console.

## Off-site SEO backlinks

- GitHub profile → Website: `https://www.nomadprogrammer.in`
- YouTube channel About link → same URL
- Instagram bio → same URL
- Google Business / profile → same URL

## Content stats fallback

If `YOUTUBE_API_KEY` is unset, set verified counts in [`content/stats.json`](content/stats.json) (`youtubeVideoCount`). GitHub repo count is fetched at build from the public API.

## Pre-launch checks

- [ ] Publish directory empty in Netlify UI; plugin step green on latest deploy.
- [ ] Production `<meta name="robots">` allows index; preview shows **noindex**.
- [ ] `/robots.txt` allows crawl on production only.
- [ ] `https://www.nomadprogrammer.in/` → 200.
- [ ] Draft slug `/work/domain-data-platform` returns **404** on production.
- [ ] RSS: `/writing/feed.xml` returns 200.
- [ ] CI green: `site-ci.yml` (lint → typecheck → validate → test → build).

## Local production smoke

```bash
cd site
npm ci
npm run validate:content
npm run test
SITE_ENV=production npm run build
npm run start
```

On Windows PowerShell: `$env:SITE_ENV='production'; npm run build`
