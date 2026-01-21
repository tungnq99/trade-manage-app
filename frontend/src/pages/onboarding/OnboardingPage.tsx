import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useCapitalStore } from '@/store/useCapitalStore';
import { onboardingCapitalSchema, type OnboardingCapitalFormData } from '@/schemas/capital.schema';
import { APP_NAME } from '@/constants/app';
import { DEFAULT_CURRENCY } from '@/constants/capital';
import { useAuthStore } from '@/store';

// Step 1: Capital Setup Component
const CapitalStep = ({ onNext }: { onNext: (data: OnboardingCapitalFormData) => void }) => {
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OnboardingCapitalFormData>({
        resolver: zodResolver(onboardingCapitalSchema),
        defaultValues: {
            initialBalance: 10000,
        },
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="border-border shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {t('onboarding.capital.title')}
                    </CardTitle>
                    <CardDescription>
                        {t('onboarding.capital.subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="initialBalance">
                                {t('settings.capital.config.initialCapital')} (USD)
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    $
                                </span>
                                <Input
                                    id="initialBalance"
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    className="pl-8 text-lg h-12"
                                    placeholder="10000"
                                    {...register('initialBalance', { valueAsNumber: true })}
                                    disabled={isSubmitting}
                                    autoFocus
                                />
                            </div>
                            {errors.initialBalance && (
                                <p className="text-sm text-destructive">{errors.initialBalance.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                This will be your starting balance for tracking performance.
                            </p>
                        </div>

                        <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
                            {t('onboarding.capital.next')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Step 2: Risk Setup Component
const RiskStep = ({
    onBack,
    onComplete,
}: {
    onBack: () => void;
    onComplete: (data: { riskPerTrade: number; dailyLossLimit: number; maxDrawdown: number }) => void;
}) => {
    const { t } = useTranslation();
    const [riskPerTrade, setRiskPerTrade] = useState(1);
    const [dailyLossLimit, setDailyLossLimit] = useState(5);
    const [maxDrawdown, setMaxDrawdown] = useState(10);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        onComplete({ riskPerTrade, dailyLossLimit, maxDrawdown });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="border-border shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {t('onboarding.risk.title')}
                    </CardTitle>
                    <CardDescription>
                        {t('onboarding.risk.subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Risk Per Trade */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>{t('settings.capital.risk.riskPerTrade')}</Label>
                            <span className="text-lg font-semibold text-primary">
                                {riskPerTrade.toFixed(1)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={riskPerTrade}
                            onChange={(e) => setRiskPerTrade(parseFloat(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <p className="text-xs text-muted-foreground">
                            {t('settings.capital.risk.riskPerTradeDesc')}
                        </p>
                    </div>

                    {/* Daily Loss Limit */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>{t('settings.capital.risk.dailyLossLimit')}</Label>
                            <span className="text-lg font-semibold text-primary">
                                {dailyLossLimit.toFixed(1)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            step="0.5"
                            value={dailyLossLimit}
                            onChange={(e) => setDailyLossLimit(parseFloat(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <p className="text-xs text-muted-foreground">
                            {t('settings.capital.risk.dailyLossLimitDesc')}
                        </p>
                    </div>

                    {/* Max Drawdown */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>{t('settings.capital.risk.maxDrawdown')}</Label>
                            <span className="text-lg font-semibold text-primary">
                                {maxDrawdown.toFixed(1)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="30"
                            step="1"
                            value={maxDrawdown}
                            onChange={(e) => setMaxDrawdown(parseFloat(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <p className="text-xs text-muted-foreground">
                            {t('settings.capital.risk.maxDrawdownDesc')}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBack}
                            className="flex-1 h-12"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('onboarding.risk.back')}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 h-12 text-base"
                        >
                            {t('onboarding.risk.complete')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Main Onboarding Page
const OnboardingPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [capitalData, setCapitalData] = useState<OnboardingCapitalFormData | null>(null);
    const { updateSettings } = useCapitalStore();

    const progress = (currentStep / 2) * 100;

    const handleCapitalNext = (data: OnboardingCapitalFormData) => {
        setCapitalData(data);
        setCurrentStep(2);
    };

    const handleRiskComplete = async (riskData: { riskPerTrade: number; dailyLossLimit: number; maxDrawdown: number }) => {
        if (!capitalData) return;

        try {
            await updateSettings(
                capitalData.initialBalance,
                DEFAULT_CURRENCY,
                riskData.riskPerTrade,
                riskData.dailyLossLimit,
                riskData.maxDrawdown
            );

            // Mark onboarding as completed
            const { user, token, setAuth } = useAuthStore.getState();
            if (user) {
                setAuth(token || '', { ...user, hasCompletedOnboarding: true });
            }

            toast.success(t('onboarding.messages.success'));
            navigate('/dashboard');
        } catch (error) {
            toast.error(t('onboarding.messages.error'));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold">{APP_NAME}</h1>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mb-8">
                <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                    <span>{t('onboarding.step', { current: currentStep, total: 2 })}</span>
                    <span>{currentStep === 1 ? 'Capital Setup' : 'Risk Setup'}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary to-primary-light"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="w-full max-w-md">
                {currentStep === 1 && <CapitalStep onNext={handleCapitalNext} />}
                {currentStep === 2 && (
                    <RiskStep
                        onBack={() => setCurrentStep(1)}
                        onComplete={handleRiskComplete}
                    />
                )}
            </div>
        </div>
    );
};

export default OnboardingPage;
