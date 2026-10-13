import { Container } from "@/components/ui/Container";
import { AtlasHeading } from "@/components/ui/AtlasHeading";
import { ContactForm } from "@/components/contact/ContactForm";
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
  const deliveryEnabled = process.env.NETLIFY === "true";
  return (
    <Container className="py-16 md:py-24">
      <AtlasHeading
        index="07"
        eyebrow="Contact / Collaboration"
        title="Let's build a good story."
        description="Engineering challenges, thoughtful partnerships, or a story worth telling. Tell me what you're working on."
      />
      <div className="contact-layout">
        <aside>
          <p className="atlas-meta">Choose your starting point</p>
          <div className="contact-intent">
            <span>01 / Engineering</span>
            <h2>Consulting & software</h2>
            <p>Share the problem, the stack, and what you want to achieve.</p>
          </div>
          <div className="contact-intent">
            <span>02 / Partnerships</span>
            <h2>Brands & sponsorships</h2>
            <p>
              Tell me about the fit, the format, and your timeline. Rate card
              available on request.
            </p>
          </div>
          <div className="contact-direct">
            <p className="atlas-meta">Prefer a direct line?</p>
            <SocialLink
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-3 inline-block text-lime break-all"
            >
              {CONTACT_EMAIL}
            </SocialLink>
          </div>
        </aside>
        <ContactForm email={CONTACT_EMAIL} deliveryEnabled={deliveryEnabled} />
      </div>
      {newsletterEmbed && (
        <section className="editorial-section">
          <p className="atlas-meta">Occasional dispatches</p>
          <h2>Stay in the loop.</h2>
          <p className="atlas-description mt-4">
            New projects, videos, and notes from the road.
          </p>
          <iframe
            title="Newsletter signup"
            src={newsletterEmbed}
            loading="lazy"
            className="mt-6 h-64 w-full max-w-xl border border-paper/10"
          />
        </section>
      )}
      <ul className="mt-12 flex flex-wrap gap-5 font-mono text-xs uppercase tracking-widest">
        {SOCIAL_LINKS.map((link) => (
          <li key={link.href}>
            <SocialLink href={link.href}>{link.label} ↗</SocialLink>
          </li>
        ))}
      </ul>
    </Container>
  );
}
