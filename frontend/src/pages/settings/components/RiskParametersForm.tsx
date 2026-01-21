import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useCapitalStore } from '@/store/useCapitalStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { riskParametersSchema, type RiskParametersFormData } from '@/schemas/capital.schema';

export const RiskParametersForm = () => {
    const { t } = useTranslation();
    const { summary, updateSettings, isLoading } = useCapitalStore();

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<RiskParametersFormData>({
        resolver: zodResolver(riskParametersSchema),
        defaultValues: {
            riskPerTrade: 1,
            dailyLossLimit: 5,
            maxDrawdown: 10,
            dailyCapTarget: 2500,
        },
    });

    // No fetch here - parent SettingsPage handles it

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
            toast.success(t('settings.capital.risk.saveSuccess'));
        } catch (error) {
            toast.error(t('settings.capital.risk.saveError'));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            {/* Risk Per Trade */}
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="riskPerTrade">
                        {t('settings.capital.risk.riskPerTrade')}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({t('settings.capital.risk.riskPerTradeUnit')})
                        </span>
                    </Label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="0.1"
                            max="5"
                            step="0.1"
                            {...register('riskPerTrade', { valueAsNumber: true })}
                            className="w-20 px-2 py-1 text-sm font-semibold text-primary border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            disabled={isLoading}
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                    </div>
                </div>
                <input
                    id="riskPerTrade"
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    {...register('riskPerTrade', { valueAsNumber: true })}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    disabled={isLoading}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.1%</span>
                    <span>{t('settings.capital.risk.riskPerTradeHint')}</span>
                    <span>5%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    {t('settings.capital.risk.riskPerTradeDesc')}
                </p>
            </div>

            {/* Daily Loss Limit */}
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="dailyLossLimit">
                        {t('settings.capital.risk.dailyLossLimit')}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({t('settings.capital.risk.dailyLossLimitUnit')})
                        </span>
                    </Label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="1"
                            max="20"
                            step="0.5"
                            {...register('dailyLossLimit', { valueAsNumber: true })}
                            className="w-20 px-2 py-1 text-sm font-semibold text-orange-600 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-orange-600/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            disabled={isLoading}
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                    </div>
                </div>
                <input
                    id="dailyLossLimit"
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    {...register('dailyLossLimit', { valueAsNumber: true })}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-orange-600"
                    disabled={isLoading}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1%</span>
                    <span>{t('settings.capital.risk.dailyLossLimitHint')}</span>
                    <span>20%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    {t('settings.capital.risk.dailyLossLimitDesc')}
                </p>
            </div>

            {/* Max Drawdown */}
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="maxDrawdown">
                        {t('settings.capital.risk.maxDrawdown')}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({t('settings.capital.risk.maxDrawdownUnit')})
                        </span>
                    </Label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="5"
                            max="50"
                            step="1"
                            {...register('maxDrawdown', { valueAsNumber: true })}
                            className="w-20 px-2 py-1 text-sm font-semibold text-red-600 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-red-600/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            disabled={isLoading}
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                    </div>
                </div>
                <input
                    id="maxDrawdown"
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    {...register('maxDrawdown', { valueAsNumber: true })}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-red-600"
                    disabled={isLoading}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5%</span>
                    <span>{t('settings.capital.risk.maxDrawdownHint')}</span>
                    <span>50%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    {t('settings.capital.risk.maxDrawdownDesc')}
                </p>
            </div>

            {/* Daily Cap Target */}
            <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="dailyCapTarget">
                        {t('settings.capital.risk.dailyCapTarget')}
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ($)
                        </span>
                    </Label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">$</span>
                        <input
                            type="number"
                            min="100"
                            max="10000"
                            step="100"
                            {...register('dailyCapTarget', { valueAsNumber: true })}
                            className="w-24 px-2 py-1 text-sm font-semibold text-blue-600 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-600/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <input
                    id="dailyCapTarget"
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    {...register('dailyCapTarget', { valueAsNumber: true })}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-600"
                    disabled={isLoading}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$100</span>
                    <span>{t('settings.capital.risk.dailyCapTargetHint')}</span>
                    <span>$10,000</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    {t('settings.capital.risk.dailyCapTargetDesc')}
                </p>
            </div>

            <div className="pt-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? t('settings.capital.risk.saving') : t('settings.capital.risk.saveButton')}
                </Button>
            </div>
        </form>
    );
};
