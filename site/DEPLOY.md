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

3. **Environment variables**

   - Production (`main`): `SITE_ENV=production` (optional; default indexable when `CONTEXT=production`).
   - Preview/PR deploys: Netlify sets `CONTEXT=deploy-preview` - site emits **noindex** and `robots.txt` disallow.

4. After any config change: **Deploys → Trigger deploy → Clear cache and deploy site**.

5. **Custom domain**

   - Primary: **`www.nomadprogrammer.in`**
   - Also add apex `nomadprogrammer.in`; redirect apex → **www** in Netlify domain settings.
   - Enable HTTPS on both.

6. **Rollback**: Netlify → Deploys → select previous production deploy → **Publish deploy**.

## Google Search Console (Phase 6)

1. Verify property for `https://www.nomadprogrammer.in` (DNS TXT or HTML file).
2. Submit sitemap: `https://www.nomadprogrammer.in/sitemap.xml`.
3. Validate rich results for `Person` (layout) and `Article` (writing / field-notes) in Search Console.

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
