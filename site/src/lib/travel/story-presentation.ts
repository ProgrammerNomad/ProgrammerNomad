export function recordedFact(value?: string): string | undefined {
  return value && !/\bTODO\b/i.test(value) ? value : undefined;
}

/** Presentation only. Source MDX, drafts and publishing decisions stay untouched. */
export function prepareTravelStory(body: string) {
  const photos: { src: string; alt: string; caption?: string }[] = [];
  let text = body.replace(
    /<Figure\b([^]*?)\/>/g,
    (full, attributes: string) => {
      const attribute = (name: string) =>
        attributes.match(new RegExp(`${name}="([^"]*)"`))?.[1];
      const src = attribute("src");
      if (!src || src.includes("placeholder")) return "";
      photos.push({
        src,
        alt: attribute("alt") ?? "Travel photograph",
        caption: attribute("caption"),
      });
      return "";
    },
  );
  text = text.replace(/^TODO[^\n]*$/gm, "");
  // Remove headings whose only content was an unfinished note or a moved photo.
  text = text
    .split(/(?=^#{2,3} )/m)
    .filter((section) => !/^#{2,3} [^\n]+\s*$/.test(section))
    .join("");
  return { body: text.trim(), photos };
}
