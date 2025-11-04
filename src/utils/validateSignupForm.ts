"use client";

import type { UserSignupFormValues } from '../types/forms.types';

type SignupErrors = Partial<Record<keyof UserSignupFormValues, string>>;

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type PasswordRule = { test: (value: string) => boolean; message: string };

const PASSWORD_RULES: PasswordRule[] = [
  { test: (value) => value.length >= 8, message: 'At least 8 characters' },
  { test: (value) => /[A-Z]/.test(value), message: 'One uppercase letter' },
  { test: (value) => /[a-z]/.test(value), message: 'One lowercase letter' },
  { test: (value) => /\d/.test(value), message: 'One number' },
  { test: (value) => /[^A-Za-z0-9]/.test(value), message: 'One special character' },
];

export const passwordChecks: PasswordRule[] = PASSWORD_RULES;

export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  const passedRules = PASSWORD_RULES.reduce(
    (acc, rule) => acc + Number(rule.test(password)),
    0,
  );
  return (passedRules / PASSWORD_RULES.length) * 100;
};

export const passwordRequirements = PASSWORD_RULES.map(({ message }) => message);

export const validateSignupForm = (values: UserSignupFormValues): SignupErrors => {
  const errors: SignupErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.username.trim()) {
    errors.username = 'Username is required';
  } else if (values.username.length < 6 || values.username.length > 20) {
    errors.username = 'Username must be between 6 and 20 characters';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else {
    const failedRule = PASSWORD_RULES.find((rule) => !rule.test(values.password));
    if (failedRule) {
      errors.password = `Password must include: ${failedRule.message.toLowerCase()}`;
    }
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and privacy policy';
  }

  return errors;
};
