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
      { title: 'mega.discover.places', items: [
        { href: '/governorates', label: 'mega.discover.governorates' },
        { href: '/destinations/pyramids-of-giza', label: 'mega.discover.destinations' },
        { href: '/map', label: 'mega.discover.map' },
        { href: '/rural-egypt', label: 'mega.discover.ruralEgypt' },
        { href: '/new-cities', label: 'mega.discover.newCities' },
      ]},
      { title: 'mega.discover.throughTime', items: [
        { href: '/egypt-through-time', label: 'mega.discover.egyptThroughTime' },
        { href: '/rulers-of-egypt', label: 'mega.discover.rulersOfEgypt' },
        { href: '/ancient-egypt-academy', label: 'mega.discover.academy' },
      ]},
      { title: 'mega.discover.water', items: [
        { href: '/nile', label: 'mega.discover.theNile' },
        { href: '/sea', label: 'mega.discover.seaMed' },
        { href: '/cruises', label: 'mega.discover.cruises' },
        { href: '/yachts', label: 'mega.discover.yachts' },
      ]},
    ],
    feature: { title: 'mega.discover.feature.title', body: 'mega.discover.feature.body', href: '/egypt-195', cta: 'mega.discover.feature.cta' },
  },
  {
    key: 'heritage', label: 'nav.heritage', href: '/heritage',
    columns: [
      { title: 'mega.heritage.registry', items: [
        { href: '/heritage', label: 'mega.heritage.registryItem' },
        { href: '/hidden-heritage', label: 'heritage.hidden.title', badge: 'New' },
        { href: '/restoration', label: 'heritage.restoration.title' },
      ]},
      { title: 'mega.heritage.collections', items: [
        { href: '/museums', label: 'mega.heritage.museums' },
        { href: '/egyptian-heritage-worldwide', label: 'heritage.worldwide.title' },
      ]},
      { title: 'mega.heritage.learn', items: [
        { href: '/ancient-egypt-academy', label: 'mega.discover.academy' },
        { href: '/research', label: 'modules.research.title' },
        { href: '/universities', label: 'mega.heritage.universities' },
      ]},
    ],
  },
  {
    key: 'plan', label: 'nav.plan', href: '/trip-builder',
    columns: [
      { title: 'mega.plan.plan', items: [
        { href: '/trip-builder', label: 'mega.plan.tripBuilder', badge: 'AI' },
        { href: '/my-itinerary', label: 'mega.plan.myItinerary' },
        { href: '/offers', label: 'mega.plan.specialOffers' },
        { href: '/events', label: 'mega.plan.events' },
      ]},
      { title: 'mega.plan.stayMove', items: [
        { href: '/hotels', label: 'quick.hotels' },
        { href: '/accommodation', label: 'mega.plan.accommodation' },
        { href: '/flights', label: 'quick.flights' },
        { href: '/transport', label: 'quick.transport' },
        { href: '/car-rental', label: 'mega.plan.carRental' },
        { href: '/vip-transport', label: 'mega.plan.vipTransport' },
      ]},
      { title: 'mega.plan.experience', items: [
        { href: '/guides', label: 'quick.guides' },
        { href: '/activities', label: 'mega.plan.activities' },
        { href: '/restaurants', label: 'mega.plan.restaurants' },
        { href: '/cafes', label: 'mega.plan.cafes' },
        { href: '/shopping', label: 'quick.shopping' },
      ]},
      { title: 'mega.plan.beforeYouGo', items: [
        { href: '/visa', label: 'mega.plan.visaEntry' },
        { href: '/safety', label: 'footer.link.safety' },
        { href: '/health', label: 'mega.plan.healthWellness' },
      ]},
    ],
  },
  {
    key: 'invest', label: 'nav.invest', href: '/invest',
    columns: [
      { title: 'mega.invest.opportunities', items: [
        { href: '/invest', label: 'footer.link.investEgypt' },
        { href: '/investment-opportunities', label: 'mega.invest.oppRegistry' },
        { href: '/tourism-investment', label: 'invest.cat.tourism' },
        { href: '/entertainment-investment', label: 'modules.entertainment.title', badge: 'Hot' },
      ]},
      { title: 'mega.invest.propertyPlace', items: [
        { href: '/real-estate', label: 'footer.link.realEstate' },
        { href: '/new-cities', label: 'mega.discover.newCities' },
        { href: '/rural-egypt', label: 'mega.discover.ruralEgypt' },
      ]},
      { title: 'mega.invest.doBusiness', items: [
        { href: '/business-setup', label: 'mega.invest.bizNavigator' },
        { href: '/corporate-mice', label: 'mega.invest.corporateMice' },
        { href: '/marketplace', label: 'mega.invest.marketplace' },
      ]},
    ],
    feature: { title: 'mega.invest.feature.title', body: 'mega.invest.feature.body', href: '/invest#ai', cta: 'mega.invest.feature.cta' },
  },
  {
    key: 'services', label: 'nav.services', href: '/support',
    columns: [
      { title: 'mega.services.healthResearch', items: [
        { href: '/medical-tourism', label: 'mega.services.medicalTourism' },
        { href: '/wellness', label: 'mega.services.wellness' },
        { href: '/know-your-origin', label: 'modules.origin.title' },
        { href: '/research', label: 'mega.services.researchProgrammes' },
      ]},
      { title: 'mega.invest.marketplace', items: [
        { href: '/wear-egypt', label: 'mega.services.wearEgypt' },
        { href: '/marketplace', label: 'mega.services.madeInEgypt' },
      ]},
      { title: 'mega.services.help', items: [
        { href: '/support', label: 'mega.services.supportCentre' },
        { href: '/safety', label: 'mega.services.safetyEmergency' },
        { href: '/reviews', label: 'mega.services.reviews' },
        { href: '/traveler-stories', label: 'footer.link.travellerStories' },
        { href: '/media', label: 'footer.link.media' },
        { href: '/about', label: 'mega.services.aboutEgyptOne' },
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
