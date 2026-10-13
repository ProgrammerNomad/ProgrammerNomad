export const SITE_URL = "https://www.nomadprogrammer.in";
export const SITE_NAME = "Nomad Programmer";
export const AUTHOR_NAME = "Shiv Singh";
export const SITE_TAGLINE = "Tech by Profession, Traveler by Soul";
export const SITE_DESCRIPTION =
  "Nomad Programmer is Shiv Singh – developer, CTO at Mobrilz and YouTube creator sharing coding, open-source projects and travel across India.";

export const CONTACT_EMAIL = "shiv@srapsware.com";

export const GITHUB_USER = "ProgrammerNomad";

export const SOCIAL = {
  youtube: "https://www.youtube.com/@NomadProgrammer",
  youtubeSubscribe:
    "https://www.youtube.com/@NomadProgrammer?sub_confirmation=1",
  github: "https://github.com/ProgrammerNomad",
  linkedin: "https://www.linkedin.com/in/programmernomad/",
  twitter: "https://twitter.com/programmernomad",
  instagram: "https://www.instagram.com/programmernomad/",
} as const;

/** Shown in header/footer micro-brand strip */
export const HEADER_COORDINATES = "28° 38' N";

export const SOCIAL_LINKS = [
  { href: SOCIAL.youtube, label: "YouTube" },
  { href: SOCIAL.github, label: "GitHub" },
  { href: SOCIAL.instagram, label: "Instagram" },
  { href: SOCIAL.linkedin, label: "LinkedIn" },
] as const;

export const FOOTER_SOCIAL_LINKS = [
  ...SOCIAL_LINKS,
  { href: `mailto:${CONTACT_EMAIL}`, label: "Email" },
] as const;

export const SAME_AS = [
  SOCIAL.youtube,
  SOCIAL.github,
  SOCIAL.linkedin,
  SOCIAL.twitter,
  SOCIAL.instagram,
] as const;

export const ORGANIZATION = {
  name: "Mobrilz",
  jobTitle: "CTO",
} as const;

export const ADDRESS = {
  locality: "Noida",
  country: "IN",
} as const;

export const DEFAULT_OG_IMAGE = "/og/home.png";
