import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'At least 8 characters.')
  .max(20, 'At most 20 characters.')
  .regex(/\d/, 'At least one number.')
  .regex(/[A-Z]/, 'At least one uppercase letter.')
  .regex(/[a-z]/, 'At least one lowercase letter.')
  .regex(/[^\w\s]/, 'At least one special character.');

export const passwordValidationRules = [
  { label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
  { label: 'At most 20 characters', test: (value: string) => value.length <= 20 },
  { label: 'At least one number', test: (value: string) => /\d/.test(value) },
  { label: 'At least one uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'At least one lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { label: 'At least one special character', test: (value: string) => /[^\w\s]/.test(value) },
];

export const loginSchema = z.object({
  username: z.string().email('Invalid email address.'),
  password: passwordSchema,
});
