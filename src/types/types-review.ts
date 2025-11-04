/**
 * Review Type Definitions
 *
 * Core types for review and rating management, including
 * campsite reviews, user reviews, and moderation.
 */

import type { User } from './types-user';
import type { Campsite } from './types-campsite';

// ============================================================================
// Enums
// ============================================================================

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  FLAGGED = 'FLAGGED',
  REMOVED = 'REMOVED',
}

export enum FlagReason {
  INAPPROPRIATE = 'INAPPROPRIATE',
  SPAM = 'SPAM',
  OFFENSIVE = 'OFFENSIVE',
  OFF_TOPIC = 'OFF_TOPIC',
  FAKE = 'FAKE',
  OTHER = 'OTHER',
}

// ============================================================================
// Core Review Type
// ============================================================================

export interface Review {
  id: string;

  // References
  campsiteId: string;
  userId: string;
  bookingId: string;

  // Rating (1-5 stars)
  overallRating: number;

  // Detailed ratings
  cleanliness: number;
  accuracy: number;
  location: number;
  value: number;
  communication: number;

  // Content
  title?: string;
  content: string;
  photos: string[];

  // Verification
  isVerifiedStay: boolean;
  stayDate: Date;

  // Status
  status: ReviewStatus;

  // Engagement
  helpfulCount: number;
  unhelpfulCount: number;

  // Response
  hasOwnerResponse: boolean;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// ============================================================================
// Extended Review Types
// ============================================================================

export interface ReviewAuthor {
  id: string;
  name: string;
  avatarUrl?: string;
  totalReviews: number;
  joinedAt: Date;
}

export interface ReviewWithAuthor extends Review {
  author: ReviewAuthor;
}

export interface ReviewWithCampsite extends Review {
  campsite: Pick<Campsite, 'id' | 'name' | 'slug' | 'imageUrl'>;
}

export interface ReviewWithDetails extends Review {
  author: ReviewAuthor;
  campsite: Pick<Campsite, 'id' | 'name' | 'slug' | 'imageUrl'>;
  ownerResponse?: OwnerResponse;
  flags?: ReviewFlag[];
}

// ============================================================================
// Owner Response Type
// ============================================================================

export interface OwnerResponse {
  id: string;
  reviewId: string;
  ownerId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OwnerResponseWithAuthor extends OwnerResponse {
  author: Pick<User, 'id' | 'name' | 'avatarUrl'>;
}

// ============================================================================
// Review Helpfulness
// ============================================================================

export interface ReviewHelpful {
  id: string;
  reviewId: string;
  userId: string;
  helpful: boolean; // true = helpful, false = unhelpful
  createdAt: Date;
}

// ============================================================================
// Review Flag/Report Types
// ============================================================================

export interface ReviewFlag {
  id: string;
  reviewId: string;
  reportedBy: string; // userId
  reason: FlagReason;
  details?: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  reviewedBy?: string; // admin userId
  resolution?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

// ============================================================================
// Form Input Types
// ============================================================================

export interface CreateReviewInput {
  campsiteId: string;
  bookingId: string;

  // Ratings (1-5)
  overallRating: number;
  cleanliness: number;
  accuracy: number;
  location: number;
  value: number;
  communication: number;

  // Content
  title?: string;
  content: string;
  photos?: string[];
}

export interface UpdateReviewInput {
  reviewId: string;
  title?: string;
  content?: string;
  photos?: string[];
}

export interface CreateOwnerResponseInput {
  reviewId: string;
  content: string;
}

export interface UpdateOwnerResponseInput {
  responseId: string;
  content: string;
}

export interface FlagReviewInput {
  reviewId: string;
  reason: FlagReason;
  details?: string;
}

export interface MarkReviewHelpfulInput {
  reviewId: string;
  helpful: boolean; // true = helpful, false = unhelpful
}

// ============================================================================
// Review Statistics
// ============================================================================

export interface ReviewStats {
  campsiteId: string;
  totalReviews: number;
  averageRating: number;

  // Detailed averages
  averageCleanliness: number;
  averageAccuracy: number;
  averageLocation: number;
  averageValue: number;
  averageCommunication: number;

  // Distribution
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];

  // Recent
  recentRating: number; // Average of last 10 reviews
}

export interface ReviewAnalytics extends ReviewStats {
  // Trends
  ratingTrend: {
    month: string;
    averageRating: number;
    reviewCount: number;
  }[];

  // Common themes (from content analysis)
  positiveThemes: {
    theme: string;
    count: number;
  }[];

  negativeThemes: {
    theme: string;
    count: number;
  }[];

  // Response rate
  ownerResponseRate: number;
  averageResponseTime: number; // hours
}

// ============================================================================
// Review Search & Filter Types
// ============================================================================

export interface ReviewFilters {
  campsiteId?: string;
  userId?: string;
  minRating?: number;
  maxRating?: number;
  verifiedOnly?: boolean;
  withPhotos?: boolean;
  status?: ReviewStatus[];
  createdAfter?: Date;
  createdBefore?: Date;
  hasOwnerResponse?: boolean;
  sortBy?: 'createdAt' | 'rating' | 'helpful';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ReviewSearchResult {
  items: ReviewWithDetails[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: ReviewStats;
}

// ============================================================================
// Review Summary Types
// ============================================================================

export interface ReviewSummary {
  campsiteId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recentReviews: ReviewWithAuthor[];
}

export interface CampsiteReviewBreakdown {
  campsiteId: string;
  overall: {
    rating: number;
    count: number;
  };
  categories: {
    cleanliness: { rating: number; count: number };
    accuracy: { rating: number; count: number };
    location: { rating: number; count: number };
    value: { rating: number; count: number };
    communication: { rating: number; count: number };
  };
  highlights: {
    positive: string[];
    negative: string[];
  };
}

// ============================================================================
// User Review Types
// ============================================================================

export interface UserReviewProfile {
  userId: string;
  totalReviewsWritten: number;
  averageRatingGiven: number;
  helpfulVotesReceived: number;
  verifiedReviews: number;
  recentReviews: ReviewWithCampsite[];
}

// ============================================================================
// Review Moderation Types
// ============================================================================

export interface ReviewModerationQueue {
  pendingReviews: ReviewWithDetails[];
  flaggedReviews: ReviewWithDetails[];
  total: number;
}

export interface ReviewModerationAction {
  reviewId: string;
  action: 'APPROVE' | 'REMOVE' | 'FLAG' | 'UNFLAG';
  reason?: string;
  moderatorId: string;
  moderatorNotes?: string;
  timestamp: Date;
}

// ============================================================================
// Review Reminders
// ============================================================================

export interface ReviewReminder {
  id: string;
  userId: string;
  bookingId: string;
  campsiteId: string;
  sentAt: Date;
  reminderCount: number;
  completed: boolean;
  completedAt?: Date;
}

// ============================================================================
// Review Templates (for owners)
// ============================================================================

export interface ResponseTemplate {
  id: string;
  ownerId: string;
  name: string;
  content: string;
  category: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  isDefault: boolean;
  useCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Utility Types
// ============================================================================

// Type for review preview (minimal data)
export type ReviewPreview = Pick<
  Review,
  'id' | 'overallRating' | 'content' | 'createdAt' | 'isVerifiedStay'
> & {
  authorName: string;
  authorAvatar?: string;
};

// Type for owner's reviews received
export type OwnerReviewSummary = {
  campsiteId: string;
  campsiteName: string;
  totalReviews: number;
  averageRating: number;
  unrespondedCount: number;
  recentReviews: ReviewWithAuthor[];
};

// Type guard functions
export const isApproved = (review: Review): boolean => {
  return review.status === ReviewStatus.APPROVED;
};

export const isPending = (review: Review): boolean => {
  return review.status === ReviewStatus.PENDING;
};

export const isFlagged = (review: Review): boolean => {
  return review.status === ReviewStatus.FLAGGED;
};

export const hasOwnerResponse = (review: Review): boolean => {
  return review.hasOwnerResponse;
};

export const isVerified = (review: Review): boolean => {
  return review.isVerifiedStay;
};

export const isHighRated = (review: Review): boolean => {
  return review.overallRating >= 4;
};

export const isLowRated = (review: Review): boolean => {
  return review.overallRating <= 2;
};

// Helper function to calculate average rating
export const calculateAverageRating = (review: Review): number => {
  const ratings = [
    review.cleanliness,
    review.accuracy,
    review.location,
    review.value,
    review.communication,
  ];
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Number((sum / ratings.length).toFixed(1));
};

// Helper function to validate rating
export const isValidRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
};
