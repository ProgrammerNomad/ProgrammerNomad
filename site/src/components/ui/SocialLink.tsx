import Link from "next/link";
import { cn } from "@/lib/utils";

const linkClass =
  "text-paper/80 hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime";

export function SocialLink({
  href,
  children,
  className,
  external = href.startsWith("http") || href.startsWith("mailto:"),
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  if (external) {
    return (
      <Link
        href={href}
        className={cn(linkClass, className)}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} className={cn(linkClass, className)}>
      {children}
    </Link>
  );
}
