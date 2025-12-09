import { z } from 'zod';

export const loginSchema = z.object({
    identifier: z
    .string()
    .min(3, 'Username or email required'),

    password: z
    .string()
    .min(1, 'Password required'),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscore'),

  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase(),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain a special character'),
});

// TypeScript type extracted from schema
export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;


// Response types
export type RegisterResult = {
  user: {
    id: string;
    email: string;
    username: string;
    name?: string;
    bio?: string | null;
    picture?: string | null;
  };
  accessToken: string;
};

export type LoginResult = RegisterResult; // same shape