import type { Metadata } from "next";
import { shouldAllowIndexing, siteUrl } from "@/lib/env";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_DESCRIPTION,
  TWITTER_HANDLE,
} from "@/lib/seo/site-config";
import type { BaseFrontmatter } from "@/lib/validation/schemas";

const defaultRobots = (): Metadata["robots"] =>
  shouldAllowIndexing()
    ? { index: true, follow: true }
    : { index: false, follow: false };

const twitterDefaults = {
  card: "summary_large_image" as const,
  site: TWITTER_HANDLE,
  creator: TWITTER_HANDLE,
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nomad Programmer – Shiv Singh | Tech by Profession, Traveler by Soul",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  robots: defaultRobots(),
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: "Nomad Programmer – Shiv Singh | Tech by Profession, Traveler by Soul",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    ...twitterDefaults,
    title: "Nomad Programmer – Shiv Singh",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

export function indexPageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  return {
    title,
    description,
    alternates: { canonical },
    robots: defaultRobots(),
    openGraph: {
      title,
      description,
      url: canonical,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      ...twitterDefaults,
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function entryMetadata(
  entry: BaseFrontmatter,
  pathPrefix: string,
): Metadata {
  const canonical = `${pathPrefix}/${entry.slug}`;
  const og = entry.ogImage ?? DEFAULT_OG_IMAGE;
  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical },
    robots: defaultRobots(),
    openGraph: {
      title: entry.title,
      description: entry.summary,
      url: canonical,
      images: [og],
    },
    twitter: {
      ...twitterDefaults,
      title: entry.title,
      description: entry.summary,
      images: [og],
    },
  };
}
