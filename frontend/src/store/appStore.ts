import { create } from 'zustand';

/**
 * Interface cho Alert/Notification
 */
export interface Alert {
    id: string;
    type: 'rule_violation' | 'drawdown_warning' | 'daily_limit' | 'info';
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

/**
 * App Store State Interface
 * Quản lý các state chung của app (không persist)
 */
interface AppState {
    // Alerts/Notifications
    alerts: Alert[];
    unreadCount: number;

    // UI State
    sidebarCollapsed: boolean;

    // Actions
    addAlert: (alert: Omit<Alert, 'id' | 'isRead' | 'createdAt'>) => void;
    markAlertAsRead: (alertId: string) => void;
    clearAllAlerts: () => void;
    toggleSidebar: () => void;
}

/**
 * App Store - Quản lý app-wide state
 * Không persist (reset mỗi lần refresh)
 */
export const useAppStore = create<AppState>((set) => ({
    // Initial state
    alerts: [],
    unreadCount: 0,
    sidebarCollapsed: false,

    // Actions
    addAlert: (alertData) =>
        set((state) => {
            const newAlert: Alert = {
                ...alertData,
                id: `alert_${Date.now()}`,
                isRead: false,
                createdAt: new Date().toISOString(),
            };

            return {
                alerts: [newAlert, ...state.alerts],
                unreadCount: state.unreadCount + 1,
            };
        }),

    markAlertAsRead: (alertId) =>
        set((state) => ({
            alerts: state.alerts.map((alert) =>
                alert.id === alertId ? { ...alert, isRead: true } : alert
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
        })),

    clearAllAlerts: () =>
        set({
            alerts: [],
            unreadCount: 0,
        }),

    toggleSidebar: () =>
        set((state) => ({
            sidebarCollapsed: !state.sidebarCollapsed,
        })),
}));
