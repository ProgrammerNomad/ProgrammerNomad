import type { Metadata } from "next";
import { shouldAllowIndexing, siteUrl } from "@/lib/env";
import type { BaseFrontmatter } from "@/lib/validation/schemas";

const defaultRobots = (): Metadata["robots"] =>
  shouldAllowIndexing()
    ? { index: true, follow: true }
    : { index: false, follow: false };

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shiv Singh | Nomad Programmer",
    template: "%s | Nomad Programmer",
  },
  description:
    "The personal portfolio of Shiv Singh, exploring software engineering, technology architecture, infrastructure, AI, and travel.",
  alternates: { canonical: "/" },
  robots: defaultRobots(),
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Nomad Programmer",
    title: "Shiv Singh | Nomad Programmer",
    description: "Software, systems, and exploration.",
    images: ["/og/home.png"],
  },
};

export function entryMetadata(
  entry: BaseFrontmatter,
  pathPrefix: string,
): Metadata {
  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: `${pathPrefix}/${entry.slug}` },
    robots: defaultRobots(),
    openGraph: {
      title: entry.title,
      description: entry.summary,
      url: `${pathPrefix}/${entry.slug}`,
      images: entry.ogImage ? [entry.ogImage] : undefined,
    },
  };
}
