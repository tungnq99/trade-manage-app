/**
 * Forex Market Session Definitions
 */

export interface MarketSession {
    name: string;
    timezone: string;
    startHour: number; // UTC hour (0-23)
    endHour: number;   // UTC hour (0-23)
    color: string;     // Tailwind color class
    flag: string;      // Country flag emoji
}

export const MARKET_SESSIONS: MarketSession[] = [
    {
        name: 'Sydney',
        timezone: 'Australia/Sydney',
        startHour: 22, // 10 PM UTC
        endHour: 7,    // 7 AM UTC (crosses midnight)
        color: 'bg-slate-400/30', // Gray - inactive
        flag: '🇦🇺',
    },
    {
        name: 'Tokyo',
        timezone: 'Asia/Tokyo',
        startHour: 0,  // 12 AM UTC
        endHour: 9,    // 9 AM UTC
        color: 'bg-slate-400/30', // Gray - inactive
        flag: '🇯🇵',
    },
    {
        name: 'London',
        timezone: 'Europe/London',
        startHour: 8,  // 8 AM UTC
        endHour: 16,   // 4 PM UTC (16:30 but simplified)
        color: 'bg-green-500/50', // Green - active
        flag: '🇬🇧',
    },
    {
        name: 'New York',
        timezone: 'America/New_York',
        startHour: 13, // 1 PM UTC
        endHour: 22,   // 10 PM UTC
        color: 'bg-green-500/50', // Green - active
        flag: '🇺🇸',
    },
];

/**
 * Timeline configuration
 * Timeline starts at 4 AM and shows 24 hours
 */
export const TIMELINE_START_HOUR = 4;
export const TIMELINE_HOURS = 24;

/**
 * Generate timeline hour labels
 */
export function getTimelineLabels(): string[] {
    const labels: string[] = [];
    for (let i = 0; i < TIMELINE_HOURS; i += 2) {
        const hour = (TIMELINE_START_HOUR + i) % 24;
        const ampm = hour >= 12 ? 'pm' : 'am';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        labels.push(`${displayHour}${ampm}`);
    }
    return labels;
}
