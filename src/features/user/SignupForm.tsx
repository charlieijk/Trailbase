"use client";

import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Formik, Field, type FieldProps } from 'formik';
import { Alert, Button, Form as ReactstrapForm } from 'reactstrap';
import { useAppDispatch } from '../../state/hooks';
import { setCurrentUser } from './userSlice';
import type { UserSignupFormValues } from '../../types/forms.types';
import {
  getPasswordStrength,
  passwordChecks,
  passwordRequirements,
  validateSignupForm,
} from '../../utils/validateSignupForm';

const DEFAULT_AVATAR = '/assets/img/unicorn.png';

const initialValues: UserSignupFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  subscribeToNews: true,
};

const strengthToLabel = (strength: number): { label: string; tone: 'danger' | 'warning' | 'success' } => {
  if (strength >= 80) return { label: 'Strong', tone: 'success' };
  if (strength >= 50) return { label: 'Almost there', tone: 'warning' };
  if (strength > 0) return { label: 'Needs work', tone: 'danger' };
  return { label: 'Start typing', tone: 'danger' };
};

const SignupForm: FC = () => {
  const dispatch = useAppDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const successTimeoutRef = useRef<number>();

  useEffect(
    () => () => {
      if (successTimeoutRef.current) {
        window.clearTimeout(successTimeoutRef.current);
      }
    },
    [],
  );

  return (
    <Formik<UserSignupFormValues>
      initialValues={initialValues}
      validate={validateSignupForm}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        dispatch(
          setCurrentUser({
            id: Date.now(),
            avatar: DEFAULT_AVATAR,
            username: values.username,
            password: values.password,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            subscribedToNews: values.subscribeToNews,
          }),
        );
        setSubmitted(true);
        setShowPassword(false);
        setShowConfirmPassword(false);
        if (successTimeoutRef.current) {
          window.clearTimeout(successTimeoutRef.current);
        }
        successTimeoutRef.current = window.setTimeout(() => setSubmitted(false), 6000);
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ handleSubmit, isSubmitting, values }) => {
        const strength = getPasswordStrength(values.password);
        const { label: strengthLabel, tone } = strengthToLabel(strength);
        const metRequirements = passwordChecks.map(({ test }) => test(values.password));

        return (
          <ReactstrapForm onSubmit={handleSubmit} className="signup-form shadow-lg border-0">
            <header className="signup-form__header">
              <h2>Create your Trailbase account</h2>
              <p className="signup-form__subtitle">
                Join the community of explorers and keep your adventures organised in one place.
              </p>
            </header>

            {submitted && (
              <Alert color="success" fade className="signup-form__alert">
                Welcome aboard! You&apos;re signed in—start exploring campsites or customise your profile.
              </Alert>
            )}

            <div className="signup-grid">
              <Field name="firstName">
                {({ field, meta }: FieldProps<string, UserSignupFormValues>) => (
                  <div className="signup-field">
                    <label htmlFor="firstName" className="signup-label">
                      First name
                    </label>
                    <input
                      {...field}
                      id="firstName"
                      className={`signup-input${meta.touched && meta.error ? ' signup-input--invalid' : ''}`}
                      placeholder="Jane"
                      autoComplete="given-name"
                    />
                    {meta.touched && meta.error && <span className="signup-error">{meta.error}</span>}
                  </div>
                )}
              </Field>

              <Field name="lastName">
                {({ field, meta }: FieldProps<string, UserSignupFormValues>) => (
                  <div className="signup-field">
                    <label htmlFor="lastName" className="signup-label">
                      Last name
                    </label>
                    <input
                      {...field}
                      id="lastName"
                      className={`signup-input${meta.touched && meta.error ? ' signup-input--invalid' : ''}`}
                      placeholder="Doe"
                      autoComplete="family-name"
                    />
                    {meta.touched && meta.error && <span className="signup-error">{meta.error}</span>}
                  </div>
                )}
              </Field>
            </div>

            <Field name="email">
              {({ field, meta }: FieldProps<string, UserSignupFormValues>) => (
                <div className="signup-field">
                  <label htmlFor="email" className="signup-label">
                    Email
                  </label>
                  <input
                    {...field}
                    id="email"
                    type="email"
                    className={`signup-input${meta.touched && meta.error ? ' signup-input--invalid' : ''}`}
                    placeholder="you@email.com"
                    autoComplete="email"
                  />
                  {meta.touched && meta.error && <span className="signup-error">{meta.error}</span>}
                </div>
              )}
            </Field>

            <Field name="username">
              {({ field, meta }: FieldProps<string, UserSignupFormValues>) => (
                <div className="signup-field">
                  <label htmlFor="username" className="signup-label">
                    Username
                  </label>
                  <input
                    {...field}
                    id="username"
                    className={`signup-input${meta.touched && meta.error ? ' signup-input--invalid' : ''}`}
                    placeholder="trailblazer"
                    autoComplete="username"
                  />
                  {meta.touched && meta.error && <span className="signup-error">{meta.error}</span>}
                </div>
              )}
            </Field>

            <div className="signup-grid">
              <Field name="password">
                {({ field, meta }: FieldProps<string, UserSignupFormValues>) => (
                  <div className="signup-field">
                    <label htmlFor="password" className="signup-label">
                      Password
                    </label>
                    <div className="signup-input-wrapper">
                      <input
                        {...field}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        className={`signup-input${meta.touched && meta.error ? ' signup-input--invalid' : ''}`}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="signup-toggle"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </button>
                    </div>
                    <div className={`signup-strength signup-strength--${tone}`}>
                      <div className="signup-strength__bar" style={{ width: `${strength}%` }} />
                      <span className="signup-strength__label">{strengthLabel}</span>
                    </div>
                    {meta.touched && meta.error && <span className="signup-error">{meta.error}</span>}
                    <ul className="signup-hints">
                      {passwordRequirements.map((requirement, index) => {
                        const met = metRequirements[index];
                        return (
                          <li
                            key={requirement}
                            className={`signup-hint${met ? ' signup-hint--met' : ''}`}
                          >
                            <i className={`fa ${met ? 'fa-check-circle' : 'fa-circle'} me-2`} aria-hidden />
                            {requirement}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </Field>

              <Field name="confirmPassword">
                {({ field, meta }: FieldProps<string, UserSignupFormValues>) => (
                  <div className="signup-field">
                    <label htmlFor="confirmPassword" className="signup-label">
                      Confirm password
                    </label>
                    <div className="signup-input-wrapper">
                      <input
                        {...field}
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`signup-input${meta.touched && meta.error ? ' signup-input--invalid' : ''}`}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="signup-toggle"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </button>
                    </div>
                    {meta.touched && meta.error && <span className="signup-error">{meta.error}</span>}
                  </div>
                )}
              </Field>
            </div>

            <div className="signup-field signup-field--checkbox">
              <Field name="subscribeToNews" type="checkbox">
                {({ field }: FieldProps<boolean, UserSignupFormValues>) => {
                  const { value, ...checkboxField } = field;
                  return (
                    <label className="signup-checkbox">
                      <input type="checkbox" {...checkboxField} checked={Boolean(value)} />
                      <span>Send me curated trail inspiration and product updates.</span>
                    </label>
                  );
                }}
              </Field>
            </div>

            <div className="signup-field signup-field--checkbox">
              <Field name="acceptTerms" type="checkbox">
                {({ field, meta }: FieldProps<boolean, UserSignupFormValues>) => {
                  const { value, ...checkboxField } = field;
                  return (
                    <>
                      <label className="signup-checkbox">
                        <input type="checkbox" {...checkboxField} checked={Boolean(value)} />
                        <span>
                          I agree to the{' '}
                          <a href="#" onClick={(event) => event.preventDefault()}>
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" onClick={(event) => event.preventDefault()}>
                            Privacy Policy
                          </a>
                          .
                        </span>
                      </label>
                      {meta.touched && meta.error && <span className="signup-error">{meta.error}</span>}
                    </>
                  );
                }}
              </Field>
            </div>

            <Button
              color="primary"
              type="submit"
              size="lg"
              className="signup-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating your account...' : 'Create account'}
            </Button>

            <footer className="signup-form__footer">
              <p>
                Already part of Trailbase? Click the{' '}
                <strong>Login</strong> button in the navigation bar to sign in.
              </p>
            </footer>
          </ReactstrapForm>
        );
      }}
    </Formik>
  );
};

export default SignupForm;
