import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useCapitalStore } from '@/store/useCapitalStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { riskParametersSchema, type RiskParametersFormData } from '@/schemas/capital.schema';

export const CapitalSettingsForm = () => {
    const { t } = useTranslation();
    const { summary, updateSettings, isLoading } = useCapitalStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RiskParametersFormData>({
        resolver: zodResolver(riskParametersSchema),
        defaultValues: {
            riskPerTrade: 1,
            dailyLossLimit: 5,
            maxDrawdown: 10,
            dailyCapTarget: 2500,
        },
    });

    useEffect(() => {
        if (summary) {
            reset({
                riskPerTrade: summary.riskPerTradePercent || 1,
                dailyLossLimit: summary.dailyLossLimit || 5,
                maxDrawdown: summary.maxDrawdown || 10,
                dailyCapTarget: summary.dailyCapTarget || 2500,
            });
        }
    }, [summary, reset]);

    const onSubmit = async (data: RiskParametersFormData) => {
        try {
            await updateSettings({
                initialBalance: summary?.initialBalance || 0,
                currency: summary?.currency || 'USD',
                riskPerTradePercent: data.riskPerTrade,
                dailyLossLimit: data.dailyLossLimit,
                maxDrawdown: data.maxDrawdown,
                dailyCapTarget: data.dailyCapTarget,
            });
            toast.success(t('common.save') + ' ' + t('settings.capital.config.title'));
        } catch (error) {
            toast.error('Failed to update settings');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
            <div className="space-y-2">
                <Label htmlFor="risk PerTrade">Risk Per Trade (%)</Label>
                <Input
                    id="riskPerTrade"
                    type="number"
                    step="0.1"
                    placeholder="1"
                    {...register('riskPerTrade', { valueAsNumber: true })}
                    disabled={isLoading}
                />
                {errors.riskPerTrade && (
                    <p className="text-xs text-destructive">{errors.riskPerTrade.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Percentage of capital to risk per trade (e.g., 1%)
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="dailyLossLimit">Daily Loss Limit (%)</Label>
                <Input
                    id="dailyLossLimit"
                    type="number"
                    step="0.5"
                    placeholder="5"
                    {...register('dailyLossLimit', { valueAsNumber: true })}
                    disabled={isLoading}
                />
                {errors.dailyLossLimit && (
                    <p className="text-xs text-destructive">{errors.dailyLossLimit.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Maximum percentage of capital you can lose in a single day
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="maxDrawdown">Max Drawdown (%)</Label>
                <Input
                    id="maxDrawdown"
                    type="number"
                    step="1"
                    placeholder="10"
                    {...register('maxDrawdown', { valueAsNumber: true })}
                    disabled={isLoading}
                />
                {errors.maxDrawdown && (
                    <p className="text-xs text-destructive">{errors.maxDrawdown.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Maximum drawdown from peak balance before stopping trading
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="dailyCapTarget">Daily Profit Target ($)</Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                        id="dailyCapTarget"
                        type="number"
                        step="50"
                        className="pl-8"
                        placeholder="2500"
                        {...register('dailyCapTarget', { valueAsNumber: true })}
                        disabled={isLoading}
                    />
                </div>
                {errors.dailyCapTarget && (
                    <p className="text-xs text-destructive">{errors.dailyCapTarget.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Your daily profit target. Widget will show progress towards this goal.
                </p>
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading ? t('common.saving') : t('common.save')}
            </Button>
        </form>
    );
};
