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

export const userIdSchema = z
  .string()
  .min(3, 'User ID must be at least 3 characters.')
  .max(20, 'User ID must be at most 20 characters.')
  .regex(/^[a-zA-Z0-9]{3,20}$/, 'User ID must contain only letters and numbers.');

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .max(30, 'First name must be at most 30 characters.')
      .regex(/^[a-zA-Z]+$/, 'First name must contain only letters.'),
    lastName: z
      .string()
      .max(30, 'Last name must be at most 30 characters.')
      .regex(/^[a-zA-Z]+$/, 'Last name must contain only letters.'),
    email: emailSchema,
    userId: userIdSchema,
    birthDate: z
      .object({
        year: z.string().optional(),
        month: z.string().optional(),
        day: z.string().optional(),
      })
      .optional(),
    country: z.string().nullable().optional(),
    gender: z.string().nullable().optional(),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const socialSignupSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Invalid email address.'),
  userId: z.string().min(1, 'User ID is required.'),
  birthDate: z.object({
    year: z.string().optional(),
    month: z.string().optional(),
    day: z.string().optional(),
  }),
  country: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
});

export const postFormTitleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

export const postFormDescriptionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
});

export const requestLiveChatSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(isValidSlashDate, 'Use a valid date in MM/DD/YYYY format'),
  selectedDate: z.date({ required_error: 'Please select a date' }),
  timeSlots: z.array(z.string()).min(1, 'Please select at least one time slot'),
  topic: z.string().min(1, 'Live chat topic is required').max(300, 'Topic must be at most 300 characters'),
});

function isValidSlashDate(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const [, monthText, dayText, yearText] = match;
  const month = Number(monthText);
  const day = Number(dayText);
  const year = Number(yearText);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export type PostFormTitleData = z.infer<typeof postFormTitleSchema>;
export type PostFormDescriptionData = z.infer<typeof postFormDescriptionSchema>;
export type RequestLiveChatData = z.infer<typeof requestLiveChatSchema>;
