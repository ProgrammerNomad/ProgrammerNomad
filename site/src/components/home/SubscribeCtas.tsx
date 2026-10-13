import { ButtonLink } from "@/components/ui/Button";
import { SOCIAL } from "@/lib/seo/site-config";

export function SubscribeCtas() {
  return (
    <div className="flex flex-wrap gap-3">
      <ButtonLink
        href={SOCIAL.youtubeSubscribe}
        variant="accent"
        size="lg"
        target="_blank"
        rel="noopener noreferrer"
      >
        Subscribe on YouTube
      </ButtonLink>
      <ButtonLink
        href={SOCIAL.github}
        variant="accent"
        size="lg"
        target="_blank"
        rel="noopener noreferrer"
      >
        Follow on GitHub
      </ButtonLink>
      <ButtonLink
        href={SOCIAL.instagram}
        variant="accent"
        size="lg"
        target="_blank"
        rel="noopener noreferrer"
      >
        Follow on Instagram
      </ButtonLink>
    </div>
  );
}
