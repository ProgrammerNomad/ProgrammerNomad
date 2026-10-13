import { cn } from "@/lib/utils";

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "prose prose-invert max-w-prose prose-headings:font-display prose-headings:tracking-tight prose-a:text-lime prose-a:no-underline hover:prose-a:underline prose-strong:text-paper",
        className,
      )}
    >
      {children}
    </article>
  );
}
