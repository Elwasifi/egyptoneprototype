import { z } from 'zod';
import type { DataClass } from '@egypt-one/types';

export type ToolState = 'PLANNED' | 'SANDBOX' | 'LIVE' | 'DISABLED';

/**
 * MCP tool declaration.
 *
 * Every tool in the platform is declared here before it can be called. The
 * gateway refuses anything not in this registry, and refuses a registered tool
 * whose state, permissions or data class does not match the caller.
 */
export interface McpTool<I = unknown, O = unknown> {
  key: string;
  server: string;
  name: string;
  description: string;
  inputSchema: z.ZodType<I>;
  permissions: string[];
  dataClass: DataClass;
  sourceOwner: string;
  auditRequired: boolean;
  rateLimitPerMin: number;
  state: ToolState;
  /** Implementation is injected by the host so the registry stays transport-agnostic. */
  handler?: (input: I, ctx: ToolContext) => Promise<O>;
}

export interface ToolContext {
  userId?: string;
  roles: string[];
  organisationId?: string;
  purpose?: string;
  consents: string[];
  locale: string;
  audit: (entry: { action: string; resource: string; decision: string; dataClass: DataClass; note?: string }) => void;
}

export interface McpServerSpec {
  key: string;
  name: string;
  family: string;
  description: string;
  state: ToolState;
}

export const MCP_SERVERS: McpServerSpec[] = [
  { key: 'tourism-knowledge', name: 'Tourism Knowledge MCP', family: 'Content', description: 'Destinations, itineraries, seasons and traveller-facing knowledge.', state: 'SANDBOX' },
  { key: 'heritage', name: 'Heritage MCP', family: 'Content', description: 'Heritage registry, museums, eras, rulers and objects held abroad.', state: 'SANDBOX' },
  { key: 'governorates', name: 'Governorates MCP', family: 'Geography', description: 'The 27 governorates, cities, villages and districts.', state: 'SANDBOX' },
  { key: 'booking', name: 'Booking MCP', family: 'Commerce', description: 'Availability and draft bookings through provider adapters.', state: 'PLANNED' },
  { key: 'provider', name: 'Provider MCP', family: 'Supply', description: 'Provider directory, verification state and inventory.', state: 'SANDBOX' },
  { key: 'transport', name: 'Transport MCP', family: 'Commerce', description: 'Ground transport, transfers and car rental.', state: 'PLANNED' },
  { key: 'investment', name: 'Investment MCP', family: 'Investment', description: 'Opportunities, property and demand indicators.', state: 'SANDBOX' },
  { key: 'research', name: 'Research MCP', family: 'Education', description: 'Universities, programmes and archives.', state: 'SANDBOX' },
  { key: 'health', name: 'Health Provider MCP', family: 'Health', description: 'Accredited medical and wellness providers. Elevated data class.', state: 'PLANNED' },
  { key: 'payments', name: 'Payments MCP', family: 'Finance', description: 'Quotes and settlement figures through a licensed PSP adapter.', state: 'PLANNED' },
  { key: 'analytics', name: 'Analytics MCP', family: 'Intelligence', description: 'Aggregated tourism and investment analytics.', state: 'SANDBOX' },
  { key: 'content', name: 'Content MCP', family: 'Content', description: 'CMS blocks, translations and provenance.', state: 'SANDBOX' },
  { key: 'government', name: 'Government Integration MCP', family: 'Government', description: 'Read-only procedure and registry exchange with competent authorities.', state: 'PLANNED' },
  { key: 'search', name: 'Search MCP', family: 'Platform', description: 'Unified cross-entity search.', state: 'SANDBOX' },
  { key: 'map', name: 'Map / Location MCP', family: 'Platform', description: 'Geocoding, distance and consent-gated location reads.', state: 'PLANNED' },
];

const S = z;

/** Declarations only — handlers are attached by the host in packages/skills. */
export const MCP_TOOLS: McpTool[] = [
  {
    key: 'governorates.list', server: 'governorates', name: 'List governorates',
    description: 'Return all 27 governorates with region, capital and demo indicators.',
    inputSchema: S.object({ region: S.string().optional(), hasCoast: S.boolean().optional() }),
    permissions: ['content:read'], dataClass: 'PUBLIC', sourceOwner: 'Egypt One content team',
    auditRequired: false, rateLimitPerMin: 120, state: 'SANDBOX',
  },
  {
    key: 'governorates.get', server: 'governorates', name: 'Get governorate',
    description: 'Full profile for one governorate including heritage, cuisine, crafts and investment sectors.',
    inputSchema: S.object({ slug: S.string() }),
    permissions: ['content:read'], dataClass: 'PUBLIC', sourceOwner: 'Egypt One content team',
    auditRequired: false, rateLimitPerMin: 120, state: 'SANDBOX',
  },
  {
    key: 'destinations.search', server: 'tourism-knowledge', name: 'Search destinations',
    description: 'Find destinations by governorate, category or free text.',
    inputSchema: S.object({ q: S.string().optional(), governorate: S.string().optional(), category: S.string().optional(), limit: S.number().max(50).default(12) }),
    permissions: ['content:read'], dataClass: 'PUBLIC', sourceOwner: 'Egypt One content team',
    auditRequired: false, rateLimitPerMin: 120, state: 'SANDBOX',
  },
  {
    key: 'heritage.search', server: 'heritage', name: 'Search heritage registry',
    description: 'Search heritage sites by era, classification, governorate or access state.',
    inputSchema: S.object({ q: S.string().optional(), era: S.string().optional(), governorate: S.string().optional(), hidden: S.boolean().optional(), limit: S.number().max(50).default(12) }),
    permissions: ['content:read'], dataClass: 'PUBLIC', sourceOwner: 'Ministry of Tourism and Antiquities (planned)',
    auditRequired: false, rateLimitPerMin: 120, state: 'SANDBOX',
  },
  {
    key: 'heritage.get', server: 'heritage', name: 'Get heritage site',
    description: 'One heritage record with access classification, restoration state and references. Never asserts opening hours.',
    inputSchema: S.object({ slug: S.string() }),
    permissions: ['content:read'], dataClass: 'PUBLIC', sourceOwner: 'Ministry of Tourism and Antiquities (planned)',
    auditRequired: false, rateLimitPerMin: 120, state: 'SANDBOX',
  },
  {
    key: 'museums.list', server: 'heritage', name: 'List museums',
    description: 'Museums by governorate.',
    inputSchema: S.object({ governorate: S.string().optional() }),
    permissions: ['content:read'], dataClass: 'PUBLIC', sourceOwner: 'Egypt One content team',
    auditRequired: false, rateLimitPerMin: 120, state: 'SANDBOX',
  },
  {
    key: 'rulers.list', server: 'heritage', name: 'List rulers',
    description: 'Ruler index, optionally filtered by era.',
    inputSchema: S.object({ era: S.string().optional() }),
    permissions: ['content:read'], dataClass: 'PUBLIC', sourceOwner: 'Egypt One content team',
    auditRequired: false, rateLimitPerMin: 120, state: 'SANDBOX',
  },
  {
    key: 'eras.list', server: 'heritage', name: 'List historical eras',
    description: 'The eleven eras used across the timeline and registry.',
    inputSchema: S.object({}),
    permissions: ['content:read'], dataClass: 'PUBLIC', sourceOwner: 'Egypt One content team',
    auditRequired: false, rateLimitPerMin: 120, state: 'SANDBOX',
  },
  {
    key: 'worldwide.list', server: 'heritage', name: 'List Egyptian heritage abroad',
    description: 'Catalogue of Egyptian objects held outside Egypt. Provenance is never asserted.',
    inputSchema: S.object({ country: S.string().optional() }),
    permissions: ['content:read'], dataClass: 'PUBLIC', sourceOwner: 'Holding institutions (planned)',
    auditRequired: false, rateLimitPerMin: 60, state: 'SANDBOX',
  },
  {
    key: 'provider.search', server: 'provider', name: 'Search providers',
    description: 'Find providers by type, governorate, language, specialty or availability.',
    inputSchema: S.object({ type: S.string().optional(), governorate: S.string().optional(), language: S.string().optional(), specialty: S.string().optional(), verifiedOnly: S.boolean().default(false), limit: S.number().max(50).default(12) }),
    permissions: ['provider:read'], dataClass: 'PUBLIC', sourceOwner: 'Registered providers',
    auditRequired: false, rateLimitPerMin: 120, state: 'SANDBOX',
  },
  {
    key: 'provider.get', server: 'provider', name: 'Get provider',
    description: 'One provider profile with verification state. Personal contact details are never returned.',
    inputSchema: S.object({ slug: S.string() }),
    permissions: ['provider:read'], dataClass: 'PUBLIC', sourceOwner: 'Registered providers',
    auditRequired: false, rateLimitPerMin: 120, state: 'SANDBOX',
  },
  {
    key: 'verification.check', server: 'provider', name: 'Check verification',
    description: 'Return the verification record for a provider or licence reference. Absence of a record means unverified.',
    inputSchema: S.object({ slug: S.string() }),
    permissions: ['provider:read'], dataClass: 'PARTNER', sourceOwner: 'Egypt One verification workflow',
    auditRequired: true, rateLimitPerMin: 60, state: 'SANDBOX',
  },
  {
    key: 'booking.searchAccommodation', server: 'booking', name: 'Search accommodation availability',
    description: 'Live availability through a connected accommodation adapter. Returns nothing while no adapter is LIVE.',
    inputSchema: S.object({ governorate: S.string(), checkIn: S.string(), checkOut: S.string(), adults: S.number().default(2), children: S.number().default(0) }),
    permissions: ['booking:read'], dataClass: 'PARTNER', sourceOwner: 'Accommodation partners',
    auditRequired: true, rateLimitPerMin: 30, state: 'PLANNED',
  },
  {
    key: 'booking.createDraft', server: 'booking', name: 'Create draft booking',
    description: 'Create a DRAFT booking. Confirmation requires a licensed PSP and a LIVE provider adapter.',
    inputSchema: S.object({ providerSlug: S.string(), serviceClass: S.string(), startDate: S.string(), travellers: S.number().default(1) }),
    permissions: ['booking:write'], dataClass: 'PERSONAL', sourceOwner: 'Egypt One',
    auditRequired: true, rateLimitPerMin: 20, state: 'PLANNED',
  },
  {
    key: 'payments.quote', server: 'payments', name: 'Quote a payment',
    description: 'Compute gross, commission, tax and provider share using the configured revenue rules.',
    inputSchema: S.object({ serviceClass: S.string(), grossAmount: S.number(), currency: S.string().default('USD') }),
    permissions: ['finance:read'], dataClass: 'PARTNER', sourceOwner: 'Egypt One revenue configuration',
    auditRequired: true, rateLimitPerMin: 60, state: 'SANDBOX',
  },
  {
    key: 'investment.search', server: 'investment', name: 'Search investment opportunities',
    description: 'Filter opportunities by sector, governorate, stage and ticket size.',
    inputSchema: S.object({ sector: S.string().optional(), governorate: S.string().optional(), minUsd: S.number().optional(), maxUsd: S.number().optional(), limit: S.number().max(50).default(12) }),
    permissions: ['investment:read'], dataClass: 'PUBLIC', sourceOwner: 'Competent entities (planned)',
    auditRequired: false, rateLimitPerMin: 60, state: 'SANDBOX',
  },
  {
    key: 'investment.get', server: 'investment', name: 'Get investment opportunity',
    description: 'One opportunity with competent entity, restrictions, risks and documents.',
    inputSchema: S.object({ slug: S.string() }),
    permissions: ['investment:read'], dataClass: 'PUBLIC', sourceOwner: 'Competent entities (planned)',
    auditRequired: false, rateLimitPerMin: 60, state: 'SANDBOX',
  },
  {
    key: 'property.search', server: 'investment', name: 'Search property',
    description: 'Residential, commercial, hospitality and land listings.',
    inputSchema: S.object({ governorate: S.string().optional(), propertyType: S.string().optional(), limit: S.number().max(50).default(12) }),
    permissions: ['investment:read'], dataClass: 'PUBLIC', sourceOwner: 'Listing providers',
    auditRequired: false, rateLimitPerMin: 60, state: 'SANDBOX',
  },
  {
    key: 'analytics.governorateDemand', server: 'analytics', name: 'Governorate demand indicators',
    description: 'Aggregated, synthetic demand indicators per governorate.',
    inputSchema: S.object({ governorate: S.string().optional() }),
    permissions: ['analytics:read'], dataClass: 'PUBLIC', sourceOwner: 'Egypt One demo generator',
    auditRequired: false, rateLimitPerMin: 60, state: 'SANDBOX',
  },
  {
    key: 'analytics.aggregate', server: 'analytics', name: 'Aggregate analytics',
    description: 'Aggregated tourism metrics. Refuses any cohort small enough to re-identify an individual.',
    inputSchema: S.object({ metric: S.string(), groupBy: S.string().optional(), minCohort: S.number().default(25) }),
    permissions: ['analytics:read:restricted'], dataClass: 'RESTRICTED_GOVERNMENT', sourceOwner: 'Egypt One demo generator',
    auditRequired: true, rateLimitPerMin: 30, state: 'SANDBOX',
  },
  {
    key: 'analytics.providerGaps', server: 'analytics', name: 'Provider coverage gaps',
    description: 'Governorates where provider or guide coverage sits below the demand indicator.',
    inputSchema: S.object({}),
    permissions: ['analytics:read:restricted'], dataClass: 'RESTRICTED_GOVERNMENT', sourceOwner: 'Egypt One demo generator',
    auditRequired: true, rateLimitPerMin: 30, state: 'SANDBOX',
  },
  {
    key: 'research.search', server: 'research', name: 'Search research programmes',
    description: 'Programmes by field, degree, university and language.',
    inputSchema: S.object({ field: S.string().optional(), degree: S.string().optional(), limit: S.number().max(50).default(12) }),
    permissions: ['content:read'], dataClass: 'PUBLIC', sourceOwner: 'Universities (planned)',
    auditRequired: false, rateLimitPerMin: 60, state: 'SANDBOX',
  },
  {
    key: 'health.searchProviders', server: 'health', name: 'Search medical providers',
    description: 'Accredited medical and wellness providers. Requires health-data consent for any personalised result.',
    inputSchema: S.object({ specialty: S.string().optional(), governorate: S.string().optional(), language: S.string().optional() }),
    permissions: ['health:read'], dataClass: 'SENSITIVE', sourceOwner: 'Accredited providers (planned)',
    auditRequired: true, rateLimitPerMin: 20, state: 'PLANNED',
  },
  {
    key: 'gov.getProcedure', server: 'government', name: 'Get government procedure',
    description: 'A procedure published by a competent authority. Returns nothing while the integration is not connected.',
    inputSchema: S.object({ key: S.string() }),
    permissions: ['gov:read'], dataClass: 'RESTRICTED_GOVERNMENT', sourceOwner: 'Competent authority',
    auditRequired: true, rateLimitPerMin: 30, state: 'PLANNED',
  },
  {
    key: 'gov.integrationStatus', server: 'government', name: 'Government integration status',
    description: 'Which authority exchanges are connected, and in what state.',
    inputSchema: S.object({}),
    permissions: ['gov:read'], dataClass: 'PUBLIC', sourceOwner: 'Egypt One integration registry',
    auditRequired: false, rateLimitPerMin: 60, state: 'SANDBOX',
  },
  {
    key: 'embassy.lookup', server: 'government', name: 'Embassy lookup',
    description: 'Egyptian missions and foreign missions in Egypt. Official directory only.',
    inputSchema: S.object({ country: S.string() }),
    permissions: ['gov:read'], dataClass: 'RESTRICTED_GOVERNMENT', sourceOwner: 'Ministry of Foreign Affairs (planned)',
    auditRequired: true, rateLimitPerMin: 30, state: 'PLANNED',
  },
  {
    key: 'location.readWithConsent', server: 'map', name: 'Read location with consent',
    description: 'Reads the traveller’s location only in TRIP_MODE or EMERGENCY_MODE, and always writes an audit row.',
    inputSchema: S.object({ purpose: S.enum(['TRIP', 'EMERGENCY']) }),
    permissions: ['location:read'], dataClass: 'SENSITIVE', sourceOwner: 'Traveller',
    auditRequired: true, rateLimitPerMin: 20, state: 'PLANNED',
  },
  {
    key: 'search.query', server: 'search', name: 'Unified search',
    description: 'Cross-entity search over every public record.',
    inputSchema: S.object({ q: S.string(), limit: S.number().max(50).default(20) }),
    permissions: ['content:read'], dataClass: 'PUBLIC', sourceOwner: 'Egypt One',
    auditRequired: false, rateLimitPerMin: 240, state: 'SANDBOX',
  },
  {
    key: 'trip.buildItinerary', server: 'tourism-knowledge', name: 'Build itinerary',
    description: 'Compose a day-by-day itinerary from a trip brief.',
    inputSchema: S.object({
      days: S.number().min(1).max(30), interests: S.array(S.string()).default([]),
      budgetUsd: S.number().optional(), partyType: S.string().optional(),
      accessibility: S.array(S.string()).default([]), languages: S.array(S.string()).default([]),
      startGovernorate: S.string().default('cairo'),
    }),
    permissions: ['content:read'], dataClass: 'PUBLIC', sourceOwner: 'Egypt One',
    auditRequired: false, rateLimitPerMin: 30, state: 'SANDBOX',
  },
  {
    key: 'content.provenance', server: 'content', name: 'Record provenance',
    description: 'Return the source status, owner and verification timestamp for any record.',
    inputSchema: S.object({ kind: S.string(), slug: S.string() }),
    permissions: ['content:read'], dataClass: 'PUBLIC', sourceOwner: 'Egypt One',
    auditRequired: false, rateLimitPerMin: 120, state: 'SANDBOX',
  },
  {
    key: 'support.escalate', server: 'content', name: 'Escalate to a human',
    description: 'Open a support case and hand the conversation to an operator.',
    inputSchema: S.object({ subject: S.string(), category: S.string(), priority: S.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL') }),
    permissions: ['support:write'], dataClass: 'PERSONAL', sourceOwner: 'Egypt One',
    auditRequired: true, rateLimitPerMin: 10, state: 'SANDBOX',
  },
];

export const toolByKey = (key: string) => MCP_TOOLS.find((t) => t.key === key);
export const toolsForServer = (server: string) => MCP_TOOLS.filter((t) => t.server === server);
