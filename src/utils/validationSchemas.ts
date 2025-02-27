import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address.');

export const emailFormSchema = z.object({
  email: emailSchema,
});

export const passwordSchema = z
  .string()
  .min(8, 'At least 8 characters.')
  .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/, 'At least one special character.');

export const passwordValidationRules = [
  { label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
  {
    label: 'At least one special character',
    test: (value: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
  },
];

export const loginSchema = z.object({
  emailOrUserId: z.string().min(1, 'Email or User ID is required.'),
  password: passwordSchema,
});

export const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    email: z.string().email('Invalid email address.'),
    userId: z.string().min(1, 'User ID is required.'),
    birthDate: z.object({
      year: z.string().min(1, 'Year is required.'),
      month: z.string().min(1, 'Month is required.'),
      day: z.string().min(1, 'Day is required.'),
    }),
    country: z.string().min(1, 'Country is required.'),
    gender: z.string().min(1, 'Gender is required.'),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
