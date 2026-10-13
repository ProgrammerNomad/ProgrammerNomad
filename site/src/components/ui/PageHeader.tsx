import { MetaLabel } from "@/components/ui/MetaLabel";
import { cn } from "@/lib/utils";

export function PageHeader({
  label,
  title,
  description,
  className,
}: {
  label: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={className}>
      <MetaLabel data-page-accent>{label}</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className={cn("mt-4 max-w-prose text-paper/70")}>{description}</p>
      ) : null}
    </header>
  );
}
