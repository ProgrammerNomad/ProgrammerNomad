import type { ReactNode } from "react";

export function AtlasHeading({
  index,
  eyebrow,
  title,
  description,
  children,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="atlas-heading">
      <div>
        <p className="atlas-meta">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="atlas-description">{description}</p>
        {children}
      </div>
      <span className="atlas-index" aria-hidden="true">
        {index}
      </span>
    </header>
  );
}
