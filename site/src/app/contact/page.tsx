import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { CONTACT_EMAIL, SOCIAL } from "@/lib/seo/site-config";
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
      <MetaLabel>CONTACT / COLLAB</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        Contact & collaborations
      </h1>
      <p className="mt-4 max-w-prose text-paper/70">
        Brand partnerships, sponsorships, and consulting - use the form or email
        below. Rate card available on request.
      </p>

      <p className="mt-6">
        <Link
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono text-sm uppercase tracking-widest text-lime hover:underline"
        >
          {CONTACT_EMAIL}
        </Link>
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
          <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-paper/60">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-2 w-full border border-paper/15 bg-elevated px-4 py-3 text-paper"
          />
        </div>
        <div>
          <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-paper/60">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 w-full border border-paper/15 bg-elevated px-4 py-3 text-paper"
          />
        </div>
        <div>
          <label htmlFor="type" className="font-mono text-xs uppercase tracking-widest text-paper/60">
            Inquiry type
          </label>
          <select
            id="type"
            name="type"
            className="mt-2 w-full border border-paper/15 bg-elevated px-4 py-3 text-paper"
          >
            <option value="brand">Brand collaboration</option>
            <option value="sponsorship">Sponsorship</option>
            <option value="consulting">Consulting</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-paper/60">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="mt-2 w-full border border-paper/15 bg-elevated px-4 py-3 text-paper"
          />
        </div>
        <button
          type="submit"
          className="rounded-md border border-lime/50 bg-lime/10 px-6 py-3 font-mono text-xs uppercase tracking-widest text-lime hover:bg-lime/20"
        >
          Send message
        </button>
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
        <li>
          <Link href={SOCIAL.github} className="text-paper/80 hover:text-lime">
            GitHub
          </Link>
        </li>
        <li>
          <Link href={SOCIAL.youtube} className="text-paper/80 hover:text-lime">
            YouTube
          </Link>
        </li>
        <li>
          <Link href={SOCIAL.instagram} className="text-paper/80 hover:text-lime">
            Instagram
          </Link>
        </li>
      </ul>
    </Container>
  );
}
