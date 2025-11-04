/**
 * API Type Definitions
 *
 * Generic types for API responses, requests, errors,
 * and pagination used throughout the application.
 */

// ============================================================================
// Generic API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>; // Field-specific errors
  stack?: string; // Only in development
}

export interface ResponseMeta {
  timestamp: string;
  requestId: string;
  version: string;
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface CursorPaginationParams {
  limit: number;
  cursor?: string;
}

export interface CursorPaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}

// ============================================================================
// Error Code Enums
// ============================================================================

export enum ErrorCode {
  // Authentication
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Resource
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',

  // Business Logic
  BOOKING_UNAVAILABLE = 'BOOKING_UNAVAILABLE',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  CAMPSITE_NOT_PUBLISHED = 'CAMPSITE_NOT_PUBLISHED',
  BOOKING_CANNOT_BE_CANCELLED = 'BOOKING_CANNOT_BE_CANCELLED',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',

  // Server
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',

  // External Services
  STRIPE_ERROR = 'STRIPE_ERROR',
  EMAIL_SERVICE_ERROR = 'EMAIL_SERVICE_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
}

// ============================================================================
// HTTP Status Codes
// ============================================================================

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// ============================================================================
// Request Types
// ============================================================================

export interface ApiRequest<T = any> {
  body?: T;
  query?: Record<string, string | string[]>;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface AuthenticatedRequest<T = any> extends ApiRequest<T> {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

// ============================================================================
// Search & Filter Types
// ============================================================================

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: SortParam[];
  pagination?: PaginationParams;
}

export interface SortParam {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterOperator {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

// ============================================================================
// Bulk Operations
// ============================================================================

export interface BulkOperation<T> {
  operation: 'create' | 'update' | 'delete';
  items: T[];
}

export interface BulkOperationResult<T> {
  successful: T[];
  failed: {
    item: T;
    error: ApiError;
  }[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// ============================================================================
// File Upload Types
// ============================================================================

export interface FileUploadResponse {
  url: string;
  publicId: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface MultiFileUploadResponse {
  files: FileUploadResponse[];
  failed: {
    filename: string;
    error: string;
  }[];
}

// ============================================================================
// Webhook Types
// ============================================================================

export interface WebhookPayload<T = any> {
  id: string;
  type: string;
  data: T;
  timestamp: string;
  signature?: string;
}

export interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  payload: any;
  status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED';
  attempts: number;
  lastAttemptAt?: Date;
  nextAttemptAt?: Date;
  createdAt: Date;
}

export enum WebhookEventType {
  BOOKING_CREATED = 'booking.created',
  BOOKING_CONFIRMED = 'booking.confirmed',
  BOOKING_CANCELLED = 'booking.cancelled',
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_FAILED = 'payment.failed',
  REVIEW_CREATED = 'review.created',
  USER_CREATED = 'user.created',
}

// ============================================================================
// Rate Limiting
// ============================================================================

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  retryAfter?: number; // Seconds
}

export interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
  'Retry-After'?: string;
}

// ============================================================================
// Cache Types
// ============================================================================

export interface CacheControl {
  maxAge: number; // seconds
  sMaxAge?: number; // seconds (for CDN)
  staleWhileRevalidate?: number; // seconds
  staleIfError?: number; // seconds
  public?: boolean;
}

// ============================================================================
// Health Check Types
// ============================================================================

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    [key: string]: ServiceHealth;
  };
  uptime: number; // seconds
  version: string;
}

export interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number; // milliseconds
  message?: string;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface AnalyticsEvent {
  eventName: string;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  properties: Record<string, any>;
  metadata?: Record<string, any>;
}

// ============================================================================
// API Version Types
// ============================================================================

export interface ApiVersion {
  version: string;
  releaseDate: string;
  deprecated: boolean;
  sunsetDate?: string;
  changelogUrl?: string;
}

// ============================================================================
// Batch Request Types
// ============================================================================

export interface BatchRequest {
  requests: {
    id: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    body?: any;
    headers?: Record<string, string>;
  }[];
}

export interface BatchResponse {
  responses: {
    id: string;
    status: number;
    body: any;
    headers?: Record<string, string>;
  }[];
}

// ============================================================================
// Validation Error Types
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationErrors {
  errors: ValidationError[];
}

// ============================================================================
// Success Response Helpers
// ============================================================================

export function createSuccessResponse<T>(
  data: T,
  meta?: ResponseMeta
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta,
  };
}

export function createPaginatedResponse<T>(
  items: T[],
  pagination: PaginationMeta,
  meta?: ResponseMeta
): ApiResponse<PaginatedResponse<T>> {
  return {
    success: true,
    data: {
      items,
      pagination,
    },
    meta,
  };
}

// ============================================================================
// Error Response Helpers
// ============================================================================

export function createErrorResponse(
  code: ErrorCode | string,
  message: string,
  details?: Record<string, string[]>
): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
}

export function createValidationErrorResponse(
  errors: ValidationError[]
): ApiResponse<never> {
  const details: Record<string, string[]> = {};
  errors.forEach((error) => {
    if (!details[error.field]) {
      details[error.field] = [];
    }
    details[error.field].push(error.message);
  });

  return {
    success: false,
    error: {
      code: ErrorCode.VALIDATION_ERROR,
      message: 'Validation failed',
      details,
    },
  };
}

// ============================================================================
// Type Guards
// ============================================================================

export function isApiError(response: ApiResponse<any>): response is ApiResponse<never> & { error: ApiError } {
  return !response.success && response.error !== undefined;
}

export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } {
  return response.success && response.data !== undefined;
}

export function isPaginatedResponse<T>(
  response: ApiResponse<any>
): response is ApiResponse<PaginatedResponse<T>> {
  return (
    response.success &&
    response.data !== undefined &&
    'items' in response.data &&
    'pagination' in response.data
  );
}

// ============================================================================
// HTTP Client Types
// ============================================================================

export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
  retryDelay?: number;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

// ============================================================================
// API Route Types (for Next.js)
// ============================================================================

export type ApiHandler<T = any> = (
  req: Request
) => Promise<Response> | Response;

export type AuthenticatedApiHandler<T = any> = (
  req: Request,
  context: { user: { id: string; email: string; role: string } }
) => Promise<Response> | Response;

// ============================================================================
// Query Key Types (for React Query)
// ============================================================================

export type QueryKey = readonly [string, ...any[]];

export interface QueryOptions<T = any> {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: boolean | number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

// ============================================================================
// Export all types
// ============================================================================

export type {
  ApiResponse,
  ApiError,
  ResponseMeta,
  PaginationParams,
  PaginationMeta,
  PaginatedResponse,
  CursorPaginationParams,
  CursorPaginatedResponse,
  ApiRequest,
  AuthenticatedRequest,
  SearchParams,
  SortParam,
  FilterOperator,
  BulkOperation,
  BulkOperationResult,
  FileUploadResponse,
  MultiFileUploadResponse,
  WebhookPayload,
  WebhookEvent,
  RateLimitInfo,
  RateLimitHeaders,
  CacheControl,
  HealthCheckResponse,
  ServiceHealth,
  AnalyticsEvent,
  ApiVersion,
  BatchRequest,
  BatchResponse,
  ValidationError,
  ValidationErrors,
  HttpClientConfig,
  RequestConfig,
  ApiHandler,
  AuthenticatedApiHandler,
  QueryKey,
  QueryOptions,
};

export {
  ErrorCode,
  HttpStatus,
  WebhookEventType,
  createSuccessResponse,
  createPaginatedResponse,
  createErrorResponse,
  createValidationErrorResponse,
  isApiError,
  isSuccessResponse,
  isPaginatedResponse,
};
