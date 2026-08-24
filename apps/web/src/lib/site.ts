/**
 * Single source of truth for Egypt One's public identity (contact address,
 * social handles). Nothing else in the app should hardcode these.
 */
export const SITE = {
  name: 'Egypt One',
  email: 'info@egypt-one.com',
  social: {
    facebook: 'https://www.facebook.com/egyptone',
    instagram: 'https://www.instagram.com/egyptone',
    tiktok: 'https://www.tiktok.com/@egyptone',
    x: 'https://x.com/egyptone',
    youtube: 'https://www.youtube.com/@egyptone',
  },
} as const;

export const mailto = (subject?: string) =>
  subject ? `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}` : `mailto:${SITE.email}`;
