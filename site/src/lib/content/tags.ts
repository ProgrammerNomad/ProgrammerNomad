export function tagToParam(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-");
}

export function matchTagFromParam(param: string, tags: string[]): string | undefined {
  return tags.find((t) => tagToParam(t) === param);
}
