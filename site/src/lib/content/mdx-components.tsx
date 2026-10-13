import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Callout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="my-8 border border-lime/30 bg-elevated/80 p-6">
      {title ? (
        <p className="font-mono text-xs uppercase tracking-widest text-lime mb-3">
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
  width = 1200,
  height = 675,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="my-10">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto border border-white/10"
        sizes="(max-width: 768px) 100vw, 65ch"
      />
      {caption ? (
        <figcaption className="mt-3 font-mono text-xs text-paper/60">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function CodeBlock({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div className="my-8 overflow-x-auto border border-white/10 bg-elevated">
      {title ? (
        <div className="border-b border-white/10 px-4 py-2 font-mono text-xs text-lime">
          {title}
        </div>
      ) : null}
      <pre className="p-4 text-sm leading-relaxed text-paper/90">{children}</pre>
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
    <div className="my-10 aspect-video border border-white/10 bg-elevated">
      <iframe
        src={src}
        title={title}
        className="h-full w-full"
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
      className="my-6 block border border-white/10 bg-elevated p-5 transition-colors hover:border-lime/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
    >
      <span className="font-medium text-paper">{title}</span>
      {description ? (
        <span className="mt-2 block text-sm text-paper/70">{description}</span>
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
    <div className="my-10 border border-dashed border-lime/30 p-4">
      <Image src={src} alt={alt} width={960} height={540} className="w-full h-auto" />
    </div>
  );
}

type AnchorProps = ComponentPropsWithoutRef<"a">;

function MdxLink({ href, children, ...rest }: AnchorProps) {
  const isExternal = href?.startsWith("http");
  if (isExternal) {
    return (
      <a href={href} rel="noopener noreferrer" target="_blank" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href ?? "#"} {...rest}>
      {children}
    </Link>
  );
}

export const mdxComponents = {
  Callout,
  Figure,
  CodeBlock,
  Video,
  LinkCard,
  ArchitectureDiagram,
  a: MdxLink,
  pre: ({ children, className }: { children?: ReactNode; className?: string }) => (
    <pre className={cn("overflow-x-auto rounded-none", className)}>{children}</pre>
  ),
};
