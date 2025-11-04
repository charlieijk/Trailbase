/**
 * Common utility types used throughout the application
 */

// Branded types for type safety
export type UUID = string & { readonly __brand: 'UUID' };
export type Email = string & { readonly __brand: 'Email' };
export type PhoneNumber = string & { readonly __brand: 'PhoneNumber' };
export type URL = string & { readonly __brand: 'URL' };
export type ISODateString = string & { readonly __brand: 'ISODateString' };

// Location types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Location extends Coordinates {
  address: Address;
  timezone?: string;
  elevation?: number;
}

// Image types
export interface Image {
  id: UUID;
  url: URL;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  thumbnailUrl?: URL;
}

export interface ImageUpload {
  file: File;
  preview?: string;
  caption?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search & Filter types
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
  dateRange?: DateRange;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Generic CRUD operations
export type EntityStatus = 'active' | 'inactive' | 'archived' | 'deleted';

export interface Timestamps {
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt?: ISODateString;
}

export interface BaseEntity extends Timestamps {
  id: UUID;
}

export interface BaseEntityWithStatus extends BaseEntity {
  status: EntityStatus;
}

// Rating & Statistics
export interface Rating {
  average: number;
  count: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface Statistics {
  views: number;
  favorites: number;
  shares: number;
}

// Price types
export interface Price {
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP';
  formatted: string;
}

export interface PriceRange {
  min: Price;
  max: Price;
}

// Utility type helpers
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncData<T> = {
  data: Nullable<T>;
  loading: boolean;
  error: Nullable<Error>;
};

// Form types
export type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
};

export type FormState<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// Result type for operations that can fail
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
