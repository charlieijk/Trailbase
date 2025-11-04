import type { ContactFormValues } from '../types/forms.types';

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const phoneNumberRegEx = /^\d+$/;

export const validateContactForm = (values: ContactFormValues): ContactFormErrors => {
  const errors: ContactFormErrors = {};

  if (!values.firstName) {
    errors.firstName = 'Required';
  } else if (values.firstName.length < 2) {
    errors.firstName = 'Must be at least 2 characters.';
  } else if (values.firstName.length > 15) {
    errors.firstName = 'Must be 15 characters or less';
  }

  if (!values.lastName) {
    errors.lastName = 'Required';
  } else if (values.lastName.length < 2) {
    errors.lastName = 'Must be at least 2 characters.';
  } else if (values.lastName.length > 15) {
    errors.lastName = 'Must be 15 characters or less';
  }

  if (!phoneNumberRegEx.test(values.phoneNum)) {
    errors.phoneNum = 'The phone number should contain only numbers.';
  }

  if (!values.email.includes('@')) {
    errors.email = 'Email should contain a @';
  }

  return errors;
};
