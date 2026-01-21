import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { MainLayout } from '@/components/layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import { LoginPage, RegisterPage } from '@/pages/auth';
import { ThemeProvider } from '@/components/ThemeProvider';
import DashboardPage from './pages/DashboardPage';
import { TradesPage } from '@/pages/trades';
import SettingsPage from '@/pages/settings/SettingsPage';
import AnalyticsPage from '@/pages/analytics/AnalyticsPage';
import CalendarPage from '@/pages/CalendarPage';
import OnboardingPage from '@/pages/onboarding/OnboardingPage';
import { useThemeStore, initializeTheme } from '@/store/themeStore';
import i18n from './i18n';

function App() {
    useEffect(() => {
        initializeTheme();

        // Initialize language from store
        const { language } = useThemeStore.getState();
        i18n.changeLanguage(language);
    }, []);

    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicRoute />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/trades" element={<TradesPage />} />
                            <Route path="/analytics" element={<AnalyticsPage />} />
                            <Route path="/news" element={<CalendarPage />} />
                            <Route path="/alerts" element={<div className="p-6"><h1 className="text-2xl font-bold text-foreground">Alerts</h1><p className="text-foreground-secondary">Sprint 5</p></div>} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Route>
                        <Route path="/onboarding" element={<OnboardingPage />} />
                    </Route>

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
                <Toaster position="top-right" richColors />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
