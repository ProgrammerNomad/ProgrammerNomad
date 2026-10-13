import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { FooterWordmark } from "./FooterWordmark";
import styles from "./FooterWordmark.module.css";
import { PRIMARY_NAV } from "@/lib/navigation";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { SocialLink } from "@/components/ui/SocialLink";
import {
  FOOTER_SOCIAL_LINKS,
  HEADER_COORDINATES,
  SITE_TAGLINE,
} from "@/lib/seo/site-config";

export function SiteFooter() {
  return (
    <footer className={`${styles.footer} border-t border-paper/10 pt-12`}>
      <Container className="mb-12 grid gap-8 md:grid-cols-2">
        <div>
          <p className="atlas-meta">Keep exploring</p>
          <p className="mt-4 max-w-sm font-display text-xl leading-snug text-paper/75">
            A little more code.
            <br />A little more world.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-sm text-paper/75 hover:text-lime"
                >
                  {link.label} ↗
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <MetaLabel>{HEADER_COORDINATES} / DIGITAL SPACE</MetaLabel>
          <p className="mt-2 max-w-md text-sm text-paper/70">{SITE_TAGLINE}</p>
        </div>
        <div className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-widest">
          {FOOTER_SOCIAL_LINKS.map((link) => (
            <SocialLink key={link.href} href={link.href}>
              {link.label}
            </SocialLink>
          ))}
        </div>
        <p className="font-mono text-xs text-paper/50">
          © {new Date().getFullYear()} Shiv Singh · Nomad Programmer
        </p>
      </Container>
      <FooterWordmark />
    </footer>
  );
}
