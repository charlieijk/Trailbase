/**
 * Campsite and Booking Validation Schemas
 *
 * Zod schemas for validating campsite creation, booking forms,
 * reviews, and search queries.
 */

import { z } from 'zod';
import {
  CampsiteCategory,
  TerrainType,
  CampsiteStatus,
} from '@/types/types-campsite';
import {
  BookingStatus,
  CancellationPolicy,
  CancellationReason,
} from '@/types/types-booking';

// ============================================================================
// Campsite Validation Schemas
// ============================================================================

export const locationSchema = z.object({
  address: z.string().min(5, 'Address is required').max(200),
  city: z.string().min(2, 'City is required').max(50),
  state: z.string().min(2, 'State is required').max(50),
  zipCode: z.string().min(5, 'ZIP code is required').max(10),
  country: z.string().length(2, 'Invalid country code'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type LocationInput = z.infer<typeof locationSchema>;

export const campsiteRulesSchema = z.object({
  checkInTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  checkOutTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  minimumStay: z.number().int().min(1, 'Minimum stay must be at least 1 night').max(365),
  maximumStay: z.number().int().min(1).max(365).optional(),
  petsAllowed: z.boolean(),
  smokingAllowed: z.boolean(),
  partiesAllowed: z.boolean(),
  quietHoursStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  quietHoursEnd: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  customRules: z.array(z.string().max(200)).max(10).optional(),
});

export type CampsiteRulesInput = z.infer<typeof campsiteRulesSchema>;

export const createCampsiteSchema = z.object({
  name: z.string().min(5, 'Name must be at least 5 characters').max(100),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000),
  category: z.nativeEnum(CampsiteCategory, {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  terrainType: z.nativeEnum(TerrainType, {
    errorMap: () => ({ message: 'Please select a terrain type' }),
  }),

  // Capacity
  maxGuests: z.number().int().min(1, 'Must accommodate at least 1 guest').max(100),
  maxVehicles: z.number().int().min(0).max(10).optional(),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().int().min(0).max(10).optional(),

  // Pricing
  pricePerNight: z.number().min(10, 'Price must be at least $10').max(10000),
  cleaningFee: z.number().min(0).max(500).optional(),

  // Terrain
  elevation: z.number().min(0).max(30000).optional(),
  siteSize: z.number().min(0).max(100000).optional(),

  // Location
  location: locationSchema,

  // Amenities
  amenities: z.array(z.string()).min(1, 'Select at least one amenity').max(50),

  // Rules
  rules: campsiteRulesSchema,
});

export type CreateCampsiteInput = z.infer<typeof createCampsiteSchema>;

export const updateCampsiteSchema = createCampsiteSchema.partial().extend({
  id: z.string().uuid(),
  status: z.nativeEnum(CampsiteStatus).optional(),
  featured: z.boolean().optional(),
});

export type UpdateCampsiteInput = z.infer<typeof updateCampsiteSchema>;

export const campsiteImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  alt: z.string().min(5).max(200),
  caption: z.string().max(300).optional(),
  order: z.number().int().min(0).max(20),
  isMain: z.boolean(),
});

export type CampsiteImageInput = z.infer<typeof campsiteImageSchema>;

export const seasonalRateSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  pricePerNight: z.number().min(10).max(10000),
  minimumStay: z.number().int().min(1).max(30).optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type SeasonalRateInput = z.infer<typeof seasonalRateSchema>;

// ============================================================================
// Campsite Search & Filter Schemas
// ============================================================================

export const campsiteSearchSchema = z.object({
  query: z.string().max(100).optional(),

  // Location
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional(),
  country: z.string().length(2).optional(),
  radius: z.number().min(1).max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),

  // Category & Terrain
  category: z.array(z.nativeEnum(CampsiteCategory)).optional(),
  terrainType: z.array(z.nativeEnum(TerrainType)).optional(),

  // Price
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),

  // Availability
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  guests: z.number().int().min(1).max(100).optional(),

  // Amenities
  amenities: z.array(z.string()).optional(),

  // Features
  petsAllowed: z.boolean().optional(),
  featured: z.boolean().optional(),

  // Sorting
  sortBy: z.enum(['price', 'rating', 'distance', 'featured']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),

  // Pagination
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
}).refine(
  (data) => {
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
      return data.maxPrice >= data.minPrice;
    }
    return true;
  },
  {
    message: 'Max price must be greater than or equal to min price',
    path: ['maxPrice'],
  }
).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.endDate > data.startDate;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export type CampsiteSearchInput = z.infer<typeof campsiteSearchSchema>;

// ============================================================================
// Booking Validation Schemas
// ============================================================================

export const createBookingSchema = z.object({
  campsiteId: z.string().uuid('Invalid campsite ID'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),

  // Guests
  adults: z.number().int().min(1, 'At least one adult required').max(50),
  children: z.number().int().min(0).max(50),
  pets: z.number().int().min(0).max(10),

  // Optional
  specialRequests: z.string().max(500).optional(),
  arrivalTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),

  // Agreements
  agreedToRules: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the campsite rules' }),
  }),
  agreedToCancellationPolicy: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the cancellation policy' }),
  }),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
}).refine((data) => data.startDate >= new Date(new Date().setHours(0, 0, 0, 0)), {
  message: 'Start date cannot be in the past',
  path: ['startDate'],
}).refine((data) => {
  const totalGuests = data.adults + data.children;
  return totalGuests >= 1 && totalGuests <= 100;
}, {
  message: 'Total guests must be between 1 and 100',
  path: ['adults'],
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const updateBookingSchema = z.object({
  bookingId: z.string().uuid(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  adults: z.number().int().min(1).max(50).optional(),
  children: z.number().int().min(0).max(50).optional(),
  pets: z.number().int().min(0).max(10).optional(),
  specialRequests: z.string().max(500).optional(),
  arrivalTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.endDate > data.startDate;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;

export const cancelBookingSchema = z.object({
  bookingId: z.string().uuid(),
  reason: z.nativeEnum(CancellationReason, {
    errorMap: () => ({ message: 'Please select a cancellation reason' }),
  }),
  reasonDetails: z.string().max(500).optional(),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;

export const checkInSchema = z.object({
  bookingId: z.string().uuid(),
  checkInTime: z.coerce.date(),
  guestsPresent: z.number().int().min(1).max(100),
  vehicleInfo: z.array(z.object({
    make: z.string().min(2).max(50),
    model: z.string().min(2).max(50),
    licensePlate: z.string().min(2).max(20),
  })).max(5).optional(),
  notes: z.string().max(500).optional(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;

export const checkOutSchema = z.object({
  bookingId: z.string().uuid(),
  checkOutTime: z.coerce.date(),
  condition: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR']),
  damages: z.array(z.object({
    description: z.string().min(10).max(500),
    estimatedCost: z.number().min(0).max(10000),
    photos: z.array(z.string().url()).max(10),
  })).max(10).optional(),
  notes: z.string().max(500).optional(),
});

export type CheckOutInput = z.infer<typeof checkOutSchema>;

// ============================================================================
// Review Validation Schemas
// ============================================================================

export const createReviewSchema = z.object({
  campsiteId: z.string().uuid(),
  bookingId: z.string().uuid(),

  // Ratings (1-5 stars)
  overallRating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  cleanliness: z.number().int().min(1).max(5),
  accuracy: z.number().int().min(1).max(5),
  location: z.number().int().min(1).max(5),
  value: z.number().int().min(1).max(5),
  communication: z.number().int().min(1).max(5),

  // Content
  title: z.string().min(5, 'Title must be at least 5 characters').max(100).optional(),
  content: z.string().min(50, 'Review must be at least 50 characters').max(2000),
  photos: z.array(z.string().url()).max(10).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const updateReviewSchema = z.object({
  reviewId: z.string().uuid(),
  title: z.string().min(5).max(100).optional(),
  content: z.string().min(50).max(2000).optional(),
  photos: z.array(z.string().url()).max(10).optional(),
});

export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;

export const ownerResponseSchema = z.object({
  reviewId: z.string().uuid(),
  content: z.string().min(20, 'Response must be at least 20 characters').max(1000),
});

export type OwnerResponseInput = z.infer<typeof ownerResponseSchema>;

export const flagReviewSchema = z.object({
  reviewId: z.string().uuid(),
  reason: z.enum(['INAPPROPRIATE', 'SPAM', 'OFFENSIVE', 'OFF_TOPIC', 'FAKE', 'OTHER']),
  details: z.string().max(500).optional(),
});

export type FlagReviewInput = z.infer<typeof flagReviewSchema>;

// ============================================================================
// Availability Validation Schemas
// ============================================================================

export const checkAvailabilitySchema = z.object({
  campsiteId: z.string().uuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  guests: z.number().int().min(1).max(100),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
}).refine((data) => data.startDate >= new Date(new Date().setHours(0, 0, 0, 0)), {
  message: 'Start date cannot be in the past',
  path: ['startDate'],
});

export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;

export const blockDatesSchema = z.object({
  campsiteId: z.string().uuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  reason: z.string().max(200).optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type BlockDatesInput = z.infer<typeof blockDatesSchema>;

// ============================================================================
// Payment Validation Schemas
// ============================================================================

export const paymentIntentSchema = z.object({
  bookingId: z.string().uuid(),
  amount: z.number().min(1).max(100000),
  currency: z.string().length(3),
});

export type PaymentIntentInput = z.infer<typeof paymentIntentSchema>;

export const refundRequestSchema = z.object({
  bookingId: z.string().uuid(),
  amount: z.number().min(1),
  reason: z.string().min(10).max(500),
});

export type RefundRequestInput = z.infer<typeof refundRequestSchema>;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate date range
 */
export function validateDateRange(startDate: Date, endDate: Date): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return end > start && start >= today;
}

/**
 * Calculate number of nights
 */
export function calculateNights(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Validate guest count
 */
export function validateGuestCount(
  adults: number,
  children: number,
  maxGuests: number
): boolean {
  const total = adults + children;
  return total >= 1 && total <= maxGuests;
}

/**
 * Validate price range
 */
export function validatePriceRange(min?: number, max?: number): boolean {
  if (min === undefined || max === undefined) return true;
  return max >= min && min >= 0;
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  return query.trim().replace(/[<>]/g, '').slice(0, 100);
}

/**
 * Validate rating value
 */
export function validateRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/**
 * Calculate average rating
 */
export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Number((sum / ratings.length).toFixed(1));
}
