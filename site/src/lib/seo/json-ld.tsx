import { siteUrl } from "@/lib/env";
import type { BaseFrontmatter } from "@/lib/validation/schemas";

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Shiv Singh",
    url: siteUrl,
    sameAs: [
      "https://github.com/ProgrammerNomad",
      "https://www.linkedin.com/in/programmernomad/",
      "https://twitter.com/programmernomad",
    ],
    jobTitle: "Software Engineer and Architect",
    email: "mailto:shiv@srapsware.com",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({
  entry,
  pathPrefix,
}: {
  entry: BaseFrontmatter;
  pathPrefix: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.summary,
    datePublished: entry.date,
    dateModified: entry.updatedAt ?? entry.date,
    url: `${siteUrl}${pathPrefix}/${entry.slug}`,
    author: {
      "@type": "Person",
      name: "Shiv Singh",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
