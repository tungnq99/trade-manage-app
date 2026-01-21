/**
 * Capital & Trading Constants
 */

export const DEFAULT_CURRENCY = 'USD';

export const SUPPORTED_CURRENCIES = ['USD'] as const;

export type Currency = typeof SUPPORTED_CURRENCIES[number];
