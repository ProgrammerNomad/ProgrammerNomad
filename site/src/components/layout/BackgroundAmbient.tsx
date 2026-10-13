/**
 * Ambient background layer - drifting glow orbs + dot grid.
 * Rendered once in the root layout. Pure CSS-driven, no JS animation loop.
 * Respects prefers-reduced-motion via CSS (globals.css disables animations).
 */
export function BackgroundAmbient() {
  return (
    <>
      <div className="ambient-orb ambient-orb--lime" aria-hidden="true" />
      <div className="ambient-orb ambient-orb--cyan" aria-hidden="true" />
      <div className="ambient-orb ambient-orb--amber" aria-hidden="true" />
      <div className="ambient-grid" aria-hidden="true" />
    </>
  );
}
