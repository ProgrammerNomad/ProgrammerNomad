// Optional editorial snapshot. Keeps already-reviewed film links available beyond RSS's window.
import fs from "node:fs/promises";
const response = await fetch("http://127.0.0.1:3000/videos");
if (!response.ok) throw new Error(`Local video library: ${response.status}`);
const html = await response.text();
const ids = [
  ...new Set([...html.matchAll(/href="\/videos\/([\w-]+)"/g)].map((m) => m[1])),
];
const videos = [];
for (const id of ids) {
  const page = await (await fetch(`http://127.0.0.1:3000/videos/${id}`)).text();
  const match = page
    .match(/<script type="application\/ld\+json">([^]*?)<\/script>/g)
    ?.find((s) => s.includes("VideoObject"));
  if (!match) continue;
  const metadata = JSON.parse(
    match.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, ""),
  );
  if (metadata["@type"] !== "VideoObject") continue;
  videos.push({
    id,
    title: metadata.name,
    description: metadata.description ?? "",
    publishedAt: metadata.uploadDate,
    thumbnailUrl: Array.isArray(metadata.thumbnailUrl)
      ? metadata.thumbnailUrl[0]
      : metadata.thumbnailUrl,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
  });
}
if (!videos.length) throw new Error("No verified video metadata found");
await fs.writeFile(
  "content/youtube/catalog.json",
  JSON.stringify({ capturedAt: new Date().toISOString(), videos }, null, 2) +
    "\n",
);
console.log(JSON.stringify(videos.map(({ id, title }) => ({ id, title }))));
