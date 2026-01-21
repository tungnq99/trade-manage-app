import { z } from 'zod';

/**
 * Schema cho Capital Settings Form
 */
export const capitalSettingsSchema = z.object({
    initialBalance: z.number().positive('Initial balance must be greater than 0'),
    currency: z.string().default('USD'),
});

export type CapitalSettingsFormData = z.infer<typeof capitalSettingsSchema>;

/**
 * Schema cho Risk Parameters Form
 */
export const riskParametersSchema = z.object({
    riskPerTrade: z
        .number()
        .min(0.1, 'Risk per trade must be at least 0.1%')
        .max(5, 'Risk per trade cannot exceed 5%'),
    dailyLossLimit: z
        .number()
        .min(1, 'Daily loss limit must be at least 1%')
        .max(20, 'Daily loss limit cannot exceed 20%'),
    maxDrawdown: z
        .number()
        .min(5, 'Max drawdown must be at least 5%')
        .max(50, 'Max drawdown cannot exceed 50%'),
    dailyCapTarget: z
        .number()
        .min(100, 'Daily cap target must be at least $100')
        .max(50000, 'Daily cap target cannot exceed $50,000'),
});

export type RiskParametersFormData = z.infer<typeof riskParametersSchema>;

/**
 * Schema cho Onboarding Capital Page
 */
export const onboardingCapitalSchema = z.object({
    initialBalance: z.number().positive('Starting balance must be greater than 0'),
});

export type OnboardingCapitalFormData = z.infer<typeof onboardingCapitalSchema>;
