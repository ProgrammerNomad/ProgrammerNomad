import { cn } from "@/lib/utils";

export function SectionLinkRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-8 flex flex-wrap items-center gap-x-6 gap-y-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
