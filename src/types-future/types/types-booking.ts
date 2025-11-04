/**
 * Booking Type Definitions
 *
 * Core types for booking management, including reservations,
 * payments, cancellations, and availability.
 */

import type { Campsite } from './types-campsite';
import type { User } from './types-user';

// ============================================================================
// Enums
// ============================================================================

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  FAILED = 'FAILED',
}

export enum CancellationPolicy {
  FLEXIBLE = 'FLEXIBLE',      // Full refund 24 hours before
  MODERATE = 'MODERATE',       // Full refund 5 days before
  STRICT = 'STRICT',           // 50% refund 7 days before
  SUPER_STRICT = 'SUPER_STRICT', // No refund
}

// ============================================================================
// Core Booking Type
// ============================================================================

export interface Booking {
  id: string;

  // References
  campsiteId: string;
  userId: string;

  // Dates
  startDate: Date;
  endDate: Date;
  numberOfNights: number;

  // Guests
  adults: number;
  children: number;
  pets: number;
  totalGuests: number;

  // Status
  status: BookingStatus;

  // Pricing
  pricePerNight: number;
  totalNights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  totalAmount: number;

  // Payment
  paymentStatus: PaymentStatus;
  paidAmount: number;
  refundedAmount: number;

  // Cancellation
  cancellationPolicy: CancellationPolicy;
  cancelledAt?: Date;
  cancelledBy?: string; // userId
  cancellationReason?: string;

  // Special requests
  specialRequests?: string;
  arrivalTime?: string;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  checkInAt?: Date;
  checkOutAt?: Date;
}

// ============================================================================
// Extended Booking Types
// ============================================================================

export interface BookingWithCampsite extends Booking {
  campsite: Pick<Campsite, 'id' | 'name' | 'slug' | 'imageUrl' | 'location'>;
}

export interface BookingWithUser extends Booking {
  user: Pick<User, 'id' | 'name' | 'email' | 'avatarUrl' | 'phone'>;
}

export interface BookingWithDetails extends Booking {
  campsite: Pick<Campsite, 'id' | 'name' | 'slug' | 'imageUrl' | 'category' | 'location' | 'rules'>;
  user: Pick<User, 'id' | 'name' | 'email' | 'avatarUrl' | 'phone'>;
  payment?: Payment;
  cancellation?: CancellationDetails;
  modifications?: BookingModification[];
}

// ============================================================================
// Payment Types
// ============================================================================

export interface Payment {
  id: string;
  bookingId: string;

  // Amount
  amount: number;
  currency: string;

  // Status
  status: PaymentStatus;

  // Payment method
  method: 'CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE';

  // Card details (masked)
  cardLast4?: string;
  cardBrand?: string;

  // Stripe
  stripePaymentIntentId?: string;
  stripeChargeId?: string;

  // Metadata
  createdAt: Date;
  capturedAt?: Date;
  failedAt?: Date;
  failureReason?: string;
}

export interface PaymentIntent {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  clientSecret: string;
  status: 'REQUIRES_PAYMENT_METHOD' | 'REQUIRES_CONFIRMATION' | 'REQUIRES_ACTION' | 'PROCESSING' | 'SUCCEEDED' | 'CANCELLED';
  createdAt: Date;
}

export interface Refund {
  id: string;
  bookingId: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
  stripeRefundId?: string;
  createdAt: Date;
  processedAt?: Date;
}

// ============================================================================
// Cancellation Types
// ============================================================================

export interface CancellationDetails {
  id: string;
  bookingId: string;

  // Who cancelled
  cancelledBy: string; // userId
  cancelledByRole: 'GUEST' | 'HOST' | 'ADMIN';

  // When
  cancelledAt: Date;

  // Why
  reason: CancellationReason;
  reasonDetails?: string;

  // Refund
  refundAmount: number;
  refundPercentage: number;
  refundProcessed: boolean;
  refundProcessedAt?: Date;

  // Policy applied
  policyApplied: CancellationPolicy;
}

export enum CancellationReason {
  GUEST_CHANGE_PLANS = 'GUEST_CHANGE_PLANS',
  GUEST_EMERGENCY = 'GUEST_EMERGENCY',
  GUEST_OTHER = 'GUEST_OTHER',
  HOST_UNAVAILABLE = 'HOST_UNAVAILABLE',
  HOST_EMERGENCY = 'HOST_EMERGENCY',
  WEATHER = 'WEATHER',
  SAFETY_CONCERN = 'SAFETY_CONCERN',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  ADMIN_DECISION = 'ADMIN_DECISION',
}

// ============================================================================
// Booking Modification Types
// ============================================================================

export interface BookingModification {
  id: string;
  bookingId: string;

  // What changed
  modificationType: 'DATES' | 'GUESTS' | 'SPECIAL_REQUESTS';

  // Old values
  previousValues: Record<string, any>;

  // New values
  newValues: Record<string, any>;

  // Price difference
  priceDifference?: number;

  // Approval
  requiresApproval: boolean;
  approved?: boolean;
  approvedBy?: string; // userId
  approvedAt?: Date;
  rejectionReason?: string;

  // Metadata
  requestedBy: string; // userId
  createdAt: Date;
  processedAt?: Date;
}

// ============================================================================
// Form Input Types
// ============================================================================

export interface CreateBookingInput {
  campsiteId: string;
  startDate: Date;
  endDate: Date;
  adults: number;
  children: number;
  pets: number;
  specialRequests?: string;
  arrivalTime?: string;
  agreedToRules: boolean;
  agreedToCancellationPolicy: boolean;
}

export interface BookingPriceCalculation {
  campsiteId: string;
  startDate: Date;
  endDate: Date;
  guests: number;

  // Breakdown
  pricePerNight: number;
  numberOfNights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  totalAmount: number;

  // Discounts
  discounts?: {
    type: 'WEEKLY' | 'MONTHLY' | 'PROMO_CODE';
    amount: number;
    description: string;
  }[];
}

export interface UpdateBookingInput {
  bookingId: string;
  startDate?: Date;
  endDate?: Date;
  adults?: number;
  children?: number;
  pets?: number;
  specialRequests?: string;
  arrivalTime?: string;
}

export interface CancelBookingInput {
  bookingId: string;
  reason: CancellationReason;
  reasonDetails?: string;
}

// ============================================================================
// Check-in/Check-out Types
// ============================================================================

export interface CheckInData {
  bookingId: string;
  checkInTime: Date;
  guestsPresent: number;
  vehicleInfo?: {
    make: string;
    model: string;
    licensePlate: string;
  }[];
  notes?: string;
}

export interface CheckOutData {
  bookingId: string;
  checkOutTime: Date;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  damages?: {
    description: string;
    estimatedCost: number;
    photos: string[];
  }[];
  notes?: string;
}

// ============================================================================
// Booking Search & Filter Types
// ============================================================================

export interface BookingFilters {
  userId?: string;
  campsiteId?: string;
  status?: BookingStatus[];
  paymentStatus?: PaymentStatus[];
  startDate?: Date;
  endDate?: Date;
  createdAfter?: Date;
  createdBefore?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string; // Booking ID or guest name
  sortBy?: 'createdAt' | 'startDate' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BookingSearchResult {
  items: BookingWithDetails[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// Availability Types
// ============================================================================

export interface AvailabilityCheck {
  campsiteId: string;
  startDate: Date;
  endDate: Date;
  guests: number;
}

export interface AvailabilityResult {
  available: boolean;
  reason?: string;
  conflictingBookings?: string[]; // Booking IDs
  alternativeDates?: {
    startDate: Date;
    endDate: Date;
  }[];
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface BlockedDates {
  campsiteId: string;
  dateRanges: DateRange[];
  reason?: string;
}

// ============================================================================
// Booking Statistics
// ============================================================================

export interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  averageStayDuration: number;
  occupancyRate: number;
  cancellationRate: number;
}

export interface BookingAnalytics extends BookingStats {
  bookingsByMonth: {
    month: string;
    count: number;
    revenue: number;
  }[];
  bookingsByStatus: {
    status: BookingStatus;
    count: number;
    percentage: number;
  }[];
  topCampsites: {
    campsiteId: string;
    campsiteName: string;
    bookingCount: number;
    revenue: number;
  }[];
  revenueByMonth: {
    month: string;
    revenue: number;
    bookings: number;
  }[];
}

// ============================================================================
// Guest Information Types
// ============================================================================

export interface GuestDetails {
  bookingId: string;
  primaryGuest: {
    name: string;
    email: string;
    phone: string;
  };
  additionalGuests?: {
    name: string;
    age?: number;
  }[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// ============================================================================
// Booking Notifications
// ============================================================================

export interface BookingNotification {
  id: string;
  bookingId: string;
  type: NotificationType;
  recipientId: string;
  title: string;
  message: string;
  read: boolean;
  sentAt: Date;
  readAt?: Date;
}

export enum NotificationType {
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_REMINDER = 'BOOKING_REMINDER',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  BOOKING_MODIFIED = 'BOOKING_MODIFIED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  REFUND_PROCESSED = 'REFUND_PROCESSED',
  CHECK_IN_REMINDER = 'CHECK_IN_REMINDER',
  CHECK_OUT_REMINDER = 'CHECK_OUT_REMINDER',
  REVIEW_REQUEST = 'REVIEW_REQUEST',
}

// ============================================================================
// Utility Types
// ============================================================================

// Type for upcoming bookings
export type UpcomingBooking = BookingWithDetails & {
  daysUntilCheckIn: number;
};

// Type for past bookings
export type PastBooking = BookingWithDetails & {
  canReview: boolean;
  hasReviewed: boolean;
};

// Type for booking summary (minimal data)
export type BookingSummary = Pick<
  Booking,
  'id' | 'startDate' | 'endDate' | 'status' | 'totalAmount' | 'campsiteId'
>;

// Type guard functions
export const isConfirmed = (booking: Booking): boolean => {
  return booking.status === BookingStatus.CONFIRMED;
};

export const isCancelled = (booking: Booking): boolean => {
  return booking.status === BookingStatus.CANCELLED;
};

export const canBeCancelled = (booking: Booking): boolean => {
  return [BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(booking.status);
};

export const isUpcoming = (booking: Booking): boolean => {
  return booking.startDate > new Date() &&
         [BookingStatus.CONFIRMED, BookingStatus.PENDING].includes(booking.status);
};

export const isPast = (booking: Booking): boolean => {
  return booking.endDate < new Date();
};
