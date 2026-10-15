# Updating your V3 content

## Life timeline

Edit `content/about/life-events.json`. The six personal chapters are based on the events you named: birth in Chitrakoot, BTech, MTech, Australia, return to Delhi and marriage. Dates are deliberately unspecified, as requested while you prepare the real details. No example year is presented as a fact.

Each record supports:

- `id`: stable, unique identifier.
- `title`: the public event heading.
- `year`: optional public year/date text. Add it when confirmed; leave the field absent until then.
- `place`: public location or a short category such as Education.
- `description`: the details you want visitors to read. Add college names, course details or a personal memory here.
- `kind`: `birth`, `education`, `move`, `return`, `marriage`, `code`, `business`, `film` or `leadership`; this selects the icon.
- `chapter`: groups the events; personal events currently use `Life, beyond the keyboard`.
- `href`: optional link to a relevant published project, journey or external organization.

Array order controls the order within each chapter. Move a record when you confirm the real chronology. The UI does not calculate age, event duration or years abroad from missing dates. Do not add private family details you do not want public.

The four pre-existing career milestones remain in `content/about/timeline.json`. Their dates were retained from the existing authored content. Update that file when correcting career history.

## Photographs and gear

Add genuine images under `public/images/`. For gear, set an item's optional `image` in `content/gear/items.json` to the public path. Keep model names/specifications factual; the current general equipment labels are retained.

For travel, existing MDX `<Figure>` records feed the photo journal. Placeholder figures are excluded from both the gallery and photo counts. A real cover plus real figures makes a visit eligible for the photo atlas. Do not place a photograph from another journey under an unrelated destination.

After adding/replacing local JPG, PNG or WebP files, run `node scripts/prepare-media.mjs` from `site/` to refresh intrinsic dimensions. Review the image crop on desktop and mobile. Original files remain unchanged.

## Project previews

The three featured projects have visibly labelled conceptual/capability previews. To replace one with a real screenshot, add the file and change the project's `cover` from `default.svg` to that path. A genuine cover takes precedence over the generated preview. Review screenshots for exposed customer data, credentials and personal information before adding them.

## Film library and trip links

`content/youtube/catalog.json` retains actual video metadata captured from the existing channel on 15 October 2026. Recent RSS/API results take precedence; the snapshot keeps existing film links usable after they leave the recent feed or when fetching fails. It does not guarantee a video remains playable on YouTube.

`content/youtube/playlists.json` contains editorial shelves based on actual titles/hashtags. These are discovery categories, not proof a film belongs to a dated visit. The current field-note sources contain no explicit video relationships, so none was fabricated.

When a film is confirmed to belong to a specific journal, add `youtubeVideoId` to that field-note frontmatter. The atlas and story template already render the connection, and the video detail page links back to matching journals. Recheck the film, its date/context and the story before assigning it.

The optional `node scripts/prepare-video-catalog.mjs` tool snapshots metadata from a running local `/videos` preview. Review its output before committing it. It is not automatically added to the deployment/content pipeline.

## Globe data

Geographic source, revision, simplification and license are recorded in `src/lib/travel/data/SOURCE.md`. Run `node scripts/prepare-globe.mjs` only to regenerate that geographic asset. Recorded personal destinations still come from the existing travel content; do not alter the country dataset to add visits or infer routes.

## Review commands

From `site/`: `npm run validate:content`, `npm run typecheck`, `npm test`, `npm run build`, then the Playwright checks against the production server. Inspect the actual images, text and links at 320px and desktop sizes before publishing content changes.
