/**
 * API Request/Response type definitions
 */

import type { PaginatedResponse } from './common.types';

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
  timestamp: string;
}

export interface ResponseMeta {
  timestamp: string;
  requestId: string;
  version: string;
  rateLimit?: RateLimitInfo;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
}

// Validation errors
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

export interface ValidationErrors {
  errors: ValidationError[];
}

// Query parameters
export interface QueryParams {
  [key: string]: string | number | boolean | undefined | null | string[];
}

// API Endpoints
export type ApiEndpoint =
  | '/campsites'
  | '/campsites/:id'
  | '/campsites/search'
  | '/bookings'
  | '/bookings/:id'
  | '/reviews'
  | '/reviews/:id'
  | '/users'
  | '/users/:id'
  | '/payments'
  | '/auth/login'
  | '/auth/signup'
  | '/auth/logout'
  | '/auth/refresh';

// Request configuration
export interface RequestConfig {
  method: HttpMethod;
  endpoint: string;
  params?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

// Fetch hooks return type
export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export interface UseMutationResult<T, V> {
  mutate: (variables: V) => Promise<T>;
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  reset: () => void;
}

// Helper type creators
export type SuccessResponse<T> = ApiResponse<T> & { success: true; data: T };
export type ErrorResponse = ApiResponse<never> & { success: false; error: ApiError };

export type PaginatedApiResponse<T> = SuccessResponse<PaginatedResponse<T>>;

// Response helpers
export function createSuccessResponse<T>(data: T, meta?: ResponseMeta): SuccessResponse<T> {
  return {
    success: true,
    data,
    meta: meta || {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
      version: '1.0.0'
    }
  };
}

export function createErrorResponse(error: ApiError): ErrorResponse {
  return {
    success: false,
    error,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
      version: '1.0.0'
    }
  };
}

// Type guards
export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.success === true && response.data !== undefined;
}

export function isErrorResponse(response: ApiResponse): response is ErrorResponse {
  return response.success === false && response.error !== undefined;
}
