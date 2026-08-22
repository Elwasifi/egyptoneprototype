import type { DataClass, SourceStatus } from '@egypt-one/types';

/**
 * Connector layer.
 *
 * One contract per class of external system. The core product depends on these
 * interfaces and never on a vendor SDK, so a partner can be swapped, added or
 * removed without touching a page, a skill or an agent.
 *
 * No adapter in this prototype is LIVE, and no commercial agreement with any
 * named company exists. Brand names appear nowhere in this file — only classes.
 */

export type AdapterState = 'PLANNED' | 'SANDBOX' | 'LIVE' | 'DISABLED';

export interface AdapterMeta {
  key: string;
  displayName: string;
  category: string;
  state: AdapterState;
  dataClass: DataClass;
  sourceOwner: string;
  /** Whether transactions through this adapter may carry a platform commission. */
  commissionable: boolean;
  notes: string;
}

export interface AdapterResult<T> {
  ok: boolean;
  data: T[];
  sourceStatus: SourceStatus;
  /** Present when an adapter could not serve the request. Never silently empty. */
  reason?: string;
  adapter: string;
}

/** Every adapter answers this so the UI can explain itself honestly. */
export abstract class BaseAdapter {
  abstract readonly meta: AdapterMeta;

  protected unavailable<T>(): AdapterResult<T> {
    return {
      ok: false, data: [], adapter: this.meta.key,
      sourceStatus: this.meta.state === 'SANDBOX' ? 'SIMULATED' : 'PLANNED_INTEGRATION',
      reason: `${this.meta.displayName} is in ${this.meta.state} state. No live data is available and nothing is being inferred.`,
    };
  }

  isLive() { return this.meta.state === 'LIVE'; }
}

/* --------------------------------------------------------------- contracts */

export interface AccommodationQuery { governorate: string; checkIn: string; checkOut: string; adults: number; children: number }
export interface AccommodationOffer { providerRef: string; name: string; unitType: string; price: number; currency: string; cancellable: boolean }
export abstract class AccommodationProviderAdapter extends BaseAdapter {
  abstract search(q: AccommodationQuery): Promise<AdapterResult<AccommodationOffer>>;
}

export interface FlightQuery { origin: string; destination: string; departDate: string; returnDate?: string; adults: number }
export interface FlightOffer { carrierRef: string; route: string; price: number; currency: string; stops: number }
export abstract class FlightProviderAdapter extends BaseAdapter {
  abstract search(q: FlightQuery): Promise<AdapterResult<FlightOffer>>;
}

export interface MobilityQuery { pickup: string; dropoff: string; when: string; passengers: number }
export interface MobilityOffer { vehicleClass: string; etaMinutes: number; price: number; currency: string }
export abstract class MobilityProviderAdapter extends BaseAdapter {
  abstract quote(q: MobilityQuery): Promise<AdapterResult<MobilityOffer>>;
}

export interface ActivityQuery { governorate: string; date?: string; category?: string }
export interface ActivityOffer { ref: string; name: string; durationMinutes: number; price: number; currency: string }
export abstract class ActivityProviderAdapter extends BaseAdapter {
  abstract search(q: ActivityQuery): Promise<AdapterResult<ActivityOffer>>;
}

export interface PaymentIntent { amount: number; currency: string; bookingRef: string }
export interface PaymentHandle { pspReference: string; redirectUrl?: string; state: string }
/**
 * Egypt One must never become an unlicensed payment processor. This contract
 * only ever hands off to a licensed PSP and reads back a state.
 */
export abstract class PaymentProviderAdapter extends BaseAdapter {
  abstract createIntent(i: PaymentIntent): Promise<AdapterResult<PaymentHandle>>;
  abstract readState(pspReference: string): Promise<AdapterResult<PaymentHandle>>;
}

export interface InsuranceQuote { plan: string; cover: string; price: number; currency: string }
export abstract class InsuranceProviderAdapter extends BaseAdapter {
  abstract quote(q: { days: number; travellers: number; nationality: string }): Promise<AdapterResult<InsuranceQuote>>;
}

export interface GovernmentProcedure { key: string; title: string; authority: string; steps: string[]; documents: string[]; officialUrl?: string }
/**
 * Read-only by default. A write is possible only where a specific integration
 * agreement grants a transaction permission, and even then the authority
 * remains the system of record.
 */
export abstract class GovernmentServiceAdapter extends BaseAdapter {
  abstract getProcedure(key: string): Promise<AdapterResult<GovernmentProcedure>>;
  readonly writePermitted: boolean = false;
}

export interface UniversityProgramme { ref: string; name: string; degree: string; field: string; languages: string[] }
export abstract class UniversityAdapter extends BaseAdapter {
  abstract listProgrammes(q: { field?: string; degree?: string }): Promise<AdapterResult<UniversityProgramme>>;
}

export interface MedicalProviderRecord { ref: string; name: string; specialties: string[]; accreditation: string[]; languages: string[] }
export abstract class MedicalProviderAdapter extends BaseAdapter {
  abstract search(q: { specialty?: string; governorate?: string }): Promise<AdapterResult<MedicalProviderRecord>>;
  /** Health data never leaves the platform through this contract. */
  readonly transmitsHealthData = false;
}

export interface AffiliateOffer { ref: string; title: string; url: string; programme: string; commissionPct: number }
export abstract class AffiliateAdapter extends BaseAdapter {
  abstract offers(q: { category?: string }): Promise<AdapterResult<AffiliateOffer>>;
}

export interface MapPlace { ref: string; name: string; lat: number; lng: number }
/** Vendor-neutral: Mapbox, Google or an OSM tile server all satisfy this. */
export abstract class MapProviderAdapter extends BaseAdapter {
  abstract geocode(q: string): Promise<AdapterResult<MapPlace>>;
  abstract staticTileUrl(lat: number, lng: number, zoom: number): string | null;
}

/* ------------------------------------------------ default (unconnected) impls */

class NullAccommodation extends AccommodationProviderAdapter {
  readonly meta: AdapterMeta = { key: 'accommodation.classA', displayName: 'Accommodation aggregator (class A)', category: 'Accommodation', state: 'PLANNED', dataClass: 'PARTNER', sourceOwner: 'Third-party accommodation platform', commissionable: true, notes: 'Contract implemented; no credentials configured and no agreement in place.' };
  async search() { return this.unavailable<AccommodationOffer>(); }
}
class NullFlights extends FlightProviderAdapter {
  readonly meta: AdapterMeta = { key: 'flights.classA', displayName: 'Airline distribution (class A)', category: 'Flights', state: 'PLANNED', dataClass: 'PARTNER', sourceOwner: 'Airline / GDS', commissionable: true, notes: 'No agreement in place.' };
  async search() { return this.unavailable<FlightOffer>(); }
}
class NullMobility extends MobilityProviderAdapter {
  readonly meta: AdapterMeta = { key: 'mobility.classA', displayName: 'Ride-hailing mobility (class A)', category: 'Mobility', state: 'PLANNED', dataClass: 'PARTNER', sourceOwner: 'Mobility operator', commissionable: true, notes: 'No agreement in place.' };
  async quote() { return this.unavailable<MobilityOffer>(); }
}
class NullActivities extends ActivityProviderAdapter {
  readonly meta: AdapterMeta = { key: 'activities.classA', displayName: 'Activities marketplace (class A)', category: 'Activities', state: 'PLANNED', dataClass: 'PARTNER', sourceOwner: 'Activities platform', commissionable: true, notes: 'No agreement in place.' };
  async search() { return this.unavailable<ActivityOffer>(); }
}
class SandboxPayments extends PaymentProviderAdapter {
  readonly meta: AdapterMeta = { key: 'psp.licensed', displayName: 'Licensed payment service provider', category: 'Payments', state: 'SANDBOX', dataClass: 'SENSITIVE', sourceOwner: 'Licensed PSP', commissionable: false, notes: 'Sandbox only. Egypt One never holds funds; settlement runs through the PSP and the provider contract.' };
  async createIntent() { return this.unavailable<PaymentHandle>(); }
  async readState() { return this.unavailable<PaymentHandle>(); }
}
class NullGovernment extends GovernmentServiceAdapter {
  readonly meta: AdapterMeta = { key: 'gov.registry', displayName: 'Competent authority registry exchange', category: 'Government', state: 'PLANNED', dataClass: 'RESTRICTED_GOVERNMENT', sourceOwner: 'Competent authority', commissionable: false, notes: 'Requires an approved data-sharing agreement. Read-only. No direct database access is ever taken.' };
  async getProcedure() { return this.unavailable<GovernmentProcedure>(); }
}
class NullUniversity extends UniversityAdapter {
  readonly meta: AdapterMeta = { key: 'university.directory', displayName: 'University admissions directory', category: 'Research', state: 'PLANNED', dataClass: 'PARTNER', sourceOwner: 'Universities', commissionable: false, notes: 'Each university supplies its own programme data.' };
  async listProgrammes() { return this.unavailable<UniversityProgramme>(); }
}
class NullMedical extends MedicalProviderAdapter {
  readonly meta: AdapterMeta = { key: 'health.network', displayName: 'Accredited hospital network', category: 'Health', state: 'PLANNED', dataClass: 'SENSITIVE', sourceOwner: 'Health providers', commissionable: false, notes: 'Elevated data class. Consent and purpose checks are required before any exchange.' };
  async search() { return this.unavailable<MedicalProviderRecord>(); }
}
class NullAffiliate extends AffiliateAdapter {
  readonly meta: AdapterMeta = { key: 'affiliate.generic', displayName: 'Affiliate network (generic)', category: 'Affiliate', state: 'PLANNED', dataClass: 'PARTNER', sourceOwner: 'Affiliate networks', commissionable: true, notes: 'Programme terms govern each payout.' };
  async offers() { return this.unavailable<AffiliateOffer>(); }
}
class LocalMap extends MapProviderAdapter {
  readonly meta: AdapterMeta = { key: 'map.local', displayName: 'Map and geocoding provider', category: 'Maps', state: 'PLANNED', dataClass: 'PUBLIC', sourceOwner: 'Map vendor', commissionable: false, notes: 'No vendor selected. The map renders a local vector fallback of Egypt rather than a blank frame.' };
  async geocode() { return this.unavailable<MapPlace>(); }
  staticTileUrl() { return null; }
}

/** The registry the app and the MCP gateway both read. */
export interface AdapterRegistry {
  accommodation: AccommodationProviderAdapter;
  flights: FlightProviderAdapter;
  mobility: MobilityProviderAdapter;
  activities: ActivityProviderAdapter;
  payments: PaymentProviderAdapter;
  government: GovernmentServiceAdapter;
  university: UniversityAdapter;
  medical: MedicalProviderAdapter;
  affiliate: AffiliateAdapter;
  map: MapProviderAdapter;
}

export const ADAPTERS: AdapterRegistry = {
  accommodation: new NullAccommodation(),
  flights: new NullFlights(),
  mobility: new NullMobility(),
  activities: new NullActivities(),
  payments: new SandboxPayments(),
  government: new NullGovernment(),
  university: new NullUniversity(),
  medical: new NullMedical(),
  affiliate: new NullAffiliate(),
  map: new LocalMap(),
};

export const ADAPTER_LIST: AdapterMeta[] = Object.values(ADAPTERS).map((a) => a.meta);
export const liveAdapters = () => ADAPTER_LIST.filter((a) => a.state === 'LIVE');
