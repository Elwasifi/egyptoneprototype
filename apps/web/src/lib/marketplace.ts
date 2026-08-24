/**
 * Editorial "Made in Egypt" collection pages, ported from the Lovable design
 * reference. These sit alongside the db-driven marketplace/wear-egypt
 * listings as deep-dive storytelling for four collections; none of the
 * commerce here is live — enquiries route to a mailto, not a checkout.
 */
export type MarketplacePage = {
  slug: 'egyptian-cotton' | 'handmade-crafts' | 'wear-egypt' | 'local-producers';
  eyebrow: string;
  title: string;
  tagline: string;
  intro: string;
  hero: string;
  heroAlt: string;
  stats: { value: string; label: string }[];
  highlights: { title: string; note: string }[];
  gallery: { image: string; alt: string; caption: string; note: string }[];
  experiences: { title: string; note: string }[];
  buySubject: string;
};

export const marketplacePages: MarketplacePage[] = [
  {
    slug: 'egyptian-cotton',
    eyebrow: 'Made in Egypt',
    title: 'Egyptian Cotton',
    tagline: 'Certified mills & ateliers',
    intro:
      "The world's most celebrated long-staple cotton, grown in the Nile Delta and finished by certified mills. Follow the thread from field to atelier and take home linen that lasts a lifetime.",
    hero: '/media/mkt-cotton-hero.jpg',
    heroAlt: 'Egyptian cotton field glowing at golden hour',
    stats: [
      { value: 'Giza 45/87', label: 'Extra-long staple varieties' },
      { value: '200+', label: 'Certified mills & ateliers' },
      { value: '6', label: 'Delta governorates growing cotton' },
    ],
    highlights: [
      { title: 'Verified provenance', note: 'Every listed mill carries a traceable certification code.' },
      { title: 'Mill visits', note: 'Guided tours through spinning, weaving and finishing lines.' },
      { title: 'Bespoke tailoring', note: 'Shirts and bed linen made to measure in 48 hours.' },
      { title: 'Global shipping', note: 'Duty-friendly export packs for visitors.' },
    ],
    gallery: [
      { image: '/media/mkt-cotton-1.jpg', alt: 'Weaver working a loom in an Egyptian cotton atelier', caption: 'Inside the atelier', note: 'Hand-finished weaving in Mahalla and Damietta workshops.' },
      { image: '/media/mkt-cotton-2.jpg', alt: 'Stack of white Egyptian cotton linen with a gold certification tag', caption: 'Certified linen', note: 'Bed linen, shirting and towels with authenticity tags.' },
    ],
    experiences: [
      { title: 'Delta cotton trail', note: 'One-day route: field, gin, mill and showroom.' },
      { title: 'Mahalla textile day', note: 'Historic mills plus a tailoring session.' },
      { title: 'Cairo showroom crawl', note: 'Curated retailers with export desks.' },
    ],
    buySubject: 'Egypt One — Egyptian Cotton enquiry',
  },
  {
    slug: 'handmade-crafts',
    eyebrow: 'Made in Egypt',
    title: 'Handmade Crafts',
    tagline: 'Artisans across 27 governorates',
    intro:
      'Copper, clay, glass, palm fibre and applique — living crafts practised in the same quarters for centuries. Meet the makers, watch the work, buy directly at fair prices.',
    hero: '/media/mkt-crafts-hero.jpg',
    heroAlt: 'Artisan engraving a copper plate in a lantern-lit Egyptian workshop',
    stats: [
      { value: '27', label: 'Governorates with craft clusters' },
      { value: '40+', label: 'Documented craft disciplines' },
      { value: '1,000s', label: 'Registered artisan families' },
    ],
    highlights: [
      { title: 'Meet the maker', note: 'Bookable workshop visits with translation.' },
      { title: 'Fair-price listing', note: 'Prices published by the artisan, no middlemen.' },
      { title: 'Try it yourself', note: 'Short hands-on classes in pottery and applique.' },
      { title: 'Safe shipping', note: 'Fragile-safe packing for ceramics and glass.' },
    ],
    gallery: [
      { image: '/media/mkt-crafts-1.jpg', alt: 'Potter shaping clay on a wheel in a Fustat workshop', caption: 'Fustat pottery', note: "Wheel-thrown clay from Cairo's oldest craft quarter." },
      { image: '/media/mkt-crafts-2.jpg', alt: 'Handwoven Egyptian kilim rugs displayed on a dark gallery wall', caption: 'Kilim & khayamiya', note: 'Woven rugs and tentmaker applique from Upper Egypt and Cairo.' },
    ],
    experiences: [
      { title: 'Khan El-Khalili by night', note: 'Copper, glass and lanterns with a craft guide.' },
      { title: 'Tentmakers Street', note: 'Khayamiya applique studios and stitching class.' },
      { title: 'Siwa & Nubia craft route', note: 'Palm fibre, silver and desert embroidery.' },
    ],
    buySubject: 'Egypt One — Handmade Crafts enquiry',
  },
  {
    slug: 'wear-egypt',
    eyebrow: 'Made in Egypt',
    title: 'Wear Egypt',
    tagline: 'Modern design, ancient roots',
    intro:
      'A new generation of Egyptian designers reworking pharaonic, Coptic and Islamic motifs into contemporary ready-to-wear — made locally, sold globally.',
    hero: '/media/mkt-wear-hero.jpg',
    heroAlt: 'Model wearing a modern Egyptian designer outfit with gold embroidery',
    stats: [
      { value: '120+', label: 'Independent design labels' },
      { value: '100%', label: 'Locally produced collections' },
      { value: '4', label: 'Seasonal design showcases a year' },
    ],
    highlights: [
      { title: 'Designer directory', note: 'Profiles, ateliers and stockists in one place.' },
      { title: 'Capsule collections', note: 'Limited runs inspired by museum archives.' },
      { title: 'Concept stores', note: 'Curated retail addresses in Cairo and Alexandria.' },
      { title: 'Made-to-order', note: 'Custom sizing produced before you fly home.' },
    ],
    gallery: [
      { image: '/media/mkt-wear-1.jpg', alt: 'Close-up of gold hieroglyph-inspired embroidery on cream fabric', caption: 'Motifs, reworked', note: 'Hieroglyph and Coptic patterns hand-embroidered in gold thread.' },
      { image: '/media/mkt-wear-2.jpg', alt: 'Modern Egyptian designer concept store interior', caption: 'Concept stores', note: 'Design districts in Zamalek, Heliopolis and Gouna.' },
    ],
    experiences: [
      { title: 'Design district walk', note: 'Three ateliers, one styling session.' },
      { title: 'Museum-to-wardrobe', note: 'Gallery visit then the collection it inspired.' },
      { title: 'Fashion week access', note: 'Seasonal showcase passes for visitors.' },
    ],
    buySubject: 'Egypt One — Wear Egypt enquiry',
  },
  {
    slug: 'local-producers',
    eyebrow: 'Made in Egypt',
    title: 'Local Producers',
    tagline: 'Farms, spices & Nile harvests',
    intro:
      "Dates from Siwa, mangoes from Ismailia, hibiscus from Aswan, olive oil, honey and herbs — Egypt's flavours straight from the farms that grow them.",
    hero: '/media/mkt-producers-hero.jpg',
    heroAlt: 'Baskets of Egyptian dates and produce at sunset on a Nile delta farm',
    stats: [
      { value: '#1', label: 'Global date producer' },
      { value: '365', label: 'Days of growing season' },
      { value: 'Delta → Siwa', label: 'Farm regions on the map' },
    ],
    highlights: [
      { title: 'Farm-direct', note: 'Buy from cooperatives, not resellers.' },
      { title: 'Tasting rooms', note: 'Olive oil, honey and hibiscus tastings.' },
      { title: 'Harvest calendar', note: 'Know what is in season before you travel.' },
      { title: 'Export packs', note: 'Airport-ready sealed gift boxes.' },
    ],
    gallery: [
      { image: '/media/mkt-producers-1.jpg', alt: 'Egyptian spices and hibiscus in copper bowls', caption: 'Spices & hibiscus', note: 'Aswan karkadeh, cumin, coriander and Nile herbs.' },
      { image: '/media/mkt-producers-2.jpg', alt: 'Premium Egyptian honey, olive oil and dates packaging', caption: 'Pantry gifts', note: 'Cold-pressed oils, desert honey and Siwa dates.' },
    ],
    experiences: [
      { title: 'Siwa date harvest', note: 'Oasis farms in October and November.' },
      { title: 'Delta food trail', note: 'Cheese, citrus and herb farms near Cairo.' },
      { title: 'Nile market morning', note: 'Shop with a chef then cook the haul.' },
    ],
    buySubject: 'Egypt One — Local Producers enquiry',
  },
];

export const marketplacePageBySlug: Record<MarketplacePage['slug'], MarketplacePage> = Object.fromEntries(
  marketplacePages.map((p) => [p.slug, p]),
) as Record<MarketplacePage['slug'], MarketplacePage>;
