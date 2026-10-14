export const SITE_URL = "https://www.nomadprogrammer.in";
export const SITE_NAME = "Nomad Programmer";
export const AUTHOR_NAME = "Shiv Singh";
export const SITE_TAGLINE = "Tech by Profession, Traveler by Soul";
export const SITE_DESCRIPTION =
  "Nomad Programmer is Shiv Singh – developer, CTO at Mobrilz and YouTube creator sharing coding, open-source projects and travel across India.";

export const CONTACT_EMAIL = "shiv@srapsware.com";

export const GITHUB_USER = "ProgrammerNomad";

/** @NomadProgrammer — public; used when YOUTUBE_CHANNEL_ID env is unset */
export const DEFAULT_YOUTUBE_CHANNEL_ID = "UCqXCwumTq46dgibfTwrJkGQ";

export const TWITTER_HANDLE = "@programmernomad";

export const SOCIAL = {
  youtube: "https://www.youtube.com/@NomadProgrammer",
  youtubeSubscribe:
    "https://www.youtube.com/@NomadProgrammer?sub_confirmation=1",
  github: "https://github.com/ProgrammerNomad",
  linkedin: "https://www.linkedin.com/in/programmernomad/",
  twitter: "https://twitter.com/programmernomad",
  instagram: "https://www.instagram.com/nomadprogrammer_/",
  googleProfile: "https://profile.google.com/@nomadprogrammer",
} as const;

/** Shown in header/footer micro-brand strip */
export const HEADER_COORDINATES = "28° 38' N";

export type SocialLinkId =
  | "youtube"
  | "github"
  | "instagram"
  | "linkedin"
  | "google"
  | "website"
  | "email";

export type SocialLinkItem = {
  id: SocialLinkId;
  href: string;
  label: string;
};

export const PROFILE_SOCIAL_LINKS: readonly SocialLinkItem[] = [
  { id: "youtube", href: SOCIAL.youtube, label: "YouTube" },
  { id: "github", href: SOCIAL.github, label: "GitHub" },
  { id: "instagram", href: SOCIAL.instagram, label: "Instagram" },
  { id: "linkedin", href: SOCIAL.linkedin, label: "LinkedIn" },
  { id: "google", href: SOCIAL.googleProfile, label: "Google profile" },
  { id: "website", href: SITE_URL, label: "Nomad Programmer website" },
] as const;

export const FOOTER_SOCIAL_LINKS: readonly SocialLinkItem[] = [
  ...PROFILE_SOCIAL_LINKS,
  { id: "email", href: `mailto:${CONTACT_EMAIL}`, label: "Email" },
] as const;

/** @deprecated Use PROFILE_SOCIAL_LINKS for UI; kept for callers expecting href/label only */
export const SOCIAL_LINKS = PROFILE_SOCIAL_LINKS.map(({ href, label }) => ({
  href,
  label,
}));

export const SAME_AS = [
  SOCIAL.youtube,
  SOCIAL.github,
  SOCIAL.linkedin,
  SOCIAL.twitter,
  SOCIAL.instagram,
  SOCIAL.googleProfile,
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
export const AUTHOR_PORTRAIT_IMAGE = "/images/shiv-singh.jpg";
