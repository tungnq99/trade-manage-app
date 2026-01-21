import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { MARKET_SESSIONS, getTimelineLabels } from '@/constants/sessions';
import {
    getPositionPercent,
    getSessionPosition
} from '@/utils/sessionTimeline';
import { formatSessionTime } from '@/utils/date';
import { useTranslation } from 'react-i18next';

export default function SessionClockWidget() {
    const { t } = useTranslation();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update every minute
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // 60 seconds

        return () => clearInterval(interval);
    }, []);

    // Calculate current time indicator position (using LOCAL time not UTC)
    const currentHourLocal = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimePosition = getPositionPercent(currentHourLocal, currentMinute);

    const timelineLabels = getTimelineLabels();

    return (
        <div className="rounded-xl border border-border bg-card p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {t('dashboard.sessionClock.title')}
                </h3>
            </div>

            {/* Timeline Header (6am - 4am) */}
            <div className="relative mb-4">
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                    {timelineLabels.map((label, index) => (
                        <div key={index} className="flex-1 text-center">
                            {label}
                        </div>
                    ))}
                </div>
                {/* Timeline grid lines */}
                <div className="absolute top-0 left-0 right-0 h-full flex justify-between pointer-events-none">
                    {timelineLabels.map((_, index) => (
                        <div
                            key={index}
                            className="flex-1 border-r border-border/30 last:border-r-0"
                        />
                    ))}
                </div>
            </div>

            {/* Sessions Container */}
            <div className="relative space-y-2 mt-6 overflow-hidden">
                {MARKET_SESSIONS.map((session) => {
                    const { startPercent, widthPercent } = getSessionPosition(session);

                    // Clamp width to prevent overflow
                    const clampedWidth = Math.min(widthPercent, 100 - startPercent);

                    return (
                        <div key={session.name} className="relative h-10">
                            {/* Session Bar */}
                            <div
                                className={`absolute h-full rounded flex items-center px-3 ${session.color} border border-border/20 overflow-hidden`}
                                style={{
                                    left: `${Math.max(0, startPercent)}%`,
                                    width: `${Math.max(0, clampedWidth)}%`,
                                }}
                            >
                                <span className="text-sm font-medium text-foreground flex items-center gap-2 whitespace-nowrap">
                                    <span>{session.flag}</span>
                                    {session.name}
                                    <span className="text-xs text-muted-foreground ml-2 font-mono">
                                        {formatSessionTime(session.startHour, session.endHour)}
                                    </span>
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* Current Time Indicator */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-green-500 z-10 pointer-events-none"
                    style={{ left: `${currentTimePosition}%` }}
                >
                    {/* Optional: Small circle at top */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-500" />
                </div>
            </div>
        </div>
    );
}
