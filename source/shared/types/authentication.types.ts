import { z } from 'zod';
import { Role, UserStatus } from '@prisma/client'; // Import generated types

// --- Input Schemas (Using Zod for Validation) ---
export const registerSchema = z.object({
    // Username is handled by the Profile model in a 1:1 relationship
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username too long')
        .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscore'),

    email: z
        .string()
        .email('Invalid email format')
        .toLowerCase(),

    // The client sends the plain-text password
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain uppercase letter')
        .regex(/[a-z]/, 'Password must contain lowercase letter')
        .regex(/[0-9]/, 'Password must contain a number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain a special character'),
});

export const loginSchema = z.object({
    // Identifier can be either username or email
    identifier: z
    .string()
    .min(3, 'Username or email required'),

    password: z
    .string()
    .min(1, 'Password required'),
});

// --- Derived Types ---
export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;


// --- Response Types ---
export type AuthenticationResponse = {
    user: {
        id: string;
        email: string;
        username: string; // From the Profile
        role: Role;       // From the User model
        status: UserStatus; // From the User model
    };
    accessToken: string;
    // refreshToken is handled via secure cookie and doesn't always need to be returned here
};