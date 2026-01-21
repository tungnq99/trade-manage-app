import { MarketSession, TIMELINE_START_HOUR, TIMELINE_HOURS } from '@/constants/sessions';

/**
 * Calculate position percentage for a given hour on the timeline
 * Timeline starts at 4 AM (TIMELINE_START_HOUR)
 * Can work with both UTC or local hours
 */
export function getPositionPercent(hour: number, minute: number = 0): number {
    let adjustedHour = hour - TIMELINE_START_HOUR;

    // Handle wrap-around (e.g., 2am is 20 hours from 6am)
    if (adjustedHour < 0) {
        adjustedHour += 24;
    }

    const totalHours = adjustedHour + (minute / 60);
    return (totalHours / TIMELINE_HOURS) * 100;
}

/**
 * Calculate session bar position and width on timeline
 * Timeline shows full 24 hours starting from 6am, so all sessions are visible
 * Sessions are defined in UTC hours, but displayed on local timeline
 */
export function getSessionPosition(session: MarketSession, useLocalTime = true): {
    startPercent: number;
    widthPercent: number;
    crossesMidnight: boolean;
} {
    const { startHour, endHour } = session;

    // Convert UTC hours to local timezone
    let localStartHour = startHour;
    let localEndHour = endHour;

    if (useLocalTime) {
        const now = new Date();
        // getTimezoneOffset returns NEGATIVE for timezones ahead of UTC
        // Example: Vietnam (GMT+7) returns -420 minutes = -7 hours
        // So we need to NEGATE it: -(-420/60) = +7
        const timezoneOffsetHours = -now.getTimezoneOffset() / 60;

        localStartHour = (startHour + timezoneOffsetHours + 24) % 24;
        localEndHour = (endHour + timezoneOffsetHours + 24) % 24;
    }

    // Check if session crosses midnight AFTER timezone conversion
    const crossesMidnight = localEndHour < localStartHour;

    if (crossesMidnight) {
        // Session runs from startHour to 24:00, then 00:00 to endHour
        const startPercent = getPositionPercent(localStartHour);
        const durationHours = (24 - localStartHour) + localEndHour;
        const widthPercent = (durationHours / TIMELINE_HOURS) * 100;

        return { startPercent, widthPercent, crossesMidnight: true };
    } else {
        // Normal session within same day
        const startPercent = getPositionPercent(localStartHour);
        const durationHours = localEndHour - localStartHour;
        const widthPercent = (durationHours / TIMELINE_HOURS) * 100;

        return { startPercent, widthPercent, crossesMidnight: false };
    }
}

/**
 * Check if a session is currently active
 */
export function isSessionActive(session: MarketSession, currentTime: Date = new Date()): boolean {
    const currentHourUTC = currentTime.getUTCHours();
    const { startHour, endHour } = session;

    if (endHour < startHour) {
        // Session crosses midnight
        return currentHourUTC >= startHour || currentHourUTC < endHour;
    } else {
        return currentHourUTC >= startHour && currentHourUTC < endHour;
    }
}

/**
 * Format local time for a session
 */
export function getSessionLocalTime(time: number, currentTime: Date = new Date()): string {
    try {
        return currentTime.toLocaleTimeString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    } catch (error) {
        console.error(`Error formatting time for ${time}:`, error);
        return '--:--';
    }
}
