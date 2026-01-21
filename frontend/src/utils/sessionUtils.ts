/**
 * Trading Session Timing Constants (UTC)
 */
export const SESSIONS = {
    SYDNEY: {
        name: 'Sydney',
        openHour: 22,  // 22:00 UTC
        closeHour: 7,   // 07:00 UTC
        color: '#10b981', // Emerald
        flag: '🇦🇺'
    },
    TOKYO: {
        name: 'Tokyo',
        openHour: 0,   // 00:00 UTC
        closeHour: 9,   // 09:00 UTC
        color: '#f59e0b', // Amber
        flag: '🇯🇵'
    },
    LONDON: {
        name: 'London',
        openHour: 8,   // 08:00 UTC
        closeHour: 17,  // 17:00 UTC
        color: '#3b82f6', // Blue
        flag: '🇬🇧'
    },
    NEW_YORK: {
        name: 'New York',
        openHour: 13,  // 13:00 UTC
        closeHour: 22,  // 22:00 UTC
        color: '#8b5cf6', // Violet
        flag: '🇺🇸'
    }
} as const;

export type SessionName = keyof typeof SESSIONS;

export interface SessionStatus {
    name: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    color: string;
    flag: string;
}

/**
 * Check if a session is currently open
 */
export const isSessionOpen = (sessionKey: SessionName): boolean => {
    const session = SESSIONS[sessionKey];
    const now = new Date();
    const currentHourUTC = now.getUTCHours();

    // Handle sessions that cross midnight (Sydney)
    if (session.openHour > session.closeHour) {
        return currentHourUTC >= session.openHour || currentHourUTC < session.closeHour;
    }

    // Normal sessions
    return currentHourUTC >= session.openHour && currentHourUTC < session.closeHour;
};

/**
 * Get all session statuses
 */
export const getAllSessionStatuses = (): SessionStatus[] => {
    return Object.keys(SESSIONS).map((key) => {
        const sessionKey = key as SessionName;
        const session = SESSIONS[sessionKey];

        return {
            name: session.name,
            isOpen: isSessionOpen(sessionKey),
            openTime: `${String(session.openHour).padStart(2, '0')}:00`,
            closeTime: `${String(session.closeHour).padStart(2, '0')}:00`,
            color: session.color,
            flag: session.flag
        };
    });
};

/**
 * Get currently open sessions
 */
export const getOpenSessions = (): SessionStatus[] => {
    return getAllSessionStatuses().filter(s => s.isOpen);
};
