import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { MetaLabel } from "@/components/ui/MetaLabel";

export function Section({
  eyebrow,
  title,
  children,
  className,
  id,
}: {
  eyebrow?: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      {eyebrow ? (
        <MetaLabel className="mb-4 block">{eyebrow}</MetaLabel>
      ) : null}
      {title ? (
        <h2 className="font-display text-3xl md:text-5xl tracking-tight text-paper mb-10">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
