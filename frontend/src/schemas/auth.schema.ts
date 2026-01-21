import { z } from 'zod';
import { VALIDATION_MESSAGES } from '@/constants/app';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
        .email(VALIDATION_MESSAGES.EMAIL_INVALID),
    password: z
        .string()
        .min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED)
        .min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
});

export const registerSchema = z.object({
    email: z
        .string()
        .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
        .email(VALIDATION_MESSAGES.EMAIL_INVALID),
    password: z
        .string()
        .min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED)
        .min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
    firstName: z.string().min(1, VALIDATION_MESSAGES.FIRST_NAME_REQUIRED),
    lastName: z.string().min(1, VALIDATION_MESSAGES.LAST_NAME_REQUIRED),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
