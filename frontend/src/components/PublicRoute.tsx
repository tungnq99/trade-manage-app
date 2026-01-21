import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store';

/**
 * PublicRoute - Dành cho trang không cần đăng nhập (Login, Register)
 * Redirect về /dashboard nếu đã login
 */
export function PublicRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    if (isAuthenticated) {
        // New users (haven't completed onboarding) → /onboarding
        // Returning users (completed onboarding) → /dashboard
        if (!user?.hasCompletedOnboarding) {
            return <Navigate to="/onboarding" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
