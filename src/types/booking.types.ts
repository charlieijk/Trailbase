/**
 * Booking and Reservation type definitions
 */

import type {
  UUID,
  BaseEntity,
  Price,
  ISODateString
} from './common.types';
import type { Campsite, CampsiteListItem } from './campsite.types';
import type { User } from './user.types';

// Booking Status
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
  REFUNDED = 'refunded'
}

export enum CancellationPolicy {
  FLEXIBLE = 'flexible', // Full refund up to 24 hours before
  MODERATE = 'moderate', // Full refund up to 5 days before
  STRICT = 'strict', // 50% refund up to 7 days before
  SUPER_STRICT = 'super_strict', // No refunds
  CUSTOM = 'custom'
}

// Guest Information
export interface GuestDetails {
  adults: number;
  children: number;
  infants: number;
  pets: number;
  vehicles: number;
}

export interface PrimaryGuest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface AdditionalGuest {
  firstName: string;
  lastName: string;
  age?: number;
  relationship?: string;
}

// Booking Breakdown
export interface PriceBreakdown {
  basePrice: Price;
  numberOfNights: number;
  subtotal: Price;

  // Additional fees
  serviceFee: Price;
  cleaningFee?: Price;
  extraGuestFee?: Price;
  extraVehicleFee?: Price;
  petFee?: Price;

  // Taxes
  taxRate: number;
  taxAmount: Price;

  // Discounts
  discounts: BookingDiscount[];
  discountTotal: Price;

  // Total
  total: Price;
  deposit?: Price;
  amountDue: Price;
}

export interface BookingDiscount {
  type: 'early_bird' | 'long_stay' | 'last_minute' | 'seasonal' | 'coupon' | 'membership';
  name: string;
  code?: string;
  amount: Price;
  percentage?: number;
}

// Special Requests
export interface SpecialRequest {
  id: UUID;
  type: 'early_checkin' | 'late_checkout' | 'accessibility' | 'dietary' | 'other';
  description: string;
  approved?: boolean;
  response?: string;
}

// Check-in/out
export interface CheckInDetails {
  actualCheckIn: ISODateString;
  checkedInBy: UUID;
  notes?: string;
  keyCode?: string;
  parkingSpot?: string;
  wristbands?: number;
}

export interface CheckOutDetails {
  actualCheckOut: ISODateString;
  checkedOutBy: UUID;
  notes?: string;
  damageReport?: DamageReport;
  cleaningStatus?: 'clean' | 'needs_cleaning' | 'damaged';
}

export interface DamageReport {
  hasViolations: boolean;
  violations: Violation[];
  photos?: string[];
  totalCost?: Price;
}

export interface Violation {
  type: 'damage' | 'missing_items' | 'rule_violation' | 'excessive_trash';
  description: string;
  cost?: Price;
  resolved: boolean;
}

// Cancellation
export interface CancellationDetails {
  canceledAt: ISODateString;
  canceledBy: 'guest' | 'owner' | 'admin';
  reason: string;
  refundAmount: Price;
  refundProcessed: boolean;
  refundProcessedAt?: ISODateString;
  penaltyFee?: Price;
}

// Main Booking Interface
export interface Booking extends BaseEntity {
  // References
  campsiteId: UUID;
  userId: UUID;
  confirmationCode: string;

  // Dates
  checkIn: ISODateString;
  checkOut: ISODateString;
  numberOfNights: number;

  // Guests
  guestDetails: GuestDetails;
  primaryGuest: PrimaryGuest;
  additionalGuests: AdditionalGuest[];

  // Status
  status: BookingStatus;
  cancellationPolicy: CancellationPolicy;

  // Pricing
  priceBreakdown: PriceBreakdown;

  // Special requests & notes
  specialRequests: SpecialRequest[];
  guestNotes?: string;
  ownerNotes?: string;
  internalNotes?: string;

  // Check-in/out
  checkInDetails?: CheckInDetails;
  checkOutDetails?: CheckOutDetails;

  // Cancellation
  cancellationDetails?: CancellationDetails;

  // Communication
  lastMessageAt?: ISODateString;
  unreadMessages: number;

  // Review
  guestReviewed: boolean;
  ownerReviewed: boolean;
}

// Booking with populated data
export interface BookingWithDetails extends Booking {
  campsite: CampsiteListItem;
  user: Pick<User, 'id' | 'profile' | 'contactInfo' | 'verificationStatus'>;
}

// Booking creation
export interface CreateBookingInput {
  campsiteId: UUID;
  checkIn: ISODateString;
  checkOut: ISODateString;
  guestDetails: GuestDetails;
  primaryGuest: PrimaryGuest;
  additionalGuests?: AdditionalGuest[];
  specialRequests?: Omit<SpecialRequest, 'id' | 'approved' | 'response'>[];
  guestNotes?: string;
  couponCode?: string;
}

export interface BookingValidation {
  isValid: boolean;
  errors: BookingValidationError[];
  warnings: string[];
}

export interface BookingValidationError {
  field: string;
  message: string;
  code: string;
}

// Booking availability check
export interface AvailabilityCheck {
  campsiteId: UUID;
  checkIn: ISODateString;
  checkOut: ISODateString;
  guests: GuestDetails;
}

export interface AvailabilityResponse {
  available: boolean;
  reasons?: string[];
  alternativeDates?: {
    checkIn: ISODateString;
    checkOut: ISODateString;
  }[];
  pricing?: PriceBreakdown;
}

// Booking search & filters
export interface BookingSearchParams {
  userId?: UUID;
  campsiteId?: UUID;
  status?: BookingStatus[];
  dateRange?: {
    start: ISODateString;
    end: ISODateString;
  };
  confirmationCode?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Calendar/Scheduler
export interface BookingCalendarEvent {
  bookingId: UUID;
  campsiteId: UUID;
  campsiteName: string;
  guestName: string;
  checkIn: ISODateString;
  checkOut: ISODateString;
  status: BookingStatus;
  total: Price;
}

// Type guards
export function isBooking(obj: unknown): obj is Booking {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'campsiteId' in obj &&
    'userId' in obj &&
    'confirmationCode' in obj
  );
}

export function isActiveBooking(booking: Booking): boolean {
  return (
    booking.status === BookingStatus.CONFIRMED ||
    booking.status === BookingStatus.CHECKED_IN
  );
}

export function isPastBooking(booking: Booking): boolean {
  return (
    booking.status === BookingStatus.COMPLETED ||
    booking.status === BookingStatus.CHECKED_OUT
  );
}

export function isCancelable(booking: Booking): boolean {
  const now = new Date();
  const checkIn = new Date(booking.checkIn);

  if (booking.status === BookingStatus.CANCELED) return false;
  if (booking.status === BookingStatus.COMPLETED) return false;
  if (booking.status === BookingStatus.CHECKED_OUT) return false;
  if (now >= checkIn) return false;

  return true;
}

// Helper functions
export function calculateRefundAmount(
  booking: Booking,
  cancelDate: Date = new Date()
): Price {
  const checkIn = new Date(booking.checkIn);
  const daysUntilCheckIn = Math.ceil(
    (checkIn.getTime() - cancelDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let refundPercentage = 0;

  switch (booking.cancellationPolicy) {
    case CancellationPolicy.FLEXIBLE:
      refundPercentage = daysUntilCheckIn >= 1 ? 100 : 0;
      break;
    case CancellationPolicy.MODERATE:
      refundPercentage = daysUntilCheckIn >= 5 ? 100 : 50;
      break;
    case CancellationPolicy.STRICT:
      refundPercentage = daysUntilCheckIn >= 7 ? 50 : 0;
      break;
    case CancellationPolicy.SUPER_STRICT:
      refundPercentage = 0;
      break;
  }

  return {
    amount: booking.priceBreakdown.total.amount * (refundPercentage / 100),
    currency: booking.priceBreakdown.total.currency,
    formatted: `$${(booking.priceBreakdown.total.amount * (refundPercentage / 100)).toFixed(2)}`
  };
}
