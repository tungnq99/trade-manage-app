/**
 * Date Utility Functions
 * Using date-fns library for consistent date manipulation
 */

import { format, startOfMonth, endOfMonth, getDaysInMonth as getDays, isSameDay as isSame } from 'date-fns';

export interface MonthBoundaries {
    startDate: Date;
    endDate: Date;
}

/**
 * Format date to YYYY-MM-DD string
 * @param date - Date object to format
 * @returns Formatted date string (YYYY-MM-DD)
 * @example
 * formatDateKey(new Date('2026-01-15')) // '2026-01-15'
 */
export function formatDateKey(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

/**
 * Get start and end dates for a given month
 * @param year - Year number
 * @param month - Month number (0-indexed, 0 = January)
 * @returns Object with startDate and endDate
 * @example
 * getMonthBoundaries(2026, 0) // { startDate: '2026-01-01', endDate: '2026-01-31 23:59:59' }
 */
export function getMonthBoundaries(year: number, month: number): MonthBoundaries {
    const date = new Date(year, month, 1);
    return {
        startDate: startOfMonth(date),
        endDate: endOfMonth(date),
    };
}

/**
 * Format date to readable Vietnamese format
 * @param date - Date object or ISO string
 * @returns Formatted string (DD/MM/YYYY)
 * @example
 * formatDateVi(new Date('2026-01-15')) // '15/01/2026'
 */
export function formatDateVi(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'dd/MM/yyyy');
}

/**
 * Format date with time to Vietnamese format
 * @param date - Date object or ISO string
 * @returns Formatted string (DD/MM/YYYY HH:mm)
 * @example
 * formatDateTimeVi(new Date('2026-01-15T14:30:00')) // '15/01/2026 14:30'
 */
export function formatDateTimeVi(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'dd/MM/yyyy HH:mm');
}

/**
 * Check if two dates are the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    return isSame(date1, date2);
}

/**
 * Get number of days in a month
 * @param year - Year number
 * @param month - Month number (0-indexed)
 * @returns Number of days
 */
export function getDaysInMonth(year: number, month: number): number {
    return getDays(new Date(year, month, 1));
}

// ===== SESSION CLOCK TIMEZONE UTILITIES =====

/**
 * Convert UTC hour to local timezone hour
 * @param utcHour - Hour in UTC (0-23)
 * @returns Hour in local timezone (0-23)
 */
export function utcToLocalHour(utcHour: number): number {
    // Create a date with the UTC hour
    const utcDate = new Date();
    utcDate.setUTCHours(utcHour, 0, 0, 0);

    // Browser automatically converts to local timezone
    return utcDate.getHours();
}

/**
 * Format hour to HH:mm format
 * @param hour - Hour (0-23)
 * @param minute - Optional minute, defaults to 00
 * @returns Formatted string like "14:00" or "09:30"
 */
export function formatHour(hour: number, minute: number = 0): string {
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return format(date, 'HH:mm');
}

/**
 * Convert UTC hour to local time and format
 * @param utcHour - Hour in UTC (0-23)
 * @returns Formatted local time like "21:00"
 */
export function formatUtcHourToLocal(utcHour: number): string {
    const localHour = utcToLocalHour(utcHour);
    return formatHour(localHour);
}

/**
 * Format session time range from UTC to local
 * @param startUtc - Start hour in UTC
 * @param endUtc - End hour in UTC
 * @returns Formatted range like "14:00 - 23:00"
 */
export function formatSessionTime(startUtc: number, endUtc: number): string {
    const startLocal = formatUtcHourToLocal(startUtc);
    const endLocal = formatUtcHourToLocal(endUtc);
    return `${startLocal} - ${endLocal}`;
}
