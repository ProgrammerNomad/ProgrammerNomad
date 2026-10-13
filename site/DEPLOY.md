# NomadProgrammer.in - deployment & launch

## Netlify (primary)

1. Import the **ProgrammerNomad** GitHub repository in [Netlify](https://app.netlify.com).
2. Set **Base directory** to `site` (or rely on repo `site/netlify.toml`).
3. Build command: `npm run build` · Publish: handled by `@netlify/plugin-nextjs`.
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
