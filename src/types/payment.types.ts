/**
 * Payment and Transaction type definitions
 */

import type { UUID, BaseEntity, Price, ISODateString } from './common.types';

// Payment Methods
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  BANK_TRANSFER = 'bank_transfer',
  CRYPTO = 'crypto'
}

export enum CardBrand {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  AMEX = 'amex',
  DISCOVER = 'discover',
  DINERS = 'diners',
  JCB = 'jcb',
  UNIONPAY = 'unionpay'
}

export interface PaymentCard {
  id: UUID;
  brand: CardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
  cardholderName: string;
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  isDefault: boolean;
  isExpired: boolean;
}

// Payment Status
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  DISPUTED = 'disputed'
}

export enum RefundReason {
  REQUESTED_BY_CUSTOMER = 'requested_by_customer',
  DUPLICATE = 'duplicate',
  FRAUDULENT = 'fraudulent',
  CANCELED_BOOKING = 'canceled_booking',
  SERVICE_NOT_PROVIDED = 'service_not_provided',
  OTHER = 'other'
}

// Transaction types
export enum TransactionType {
  BOOKING_PAYMENT = 'booking_payment',
  DEPOSIT = 'deposit',
  REMAINING_BALANCE = 'remaining_balance',
  SECURITY_DEPOSIT = 'security_deposit',
  REFUND = 'refund',
  PAYOUT = 'payout',
  FEE = 'fee',
  ADJUSTMENT = 'adjustment'
}

// Main Payment Interface
export interface Payment extends BaseEntity {
  // References
  bookingId: UUID;
  userId: UUID;
  campsiteId: UUID;

  // Payment details
  amount: Price;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  type: TransactionType;

  // Payment processor (e.g., Stripe)
  processorId: string; // Stripe payment intent ID
  processorCustomerId?: string;
  processorPaymentMethodId?: string;

  // Breakdown
  breakdown: {
    subtotal: Price;
    serviceFee: Price;
    taxAmount: Price;
    discounts: Price;
    total: Price;
  };

  // Card details (if applicable)
  cardDetails?: {
    brand: CardBrand;
    last4: string;
    expMonth: number;
    expYear: number;
  };

  // Status tracking
  authorizedAt?: ISODateString;
  capturedAt?: ISODateString;
  succeededAt?: ISODateString;
  failedAt?: ISODateString;
  refundedAt?: ISODateString;

  // Error handling
  errorCode?: string;
  errorMessage?: string;
  failureReason?: string;

  // Refund
  refundAmount?: Price;
  refundReason?: RefundReason;
  refundedBy?: UUID;

  // Receipt & Invoice
  receiptUrl?: string;
  invoiceUrl?: string;
  receiptNumber?: string;

  // Metadata
  metadata?: Record<string, unknown>;
  notes?: string;
}

// Payout to owners
export interface Payout extends BaseEntity {
  // References
  ownerId: UUID;
  bookingIds: UUID[];

  // Amount
  amount: Price;
  currency: string;
  status: PaymentStatus;

  // Bank account
  bankAccountId: string;
  bankAccountLast4: string;

  // Processing
  processorPayoutId?: string;
  scheduledFor: ISODateString;
  arrivalDate?: ISODateString;
  paidAt?: ISODateString;

  // Breakdown
  breakdown: {
    grossEarnings: Price;
    platformFee: Price;
    processingFee: Price;
    netEarnings: Price;
  };

  // Failure
  failureCode?: string;
  failureMessage?: string;

  // Metadata
  description?: string;
  statementDescriptor?: string;
}

// Wallet/Balance
export interface Wallet {
  userId: UUID;
  availableBalance: Price;
  pendingBalance: Price;
  totalEarnings: Price;
  totalWithdrawn: Price;
  currency: string;
  lastUpdated: ISODateString;
}

export interface WalletTransaction {
  id: UUID;
  walletId: UUID;
  type: 'credit' | 'debit';
  amount: Price;
  description: string;
  referenceId?: UUID;
  referenceType?: 'booking' | 'payout' | 'refund' | 'adjustment';
  balanceAfter: Price;
  createdAt: ISODateString;
}

// Payment Intent (for checkout)
export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: Price;
  status: PaymentStatus;
  metadata: {
    bookingId: UUID;
    userId: UUID;
    campsiteId: UUID;
  };
}

// Refund Request
export interface RefundRequest {
  paymentId: UUID;
  amount: Price;
  reason: RefundReason;
  notes?: string;
}

// Dispute
export interface Dispute {
  id: UUID;
  paymentId: UUID;
  status: 'warning_needs_response' | 'warning_under_review' | 'warning_closed' | 'needs_response' | 'under_review' | 'won' | 'lost';
  reason: string;
  amount: Price;
  currency: string;
  evidence?: DisputeEvidence;
  evidenceDueBy?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface DisputeEvidence {
  customerCommunication?: string;
  customerSignature?: string;
  receipt?: string;
  refundPolicy?: string;
  serviceDocumentation?: string;
  shippingDocumentation?: string;
  uncategorizedFile?: string;
  uncategorizedText?: string;
}

// Payment analytics
export interface PaymentAnalytics {
  totalRevenue: Price;
  netRevenue: Price;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  refundedTransactions: number;
  averageTransactionValue: Price;
  successRate: number;
  refundRate: number;
  topPaymentMethods: Array<{
    method: PaymentMethod;
    count: number;
    percentage: number;
  }>;
}

// Type guards
export function isPayment(obj: unknown): obj is Payment {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'amount' in obj &&
    'status' in obj &&
    'method' in obj
  );
}

export function isSuccessfulPayment(payment: Payment): boolean {
  return payment.status === PaymentStatus.SUCCEEDED;
}

export function isRefundable(payment: Payment): boolean {
  return (
    payment.status === PaymentStatus.SUCCEEDED &&
    (!payment.refundedAt || payment.status === PaymentStatus.PARTIALLY_REFUNDED)
  );
}

export function canBeDisputed(payment: Payment): boolean {
  if (!payment.succeededAt) return false;

  const daysSincePayment = Math.ceil(
    (Date.now() - new Date(payment.succeededAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSincePayment <= 120; // 120 days dispute window
}
