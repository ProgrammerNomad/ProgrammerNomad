import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FieldLabel, Input, Select, Textarea } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { SocialLink } from "@/components/ui/SocialLink";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/seo/site-config";
import { indexPageMetadata } from "@/lib/seo/metadata";

export const metadata = indexPageMetadata(
  "Contact & Collaborations – Nomad Programmer",
  "Brand collaborations, sponsorships, consulting, and newsletter signup.",
  "/contact",
);

export default function ContactPage() {
  const newsletterEmbed = process.env.NEWSLETTER_EMBED_URL?.trim();

  return (
    <Container className="py-16 md:py-24">
      <PageHeader
        label="CONTACT / COLLAB"
        title="Contact & collaborations"
        description="Brand partnerships, sponsorships, and consulting - use the form or email below. Rate card available on request."
      />

      <p className="mt-6">
        <SocialLink
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono text-sm uppercase tracking-widest text-lime hover:underline"
        >
          {CONTACT_EMAIL}
        </SocialLink>
      </p>

      <form
        name="collab"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        className="mt-12 max-w-xl space-y-6"
      >
        <input type="hidden" name="form-name" value="collab" />
        <p className="hidden">
          <label>
            Don&apos;t fill this out: <input name="bot-field" />
          </label>
        </p>
        <div>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" name="name" required />
        </div>
        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <FieldLabel htmlFor="type">Inquiry type</FieldLabel>
          <Select id="type" name="type">
            <option value="brand">Brand collaboration</option>
            <option value="sponsorship">Sponsorship</option>
            <option value="consulting">Consulting</option>
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <Textarea id="message" name="message" required rows={5} />
        </div>
        <Button type="submit" variant="accent" size="lg">
          Send message
        </Button>
      </form>

      <div className="mt-16 border-t border-paper/10 pt-12">
        <h2 className="font-display text-2xl text-paper">Newsletter</h2>
        <p className="mt-3 max-w-prose text-paper/70">
          Build your own audience list - get updates on new videos, projects, and
          travel posts.
        </p>
        {newsletterEmbed ? (
          <iframe
            title="Newsletter signup"
            src={newsletterEmbed}
            className="mt-6 h-64 w-full max-w-xl border border-paper/10"
          />
        ) : (
          <p className="mt-4 text-sm text-paper/50">
            Set <code className="text-lime">NEWSLETTER_EMBED_URL</code> in Netlify
            to embed your provider form.
          </p>
        )}
      </div>

      <ul className="mt-12 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-widest">
        {SOCIAL_LINKS.map((link) => (
          <li key={link.href}>
            <SocialLink href={link.href}>{link.label}</SocialLink>
          </li>
        ))}
      </ul>
    </Container>
  );
}
