import type { DataClass, Role } from '@egypt-one/types';

/**
 * The agent contract.
 *
 * Permission boundaries are data, not prose: the orchestrator reads these
 * fields before routing, and the API enforces them again before any tool runs.
 * `cannotDo` is not decoration — each entry maps to a guard in packages/security.
 */
export interface AgentSpec {
  key: string;
  index: number;
  name: string;
  /** Shown in the UI trace line. The user never has to pick an agent. */
  publicLabel: string;
  purpose: string;
  canDo: string[];
  cannotDo: string[];
  allowedTools: string[];
  dataClasses: DataClass[];
  /** Explicit deny-list, checked before dataClasses — belt-and-braces against a future accidental grant. */
  deniedDataClasses: DataClass[];
  /** Calls per minute this agent may make across all its tools, combined. */
  rateLimitPerMin: number;
  requiredRoles: Role[] | 'ANY';
  requiresHumanApproval: boolean;
  requiresConsent?: string[];
  /** What the composer must attach to any answer this agent contributes to. */
  sourceLabelPolicy: 'MUST_CITE_OFFICIAL' | 'MUST_CITE_PROVIDER' | 'MUST_LABEL' | 'ANALYSIS_ONLY';
}

export const AGENTS: AgentSpec[] = [
  {
    key: 'CONCIERGE', index: 0, name: 'Master AI Concierge / Orchestrator',
    publicLabel: 'Egypt One Concierge',
    purpose: 'The single conversational interface. Detects intent, decomposes requests, routes to specialists, holds context, gates permissions and composes the final answer with source labels.',
    canDo: ['Converse in any supported language', 'Detect intent and decompose requests', 'Route to approved specialist agents', 'Hold conversation and trip context', 'Compose answers with citations', 'Refuse and explain when a boundary is hit'],
    cannotDo: ['Override a government decision', 'Modify restricted data', 'Present demo data as an official answer', 'Route to an agent the caller is not permitted to use'],
    allowedTools: ['search.query', 'content.get', 'analytics.trackEvent'],
    dataClasses: ['PUBLIC', 'PERSONAL'],
    deniedDataClasses: ['SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE', 'RESTRICTED_GOVERNMENT'],
    rateLimitPerMin: 120,
    requiredRoles: 'ANY', requiresHumanApproval: false, sourceLabelPolicy: 'MUST_LABEL',
  },
  {
    key: 'TRIP_PLANNER', index: 1, name: 'Trip Planner Agent',
    publicLabel: 'trip planning',
    purpose: 'Builds and optimises itineraries from dates, interests, budget, party composition and accessibility needs.',
    canDo: ['Build day-by-day itineraries', 'Optimise routing between governorates', 'Balance interests against time and budget', 'Suggest seasonal alternatives'],
    cannotDo: ['Issue tickets', 'Take payment', 'Confirm availability without the Booking Agent', 'Invent opening hours'],
    allowedTools: ['governorates.list', 'governorates.get', 'destinations.search', 'heritage.search', 'provider.search', 'trip.buildItinerary'],
    dataClasses: ['PUBLIC', 'PERSONAL'],
    deniedDataClasses: ['SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE', 'RESTRICTED_GOVERNMENT'],
    rateLimitPerMin: 60,
    requiredRoles: 'ANY', requiresHumanApproval: false, sourceLabelPolicy: 'MUST_LABEL',
  },
  {
    key: 'HERITAGE', index: 2, name: 'Destination & Heritage Agent',
    publicLabel: 'heritage and destinations',
    purpose: 'Explains destinations, monuments, museums, eras and rulers, preferring verified historical sources.',
    canDo: ['Explain sites, eras and rulers', 'Link sites to museums and academic references', 'Describe recorded access classifications'],
    cannotDo: ['Invent history', 'Assert opening hours or ticket prices', 'Imply public access to a restricted site', 'Assert provenance for objects held abroad'],
    allowedTools: ['heritage.get', 'heritage.search', 'museums.list', 'rulers.list', 'eras.list', 'worldwide.list'],
    dataClasses: ['PUBLIC'],
    deniedDataClasses: ['PERSONAL', 'SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE', 'RESTRICTED_GOVERNMENT'],
    rateLimitPerMin: 120,
    requiredRoles: 'ANY', requiresHumanApproval: false, sourceLabelPolicy: 'MUST_CITE_OFFICIAL',
  },
  {
    key: 'BOOKING', index: 3, name: 'Booking Agent',
    publicLabel: 'booking',
    purpose: 'Handles accommodation, flights, guides, transport, activities, restaurants and tickets through approved provider adapters.',
    canDo: ['Query connected provider adapters', 'Return availability that an adapter actually returned', 'Create a draft booking', 'Explain a cancellation policy that a provider supplied'],
    cannotDo: ['Invent prices or availability', 'Book through an adapter that is not LIVE', 'Hold or move funds', 'Apply a commission outside the configured revenue rules'],
    allowedTools: ['booking.searchAccommodation', 'booking.searchTransport', 'booking.searchActivity', 'booking.createDraft', 'payments.quote'],
    dataClasses: ['PUBLIC', 'PARTNER', 'PERSONAL'],
    deniedDataClasses: ['SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE', 'RESTRICTED_GOVERNMENT'],
    rateLimitPerMin: 30,
    requiredRoles: 'ANY', requiresHumanApproval: false, sourceLabelPolicy: 'MUST_CITE_PROVIDER',
  },
  {
    key: 'LANGUAGE', index: 4, name: 'Translation & Language Agent',
    publicLabel: 'translation',
    purpose: 'Translates and localises answers across the supported languages without changing the underlying facts.',
    canDo: ['Translate answers', 'Adapt register and formality', 'Explain Arabic and Ancient Egyptian terms'],
    cannotDo: ['Modify source facts', 'Soften a legal or safety caveat in translation', 'Drop a source label during translation'],
    allowedTools: ['content.translate', 'i18n.missingKeys'],
    dataClasses: ['PUBLIC'],
    deniedDataClasses: ['PERSONAL', 'SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE', 'RESTRICTED_GOVERNMENT'],
    rateLimitPerMin: 120,
    requiredRoles: 'ANY', requiresHumanApproval: false, sourceLabelPolicy: 'MUST_LABEL',
  },
  {
    key: 'GUIDE_MATCH', index: 5, name: 'Guide Matching Agent',
    publicLabel: 'guide matching',
    purpose: 'Matches travellers to guides on language, governorate, specialty, availability, rating and accessibility expertise.',
    canDo: ['Rank guides against stated needs', 'Explain why a guide matched', 'Show verification state honestly'],
    cannotDo: ['Describe a person as officially licensed without a verification record', 'Share a guide’s personal contact details', 'Guarantee availability'],
    allowedTools: ['provider.search', 'provider.get', 'verification.check'],
    dataClasses: ['PUBLIC', 'PARTNER'],
    deniedDataClasses: ['PERSONAL', 'SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE', 'RESTRICTED_GOVERNMENT'],
    rateLimitPerMin: 60,
    requiredRoles: 'ANY', requiresHumanApproval: false, sourceLabelPolicy: 'MUST_CITE_PROVIDER',
  },
  {
    key: 'SAFETY', index: 6, name: 'Safety Agent',
    publicLabel: 'safety',
    purpose: 'Traveller safety guidance, emergency navigation, embassy assistance, lost document and lost person workflows.',
    canDo: ['Explain emergency numbers and procedures', 'Route to the correct embassy or authority', 'Walk through a lost passport workflow', 'Escalate to a human operator'],
    cannotDo: ['Access precise location without EMERGENCY_MODE consent', 'Contact authorities on the user’s behalf without consent', 'Give medical or legal instructions'],
    allowedTools: ['safety.getGuidance', 'embassy.lookup', 'location.readWithConsent', 'support.escalate'],
    dataClasses: ['PUBLIC', 'PERSONAL', 'SENSITIVE', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE'],
    deniedDataClasses: ['FINANCIAL', 'HEALTH', 'RESTRICTED_GOVERNMENT'],
    rateLimitPerMin: 20,
    requiredRoles: 'ANY', requiresHumanApproval: false,
    requiresConsent: ['LOCATION'], sourceLabelPolicy: 'MUST_CITE_OFFICIAL',
  },
  {
    key: 'MEDICAL', index: 7, name: 'Medical Tourism Agent',
    publicLabel: 'medical tourism',
    purpose: 'Helps discover accredited providers and coordinate a medical or wellness journey.',
    canDo: ['List verified providers and their stated specialties', 'Explain a typical medical travel journey', 'Coordinate travel around an appointment'],
    cannotDo: ['Diagnose', 'Recommend a treatment', 'Interpret test results', 'Store or transmit health data without explicit consent', 'Assert accreditation without a verification record'],
    allowedTools: ['health.searchProviders', 'health.getProvider', 'verification.check'],
    dataClasses: ['PUBLIC', 'SENSITIVE', 'HEALTH'],
    deniedDataClasses: ['FINANCIAL', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE', 'RESTRICTED_GOVERNMENT'],
    rateLimitPerMin: 20,
    requiredRoles: 'ANY', requiresHumanApproval: false,
    requiresConsent: ['HEALTH_DATA'], sourceLabelPolicy: 'MUST_CITE_PROVIDER',
  },
  {
    key: 'INVESTMENT', index: 8, name: 'Investment Agent',
    publicLabel: 'investment analysis',
    purpose: 'Matches capital and sector intent to opportunities, compares governorates and surfaces demand signals.',
    canDo: ['Compare governorates on labelled indicators', 'Shortlist opportunities by sector and ticket size', 'Name the competent entity for each opportunity', 'State risks explicitly'],
    cannotDo: ['Guarantee a return', 'Invent an opportunity, licence or land allocation', 'Present analysis as official approval', 'Give regulated financial advice'],
    allowedTools: ['investment.search', 'investment.get', 'analytics.governorateDemand', 'property.search'],
    dataClasses: ['PUBLIC', 'PARTNER'],
    deniedDataClasses: ['PERSONAL', 'SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE', 'RESTRICTED_GOVERNMENT'],
    rateLimitPerMin: 60,
    requiredRoles: 'ANY', requiresHumanApproval: false, sourceLabelPolicy: 'ANALYSIS_ONLY',
  },
  {
    key: 'BUSINESS_SETUP', index: 9, name: 'Business Setup Agent',
    publicLabel: 'business setup navigation',
    purpose: 'Navigates the steps, authorities, licences and documents involved in establishing a business.',
    canDo: ['Sequence the steps for an activity and legal form', 'Name the responsible authorities', 'List required documents', 'Link to the official application channel'],
    cannotDo: ['Issue or approve anything', 'Submit an application', 'State that a licence will be granted', 'Give legal advice'],
    allowedTools: ['gov.getProcedure', 'gov.listAuthorities', 'business.checklist'],
    dataClasses: ['PUBLIC', 'RESTRICTED_GOVERNMENT'],
    deniedDataClasses: ['PERSONAL', 'SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE'],
    rateLimitPerMin: 60,
    requiredRoles: 'ANY', requiresHumanApproval: false, sourceLabelPolicy: 'MUST_CITE_OFFICIAL',
  },
  {
    key: 'GOV_SERVICES', index: 10, name: 'Government Services Agent',
    publicLabel: 'government services navigation',
    purpose: 'Navigates integrated government services and explains verified procedures.',
    canDo: ['Explain a procedure that a connected authority published', 'Route a request to an approved system', 'Report integration state honestly'],
    cannotDo: ['Write to a government system without an explicit transaction permission', 'Approve, reject or issue anything', 'Answer from demo data when asked an official question'],
    allowedTools: ['gov.getProcedure', 'gov.integrationStatus', 'gov.submitIfPermitted'],
    dataClasses: ['PUBLIC', 'RESTRICTED_GOVERNMENT'],
    deniedDataClasses: ['PERSONAL', 'SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE'],
    rateLimitPerMin: 30,
    requiredRoles: 'ANY', requiresHumanApproval: true, sourceLabelPolicy: 'MUST_CITE_OFFICIAL',
  },
  {
    key: 'TOURISM_INTEL', index: 11, name: 'Tourism Intelligence Agent',
    publicLabel: 'tourism intelligence',
    purpose: 'Aggregated analytics for authorised government and operations users.',
    canDo: ['Report aggregated demand, flows and provider coverage', 'Highlight emerging destinations and gaps', 'Compare periods'],
    cannotDo: ['Expose individual personal data', 'Return a cohort small enough to re-identify a person', 'Serve a caller without an analyst or officer role'],
    allowedTools: ['analytics.aggregate', 'analytics.governorateDemand', 'analytics.providerGaps'],
    dataClasses: ['PUBLIC', 'RESTRICTED_GOVERNMENT'],
    deniedDataClasses: ['PERSONAL', 'SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE'],
    rateLimitPerMin: 60,
    requiredRoles: ['GOVERNMENT_ANALYST', 'GOVERNMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    requiresHumanApproval: false, sourceLabelPolicy: 'MUST_LABEL',
  },
  {
    key: 'TRUST', index: 12, name: 'Trust & Verification Agent',
    publicLabel: 'verification',
    purpose: 'Checks source provenance, provider verification state, listing anomalies and AI confidence labelling.',
    canDo: ['Report a record’s source status and owner', 'Flag suspicious or unverified listings', 'Downgrade a claim that lacks a labelled source'],
    cannotDo: ['Grant verification', 'Represent a platform check as a government licence'],
    allowedTools: ['verification.check', 'content.provenance', 'trust.flagListing'],
    dataClasses: ['PUBLIC', 'PARTNER'],
    deniedDataClasses: ['PERSONAL', 'SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE', 'RESTRICTED_GOVERNMENT'],
    rateLimitPerMin: 60,
    requiredRoles: 'ANY', requiresHumanApproval: false, sourceLabelPolicy: 'MUST_LABEL',
  },
  {
    key: 'RESEARCH', index: 13, name: 'Research & Education Agent',
    publicLabel: 'research and education',
    purpose: 'Universities, research programmes, Egyptology, archives and academic partnerships.',
    canDo: ['Find programmes by field, degree and language', 'Explain a typical research permit pathway', 'Point to archives and collections'],
    cannotDo: ['Grant a research or excavation permit', 'Promise admission', 'Assert that an archive holds a specific unverified item'],
    allowedTools: ['research.search', 'research.get', 'universities.list', 'heritage.search'],
    dataClasses: ['PUBLIC'],
    deniedDataClasses: ['PERSONAL', 'SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE', 'RESTRICTED_GOVERNMENT'],
    rateLimitPerMin: 60,
    requiredRoles: 'ANY', requiresHumanApproval: false, sourceLabelPolicy: 'MUST_CITE_OFFICIAL',
  },
  {
    key: 'MARKETING', index: 14, name: 'Marketing Agent',
    publicLabel: 'marketing',
    purpose: 'Campaign recommendations, destination promotion, traveller story routing and segmentation.',
    canDo: ['Recommend campaigns from aggregated signals', 'Classify traveller content', 'Queue content for human review'],
    cannotDo: ['Publish anything without human approval', 'Use sensitive data for targeting', 'Post to an external channel automatically'],
    allowedTools: ['marketing.queue', 'analytics.aggregate', 'content.classify'],
    dataClasses: ['PUBLIC', 'PARTNER'],
    deniedDataClasses: ['PERSONAL', 'SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE', 'RESTRICTED_GOVERNMENT'],
    rateLimitPerMin: 30,
    requiredRoles: ['MODERATOR', 'ADMIN', 'SUPER_ADMIN'],
    requiresHumanApproval: true, sourceLabelPolicy: 'MUST_LABEL',
  },
  {
    key: 'OPERATIONS', index: 15, name: 'Operations Agent',
    publicLabel: 'operations',
    purpose: 'Support triage, provider onboarding, workflow routing and operational alerts.',
    canDo: ['Triage a support case', 'Route an onboarding task', 'Raise an operational alert'],
    cannotDo: ['Change a verification decision', 'Alter financial records', 'Access health data'],
    allowedTools: ['support.triage', 'provider.onboardingStatus', 'ops.alert'],
    dataClasses: ['PUBLIC', 'PERSONAL'],
    deniedDataClasses: ['SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE', 'RESTRICTED_GOVERNMENT'],
    rateLimitPerMin: 60,
    requiredRoles: ['SUPPORT_AGENT', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'],
    requiresHumanApproval: false, sourceLabelPolicy: 'MUST_LABEL',
  },
];

export const agentByKey = (key: string) => AGENTS.find((a) => a.key === key);
export const SPECIALISTS = AGENTS.filter((a) => a.key !== 'CONCIERGE');
