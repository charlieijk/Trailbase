/**
 * Review and Rating type definitions
 */

import type { UUID, BaseEntity, Image, ISODateString } from './common.types';

// Review Rating Categories
export interface DetailedRating {
  cleanliness: number; // 1-5
  accuracy: number; // 1-5
  communication: number; // 1-5
  location: number; // 1-5
  value: number; // 1-5
  amenities: number; // 1-5
}

export enum ReviewStatus {
  PENDING = 'pending',
  PUBLISHED = 'published',
  FLAGGED = 'flagged',
  HIDDEN = 'hidden',
  REMOVED = 'removed'
}

export enum FlagReason {
  INAPPROPRIATE = 'inappropriate',
  SPAM = 'spam',
  FAKE = 'fake',
  OFFENSIVE = 'offensive',
  PRIVACY_VIOLATION = 'privacy_violation',
  OTHER = 'other'
}

// Main Review Interface
export interface Review extends BaseEntity {
  // References
  campsiteId: UUID;
  bookingId: UUID;
  reviewerId: UUID;
  reviewerName: string;
  reviewerAvatar?: Image;

  // Ratings
  overallRating: number; // 1-5
  detailedRatings: DetailedRating;

  // Content
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  photos?: Image[];

  // Metadata
  status: ReviewStatus;
  verified: boolean; // Verified stay
  stayDate: ISODateString;
  tripType?: 'solo' | 'couple' | 'family' | 'friends' | 'business';

  // Engagement
  helpfulCount: number;
  unhelpfulCount: number;
  responseFromOwner?: OwnerResponse;

  // Moderation
  flagged: boolean;
  flagReasons?: FlagReason[];
  moderatedBy?: UUID;
  moderatedAt?: ISODateString;
  moderationNotes?: string;
}

export interface OwnerResponse {
  respondedBy: UUID;
  respondedAt: ISODateString;
  response: string;
  edited: boolean;
  editedAt?: ISODateString;
}

// Review with populated data
export interface ReviewWithDetails extends Review {
  campsite: {
    id: UUID;
    name: string;
    slug: string;
    coverImage: Image;
  };
}

// Review creation
export interface CreateReviewInput {
  campsiteId: UUID;
  bookingId: UUID;
  overallRating: number;
  detailedRatings: DetailedRating;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  tripType?: Review['tripType'];
}

// Review statistics
export interface ReviewStatistics {
  totalReviews: number;
  averageOverallRating: number;
  averageDetailedRatings: DetailedRating;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedReviewCount: number;
  responseRate: number;
}

// Review filters
export interface ReviewFilters {
  minRating?: number;
  maxRating?: number;
  verified?: boolean;
  tripType?: Review['tripType'][];
  hasPhotos?: boolean;
  dateRange?: {
    start: ISODateString;
    end: ISODateString;
  };
  sortBy?: 'recent' | 'rating_high' | 'rating_low' | 'helpful';
}

// Type guards
export function isReview(obj: unknown): obj is Review {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'overallRating' in obj &&
    'comment' in obj
  );
}

export function isPublishedReview(review: Review): boolean {
  return review.status === ReviewStatus.PUBLISHED;
}

export function hasOwnerResponse(review: Review): review is Review & { responseFromOwner: OwnerResponse } {
  return review.responseFromOwner !== undefined;
}
