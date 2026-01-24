import { useState } from 'react';
import { BaseModal } from '@/components/common/BaseModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/common/DatePicker/DatePicker';
import { TimePicker } from '@/components/common/TimePicker/TimePicker';
import { createTradeSchema, CreateTradeFormData } from '@/schemas/trade.schema';
import { tradeService } from '@/services/trade.service';
import { calculatePips, calculateProfitLoss, detectSession, formatSymbol } from '@/helpers/trade.helper';
import { toast } from 'sonner';
import { AddTradeModalProps } from './AddTradeModal.types';
import { useTranslation } from 'react-i18next';
import { StrategyCombobox } from '@/components/common/StrategyCombobox';
import { format } from 'date-fns';
import { useCapitalStore } from '@/store';

export function AddTradeModal({ isOpen, onClose, onTradeAdded }: AddTradeModalProps) {
    const { t } = useTranslation();
    const { summary } = useCapitalStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<CreateTradeFormData>>({
        direction: 'long',
        entryDate: format(new Date(), 'yyyy-MM-dd'),
        entryTime: '00:00',
        exitDate: format(new Date(), 'yyyy-MM-dd'),
        exitTime: '00:00',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof CreateTradeFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setErrors({});

            // Validate
            const validated = createTradeSchema.parse(formData);
            // Auto-calculate fields
            const symbol = formatSymbol(validated.symbol);
            const pips = calculatePips(symbol, validated.entryPrice, validated.exitPrice, validated.direction);
            const profitLoss = calculateProfitLoss(pips, validated.lotSize, symbol);
            const session = detectSession(validated.entryTime);

            // Assume initial account balance (này sẽ lấy từ Capital settings sau, hardcode tạm 10000)
            const accountBalance = summary?.initialBalance || 1000;
            const profitLossPercent = (profitLoss / accountBalance) * 100;

            // Create trade
            await tradeService.createTrade({
                ...validated,
                symbol,
                pips,
                profitLoss,
                profitLossPercent,
                session,

            });

            toast.success(t('trades.messages.addSuccess'));
            onTradeAdded();
            onClose();
            // Reset form
            setFormData({ direction: 'long', entryDate: format(new Date(), 'yyyy-MM-dd'), entryTime: '00:00', exitDate: format(new Date(), 'yyyy-MM-dd'), exitTime: '00:00', });
        } catch (error: any) {
            if (error.errors) {
                // Zod validation errors
                const fieldErrors: Record<string, string> = {};
                console.log(error.errors);
                error.errors.forEach((err: any) => {
                    if (err.path) {
                        fieldErrors[err.path[0]] = err.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                toast.error(t('trades.messages.addError'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={t('trades.popup.titleAdd')}
            size="md"
            footer={
                <>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        {t('common.cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? t('common.saving') : t('trades.buttons.add')}
                    </Button>
                </>
            }
        >
            <div className="space-y-4">
                {/* Symbol & Direction */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">{t('trades.popup.symbol')}</label>
                        <Input
                            placeholder="EURUSD"
                            value={formData.symbol || ''}
                            onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
                        />
                        {errors.symbol && <p className="text-sm text-destructive mt-1">{errors.symbol}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">{t('trades.popup.direction')}</label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={formData.direction === 'long' ? 'success' : 'outline'}
                                className="flex-1"
                                onClick={() => handleChange('direction', 'long')}
                            >
                                {t('trades.status.long').toUpperCase()}
                            </Button>
                            <Button
                                type="button"
                                variant={formData.direction === 'short' ? 'destructive' : 'outline'}
                                className="flex-1"
                                onClick={() => handleChange('direction', 'short')}
                            >
                                {t('trades.status.short').toUpperCase()}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Entry Info */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">{t('trades.popup.entryDate')}</label>
                        <DatePicker
                            value={formData.entryDate || ''}
                            onChange={(value) => handleChange('entryDate', value)}
                            placeholder="Select date"
                        />
                        {errors.entryDate && <p className="text-sm text-destructive mt-1">{errors.entryDate}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">{t('trades.popup.entryTime')}</label>
                        <TimePicker
                            value={formData.entryTime || ''}
                            onChange={(value) => handleChange('entryTime', value)}
                            placeholder="Select time"
                        />
                        {errors.entryTime && <p className="text-sm text-destructive mt-1">{errors.entryTime}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">{t('trades.popup.entryPrice')}</label>
                        <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="1.09500"
                            value={formData.entryPrice || ''}
                            onChange={(e) => handleChange('entryPrice', e.target.value)}
                        />
                        {errors.entryPrice && <p className="text-sm text-destructive mt-1">{errors.entryPrice}</p>}
                    </div>
                </div>

                {/* LotSize, TP & SL */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">{t('trades.popup.lotSize')}</label>
                        <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="0.10"
                            value={formData.lotSize || ''}
                            onChange={(e) => handleChange('lotSize', e.target.value)}
                        />
                        {errors.lotSize && <p className="text-sm text-destructive mt-1">{errors.lotSize}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">{t('trades.popup.takeProfit')}</label>
                        <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="Optional"
                            value={formData.tp || ''}
                            onChange={(e) => handleChange('tp', e.target.value)}
                        />
                        {errors.tp && <p className="text-sm text-destructive mt-1">{errors.tp}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">{t('trades.popup.stopLoss')}</label>
                        <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="Optional"
                            value={formData.sl || ''}
                            onChange={(e) => handleChange('sl', e.target.value)}
                        />
                        {errors.sl && <p className="text-sm text-destructive mt-1">{errors.sl}</p>}
                    </div>
                </div>

                {/* Exit Info */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">{t('trades.popup.exitDate')}</label>
                        <DatePicker
                            value={formData.exitDate || ''}
                            onChange={(value) => handleChange('exitDate', value)}
                            placeholder="Select date"
                        />
                        {errors.exitDate && <p className="text-sm text-destructive mt-1">{errors.exitDate}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">{t('trades.popup.exitTime')}</label>
                        <TimePicker
                            value={formData.exitTime || ''}
                            onChange={(value) => handleChange('exitTime', value)}
                            placeholder="Select time"
                        />
                        {errors.exitTime && <p className="text-sm text-destructive mt-1">{errors.exitTime}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">{t('trades.popup.exitPrice')}</label>
                        <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="1.09850"
                            value={formData.exitPrice || ''}
                            onChange={(e) => handleChange('exitPrice', e.target.value)}
                        />
                        {errors.exitPrice && <p className="text-sm text-destructive mt-1">{errors.exitPrice}</p>}
                    </div>
                </div>

                {/* Setup/Strategy */}
                <div>
                    <label className="text-sm font-medium mb-2 block">{t('trades.popup.setup')}</label>
                    <StrategyCombobox
                        value={formData.setup || ''}
                        onChange={(value) => handleChange('setup', value)}
                        placeholder="Chọn hoặc nhập chiến lược..."
                    />
                    {errors.setup && <p className="text-sm text-destructive mt-1">{errors.setup}</p>}
                </div>

                {/* Notes (Optional) */}
                <div>
                    <label className="text-sm font-medium mb-2 block">{t('trades.popup.notes')}</label>
                    <Input
                        placeholder="Additional comments about this trade"
                        value={formData.notes || ''}
                        onChange={(e) => handleChange('notes', e.target.value)}
                    />
                </div>
            </div>
        </BaseModal>
    );
}
