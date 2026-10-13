import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";

export function SiteFooter() {
  return (
    <footer className="border-t border-paper/10 py-12">
      <Container className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <MetaLabel>28° 38&apos; N / DIGITAL SPACE</MetaLabel>
          <p className="mt-2 max-w-md text-sm text-paper/70">
            Independent engineer exploring software, systems, and the world beyond
            the screen.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-widest">
          <Link
            href="https://github.com/ProgrammerNomad"
            className="text-paper/80 hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/programmernomad/"
            className="text-paper/80 hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
          >
            LinkedIn
          </Link>
          <Link
            href="mailto:shiv@srapsware.com"
            className="text-paper/80 hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
          >
            Email
          </Link>
        </div>
        <p className="font-mono text-xs text-paper/50">
          © {new Date().getFullYear()} Shiv Singh
        </p>
      </Container>
    </footer>
  );
}
