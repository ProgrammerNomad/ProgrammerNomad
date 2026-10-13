import Link from "next/link";
import { SOCIAL } from "@/lib/seo/site-config";

const btn =
  "inline-flex items-center justify-center rounded-md border border-lime/50 bg-lime/10 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-lime transition hover:bg-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime";

export function SubscribeCtas() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href={SOCIAL.youtubeSubscribe} className={btn} target="_blank" rel="noopener noreferrer">
        Subscribe on YouTube
      </Link>
      <Link href={SOCIAL.github} className={btn} target="_blank" rel="noopener noreferrer">
        Follow on GitHub
      </Link>
      <Link href={SOCIAL.instagram} className={btn} target="_blank" rel="noopener noreferrer">
        Follow on Instagram
      </Link>
    </div>
  );
}
