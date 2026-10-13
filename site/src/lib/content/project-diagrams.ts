// Capability maps drawn only from the corresponding authored project MDX.
// These are not claims about production topology, deployment or performance.
export const projectDiagrams: Record<
  string,
  { label: string; detail: string }[]
> = {
  jodkit: [
    {
      label: "Authentication",
      detail:
        "Reusable authentication modules in an opinionated Laravel starter kit.",
    },
    {
      label: "Billing hooks",
      detail:
        "Billing hooks are packaged alongside the modules; integration details remain in the repository.",
    },
    {
      label: "Admin patterns",
      detail:
        "Shared admin patterns and modular service providers capture repeated scaffolding decisions.",
    },
  ],
  laracorekit: [
    {
      label: "Module boundaries",
      detail:
        "A domain-driven folder layout establishes module boundaries for growing teams.",
    },
    {
      label: "Testing defaults",
      detail:
        "Testing defaults form part of the starter kit's application structure.",
    },
    {
      label: "CI-friendly layout",
      detail:
        "The project documents a CI-friendly layout and ADR-friendly conventions.",
    },
  ],
  likhaeditor: [
    {
      label: "Embed",
      detail: "An embeddable editor for blogs and internal tools.",
    },
    {
      label: "Edit",
      detail:
        "A self-hosted rich text editing interface built with TypeScript and a component architecture.",
    },
    {
      label: "Document model",
      detail:
        "An API-friendly document model without third-party document lock-in.",
    },
  ],
  dashpix: [
    {
      label: "System & sensors",
      detail:
        "Live system data and GPIO / sensor integrations provide the dashboard's inputs.",
    },
    {
      label: "Python",
      detail: "Python is the documented implementation language.",
    },
    {
      label: "Pi-friendly UI",
      detail:
        "A lightweight web UI presents metrics for homelab and field hardware demos.",
    },
  ],
  "indian-railway-station-search": [
    {
      label: "Name or code",
      detail: "Search starts with a railway station name or code.",
    },
    {
      label: "Next.js + TypeScript",
      detail:
        "The app uses the Next.js App Router and static-friendly data loading.",
    },
    {
      label: "Station search",
      detail:
        "The interface serves travelers and developers integrating rail data.",
    },
  ],
  "shiprocket-woo-shipping": [
    {
      label: "WooCommerce",
      detail:
        "WooCommerce orders are the starting point of the shipping workflow.",
    },
    {
      label: "PHP hooks",
      detail:
        "The plugin uses PHP and WooCommerce hooks to integrate the Shiprocket API.",
    },
    {
      label: "Labels & tracking",
      detail:
        "The authored project describes label generation and tracking for Indian e-commerce stacks.",
    },
  ],
};
