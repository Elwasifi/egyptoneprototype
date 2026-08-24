/**
 * Single source of truth for Egypt One's public identity.
 * Nothing else in the app should hardcode the domain or contact address.
 */
export const SITE = {
  name: "Egypt One",
  tagline: "One Egypt. One Journey. One Platform.",
  url: "https://www.egypt-one.com",
  domain: "www.egypt-one.com",
  email: "info@egypt-one.com",
  support: "info@egypt-one.com",
  locales: ["en", "ar"] as const,
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
    linkedin: "https://www.linkedin.com/",
  },
} as const;

export const mailto = (subject?: string) =>
  subject ? `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}` : `mailto:${SITE.email}`;
