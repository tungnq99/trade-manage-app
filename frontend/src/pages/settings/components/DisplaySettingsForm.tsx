import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useThemeStore } from '@/store/themeStore';
import { Monitor, Sun, Moon, Globe, Calendar } from 'lucide-react';

const displaySettingsSchema = z.object({
    theme: z.enum(['light', 'dark', 'system']),
    language: z.enum(['en', 'vi']),
    dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY']),
});

type DisplaySettingsFormData = z.infer<typeof displaySettingsSchema>;

export const DisplaySettingsForm = () => {
    const { t, i18n } = useTranslation();
    const { theme, language, dateFormat, setTheme, setLanguage, setDateFormat } = useThemeStore();

    const {
        register,
        handleSubmit,
        watch,
    } = useForm<DisplaySettingsFormData>({
        resolver: zodResolver(displaySettingsSchema),
        defaultValues: {
            theme,
            language,
            dateFormat,
        },
    });

    const selectedTheme = watch('theme');
    const selectedLanguage = watch('language');

    // Auto-apply theme when user clicks (instant preview)
    useEffect(() => {
        if (selectedTheme && selectedTheme !== theme) {
            setTheme(selectedTheme);
        }
    }, [selectedTheme, theme, setTheme]);

    // Auto-switch language when changed
    useEffect(() => {
        if (selectedLanguage && selectedLanguage !== language) {
            setLanguage(selectedLanguage);
            i18n.changeLanguage(selectedLanguage);
        }
    }, [selectedLanguage, language, setLanguage, i18n]);

    const onSubmit = (data: DisplaySettingsFormData) => {
        // Theme already applied by useEffect above
        setLanguage(data.language);
        setDateFormat(data.dateFormat);
        toast.success(t('settings.display.saveSuccess'));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            {/* Theme Selection */}
            <div className="space-y-3">
                <Label className="text-base font-semibold">{t('settings.display.theme.label')}</Label>
                <div className="grid grid-cols-3 gap-3">
                    {/* Light */}
                    <label className={`relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all hover:bg-muted/50 ${selectedTheme === 'light' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <input
                            type="radio"
                            value="light"
                            {...register('theme')}
                            className="sr-only"
                        />
                        <Sun className={`h-6 w-6 ${selectedTheme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm font-medium">{t('settings.display.theme.light')}</span>
                    </label>

                    {/* Dark */}
                    <label className={`relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all hover:bg-muted/50 ${selectedTheme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <input
                            type="radio"
                            value="dark"
                            {...register('theme')}
                            className="sr-only"
                        />
                        <Moon className={`h-6 w-6 ${selectedTheme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm font-medium">{t('settings.display.theme.dark')}</span>
                    </label>

                    {/* System */}
                    <label className={`relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all hover:bg-muted/50 ${selectedTheme === 'system' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <input
                            type="radio"
                            value="system"
                            {...register('theme')}
                            className="sr-only"
                        />
                        <Monitor className={`h-6 w-6 ${selectedTheme === 'system' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm font-medium">{t('settings.display.theme.system')}</span>
                    </label>
                </div>
                <p className="text-xs text-muted-foreground">
                    {t('settings.display.theme.description')}
                </p>
            </div>

            {/* Language Selection */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="language" className="text-base font-semibold">{t('settings.display.language.label')}</Label>
                </div>
                <select
                    id="language"
                    {...register('language')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="en">English</option>
                    <option value="vi">Tiếng Việt</option>
                </select>
                <p className="text-xs text-muted-foreground">
                    {t('settings.display.language.description')}
                </p>
            </div>

            {/* Date Format */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="dateFormat" className="text-base font-semibold">{t('settings.display.dateFormat.label')}</Label>
                </div>
                <select
                    id="dateFormat"
                    {...register('dateFormat')}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="DD/MM/YYYY">DD/MM/YYYY (19/01/2026)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (01/19/2026)</option>
                </select>
                <p className="text-xs text-muted-foreground">
                    {t('settings.display.dateFormat.description')}
                </p>
            </div>

            <div className="pt-4">
                <Button type="submit">
                    {t('settings.display.saveButton')}
                </Button>
            </div>
        </form>
    );
};
