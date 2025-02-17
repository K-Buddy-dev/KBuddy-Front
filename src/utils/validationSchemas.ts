import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address.');

export const emailFormSchema = z.object({
  email: emailSchema,
});

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
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Invalid email address.'),
  userId: z.string().min(1, 'User ID is required.'),
  birthDate: z.object({
    year: z.string().min(1, 'Year is required.'),
    month: z.string().min(1, 'Month is required.'),
    day: z.string().min(1, 'Day is required.'),
  }),
  nationality: z.string().min(1, 'Nationality is required.'),
  gender: z.string().min(1, 'Gender is required.'),
  password: passwordSchema,
  confirmPassword: passwordSchema,
});
