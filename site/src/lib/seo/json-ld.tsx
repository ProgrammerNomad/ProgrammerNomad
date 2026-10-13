import { siteUrl } from "@/lib/env";
import {
  ADDRESS,
  AUTHOR_NAME,
  CONTACT_EMAIL,
  DEFAULT_OG_IMAGE,
  ORGANIZATION,
  SAME_AS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/seo/site-config";
import type { BaseFrontmatter } from "@/lib/validation/schemas";
import type { YouTubeVideo } from "@/lib/youtube/rss";

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR_NAME,
    alternateName: SITE_NAME,
    url: `${siteUrl}/`,
    image: `${siteUrl}${DEFAULT_OG_IMAGE}`,
    description: SITE_TAGLINE,
    jobTitle: ORGANIZATION.jobTitle,
    worksFor: {
      "@type": "Organization",
      name: ORGANIZATION.name,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: ADDRESS.locality,
      addressCountry: ADDRESS.country,
    },
    email: `mailto:${CONTACT_EMAIL}`,
    sameAs: [...SAME_AS],
  };
  return <JsonLdScript data={data} />;
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${siteUrl}/`,
    description: SITE_DESCRIPTION,
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
      alternateName: SITE_NAME,
    },
  };
  return <JsonLdScript data={data} />;
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
  return <JsonLdScript data={data} />;
}

export function BlogPostingJsonLd({
  entry,
  pathPrefix,
}: {
  entry: BaseFrontmatter;
  pathPrefix: string;
}) {
  const url = `${siteUrl}${pathPrefix}/${entry.slug}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: entry.title,
    description: entry.summary,
    datePublished: entry.date,
    dateModified: entry.updatedAt ?? entry.date,
    url,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: `${siteUrl}/`,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    mainEntityOfPage: url,
  };
  return <JsonLdScript data={data} />;
}

export function ArticleJsonLd(props: {
  entry: BaseFrontmatter;
  pathPrefix: string;
}) {
  return <BlogPostingJsonLd {...props} />;
}

export function VideoObjectJsonLd({ video }: { video: YouTubeVideo }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.publishedAt,
    embedUrl: `https://www.youtube.com/embed/${video.id}`,
    contentUrl: video.watchUrl,
  };
  return <JsonLdScript data={data} />;
}
