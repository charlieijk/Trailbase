/**
 * Campsite-related type definitions
 */

import type {
  UUID,
  URL,
  BaseEntity,
  BaseEntityWithStatus,
  Location,
  Image,
  Price,
  Rating,
  Statistics,
  ISODateString
} from './common.types';

// Campsite Categories & Features
export enum CampsiteCategory {
  TENT = 'tent',
  RV = 'rv',
  CABIN = 'cabin',
  GLAMPING = 'glamping',
  GROUP = 'group',
  BACKCOUNTRY = 'backcountry'
}

export enum TerrainType {
  MOUNTAIN = 'mountain',
  FOREST = 'forest',
  DESERT = 'desert',
  BEACH = 'beach',
  LAKESIDE = 'lakeside',
  RIVERSIDE = 'riverside',
  PRAIRIE = 'prairie'
}

export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  FALL = 'fall',
  WINTER = 'winter',
  YEAR_ROUND = 'year_round'
}

// Amenities
export interface Amenity {
  id: UUID;
  name: string;
  icon: string;
  category: AmenityCategory;
  description?: string;
}

export enum AmenityCategory {
  UTILITIES = 'utilities',
  FACILITIES = 'facilities',
  RECREATION = 'recreation',
  ACCESSIBILITY = 'accessibility',
  SAFETY = 'safety'
}

export interface CampsiteAmenities {
  // Utilities
  electricity?: boolean;
  water?: boolean;
  sewer?: boolean;
  wifi?: boolean;
  cellReception?: 'none' | 'poor' | 'fair' | 'good' | 'excellent';

  // Facilities
  restrooms?: boolean;
  showers?: boolean;
  laundry?: boolean;
  dumpStation?: boolean;
  fireRing?: boolean;
  picnicTable?: boolean;
  grill?: boolean;

  // Recreation
  hiking?: boolean;
  fishing?: boolean;
  swimming?: boolean;
  boating?: boolean;
  biking?: boolean;
  horsebackRiding?: boolean;

  // Accessibility
  wheelchairAccessible?: boolean;
  petFriendly?: boolean;
  adaCompliant?: boolean;

  // Safety
  firstAid?: boolean;
  emergencyServices?: boolean;
  security?: boolean;
}

// Site specifications
export interface SiteSpecifications {
  maxOccupancy: number;
  maxVehicles: number;
  maxPets?: number;
  maxTentLength?: number; // in feet
  maxRVLength?: number; // in feet
  pullThrough?: boolean;
  backIn?: boolean;
  siteArea?: number; // in sq ft
  padType?: 'gravel' | 'paved' | 'grass' | 'dirt';
}

// Rules & Policies
export interface CampsiteRules {
  checkInTime: string; // HH:mm format
  checkOutTime: string;
  quietHours: {
    start: string;
    end: string;
  };
  minimumAge?: number;
  maximumStay?: number; // in nights
  minimumStay?: number;
  smokingAllowed?: boolean;
  alcoholAllowed?: boolean;
  fireworksAllowed?: boolean;
  generatorHours?: {
    allowed: boolean;
    start?: string;
    end?: string;
  };
}

// Pricing
export interface CampsitePricing {
  basePrice: Price;
  weekendSurcharge?: Price;
  holidaySurcharge?: Price;
  seasonalRates?: SeasonalRate[];
  discounts?: Discount[];
  extraPersonFee?: Price;
  extraVehicleFee?: Price;
  petFee?: Price;
  cleaningFee?: Price;
  taxRate?: number; // percentage
}

export interface SeasonalRate {
  season: Season;
  startDate: ISODateString;
  endDate: ISODateString;
  price: Price;
}

export interface Discount {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  minNights?: number;
  applicableSeasons?: Season[];
  validFrom?: ISODateString;
  validTo?: ISODateString;
}

// Main Campsite Interface
export interface Campsite extends BaseEntityWithStatus {
  // Basic Info
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: CampsiteCategory;
  terrain: TerrainType[];

  // Location
  location: Location;
  parkName?: string;
  region?: string;

  // Media
  images: Image[];
  coverImage: Image;
  virtualTourUrl?: URL;

  // Specifications
  specifications: SiteSpecifications;
  amenities: CampsiteAmenities;
  rules: CampsiteRules;
  pricing: CampsitePricing;

  // Ratings & Stats
  rating: Rating;
  statistics: Statistics;

  // Ownership
  ownerId: UUID;
  ownerName: string;
  ownerVerified: boolean;

  // Availability
  availableSeasons: Season[];
  bookingEnabled: boolean;
  instantBooking: boolean;

  // Features
  featured: boolean;
  verified: boolean;
  superhost: boolean;

  // SEO & Tags
  tags: string[];
  seoKeywords?: string[];
  metaDescription?: string;
}

// Campsite creation/update DTOs
export type CreateCampsiteInput = Omit<
  Campsite,
  'id' | 'slug' | 'createdAt' | 'updatedAt' | 'rating' | 'statistics' | 'status'
>;

export type UpdateCampsiteInput = Partial<CreateCampsiteInput> & {
  id: UUID;
};

// Campsite list item (lighter version for listings)
export type CampsiteListItem = Pick<
  Campsite,
  | 'id'
  | 'name'
  | 'slug'
  | 'shortDescription'
  | 'category'
  | 'coverImage'
  | 'location'
  | 'pricing'
  | 'rating'
  | 'featured'
  | 'verified'
  | 'availableSeasons'
>;

// Search & Filter
export interface CampsiteSearchParams {
  query?: string;
  category?: CampsiteCategory[];
  terrain?: TerrainType[];
  priceRange?: {
    min: number;
    max: number;
  };
  amenities?: string[];
  minRating?: number;
  location?: {
    latitude: number;
    longitude: number;
    radiusMiles: number;
  };
  availableDates?: {
    checkIn: ISODateString;
    checkOut: ISODateString;
  };
  guests?: number;
  pets?: number;
  rvLength?: number;
  features?: {
    instantBooking?: boolean;
    featured?: boolean;
    verified?: boolean;
  };
}

// Availability
export interface AvailabilityCalendar {
  campsiteId: UUID;
  dates: AvailabilityDate[];
}

export interface AvailabilityDate {
  date: ISODateString;
  available: boolean;
  price: Price;
  minStay?: number;
  reserved?: boolean;
  blocked?: boolean;
}

// Type guards
export function isCampsite(obj: unknown): obj is Campsite {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'category' in obj
  );
}

export function isCampsiteListItem(obj: unknown): obj is CampsiteListItem {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'slug' in obj
  );
}
