import type { SourceMeta } from './source-status';
import type { DataClass } from './data-class';
import type { EraKey, HeritageAccess, IntegrationState, VerificationState } from './verification';

export interface Localised { en: string; ar?: string; [locale: string]: string | undefined }

export interface BaseRecord extends SourceMeta {
  id: string;
  slug: string;
  name: string;
  nameAr?: string;
  summary?: string;
  description?: string;
  images?: string[];
  dataClass?: DataClass;
  tags?: string[];
}

export interface Governorate extends BaseRecord {
  code: string;
  capital: string;
  region: 'Greater Cairo' | 'Delta' | 'Canal' | 'Sinai' | 'Red Sea' | 'Upper Egypt' | 'Western Desert' | 'Mediterranean';
  areaKm2: number;
  populationM: number;
  established?: string;
  coordinates: { lat: number; lng: number };
  highlights: string[];
  cities: string[];
  villages?: string[];
  heritageEras: EraKey[];
  cuisine: string[];
  crafts: string[];
  nature: string[];
  investmentSectors: string[];
  hasCoast: boolean;
  hasNile: boolean;
  metrics: { annualVisitors: number; hotels: number; heritageSites: number; guides: number; occupancyPct: number };
}

export interface Destination extends BaseRecord {
  governorateSlug: string;
  category: 'city' | 'coast' | 'desert' | 'oasis' | 'nile' | 'heritage' | 'modern';
  bestSeason?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Attraction extends BaseRecord {
  governorateSlug: string;
  destinationSlug?: string;
  era: EraKey;
  durationMinutes?: number;
  ticketFromEgp?: number;
  access: HeritageAccess;
}

export interface HeritageSite extends BaseRecord {
  governorateSlug: string;
  era: EraKey;
  classification: 'Ancient Egyptian' | 'Greco-Roman' | 'Coptic / Christian' | 'Islamic' | 'Jewish' | 'Modern';
  access: HeritageAccess;
  restorationStatus?: 'NONE' | 'PLANNED' | 'IN_PROGRESS' | 'PROPOSED' | 'COMPLETED';
  hidden?: boolean;
  academicReferences?: string[];
  relatedFigures?: string[];
  accessibility?: string[];
  coordinates?: { lat: number; lng: number };
}

export interface Museum extends BaseRecord {
  governorateSlug: string;
  collectionsCount?: number;
  opened?: string;
  highlights: string[];
  access: HeritageAccess;
}

export interface HistoricalEra { key: EraKey; name: string; from: string; to: string; colour: string; summary: string; monuments: string[]; museums: string[]; rulers: string[] }

export interface Ruler extends BaseRecord {
  era: EraKey;
  dynasty?: string;
  reign: string;
  achievements: string[];
  monuments: string[];
}

export interface WorldwideObject extends BaseRecord {
  object: string;
  era: EraKey;
  institution: string;
  country: string;
  provenanceNote: string;
}

export interface Country extends BaseRecord {
  iso2: string;
  region: string;
  currency: string;
  language: string;
  hasEgyptianMission: boolean;
  missionNote?: string;
  visaRoute: string;
  directFlights: string[];
  suggestedRoutes: string[];
  travellersToEgypt?: number;
}

export interface Provider extends BaseRecord {
  type: 'HOTEL' | 'GUIDE' | 'RESTAURANT' | 'CAFE' | 'TRANSPORT' | 'CAR_RENTAL' | 'YACHT' | 'ACTIVITY' | 'EVENT_ORGANISER' | 'MEDICAL' | 'RETAILER' | 'UNIVERSITY' | 'TOUR_OPERATOR';
  governorateSlug: string;
  verification: VerificationState;
  licenceRef?: string;
  rating?: number;
  reviewCount?: number;
  priceFrom?: number;
  currency?: string;
  languages?: string[];
  specialties?: string[];
  amenities?: string[];
  accessibility?: string[];
  availability?: string[];
}

export interface InvestmentOpportunity extends BaseRecord {
  sector: string;
  governorateSlug: string;
  stage: 'CONCEPT' | 'FEASIBILITY' | 'READY' | 'IN_EXECUTION';
  investmentRangeUsd: [number, number];
  landRequirementHa?: number;
  competentEntity: string;
  restrictions: string[];
  documents: { title: string; sourceStatus: string }[];
  demandSignals: string[];
  risks: string[];
}

export interface Property extends BaseRecord {
  governorateSlug: string;
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL' | 'HOSPITALITY' | 'HOTEL_APARTMENT' | 'OFFICE' | 'LAND';
  priceUsd?: number;
  areaM2?: number;
  city?: string;
}

export interface EventRecord extends BaseRecord {
  governorateSlug: string;
  category: 'Cultural' | 'Music' | 'Film' | 'Sports' | 'Business' | 'Conference' | 'MICE' | 'Festival' | 'Heritage' | 'International';
  startDate: string;
  endDate: string;
  venue: string;
  organiser: string;
  ticketed: boolean;
  languages: string[];
}

export interface Product extends BaseRecord {
  governorateSlug: string;
  category: string;
  priceEgp: number;
  maker: string;
}

export interface ResearchProgram extends BaseRecord {
  university: string;
  governorateSlug: string;
  field: string;
  degree: 'PhD' | 'Masters' | 'Fellowship' | 'Field School' | 'Short Course';
  languages: string[];
}

export interface IntegrationRecord {
  id: string;
  name: string;
  category: string;
  adapter: string;
  state: IntegrationState;
  dataClass: DataClass;
  sourceOwner: string;
  notes: string;
  commissionable: boolean;
}
