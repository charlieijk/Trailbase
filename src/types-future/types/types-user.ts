/**
 * User Type Definitions
 *
 * Core types for user management, authentication,
 * profiles, and authorization.
 */

// ============================================================================
// Enums
// ============================================================================

export enum UserRole {
  CAMPER = 'CAMPER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  DELETED = 'DELETED',
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

// ============================================================================
// Core User Type
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  accountStatus: AccountStatus;

  // Profile
  avatarUrl?: string;
  bio?: string;
  phone?: string;

  // Verification
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  phoneVerified: boolean;
  phoneVerifiedAt?: Date;

  // Identity verification (for owners)
  identityVerificationStatus: VerificationStatus;

  // Settings
  language: string;
  timezone: string;
  currency: string;

  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  agreedToTerms: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  expiresAt?: number;
  error?: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EmailVerification {
  token: string;
}

// ============================================================================
// Profile Types
// ============================================================================

export interface UserProfile extends User {
  // Additional profile fields
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: string;

  // Address
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  // Social
  website?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };

  // Emergency contact
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface PublicUserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  joinedAt: Date;
  verifiedOwner: boolean;

  // Stats
  totalReviews?: number;
  averageRating?: number;
  responseRate?: number;
  responseTime?: number; // hours
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  phone?: string;
  avatarUrl?: string;
  language?: string;
  timezone?: string;
  currency?: string;
  address?: UserProfile['address'];
  socialLinks?: UserProfile['socialLinks'];
  emergencyContact?: UserProfile['emergencyContact'];
}

// ============================================================================
// Owner-Specific Types
// ============================================================================

export interface OwnerProfile extends UserProfile {
  // Business info
  businessName?: string;
  businessType?: 'INDIVIDUAL' | 'COMPANY';
  taxId?: string;

  // Verification
  identityVerificationStatus: VerificationStatus;
  identityDocuments?: IdentityDocument[];

  // Payout
  payoutMethod?: PayoutMethod;

  // Stats
  totalCampsites: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  responseRate: number;
  superhost: boolean;
}

export interface IdentityDocument {
  id: string;
  type: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID';
  documentNumber: string;
  frontImageUrl: string;
  backImageUrl?: string;
  expiryDate: Date;
  verificationStatus: VerificationStatus;
  uploadedAt: Date;
  verifiedAt?: Date;
  rejectionReason?: string;
}

export interface PayoutMethod {
  id: string;
  type: 'BANK_ACCOUNT' | 'PAYPAL' | 'STRIPE';
  isDefault: boolean;

  // Bank account details (masked)
  bankName?: string;
  accountLast4?: string;
  routingNumber?: string;

  // PayPal
  paypalEmail?: string;

  // Stripe
  stripeAccountId?: string;

  createdAt: Date;
  verifiedAt?: Date;
}

// ============================================================================
// Admin-Specific Types
// ============================================================================

export interface AdminProfile extends UserProfile {
  permissions: AdminPermission[];
  department?: string;
}

export enum AdminPermission {
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_CAMPSITES = 'MANAGE_CAMPSITES',
  MANAGE_BOOKINGS = 'MANAGE_BOOKINGS',
  MANAGE_REVIEWS = 'MANAGE_REVIEWS',
  MANAGE_PAYMENTS = 'MANAGE_PAYMENTS',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  MANAGE_CONTENT = 'MANAGE_CONTENT',
  MANAGE_ADMINS = 'MANAGE_ADMINS',
}

// ============================================================================
// User Preferences
// ============================================================================

export interface UserPreferences {
  userId: string;

  // Notifications
  notifications: {
    email: {
      bookingConfirmation: boolean;
      bookingReminder: boolean;
      messages: boolean;
      reviews: boolean;
      promotions: boolean;
    };
    sms: {
      bookingConfirmation: boolean;
      bookingReminder: boolean;
      messages: boolean;
    };
    push: {
      messages: boolean;
      bookingUpdates: boolean;
    };
  };

  // Privacy
  privacy: {
    showProfile: boolean;
    showReviews: boolean;
    allowMessages: boolean;
  };

  // Display
  display: {
    theme: 'LIGHT' | 'DARK' | 'AUTO';
    language: string;
    dateFormat: string;
    currency: string;
  };
}

// ============================================================================
// User Activity Types
// ============================================================================

export interface UserActivity {
  id: string;
  userId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export enum ActivityType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  CAMPSITE_CREATED = 'CAMPSITE_CREATED',
  CAMPSITE_UPDATED = 'CAMPSITE_UPDATED',
  BOOKING_CREATED = 'BOOKING_CREATED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  REVIEW_POSTED = 'REVIEW_POSTED',
  MESSAGE_SENT = 'MESSAGE_SENT',
}

// ============================================================================
// User Statistics
// ============================================================================

export interface UserStats {
  userId: string;

  // For campers
  totalBookings?: number;
  totalSpent?: number;
  totalNightsBooked?: number;
  totalReviewsWritten?: number;
  favoriteDestination?: string;

  // For owners
  totalCampsites?: number;
  totalEarnings?: number;
  totalBookingsReceived?: number;
  averageRating?: number;
  totalReviewsReceived?: number;
  occupancyRate?: number;
}

// ============================================================================
// Favorites & Wishlist
// ============================================================================

export interface Favorite {
  id: string;
  userId: string;
  campsiteId: string;
  addedAt: Date;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  campsites: string[]; // Campsite IDs
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// User Relationships
// ============================================================================

export interface UserWithStats extends User {
  stats: UserStats;
}

export interface UserWithPreferences extends User {
  preferences: UserPreferences;
}

export interface UserWithActivity extends User {
  recentActivity: UserActivity[];
}

// ============================================================================
// Form Input Types
// ============================================================================

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface UpdateUserInput {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
  accountStatus?: AccountStatus;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
}

export interface UserFilters {
  role?: UserRole;
  accountStatus?: AccountStatus;
  emailVerified?: boolean;
  identityVerified?: boolean;
  search?: string; // Name or email
  createdAfter?: Date;
  createdBefore?: Date;
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastLoginAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ============================================================================
// OAuth Types
// ============================================================================

export interface OAuthProvider {
  provider: 'GOOGLE' | 'FACEBOOK' | 'GITHUB' | 'APPLE';
  providerId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface OAuthUser {
  provider: string;
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

// Type for user without sensitive data
export type SafeUser = Omit<User, 'emailVerified' | 'phoneVerified' | 'identityVerificationStatus'>;

// Type for user list items (minimal data)
export type UserListItem = Pick<User, 'id' | 'name' | 'email' | 'avatarUrl' | 'role' | 'accountStatus' | 'createdAt'>;

// Type for current authenticated user
export type CurrentUser = User & {
  preferences: UserPreferences;
  stats: UserStats;
};

// Type guard functions
export const isOwner = (user: User): user is User & { role: UserRole.OWNER } => {
  return user.role === UserRole.OWNER;
};

export const isAdmin = (user: User): user is User & { role: UserRole.ADMIN } => {
  return user.role === UserRole.ADMIN;
};

export const isCamper = (user: User): user is User & { role: UserRole.CAMPER } => {
  return user.role === UserRole.CAMPER;
};
