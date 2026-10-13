# Nomad Programmer - site (`site/`)

Next.js App Router portfolio for [www.nomadprogrammer.in](https://www.nomadprogrammer.in). Content lives in `content/` as MDX; the GitHub profile README and badge automation stay at the **repository root**.

## Stack

- Next.js 15 (Netlify adapter, not static export)
- MDX via **next-mdx-remote/rsc** with a fixed component map (`src/components/mdx/MdxComponents.tsx`)
- Zod frontmatter + `scripts/validate-content.ts` (AST allowlist via remark-mdx)

## Content pipeline

1. Add or edit `content/{work|writing|field-notes|pages}/*.mdx`.
2. Use ISO dates `YYYY-MM-DD` in frontmatter.
3. Set `published: true` only when ready; drafts are omitted from indexes, sitemap, RSS, and `generateStaticParams`.
4. Direct URLs to draft slugs return **404** in production builds.
5. Allowed MDX components: `Callout`, `Figure`, `CodeBlock`, `Video`, `LinkCard`, `ArchitectureDiagram`, `YouTubeEmbed`.
6. **Travel trips** (`content/field-notes/`): set `geo` for map pins; add photos under `public/images/travel/{slug}/`. Keep `content/travel/places.json` in sync for supplemental map markers. Published trip image paths are checked by `validate:content` (placeholder SVG is always allowed).

## Commands

```bash
npm ci
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run validate:content
npm run test
npm run build
npm run test:e2e     # requires build + start (see playwright.config.ts)
```

On **Windows**, if this folder is a junction (e.g. `C:\xampp\...\site` → `D:\Websites\...\site`), use `npm run dev` / `npm run build` only - they run via `scripts/next-cli.cjs` so Next’s cwd matches the real path. Avoid raw `npx next dev` from the junction. If paths look wrong, delete `site/.next` and stop stray Node processes on port 3000.

## Preview vs production indexing

- **Production**: `CONTEXT=production` (Netlify) or unset `SITE_ENV` → indexable.
- **Preview**: `CONTEXT=deploy-preview` or `SITE_ENV=preview` → `noindex`, `robots.txt` disallow.

See [DEPLOY.md](./DEPLOY.md) for Netlify domain and Search Console steps.
