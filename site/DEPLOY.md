# NomadProgrammer.in - deployment & launch

## Netlify (primary)

1. Import the **ProgrammerNomad** GitHub repository in [Netlify](https://app.netlify.com).
2. **Build settings** are defined in the repo root [`netlify.toml`](../netlify.toml) (`base = "site"`, `npm run build`, `@netlify/plugin-nextjs`, Node 20). After connect, confirm UI shows **Base directory** `site` and **Publish** is handled by the Next.js plugin (do not set publish to `.next` manually).
3. After changing config, use **Deploys → Trigger deploy → Clear cache and deploy site**.
4. **Environment variables**
   - Production (`main`): `SITE_ENV=production` (optional; default indexable when `CONTEXT=production`).
   - Preview/PR deploys: Netlify sets `CONTEXT=deploy-preview` - site emits **noindex** and `robots.txt` disallow.
5. **Custom domain**
   - Add `nomadprogrammer.in` and `www.nomadprogrammer.in`.
   - Enable HTTPS; set apex as primary and redirect `www` → apex (or vice versa - pick one canonical).
6. **Rollback**: Netlify → Deploys → select previous production deploy → **Publish deploy**.

## Google Search Console (Phase 6)

1. Verify property for `https://nomadprogrammer.in` (DNS TXT or HTML file).
2. Submit sitemap: `https://nomadprogrammer.in/sitemap.xml`.
3. Validate rich results for `Person` (layout) and `Article` (writing / field-notes) in Search Console.

## Pre-launch checks

- [ ] Production `<meta name="robots">` allows index; preview shows **noindex**.
- [ ] `/robots.txt` allows crawl on production only.
- [ ] Draft slug `/work/domain-data-platform` returns **404** on production build.
- [ ] RSS: `/writing/feed.xml` returns 200 on Netlify.
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
