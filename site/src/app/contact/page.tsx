import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";

export const metadata = {
  title: "Contact",
  description: "Professional enquiries and verified profiles.",
};

export default function ContactPage() {
  return (
    <Container className="py-16 md:py-24">
      <MetaLabel>CONTACT / VERIFIED CHANNELS</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        Contact
      </h1>
      <p className="mt-4 max-w-prose text-paper/70">
        For collaboration or professional enquiries, reach out through verified
        channels below. No contact form in v1 - direct email and social links
        only.
      </p>
      <ul className="mt-10 space-y-4 font-mono text-sm uppercase tracking-widest">
        <li>
          <Link href="mailto:shiv@srapsware.com" className="text-lime hover:underline">
            shiv@srapsware.com
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/ProgrammerNomad"
            className="text-paper/80 hover:text-lime"
          >
            GitHub - ProgrammerNomad
          </Link>
        </li>
        <li>
          <Link
            href="https://www.linkedin.com/in/programmernomad/"
            className="text-paper/80 hover:text-lime"
          >
            LinkedIn
          </Link>
        </li>
        <li>
          <Link
            href="https://twitter.com/programmernomad"
            className="text-paper/80 hover:text-lime"
          >
            Twitter / X
          </Link>
        </li>
      </ul>
      <p className="mt-10 font-mono text-xs text-paper/50">
        Terminal easter egg:{" "}
        <code className="text-lime">npx nomadprogrammer</code>
      </p>
    </Container>
  );
}
