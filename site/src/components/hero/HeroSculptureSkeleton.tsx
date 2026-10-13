export function HeroSculptureSkeleton() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-canvas/40"
      aria-hidden
    >
      <div className="h-32 w-32 animate-pulse rounded-full border border-lime/20 bg-elevated/30 md:h-40 md:w-40" />
    </div>
  );
}
