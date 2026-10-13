export type SearchRecord = {
  title: string;
  href: string;
  kind: string;
  summary: string;
  tags: string[];
};

export function searchRecords(
  records: SearchRecord[],
  query: string,
  kind = "All",
) {
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return records
    .filter(
      (record) =>
        (kind === "All" || record.kind === kind) &&
        words.every((word) =>
          `${record.title} ${record.summary} ${record.tags.join(" ")}`
            .toLocaleLowerCase()
            .includes(word),
        ),
    )
    .sort(
      (a, b) =>
        Number(b.title.toLowerCase().includes(query.toLowerCase().trim())) -
        Number(a.title.toLowerCase().includes(query.toLowerCase().trim())),
    );
}
