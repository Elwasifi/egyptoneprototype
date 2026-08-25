import type { PortalNavItem } from '@egypt-one/ui';

/** Primary horizontal nav shown in the header at lg: and up. */
export const HEADER_NAV: { href: string; labelKey: string }[] = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/discover', labelKey: 'nav.headerExplore' },
  { href: '/activities', labelKey: 'nav.experiences' },
  { href: '/accommodation', labelKey: 'nav.stay' },
  { href: '/events', labelKey: 'nav.events' },
  { href: '/transport', labelKey: 'nav.transport' },
  { href: '/visa', labelKey: 'nav.services' },
  { href: '/support', labelKey: 'nav.esim' },
];

/** Grouped link data used by the mobile drawer — the full route list the header nav's 8 top-level items summarize. */
export const SIDEBAR_GROUPS: { title: string; items: { href: string; label: string; badge?: string }[] }[] = [
  { title: 'Plan your trip', items: [
    { href: '/trip-builder', label: 'Smart trip planner', badge: 'AI' },
    { href: '/my-itinerary', label: 'My itinerary' },
    { href: '/hotels', label: 'Hotels & stays' },
    { href: '/accommodation', label: 'Accommodation' },
    { href: '/flights', label: 'Flights' },
    { href: '/transport', label: 'Transport' },
    { href: '/car-rental', label: 'Car rental' },
    { href: '/vip-transport', label: 'VIP transport' },
    { href: '/activities', label: 'Attractions & tours' },
    { href: '/nile', label: 'Nile & sea experiences' },
    { href: '/guides', label: 'Guides & assistants' },
    { href: '/restaurants', label: 'Food & restaurants' },
    { href: '/cafes', label: 'Cafés' },
    { href: '/shopping', label: 'Shopping' },
    { href: '/events', label: 'Events & festivals' },
    { href: '/offers', label: 'Special offers' },
  ]},
  { title: 'Discover Egypt', items: [
    { href: '/map', label: 'Interactive map' },
    { href: '/governorates', label: '27 governorates' },
    { href: '/destinations/pyramids-of-giza', label: 'Popular destinations' },
    { href: '/new-cities', label: 'New cities' },
    { href: '/rural-egypt', label: 'Rural Egypt' },
    { href: '/egypt-through-time', label: 'Egypt through time' },
    { href: '/rulers-of-egypt', label: 'Rulers of Egypt' },
    { href: '/heritage', label: 'Heritage sites' },
    { href: '/museums', label: 'Museums & exhibitions' },
    { href: '/hidden-heritage', label: 'Hidden heritage', badge: 'New' },
    { href: '/egyptian-heritage-worldwide', label: 'Heritage worldwide' },
    { href: '/restoration', label: 'Restoration pipeline' },
    { href: '/ancient-egypt-academy', label: 'Ancient Egypt Academy' },
    { href: '/research', label: 'Research & education' },
    { href: '/universities', label: 'Universities' },
    { href: '/sea', label: 'Red Sea & Mediterranean' },
    { href: '/cruises', label: 'Nile cruises' },
    { href: '/yachts', label: 'Yachts & marinas' },
    { href: '/egypt-195', label: 'Egypt 195' },
  ]},
  { title: 'Invest & business', items: [
    { href: '/invest', label: 'Invest in Egypt' },
    { href: '/entertainment-investment', label: 'Entertainment investment', badge: 'Hot' },
    { href: '/tourism-investment', label: 'Tourism investment' },
    { href: '/real-estate', label: 'Real estate & living' },
    { href: '/business-setup', label: 'Business setup' },
    { href: '/corporate-mice', label: 'Corporate & MICE' },
    { href: '/investment-opportunities', label: 'Opportunities' },
    { href: '/marketplace', label: 'Made in Egypt marketplace' },
    { href: '/wear-egypt', label: 'Wear Egypt' },
  ]},
  { title: 'Services', items: [
    { href: '/visa', label: 'Visa & entry' },
    { href: '/medical-tourism', label: 'Health & medical tourism' },
    { href: '/health', label: 'Health' },
    { href: '/wellness', label: 'Wellness' },
    { href: '/know-your-origin', label: 'Know your origin' },
    { href: '/safety', label: 'Safety centre' },
    { href: '/support', label: 'Support centre' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/traveler-stories', label: 'Traveller stories' },
    { href: '/media', label: 'Media centre' },
    { href: '/about', label: 'About Egypt One' },
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
    { href: '/about', label: 'footer.link.aboutUs' }, { href: '/media', label: 'footer.link.media' },
    { href: '/traveler-stories', label: 'footer.link.travellerStories' }, { href: '/partner', label: 'footer.link.partners' },
  ]},
  { title: 'footer.travel', items: [
    { href: '/trip-builder', label: 'footer.link.planTrip' }, { href: '/governorates', label: 'footer.link.destinations' },
    { href: '/guides', label: 'footer.link.travelGuides' }, { href: '/visa', label: 'footer.link.visaInfo' },
  ]},
  { title: 'footer.invest', items: [
    { href: '/invest', label: 'footer.link.investEgypt' }, { href: '/investment-opportunities', label: 'footer.link.opportunities' },
    { href: '/business-setup', label: 'footer.link.businessSetup' }, { href: '/real-estate', label: 'footer.link.realEstate' },
  ]},
  { title: 'footer.legal', items: [
    { href: '/legal/terms', label: 'footer.link.terms' }, { href: '/legal/privacy', label: 'footer.link.privacy' },
    { href: '/legal/consent', label: 'footer.link.consent' }, { href: '/legal/data-protection', label: 'footer.link.dataProtection' },
  ]},
  { title: 'footer.support', items: [
    { href: '/support', label: 'footer.link.helpCentre' }, { href: '/contact', label: 'footer.link.contact' },
    { href: '/safety', label: 'footer.link.safety' }, { href: '/support#report', label: 'footer.link.reportIssue' },
  ]},
];
