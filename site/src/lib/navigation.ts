export const PRIMARY_NAV = [
  { href: "/work", label: "Projects" },
  { href: "/field-notes", label: "Travel" },
  { href: "/writing", label: "Writing" },
  { href: "/videos", label: "Videos" },
  { href: "/gear", label: "Gear" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const NOT_FOUND_NAV = PRIMARY_NAV.filter((l) =>
  ["/work", "/videos", "/field-notes", "/writing", "/contact"].includes(l.href),
);
