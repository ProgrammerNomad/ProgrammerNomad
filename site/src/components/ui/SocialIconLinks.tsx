import Link from "next/link";
import {
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SocialLinkItem } from "@/lib/seo/site-config";

const linkClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm text-paper/80 transition-colors hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

const LUCIDE_ICONS: Partial<
  Record<SocialLinkItem["id"], LucideIcon>
> = {
  youtube: Youtube,
  github: Github,
  instagram: Instagram,
  linkedin: Linkedin,
  website: Globe,
  email: Mail,
};

function SocialIcon({
  id,
  className,
}: {
  id: SocialLinkItem["id"];
  className: string;
}) {
  if (id === "google") {
    return <GoogleIcon className={className} />;
  }
  const Icon = LUCIDE_ICONS[id];
  if (!Icon) return null;
  return <Icon className={className} aria-hidden="true" />;
}

export function SocialIconLinks({
  links,
  className,
  iconClassName = "h-5 w-5",
}: {
  links: readonly SocialLinkItem[];
  className?: string;
  iconClassName?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-1", className)}>
      {links.map((link) => {
        const isMailto = link.href.startsWith("mailto:");
        const isExternal = link.href.startsWith("http");
        return (
          <li key={`${link.id}-${link.href}`}>
            <Link
              href={link.href}
              className={linkClass}
              aria-label={link.label}
              title={link.label}
              target={isMailto ? undefined : isExternal ? "_blank" : undefined}
              rel={
                isMailto || !isExternal ? undefined : "noopener noreferrer"
              }
            >
              <SocialIcon id={link.id} className={iconClassName} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
