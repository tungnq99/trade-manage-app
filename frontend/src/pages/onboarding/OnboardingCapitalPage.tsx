import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useCapitalStore } from '@/store/useCapitalStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { onboardingCapitalSchema, type OnboardingCapitalFormData } from '@/schemas/capital.schema';

const OnboardingCapitalPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { updateSettings, isLoading } = useCapitalStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OnboardingCapitalFormData>({
        resolver: zodResolver(onboardingCapitalSchema),
        defaultValues: {
            initialBalance: 10000,
        },
    });

    const onSubmit = async (data: OnboardingCapitalFormData) => {
        try {
            await updateSettings({
                initialBalance: data.initialBalance,
                currency: 'USD',
            });
            toast.success(t('common.save') + ' ' + t('settings.capital.config.title'));
            navigate('/dashboard');
        } catch (error) {
            console.error('Error setting capital:', error);
            toast.error('Failed to save settings');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Welcome to Trade Manager</CardTitle>
                    <CardDescription className="text-center">
                        Let's set up your trading account. How much capital are you starting with?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="initialBalance">{t('settings.capital.config.initialCapital')} (USD)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    id="initialBalance"
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    className="pl-8 text-lg"
                                    placeholder="10000"
                                    {...register('initialBalance', { valueAsNumber: true })}
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>
                            {errors.initialBalance && (
                                <p className="text-sm text-destructive">{errors.initialBalance.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                            {isLoading ? t('common.saving') : 'Start Trading'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default OnboardingCapitalPage;
