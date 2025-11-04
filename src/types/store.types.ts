/**
 * Redux Store and State type definitions
 */

import type { AsyncData, Nullable, PaginatedResponse } from './common.types';
import type { Campsite, CampsiteListItem, CampsiteSearchParams } from './campsite.types';
import type { User, UserSession } from './user.types';
import type { Booking, BookingWithDetails } from './booking.types';
import type { Review, ReviewStatistics } from './review.types';
import type { Payment, Wallet } from './payment.types';

// ==================== Auth State ====================
export interface AuthState extends UserSession {
  tokens: {
    accessToken: Nullable<string>;
    refreshToken: Nullable<string>;
    expiresAt: Nullable<number>;
  };
}

// ==================== Campsites State ====================
export interface CampsitesState {
  // List view
  list: AsyncData<CampsiteListItem[]>;
  searchResults: AsyncData<PaginatedResponse<CampsiteListItem>>;
  searchParams: Nullable<CampsiteSearchParams>;

  // Detail view
  currentCampsite: AsyncData<Campsite>;

  // Featured & recommendations
  featured: AsyncData<CampsiteListItem[]>;
  recommended: AsyncData<CampsiteListItem[]>;

  // Filters & sorting
  filters: CampsiteFilters;
  sortBy: CampsiteSortOption;

  // Favorites
  favorites: Set<string>; // UUID set
}

export interface CampsiteFilters {
  priceRange: {
    min: number;
    max: number;
  };
  categories: string[];
  amenities: string[];
  minRating: number;
  instantBooking: boolean;
  petFriendly: boolean;
}

export type CampsiteSortOption =
  | 'relevance'
  | 'price_low'
  | 'price_high'
  | 'rating'
  | 'distance'
  | 'newest';

// ==================== Bookings State ====================
export interface BookingsState {
  // User's bookings
  myBookings: {
    upcoming: AsyncData<BookingWithDetails[]>;
    past: AsyncData<BookingWithDetails[]>;
    canceled: AsyncData<BookingWithDetails[]>;
  };

  // Owner's bookings (if user is owner)
  ownerBookings: {
    pending: AsyncData<BookingWithDetails[]>;
    confirmed: AsyncData<BookingWithDetails[]>;
    checkedIn: AsyncData<BookingWithDetails[]>;
  };

  // Current booking flow
  currentBooking: Nullable<Booking>;
  bookingDraft: Nullable<BookingDraft>;
}

export interface BookingDraft {
  campsiteId: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
    pets: number;
  };
  step: BookingStep;
}

export type BookingStep = 'dates' | 'guests' | 'details' | 'payment' | 'confirmation';

// ==================== Reviews State ====================
export interface ReviewsState {
  // Reviews for a campsite
  campsiteReviews: {
    [campsiteId: string]: AsyncData<PaginatedResponse<Review>>;
  };

  // User's reviews
  myReviews: AsyncData<Review[]>;

  // Review statistics
  statistics: {
    [campsiteId: string]: ReviewStatistics;
  };

  // Current review being written
  draftReview: Nullable<Review>;
}

// ==================== Payments State ====================
export interface PaymentsState {
  // Payment history
  transactions: AsyncData<Payment[]>;

  // Wallet/balance
  wallet: AsyncData<Wallet>;

  // Current payment
  currentPayment: AsyncData<Payment>;

  // Payment methods
  savedCards: AsyncData<Payment['cardDetails'][]>;
}

// ==================== UI State ====================
export interface UIState {
  // Modals
  modals: {
    login: boolean;
    signup: boolean;
    booking: boolean;
    review: boolean;
    filters: boolean;
  };

  // Notifications/Toasts
  notifications: Notification[];

  // Loading states
  globalLoading: boolean;

  // Mobile
  mobileMenuOpen: boolean;
  sidebar: {
    open: boolean;
    content: Nullable<'filters' | 'menu' | 'user'>;
  };

  // Theme
  theme: 'light' | 'dark' | 'auto';

  // Map view
  mapView: {
    enabled: boolean;
    center: {
      lat: number;
      lng: number;
    };
    zoom: number;
  };
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number; // in ms
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ==================== Root State ====================
export interface RootState {
  auth: AuthState;
  campsites: CampsitesState;
  bookings: BookingsState;
  reviews: ReviewsState;
  payments: PaymentsState;
  ui: UIState;
}

// ==================== Action Types ====================
export type AppDispatch = (action: AppAction) => void;
export type AppThunk<ReturnType = void> = (
  dispatch: AppDispatch,
  getState: () => RootState
) => ReturnType;

export interface AppAction<T = unknown> {
  type: string;
  payload?: T;
  error?: boolean;
  meta?: Record<string, unknown>;
}

// ==================== Selectors Return Types ====================
export type Selector<T> = (state: RootState) => T;

// Common selector patterns
export interface LoadingSelectors {
  isLoading: Selector<boolean>;
  hasError: Selector<boolean>;
  errorMessage: Selector<Nullable<string>>;
}

// ==================== Redux Toolkit Helpers ====================
export interface AsyncThunkConfig {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}

// ==================== Counter (from existing code) ====================
export interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

// Export for use in components
export type { Store } from 'redux';

// Utility types for connected components
export type MapStateToProps<StateProps, OwnProps = {}> = (
  state: RootState,
  ownProps: OwnProps
) => StateProps;

export type MapDispatchToProps<DispatchProps, OwnProps = {}> =
  | {
      [K in keyof DispatchProps]: (...args: any[]) => any;
    }
  | ((dispatch: AppDispatch, ownProps: OwnProps) => DispatchProps);

// Type guard utilities
export function isAsyncDataLoaded<T>(data: AsyncData<T>): data is AsyncData<T> & { data: T } {
  return !data.loading && data.error === null && data.data !== null;
}

export function hasAsyncDataError<T>(data: AsyncData<T>): data is AsyncData<T> & { error: Error } {
  return data.error !== null;
}
