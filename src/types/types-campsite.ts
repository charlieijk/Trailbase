/**
 * Campsite Type Definitions
 *
 * Core types for campsite management, including location,
 * amenities, pricing, and search functionality.
 */

// ============================================================================
// Enums
// ============================================================================

export enum CampsiteStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum CampsiteCategory {
  TENT = 'TENT',
  RV = 'RV',
  CABIN = 'CABIN',
  GLAMPING = 'GLAMPING',
  GROUP = 'GROUP',
}

export enum TerrainType {
  MOUNTAIN = 'MOUNTAIN',
  FOREST = 'FOREST',
  BEACH = 'BEACH',
  DESERT = 'DESERT',
  LAKESIDE = 'LAKESIDE',
  RIVERSIDE = 'RIVERSIDE',
  PRAIRIE = 'PRAIRIE',
}

// ============================================================================
// Core Types
// ============================================================================

export interface Location {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
  category: 'ESSENTIAL' | 'COMFORT' | 'RECREATION' | 'SAFETY';
}

export interface Pricing {
  id: string;
  basePrice: number;
  weekendSurcharge?: number;
  cleaningFee?: number;
  securityDeposit?: number;
  currency: string;
}

export interface SeasonalRate {
  id: string;
  startDate: Date;
  endDate: Date;
  pricePerNight: number;
  minimumStay?: number;
}

export interface CampsiteImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
  isMain: boolean;
}

export interface CampsiteRules {
  id: string;
  checkInTime: string; // "14:00"
  checkOutTime: string; // "11:00"
  minimumStay: number; // nights
  maximumStay?: number; // nights
  petsAllowed: boolean;
  smokingAllowed: boolean;
  partiesAllowed: boolean;
  quietHoursStart?: string; // "22:00"
  quietHoursEnd?: string; // "07:00"
  customRules?: string[];
}

// ============================================================================
// Main Campsite Type
// ============================================================================

export interface Campsite {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: CampsiteCategory;
  status: CampsiteStatus;
  featured: boolean;

  // Capacity
  maxGuests: number;
  maxVehicles?: number;
  bedrooms?: number;
  bathrooms?: number;

  // Pricing
  pricePerNight: number;
  cleaningFee?: number;

  // Terrain
  terrainType: TerrainType;
  elevation?: number;
  siteSize?: number; // square feet

  // Images
  imageUrl: string; // Main image

  // Owner
  ownerId: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// ============================================================================
// Extended Types (with relations)
// ============================================================================

export interface CampsiteOwner {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joinedAt: Date;
}

export interface CampsiteWithOwner extends Campsite {
  owner: CampsiteOwner;
}

export interface CampsiteWithLocation extends Campsite {
  location: Location;
}

export interface CampsiteWithDetails extends Campsite {
  owner: CampsiteOwner;
  location: Location;
  amenities: Amenity[];
  pricing: Pricing;
  images: CampsiteImage[];
  rules: CampsiteRules;
  seasonalRates: SeasonalRate[];
  averageRating: number;
  totalReviews: number;
}

// ============================================================================
// List/Preview Types
// ============================================================================

export interface CampsitePreview {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  category: CampsiteCategory;
  pricePerNight: number;
  location: {
    city: string;
    state: string;
  };
  averageRating: number;
  totalReviews: number;
  featured: boolean;
}

export interface CampsiteCard extends CampsitePreview {
  description: string;
  maxGuests: number;
  amenities: string[]; // Just names for preview
}

// ============================================================================
// Search & Filter Types
// ============================================================================

export interface LocationFilter {
  city?: string;
  state?: string;
  country?: string;
  radius?: number; // miles
  latitude?: number;
  longitude?: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface CampsiteSearchParams {
  query?: string; // Text search
  location?: LocationFilter;
  category?: CampsiteCategory[];
  terrainType?: TerrainType[];
  priceRange?: PriceRange;

  // Availability
  startDate?: Date;
  endDate?: Date;
  guests?: number;

  // Amenities
  amenities?: string[]; // Amenity IDs

  // Features
  petsAllowed?: boolean;
  featured?: boolean;

  // Sorting
  sortBy?: 'price' | 'rating' | 'distance' | 'featured';
  sortOrder?: 'asc' | 'desc';

  // Pagination
  page?: number;
  limit?: number;
}

export interface CampsiteSearchResult {
  items: CampsiteCard[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: CampsiteSearchParams;
}

// ============================================================================
// Form Input Types
// ============================================================================

export interface CreateCampsiteInput {
  name: string;
  description: string;
  category: CampsiteCategory;
  terrainType: TerrainType;

  maxGuests: number;
  maxVehicles?: number;
  bedrooms?: number;
  bathrooms?: number;

  pricePerNight: number;
  cleaningFee?: number;

  elevation?: number;
  siteSize?: number;

  location: Omit<Location, 'id'>;
  amenities: string[]; // Amenity IDs
  rules: Omit<CampsiteRules, 'id'>;
}

export interface UpdateCampsiteInput extends Partial<CreateCampsiteInput> {
  id: string;
  status?: CampsiteStatus;
  featured?: boolean;
}

// ============================================================================
// Availability Types
// ============================================================================

export interface DateAvailability {
  date: Date;
  available: boolean;
  price: number;
  minimumStay?: number;
  reason?: string; // Why unavailable
}

export interface AvailabilityCalendar {
  campsiteId: string;
  month: number;
  year: number;
  dates: DateAvailability[];
}

export interface BlockedDate {
  id: string;
  campsiteId: string;
  startDate: Date;
  endDate: Date;
  reason?: string; // "Maintenance", "Owner block", etc.
}

// ============================================================================
// Statistics Types
// ============================================================================

export interface CampsiteStats {
  campsiteId: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  occupancyRate: number; // percentage
  responseRate: number; // percentage
  averageResponseTime: number; // hours
}

export interface CampsiteAnalytics extends CampsiteStats {
  bookingsByMonth: {
    month: string;
    count: number;
    revenue: number;
  }[];
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
  topAmenities: {
    amenity: string;
    mentionCount: number;
  }[];
}

// ============================================================================
// Utility Types
// ============================================================================

// Type for campsite without sensitive owner data
export type PublicCampsite = Omit<CampsiteWithDetails, 'ownerId'> & {
  owner: Pick<CampsiteOwner, 'id' | 'name' | 'avatarUrl'>;
};

// Type for owner's own campsite (includes all data)
export type OwnedCampsite = CampsiteWithDetails & {
  stats: CampsiteStats;
  blockedDates: BlockedDate[];
};

// Type for updating just the status
export type CampsiteStatusUpdate = Pick<Campsite, 'id' | 'status'>;

// Type for updating just the pricing
export type CampsitePricingUpdate = Pick<Campsite, 'id' | 'pricePerNight' | 'cleaningFee'>;
