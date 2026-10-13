import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { ButtonLink } from "@/components/ui/Button";
import { NOT_FOUND_NAV } from "@/lib/navigation";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-24">
      <MetaLabel>404 / NOT FOUND</MetaLabel>
      <div className="off-map-mark" aria-hidden="true">
        ⌖ <span>404</span>
      </div>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        This page is off the map.
      </h1>
      <p className="mt-4 max-w-prose text-paper/70">
        The URL may be wrong, or the content is not published yet. Try one of
        these sections:
      </p>
      <p className="text-sm text-paper/55 mt-3">
        Use the search button in the header, or press Ctrl / Cmd + K.
      </p>
      <ul className="mt-6 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-widest">
        {NOT_FOUND_NAV.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-lime hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <ButtonLink href="/" className="mt-8 w-fit">
        Return home
      </ButtonLink>
    </Container>
  );
}
