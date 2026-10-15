import fs from "node:fs/promises";
import sharp from "sharp";
const files = (await fs.readdir("public/images", { recursive: true })).filter(
  (p) => /\.(jpg|png|webp)$/i.test(p),
);
const entries = await Promise.all(
  files.map(async (file) => {
    const { width, height } = await sharp(`public/images/${file}`).metadata();
    return [`/images/${file.replaceAll("\\", "/")}`, { width, height }];
  }),
);
await fs.writeFile(
  "src/lib/travel/data/media-dimensions.json",
  JSON.stringify(Object.fromEntries(entries)),
);
console.log(`Recorded dimensions for ${entries.length} images`);
