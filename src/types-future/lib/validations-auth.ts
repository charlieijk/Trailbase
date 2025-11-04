/**
 * Authentication Validation Schemas
 *
 * Zod schemas for validating authentication-related forms
 * including login, signup, password reset, and profile updates.
 */

import { z } from 'zod';
import { UserRole } from '@/types/types-user';

// ============================================================================
// Common Validation Rules
// ============================================================================

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .trim();

const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .optional();

// ============================================================================
// Login Schema
// ============================================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================================================
// Signup Schema
// ============================================================================

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    name: nameSchema,
    role: z.nativeEnum(UserRole, {
      errorMap: () => ({ message: 'Please select a role' }),
    }),
    agreedToTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupInput = z.infer<typeof signupSchema>;

// ============================================================================
// Password Reset Request Schema
// ============================================================================

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;

// ============================================================================
// Password Reset Confirm Schema
// ============================================================================

export const passwordResetConfirmSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>;

// ============================================================================
// Change Password Schema
// ============================================================================

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ============================================================================
// Email Verification Schema
// ============================================================================

export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>;

// ============================================================================
// Update Profile Schema
// ============================================================================

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  phone: phoneSchema,
  avatarUrl: z.string().url('Invalid URL').optional(),
  language: z.string().length(2, 'Invalid language code').optional(),
  timezone: z.string().optional(),
  currency: z.string().length(3, 'Invalid currency code').optional(),
  address: z
    .object({
      street: z.string().max(100).optional(),
      city: z.string().max(50).optional(),
      state: z.string().max(50).optional(),
      zipCode: z.string().max(20).optional(),
      country: z.string().length(2, 'Invalid country code').optional(),
    })
    .optional(),
  socialLinks: z
    .object({
      facebook: z.string().url('Invalid URL').optional(),
      twitter: z.string().url('Invalid URL').optional(),
      instagram: z.string().url('Invalid URL').optional(),
      linkedin: z.string().url('Invalid URL').optional(),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: z.string().min(2).max(50),
      phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
      relationship: z.string().min(2).max(50),
    })
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ============================================================================
// User Preferences Schema
// ============================================================================

export const userPreferencesSchema = z.object({
  notifications: z.object({
    email: z.object({
      bookingConfirmation: z.boolean(),
      bookingReminder: z.boolean(),
      messages: z.boolean(),
      reviews: z.boolean(),
      promotions: z.boolean(),
    }),
    sms: z.object({
      bookingConfirmation: z.boolean(),
      bookingReminder: z.boolean(),
      messages: z.boolean(),
    }),
    push: z.object({
      messages: z.boolean(),
      bookingUpdates: z.boolean(),
    }),
  }),
  privacy: z.object({
    showProfile: z.boolean(),
    showReviews: z.boolean(),
    allowMessages: z.boolean(),
  }),
  display: z.object({
    theme: z.enum(['LIGHT', 'DARK', 'AUTO']),
    language: z.string().length(2),
    dateFormat: z.string(),
    currency: z.string().length(3),
  }),
});

export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;

// ============================================================================
// Owner Identity Verification Schema
// ============================================================================

export const identityDocumentSchema = z.object({
  type: z.enum(['PASSPORT', 'DRIVERS_LICENSE', 'NATIONAL_ID']),
  documentNumber: z.string().min(5).max(50),
  frontImageUrl: z.string().url('Invalid image URL'),
  backImageUrl: z.string().url('Invalid image URL').optional(),
  expiryDate: z.coerce.date().refine((date) => date > new Date(), {
    message: 'Document has expired',
  }),
});

export type IdentityDocumentInput = z.infer<typeof identityDocumentSchema>;

// ============================================================================
// Payout Method Schema
// ============================================================================

export const payoutMethodSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('BANK_ACCOUNT'),
    bankName: z.string().min(2).max(100),
    accountNumber: z.string().min(5).max(20),
    routingNumber: z.string().length(9),
    accountHolderName: z.string().min(2).max(100),
  }),
  z.object({
    type: z.literal('PAYPAL'),
    paypalEmail: emailSchema,
  }),
  z.object({
    type: z.literal('STRIPE'),
    stripeAccountId: z.string().startsWith('acct_'),
  }),
]);

export type PayoutMethodInput = z.infer<typeof payoutMethodSchema>;

// ============================================================================
// OAuth Connection Schema
// ============================================================================

export const oauthConnectionSchema = z.object({
  provider: z.enum(['GOOGLE', 'FACEBOOK', 'GITHUB', 'APPLE']),
  code: z.string().min(1, 'Authorization code is required'),
  redirectUri: z.string().url('Invalid redirect URI'),
});

export type OAuthConnectionInput = z.infer<typeof oauthConnectionSchema>;

// ============================================================================
// Two-Factor Authentication Schemas
// ============================================================================

export const enable2FASchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export type Enable2FAInput = z.infer<typeof enable2FASchema>;

export const verify2FASchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d+$/, 'Code must be numeric'),
});

export type Verify2FAInput = z.infer<typeof verify2FASchema>;

export const disable2FASchema = z.object({
  password: z.string().min(1, 'Password is required'),
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d+$/, 'Code must be numeric'),
});

export type Disable2FAInput = z.infer<typeof disable2FASchema>;

// ============================================================================
// Account Deletion Schema
// ============================================================================

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  confirmation: z.literal('DELETE', {
    errorMap: () => ({ message: 'Please type DELETE to confirm' }),
  }),
  reason: z.string().max(500).optional(),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): boolean {
  return passwordSchema.safeParse(password).success;
}

/**
 * Get password strength score (0-4)
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;

  return Math.min(strength, 4);
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(password: string): string {
  const strength = getPasswordStrength(password);
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return labels[strength];
}

/**
 * Sanitize user input
 */
export function sanitizeUserInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
