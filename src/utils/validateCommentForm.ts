import type { CommentFormValues } from '../types/forms.types';

type CommentFormErrors = Partial<Record<keyof CommentFormValues, string>>;

export const validateCommentForm = (values: CommentFormValues): CommentFormErrors => {
  const errors: CommentFormErrors = {};

  if (!values.rating || Number.isNaN(Number(values.rating))) {
    errors.rating = 'Rating is required';
  }

  if (!values.author) {
    errors.author = 'Author is required';
  } else if (values.author.length < 2) {
    errors.author = 'Must be at least 2 characters.';
  } else if (values.author.length > 15) {
    errors.author = 'Must be 15 characters or less.';
  }

  return errors;
};
