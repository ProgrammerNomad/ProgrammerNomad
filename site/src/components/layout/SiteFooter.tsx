import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { SocialLink } from "@/components/ui/SocialLink";
import {
  FOOTER_SOCIAL_LINKS,
  HEADER_COORDINATES,
  SITE_TAGLINE,
} from "@/lib/seo/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-paper/10 py-12">
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
    </footer>
  );
}
