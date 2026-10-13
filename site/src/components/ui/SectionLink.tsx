import Link from "next/link";
import { cn } from "@/lib/utils";

export function SectionLink({
  href,
  children,
  className,
  inline = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Use inside SectionLinkRow - no extra top margin */
  inline?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-mono text-xs uppercase tracking-widest text-lime hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime",
        inline ? "inline-block" : "mt-8 inline-block",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function SectionTextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-mono text-xs uppercase tracking-widest text-paper/70 hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime",
        className,
      )}
    >
      {children}
    </Link>
  );
}
