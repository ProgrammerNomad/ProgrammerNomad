import { cn } from "@/lib/utils";

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-prose space-y-4 text-base leading-relaxed text-paper/85 [&_a]:text-lime [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-paper [&_h3]:font-display [&_h3]:text-xl [&_strong]:text-paper",
        className,
      )}
    >
      {children}
    </div>
  );
}
