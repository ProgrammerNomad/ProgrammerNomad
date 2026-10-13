export function HeroSculptureSkeleton() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-canvas/40"
      aria-hidden
    >
      <div className="relative h-36 w-36 animate-pulse md:h-48 md:w-48">
        <span className="absolute inset-3 rotate-12 rounded-full border border-lime/25" />
        <span className="absolute inset-1 -rotate-45 rounded-full border border-cyan-300/20" />
        <span className="absolute inset-7 rotate-45 border border-lime/20" />
      </div>
    </div>
  );
}
