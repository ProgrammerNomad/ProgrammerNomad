import { Container } from "@/components/ui/Container";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-24">
      <MetaLabel>404 / NOT FOUND</MetaLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold md:text-5xl">
        Route not in this universe.
      </h1>
      <p className="mt-4 max-w-prose text-paper/70">
        The page you requested does not exist, or the content is not published
        yet.
      </p>
      <ButtonLink href="/" className="mt-8 w-fit">
        Return home
      </ButtonLink>
    </Container>
  );
}
