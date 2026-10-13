import { getAllEntries } from "@/lib/content/loader";
import { siteUrl } from "@/lib/env";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const posts = await getAllEntries("writing");
  const items = posts
    .map((post) => {
      const url = `${siteUrl}/writing/${post.frontmatter.slug}`;
      return `<item>
  <title>${escapeXml(post.frontmatter.title)}</title>
  <link>${url}</link>
  <guid>${url}</guid>
  <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
  <description>${escapeXml(post.frontmatter.summary)}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Nomad Programmer - Writing</title>
  <link>${siteUrl}/writing</link>
  <description>Articles and long-form writing by Shiv Singh.</description>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
