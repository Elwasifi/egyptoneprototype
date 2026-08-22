export const ROLES = [
  'TOURIST', 'DOMESTIC_TRAVELER', 'INVESTOR', 'RESEARCHER', 'GUIDE', 'HOTEL',
  'RESTAURANT', 'TOUR_OPERATOR', 'TRANSPORT_PROVIDER', 'MEDICAL_PROVIDER',
  'UNIVERSITY', 'BUSINESS_PROVIDER', 'PARTNER', 'GOVERNMENT_OFFICER',
  'GOVERNMENT_ANALYST', 'MODERATOR', 'SUPPORT_AGENT', 'FINANCE', 'SECURITY',
  'ADMIN', 'SUPER_ADMIN', 'SYSTEM',
] as const;
export type Role = (typeof ROLES)[number];

export const PROVIDER_ROLES: Role[] = [
  'GUIDE', 'HOTEL', 'RESTAURANT', 'TOUR_OPERATOR', 'TRANSPORT_PROVIDER',
  'MEDICAL_PROVIDER', 'UNIVERSITY', 'BUSINESS_PROVIDER',
];
export const GOVERNMENT_ROLES: Role[] = ['GOVERNMENT_OFFICER', 'GOVERNMENT_ANALYST'];
export const ADMIN_ROLES: Role[] = ['ADMIN', 'SUPER_ADMIN'];

export const ROLE_LABEL: Record<Role, string> = {
  TOURIST: 'Tourist', DOMESTIC_TRAVELER: 'Domestic traveller', INVESTOR: 'Investor',
  RESEARCHER: 'Researcher', GUIDE: 'Licensed guide', HOTEL: 'Hotel',
  RESTAURANT: 'Restaurant', TOUR_OPERATOR: 'Tour operator',
  TRANSPORT_PROVIDER: 'Transport provider', MEDICAL_PROVIDER: 'Medical provider',
  UNIVERSITY: 'University', BUSINESS_PROVIDER: 'Business provider', PARTNER: 'Strategic partner',
  GOVERNMENT_OFFICER: 'Government officer', GOVERNMENT_ANALYST: 'Government analyst',
  MODERATOR: 'Moderator', SUPPORT_AGENT: 'Support agent', FINANCE: 'Finance',
  SECURITY: 'Security', ADMIN: 'Administrator', SUPER_ADMIN: 'Super administrator',
  SYSTEM: 'System',
};

export type PortalKey = 'public' | 'account' | 'provider' | 'partner' | 'government' | 'admin';
