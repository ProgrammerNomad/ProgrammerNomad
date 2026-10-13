import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { CodeBlockCopy } from "@/components/content/CodeBlockCopy";
import { headingIdFromText } from "@/lib/content/heading-id";
import { AUTHOR_NAME, SITE_TAGLINE } from "@/lib/seo/site-config";
import { cn } from "@/lib/utils";

function textFromChildren(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textFromChildren).join("");
  if (children && typeof children === "object" && "props" in children) {
    const props = children.props as { children?: ReactNode };
    return textFromChildren(props.children);
  }
  return "";
}

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
  const text = textFromChildren(children).trim();
  return (
    <div className="relative my-8 overflow-x-auto border border-white/10 bg-elevated">
      {title ? (
        <div className="border-b border-white/10 px-4 py-2 font-mono text-xs text-lime">
          {title}
        </div>
      ) : null}
      {text ? <CodeBlockCopy text={text} /> : null}
      <pre className="p-4 text-sm leading-relaxed text-paper/90">{children}</pre>
    </div>
  );
}

export function Checklist({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="guide-checklist my-8 rounded-xl border border-paper/15 bg-elevated/40 p-6">
      {title ? (
        <p className="font-mono text-xs uppercase tracking-widest text-lime">
          {title}
        </p>
      ) : null}
      <div
        className={cn(
          "text-paper/90 [&_ul]:mt-4 [&_ul]:space-y-3 [&_li]:flex [&_li]:gap-3 [&_li]:leading-relaxed",
          "[&_li]:before:mt-1 [&_li]:before:h-4 [&_li]:before:w-4 [&_li]:before:shrink-0 [&_li]:before:rounded-sm [&_li]:before:border [&_li]:before:border-lime/50 [&_li]:before:content-['']",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function AuthorBio() {
  return (
    <aside className="my-12 border border-paper/10 bg-elevated/50 p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-paper/50">
        About the author
      </p>
      <p className="mt-3 text-paper/85">
        <Link href="/about" className="font-medium text-lime hover:underline">
          {AUTHOR_NAME}
        </Link>{" "}
        - {SITE_TAGLINE}. CTO at Mobrilz, open-source maintainer, and travel
        filmmaker documenting routes across India.
      </p>
    </aside>
  );
}

export function GuideNextStep({
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
      className="my-10 block border border-lime/40 bg-lime/5 p-6 transition hover:border-lime hover:bg-lime/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-lime">
        Next step
      </p>
      <p className="mt-2 font-display text-xl text-paper">{title}</p>
      {description ? (
        <p className="mt-2 text-sm text-paper/70">{description}</p>
      ) : null}
    </Link>
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

export function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <Video
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video"
    />
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

function MdxH2({
  children,
  className,
  ...rest
}: ComponentPropsWithoutRef<"h2">) {
  const text = textFromChildren(children);
  const id = headingIdFromText(text);
  return (
    <h2 id={id} className={cn(className)} {...rest}>
      {children}
    </h2>
  );
}

function MdxH3({
  children,
  className,
  ...rest
}: ComponentPropsWithoutRef<"h3">) {
  const text = textFromChildren(children);
  const id = headingIdFromText(text);
  return (
    <h3 id={id} className={cn(className)} {...rest}>
      {children}
    </h3>
  );
}

export const mdxComponents = {
  Callout,
  Figure,
  CodeBlock,
  Checklist,
  AuthorBio,
  GuideNextStep,
  Video,
  YouTubeEmbed,
  LinkCard,
  ArchitectureDiagram,
  a: MdxLink,
  h2: MdxH2,
  h3: MdxH3,
  pre: ({ children, className }: { children?: ReactNode; className?: string }) => (
    <pre className={cn("overflow-x-auto rounded-none", className)}>{children}</pre>
  ),
};
