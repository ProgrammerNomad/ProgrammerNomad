import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { Prose } from "@/components/ui/Prose";

export function Callout({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="my-6 rounded-lg border border-lime/30 bg-elevated/80 p-4">
      {title ? (
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-lime">
          {title}
        </p>
      ) : null}
      <div className="text-paper/90">{children}</div>
    </aside>
  );
}

export function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-8">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-elevated">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 720px" />
      </div>
      {caption ? (
        <figcaption className="mt-2 font-mono text-xs text-paper/60">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function CodeBlock({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-paper/10 bg-elevated">
      {title ? (
        <div className="border-b border-paper/10 px-4 py-2 font-mono text-xs text-lime">
          {title}
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 text-sm text-paper/90">{children}</pre>
    </div>
  );
}

export function Video({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  return (
    <div className="my-8 aspect-video overflow-hidden rounded-lg bg-elevated">
      <iframe
        src={src}
        title={title}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function LinkCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description?: string;
}) {
  return (
    <Link
      href={href}
      className="my-4 block rounded-lg border border-paper/10 bg-elevated p-4 transition hover:border-lime/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
    >
      <span className="font-medium text-paper">{title}</span>
      {description ? (
        <span className="mt-1 block text-sm text-paper/70">{description}</span>
      ) : null}
    </Link>
  );
}

export function ArchitectureDiagram({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="my-8 rounded-lg border border-paper/10 bg-elevated p-4">
      <Image src={src} alt={alt} width={960} height={540} className="h-auto w-full" />
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  wrapper: Prose,
  Callout,
  Figure,
  CodeBlock,
  Video,
  LinkCard,
  ArchitectureDiagram,
};
