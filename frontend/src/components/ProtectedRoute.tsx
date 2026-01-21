import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store';

/**
 * ProtectedRoute - Bảo vệ routes cần authentication
 * Redirect về /login nếu chưa đăng nhập
 */
export function ProtectedRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

