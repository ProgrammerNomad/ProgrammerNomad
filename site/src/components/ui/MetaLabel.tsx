import { cn } from "@/lib/utils";

export function MetaLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-xs uppercase tracking-[0.2em] text-paper/60",
        className,
      )}
    >
      {children}
    </p>
  );
}
