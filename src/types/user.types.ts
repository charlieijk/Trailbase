/**
 * User and Authentication type definitions
 */

import type {
  UUID,
  Email,
  PhoneNumber,
  URL,
  BaseEntityWithStatus,
  Address,
  Image,
  ISODateString
} from './common.types';

// User Roles
export enum UserRole {
  GUEST = 'guest',
  CAMPER = 'camper',
  OWNER = 'owner',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  PENDING_VERIFICATION = 'pending_verification'
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  EMAIL_VERIFIED = 'email_verified',
  PHONE_VERIFIED = 'phone_verified',
  ID_VERIFIED = 'id_verified',
  FULLY_VERIFIED = 'fully_verified'
}

// User Profile
export interface UserProfile {
  firstName: string;
  lastName: string;
  displayName?: string;
  bio?: string;
  avatar?: Image;
  coverPhoto?: Image;
  dateOfBirth?: ISODateString;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  languages?: string[];
  website?: URL;
  socialLinks?: {
    facebook?: URL;
    instagram?: URL;
    twitter?: URL;
  };
}

// Contact Information
export interface ContactInfo {
  email: Email;
  emailVerified: boolean;
  phone?: PhoneNumber;
  phoneVerified: boolean;
  address?: Address;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: PhoneNumber;
  };
}

// Preferences
export interface UserPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  communication: CommunicationPreferences;
  display: DisplayPreferences;
}

export interface NotificationPreferences {
  email: {
    bookingConfirmations: boolean;
    bookingReminders: boolean;
    promotions: boolean;
    newsletters: boolean;
    reviewRequests: boolean;
    messages: boolean;
  };
  push: {
    bookingUpdates: boolean;
    messages: boolean;
    promotions: boolean;
  };
  sms: {
    bookingConfirmations: boolean;
    bookingReminders: boolean;
  };
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowMessages: 'everyone' | 'connections' | 'none';
  dataSharing: boolean;
}

export interface CommunicationPreferences {
  language: string;
  timezone: string;
  currency: 'USD' | 'EUR' | 'GBP';
  distanceUnit: 'miles' | 'kilometers';
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

export interface DisplayPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  colorScheme?: string;
  accessibility: {
    screenReader: boolean;
    highContrast: boolean;
    reduceMotion: boolean;
  };
}

// Stats & Achievements
export interface UserStats {
  totalBookings: number;
  completedStays: number;
  canceledBookings: number;
  reviewsGiven: number;
  reviewsReceived: number;
  favoriteCount: number;
  memberSince: ISODateString;
  lastActivity: ISODateString;
}

export interface OwnerStats extends UserStats {
  totalListings: number;
  activeListings: number;
  totalEarnings: number;
  averageRating: number;
  responseRate: number;
  responseTime: number; // in minutes
  acceptanceRate: number;
  superhostStatus: boolean;
}

export interface Badge {
  id: UUID;
  name: string;
  description: string;
  icon: string;
  earnedAt: ISODateString;
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// Main User Interface
export interface User extends BaseEntityWithStatus {
  // Authentication
  role: UserRole;
  accountStatus: AccountStatus;
  verificationStatus: VerificationStatus;

  // Profile
  profile: UserProfile;
  contactInfo: ContactInfo;
  preferences: UserPreferences;

  // Stats
  stats: UserStats | OwnerStats;
  badges: Badge[];

  // Security
  twoFactorEnabled: boolean;
  lastLogin?: ISODateString;
  lastPasswordChange?: ISODateString;

  // Metadata
  referralCode?: string;
  referredBy?: UUID;
  stripeCustomerId?: string;
}

// Authentication types
export interface LoginCredentials {
  email: Email;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: Email;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  agreeToTerms: boolean;
  receiveNewsletter?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface PasswordResetRequest {
  email: Email;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EmailVerification {
  token: string;
  email: Email;
}

export interface PhoneVerification {
  code: string;
  phone: PhoneNumber;
}

// Session
export interface UserSession {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// User creation/update DTOs
export type CreateUserInput = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'status' | 'stats' | 'badges'
>;

export type UpdateUserInput = Partial<
  Pick<User, 'profile' | 'contactInfo' | 'preferences'>
> & {
  id: UUID;
};

// Type guards
export function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'role' in obj &&
    'profile' in obj
  );
}

export function isOwner(user: User): user is User & { stats: OwnerStats } {
  return user.role === UserRole.OWNER || user.role === UserRole.ADMIN;
}

export function isAdmin(user: User): boolean {
  return user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
}

export function isCamper(user: User): boolean {
  return (
    user.role === UserRole.CAMPER ||
    user.role === UserRole.OWNER ||
    isAdmin(user)
  );
}

export function isVerified(user: User): boolean {
  return (
    user.verificationStatus === VerificationStatus.FULLY_VERIFIED ||
    user.verificationStatus === VerificationStatus.ID_VERIFIED
  );
}
