import type { PortalNavItem } from '@egypt-one/ui';

export type MegaColumn = { title: string; items: { href: string; label: string; hint?: string; badge?: string }[] };
export type MegaSection = { key: string; label: string; href: string; columns: MegaColumn[]; feature?: { title: string; body: string; href: string; cta: string } };

/**
 * The full navigation graph. Every route template in the platform is reachable
 * from here, which is what keeps the homepage a preview surface rather than a
 * dumping ground.
 */
export const MEGA: MegaSection[] = [
  {
    key: 'discover', label: 'nav.discover', href: '/discover',
    columns: [
      { title: 'Places', items: [
        { href: '/governorates', label: '27 governorates', hint: 'Every region of Egypt' },
        { href: '/destinations/pyramids-of-giza', label: 'Destinations' },
        { href: '/map', label: 'Interactive map' },
        { href: '/rural-egypt', label: 'Rural Egypt' },
        { href: '/new-cities', label: 'New cities' },
      ]},
      { title: 'Through time', items: [
        { href: '/egypt-through-time', label: 'Egypt through time', hint: '11 eras' },
        { href: '/rulers-of-egypt', label: 'Rulers of Egypt' },
        { href: '/ancient-egypt-academy', label: 'Ancient Egypt Academy' },
      ]},
      { title: 'Water', items: [
        { href: '/nile', label: 'The Nile' },
        { href: '/sea', label: 'Red Sea & Mediterranean' },
        { href: '/cruises', label: 'Nile cruises' },
        { href: '/yachts', label: 'Yachts & marinas' },
      ]},
    ],
    feature: { title: 'Egypt 195', body: 'A gateway page for every country in the world — missions, routes and entry guidance.', href: '/egypt-195', cta: 'Choose your country' },
  },
  {
    key: 'heritage', label: 'nav.heritage', href: '/heritage',
    columns: [
      { title: 'Registry', items: [
        { href: '/heritage', label: 'Heritage registry' },
        { href: '/hidden-heritage', label: 'Hidden heritage', badge: 'New' },
        { href: '/restoration', label: 'Restoration pipeline' },
      ]},
      { title: 'Collections', items: [
        { href: '/museums', label: 'Museums' },
        { href: '/egyptian-heritage-worldwide', label: 'Egyptian heritage worldwide' },
      ]},
      { title: 'Learn', items: [
        { href: '/ancient-egypt-academy', label: 'Ancient Egypt Academy' },
        { href: '/research', label: 'Research & education' },
        { href: '/universities', label: 'Universities' },
      ]},
    ],
  },
  {
    key: 'plan', label: 'nav.plan', href: '/trip-builder',
    columns: [
      { title: 'Plan', items: [
        { href: '/trip-builder', label: 'Smart trip builder', badge: 'AI' },
        { href: '/my-itinerary', label: 'My itinerary' },
        { href: '/offers', label: 'Special offers' },
        { href: '/events', label: 'Events & festivals' },
      ]},
      { title: 'Stay & move', items: [
        { href: '/hotels', label: 'Hotels' },
        { href: '/accommodation', label: 'Accommodation' },
        { href: '/flights', label: 'Flights' },
        { href: '/transport', label: 'Transport' },
        { href: '/car-rental', label: 'Car rental' },
        { href: '/vip-transport', label: 'VIP transport' },
      ]},
      { title: 'Experience', items: [
        { href: '/guides', label: 'Guides' },
        { href: '/activities', label: 'Activities' },
        { href: '/restaurants', label: 'Restaurants' },
        { href: '/cafes', label: 'Cafés' },
        { href: '/shopping', label: 'Shopping' },
      ]},
      { title: 'Before you go', items: [
        { href: '/visa', label: 'Visa & entry' },
        { href: '/safety', label: 'Safety centre' },
        { href: '/health', label: 'Health & wellness' },
      ]},
    ],
  },
  {
    key: 'invest', label: 'nav.invest', href: '/invest',
    columns: [
      { title: 'Opportunities', items: [
        { href: '/invest', label: 'Invest in Egypt' },
        { href: '/investment-opportunities', label: 'Opportunity registry' },
        { href: '/tourism-investment', label: 'Tourism investment' },
        { href: '/entertainment-investment', label: 'Entertainment investment', badge: 'Hot' },
      ]},
      { title: 'Property & place', items: [
        { href: '/real-estate', label: 'Real estate' },
        { href: '/new-cities', label: 'New cities' },
        { href: '/rural-egypt', label: 'Rural Egypt' },
      ]},
      { title: 'Do business', items: [
        { href: '/business-setup', label: 'Business setup navigator' },
        { href: '/corporate-mice', label: 'Corporate & MICE' },
        { href: '/marketplace', label: 'Marketplace' },
      ]},
    ],
    feature: { title: 'Investment AI', body: 'Describe a budget and a sector; the Investment Agent compares governorates using labelled data.', href: '/invest#ai', cta: 'Try the analysis' },
  },
  {
    key: 'services', label: 'nav.services', href: '/support',
    columns: [
      { title: 'Health & research', items: [
        { href: '/medical-tourism', label: 'Medical tourism' },
        { href: '/wellness', label: 'Wellness' },
        { href: '/know-your-origin', label: 'Know your origin' },
        { href: '/research', label: 'Research programmes' },
      ]},
      { title: 'Marketplace', items: [
        { href: '/wear-egypt', label: 'Wear Egypt' },
        { href: '/marketplace', label: 'Made in Egypt' },
      ]},
      { title: 'Help', items: [
        { href: '/support', label: 'Support centre' },
        { href: '/safety', label: 'Safety & emergency' },
        { href: '/reviews', label: 'Reviews' },
        { href: '/traveler-stories', label: 'Traveller stories' },
        { href: '/media', label: 'Media centre' },
        { href: '/about', label: 'About Egypt One' },
      ]},
    ],
  },
];

export const SIDEBAR_GROUPS: { title: string; items: { href: string; label: string; badge?: string }[] }[] = [
  { title: 'Plan your trip', items: [
    { href: '/trip-builder', label: 'Smart trip planner', badge: 'AI' },
    { href: '/hotels', label: 'Hotels & stays' },
    { href: '/flights', label: 'Flights' },
    { href: '/transport', label: 'Transport' },
    { href: '/activities', label: 'Attractions & tours' },
    { href: '/nile', label: 'Nile & sea experiences' },
    { href: '/guides', label: 'Guides & assistants' },
    { href: '/restaurants', label: 'Food & restaurants' },
    { href: '/events', label: 'Events & festivals' },
  ]},
  { title: 'Discover Egypt', items: [
    { href: '/governorates', label: '27 governorates' },
    { href: '/egypt-through-time', label: 'Egypt through time' },
    { href: '/rulers-of-egypt', label: 'Rulers of Egypt' },
    { href: '/heritage', label: 'Heritage sites' },
    { href: '/museums', label: 'Museums & exhibitions' },
    { href: '/hidden-heritage', label: 'Hidden heritage', badge: 'New' },
    { href: '/egyptian-heritage-worldwide', label: 'Heritage worldwide' },
    { href: '/ancient-egypt-academy', label: 'Ancient Egypt Academy' },
    { href: '/egypt-195', label: 'Egypt 195' },
  ]},
  { title: 'Invest & business', items: [
    { href: '/invest', label: 'Invest in Egypt' },
    { href: '/entertainment-investment', label: 'Entertainment investment', badge: 'Hot' },
    { href: '/real-estate', label: 'Real estate & living' },
    { href: '/business-setup', label: 'Business setup' },
    { href: '/corporate-mice', label: 'Corporate & MICE' },
    { href: '/investment-opportunities', label: 'Opportunities' },
  ]},
  { title: 'Services', items: [
    { href: '/visa', label: 'Visa & entry' },
    { href: '/medical-tourism', label: 'Health & medical tourism' },
    { href: '/safety', label: 'Safety centre' },
    { href: '/account/pass', label: 'Egypt One Pass' },
    { href: '/account/wallet', label: 'Loyalty & rewards' },
  ]},
];

export const ACCOUNT_NAV: PortalNavItem[] = [
  { href: '/account', label: 'Overview' },
  { href: '/account/trips', label: 'My trips' },
  { href: '/account/bookings', label: 'Bookings' },
  { href: '/account/pass', label: 'Egypt One Pass' },
  { href: '/account/wallet', label: 'Wallet & rewards' },
  { href: '/account/consent', label: 'Privacy & consent' },
];

export const PROVIDER_NAV: PortalNavItem[] = [
  { href: '/provider', label: 'Dashboard' },
  { href: '/provider/profile', label: 'Business profile' },
  { href: '/provider/services', label: 'Services & inventory' },
  { href: '/provider/availability', label: 'Availability & pricing' },
  { href: '/provider/bookings', label: 'Bookings' },
  { href: '/provider/analytics', label: 'Analytics' },
  { href: '/provider/payouts', label: 'Payouts & settlement' },
  { href: '/provider/compliance', label: 'Compliance & documents' },
];

export const PARTNER_NAV: PortalNavItem[] = [
  { href: '/partner', label: 'Overview' },
  { href: '/partner/integrations', label: 'Integrations' },
  { href: '/partner/api', label: 'API & credentials' },
  { href: '/partner/transactions', label: 'Transactions' },
  { href: '/partner/analytics', label: 'Analytics' },
];

export const GOVERNMENT_NAV: PortalNavItem[] = [
  { href: '/government', label: 'National overview' },
  { href: '/government/tourism-intelligence', label: 'Tourism intelligence' },
  { href: '/government/national-map', label: 'National map' },
  { href: '/government/providers', label: 'Provider coverage' },
  { href: '/government/heritage', label: 'Heritage registry' },
  { href: '/government/restoration', label: 'Restoration pipeline' },
  { href: '/government/emergencies', label: 'Emergency aggregates' },
  { href: '/government/investment', label: 'Investment leads' },
  { href: '/government/analytics', label: 'Analytics' },
];

export const ADMIN_NAV: PortalNavItem[] = [
  { href: '/admin', label: 'Operations console' },
  { href: '/admin/content', label: 'Content & CMS' },
  { href: '/admin/users', label: 'Users & roles' },
  { href: '/admin/providers', label: 'Providers' },
  { href: '/admin/verification', label: 'Verification queue' },
  { href: '/admin/integrations', label: 'Integration registry' },
  { href: '/admin/revenue', label: 'Revenue control' },
  { href: '/admin/support', label: 'Support & moderation' },
  { href: '/admin/ai', label: 'AI agents & MCP' },
  { href: '/admin/audit', label: 'Audit log' },
  { href: '/admin/security', label: 'Security' },
  { href: '/admin/golden-license', label: 'Golden Licence readiness' },
];

export const FOOTER = [
  { title: 'footer.about', items: [
    { href: '/about', label: 'About us' }, { href: '/media', label: 'Media centre' },
    { href: '/traveler-stories', label: 'Traveller stories' }, { href: '/partner', label: 'Partners' },
  ]},
  { title: 'footer.travel', items: [
    { href: '/trip-builder', label: 'Plan your trip' }, { href: '/governorates', label: 'Destinations' },
    { href: '/guides', label: 'Travel guides' }, { href: '/visa', label: 'Visa information' },
  ]},
  { title: 'footer.invest', items: [
    { href: '/invest', label: 'Invest in Egypt' }, { href: '/investment-opportunities', label: 'Opportunities' },
    { href: '/business-setup', label: 'Business setup' }, { href: '/real-estate', label: 'Real estate' },
  ]},
  { title: 'footer.legal', items: [
    { href: '/about#terms', label: 'Terms & conditions' }, { href: '/about#privacy', label: 'Privacy policy' },
    { href: '/account/consent', label: 'Consent centre' }, { href: '/about#data', label: 'Data protection' },
  ]},
  { title: 'footer.support', items: [
    { href: '/support', label: 'Help centre' }, { href: '/support#contact', label: 'Contact us' },
    { href: '/safety', label: 'Safety centre' }, { href: '/support#report', label: 'Report an issue' },
  ]},
];
