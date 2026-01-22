import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { login } from '@/services/auth.service';
import { useAuthStore } from '@/store';
import { TrendingUp } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { APP_NAME, APP_TAGLINE } from '@/constants/app';

export function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const { accessToken, refreshToken, user } = await login(data);

            // Existing users logging in should have completed onboarding
            // Backend will eventually provide this field, for now we default to true
            const userWithOnboarding = {
                ...user,
                hasCompletedOnboarding: user.hasCompletedOnboarding ?? true, // Default true for existing users
            };

            setAuth(accessToken, refreshToken, userWithOnboarding);
            toast.success(t('auth.login.success', { name: user.firstName }));
            navigate('/dashboard');
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || t('auth.login.error');
            toast.error(errorMessage);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-lg">
                        <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">{APP_NAME}</h1>
                    <p className="mt-1 text-sm text-foreground-secondary">{APP_TAGLINE}</p>
                </div>

                <Card className="border-border shadow-xl">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            {t('auth.login.title')}
                        </CardTitle>
                        <CardDescription className="text-foreground-secondary">
                            {t('auth.login.subtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-foreground-secondary">
                                    {t('auth.login.email')}
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="trader@example.com"
                                    {...register('email')}
                                    className={`h-11 ${errors.email ? 'border-destructive' : ''}`}
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                />
                                {errors.email && (
                                    <p id="email-error" className="text-sm text-destructive">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground-secondary">
                                    {t('auth.login.password')}
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register('password')}
                                    className={`h-11 ${errors.password ? 'border-destructive' : ''}`}
                                    aria-invalid={!!errors.password}
                                    aria-describedby={errors.password ? 'password-error' : undefined}
                                />
                                {errors.password && (
                                    <p id="password-error" className="text-sm text-destructive">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="h-11 w-full font-semibold"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t('auth.login.loggingIn') : t('auth.login.button')}
                            </Button>

                            {/* Register link */}
                            <p className="text-center text-sm text-foreground-secondary">
                                {t('auth.login.noAccount')}{' '}
                                <Link to="/register" className="font-semibold text-primary hover:text-primary-light hover:underline">
                                    {t('auth.login.createAccount')}
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
