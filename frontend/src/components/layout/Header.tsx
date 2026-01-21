import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, User, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';
import { useThemeStore } from '@/store/themeStore';
import { logout } from '@/services/auth.service';
import { APP_NAME, THEME_LABELS } from '@/constants/app';

export function Header() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
            {/* Left: Page Title */}
            <div className="hidden md:block">
                <h2 className="text-xl font-semibold text-foreground"></h2>
            </div>

            {/* Mobile: App name */}
            <div className="md:hidden">
                <h2 className="ml-12 text-lg font-semibold text-foreground">{APP_NAME}</h2>
            </div>

            {/* Right: Theme Toggle + Notifications + User */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Theme Toggle with text indicator */}
                <div className="hidden items-center gap-2 lg:flex">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-9 w-9"
                        title={theme === 'dark' ? THEME_LABELS.SWITCH_TO_LIGHT : THEME_LABELS.SWITCH_TO_DARK}
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                </div>

                {/* Notification Bell */}
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
                </Button>

                {/* User Menu - Compact */}
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background-secondary px-3 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                    <p className="hidden text-sm font-medium text-foreground sm:block">
                        {user?.firstName} {user?.lastName}
                    </p>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="h-8 w-8"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
