export const isRequired = value =>
  value ? undefined : 'This field is required';

export const minLength = length => value =>
  value.length < length
    ? `This field must be more than ${length - 1} chars`
    : undefined;

export const isEmail = value =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? undefined
    : 'Provide a valid email';
