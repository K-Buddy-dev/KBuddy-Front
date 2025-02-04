import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long.')
  .max(20, 'Password must be less than 20 characters long.')
  .regex(/\d/, 'Password must contain at least one number.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[^\w\s]/, 'Password must contain at least one special character.');

export const passwordValidationRules = [
  { label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
  { label: 'At least 20 characters', test: (value: string) => value.length <= 20 },
  { label: 'At least one number', test: (value: string) => /\d/.test(value) },
  { label: 'At least one uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'At least one lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { label: 'At least one special character', test: (value: string) => /[^\w\s]/.test(value) },
];

export const loginSchema = z.object({
  username: z.string().email('Invalid email address.'),
  password: passwordSchema,
});
