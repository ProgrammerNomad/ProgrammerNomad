import Link from "next/link";
import { cn } from "@/lib/utils";

export function SectionLink({
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
        "mt-8 inline-block font-mono text-xs uppercase tracking-widest text-lime hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime",
        className,
      )}
    >
      {children}
    </Link>
  );
}
