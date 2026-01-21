import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    BookOpen,
    TrendingUp,
    Settings,
    Menu,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';


export function Sidebar() {
    const { t } = useTranslation();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const menuItems = [
        { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { href: '/trades', label: t('nav.trades'), icon: BookOpen },
        { href: '/analytics', label: t('nav.analytics'), icon: TrendingUp },
        { href: '/settings', label: t('nav.settings'), icon: Settings },
    ];

    return (
        <>
            {/* Mobile Hamburger Button - Fixed outside sidebar, hidden when menu is open */}
            {!mobileMenuOpen && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="fixed left-4 top-4 z-50 md:hidden"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <Menu className="h-6 w-6" />
                </Button>
            )}

            {/* Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-background-sidebar transition-transform duration-300',
                    'md:translate-x-0',
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo + Close Button */}
                <div className="flex h-16 items-center justify-between border-b border-border px-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-light">
                            <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-lg font-bold text-foreground">{t('branding.appName')}</h1>
                    </div>

                    {/* Close button - only visible on mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-4 text-sm font-medium transition-all',
                                    isActive
                                        ? 'bg-primary/10 text-primary shadow-sm'
                                        : 'text-foreground-secondary hover:bg-background-tertiary hover:text-foreground'
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t border-border p-4">
                    <p className="text-xs text-foreground-tertiary">{t('branding.version')}</p>
                </div>
            </aside>
        </>
    );
}

