import { cn } from "@/lib/utils";
import { MetaLabel } from "@/components/ui/MetaLabel";

export function Section({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      {eyebrow ? <MetaLabel className="mb-4">{eyebrow}</MetaLabel> : null}
      {title ? (
        <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
