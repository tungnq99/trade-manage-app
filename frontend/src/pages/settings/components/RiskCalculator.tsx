import { useEffect, useState } from 'react';
import { useCapitalStore } from '@/store/useCapitalStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { COMMON_PAIRS } from '@/helpers/trading.constants';
import {
    calculateLotSize,
    type RiskCalculationResult
} from './RiskCalculator.logic';

export const RiskCalculator = () => {
    const { summary } = useCapitalStore();

    const [symbol, setSymbol] = useState('EURUSD');
    const [entryPrice, setEntryPrice] = useState('');
    const [stopLoss, setStopLoss] = useState('');
    const [riskPercent, setRiskPercent] = useState(1);
    const [result, setResult] = useState<RiskCalculationResult | null>(null);

    // No fetch here - parent SettingsPage handles it

    useEffect(() => {
        if (summary?.riskPerTradePercent) {
            setRiskPercent(summary.riskPerTradePercent);
        }
    }, [summary]);

    const handleCalculate = () => {
        try {
            const calculationResult = calculateLotSize({
                accountBalance: summary?.currentBalance || 0,
                riskPercent,
                entryPrice: parseFloat(entryPrice),
                stopLoss: parseFloat(stopLoss),
                symbol,
            });
            setResult(calculationResult);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Calculation failed');
        }
    };

    const copyLotSize = () => {
        if (result) {
            navigator.clipboard.writeText(result.lotSize.toString());
            toast.success('Lot size copied to clipboard!');
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Account Info */}
            <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account Balance</span>
                    <span className="text-lg font-semibold">
                        ${summary?.currentBalance?.toLocaleString() || '0'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Symbol */}
                <div className="space-y-2">
                    <Label htmlFor="symbol">Symbol</Label>
                    <select
                        id="symbol"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                        {COMMON_PAIRS.map(pair => (
                            <option key={pair} value={pair}>{pair}</option>
                        ))}
                    </select>
                </div>

                {/* Risk % */}
                <div className="space-y-2">
                    <Label htmlFor="riskPercent">Risk per Trade (%)</Label>
                    <Input
                        id="riskPercent"
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="5"
                        value={riskPercent}
                        onChange={(e) => setRiskPercent(parseFloat(e.target.value))}
                    />
                </div>

                {/* Entry Price */}
                <div className="space-y-2">
                    <Label htmlFor="entryPrice">Entry Price</Label>
                    <Input
                        id="entryPrice"
                        type="number"
                        step="0.00001"
                        placeholder="1.10000"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                    />
                </div>

                {/* Stop Loss */}
                <div className="space-y-2">
                    <Label htmlFor="stopLoss">Stop Loss</Label>
                    <Input
                        id="stopLoss"
                        type="number"
                        step="0.00001"
                        placeholder="1.09500"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(e.target.value)}
                    />
                </div>
            </div>

            <Button
                onClick={handleCalculate}
                className="w-full"
                size="lg"
            >
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Lot Size
            </Button>

            {/* Results */}
            {result && (
                <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6 space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Calculation Results
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Risk Amount</p>
                            <p className="text-xl font-semibold">${result.riskAmount}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Pips at Risk</p>
                            <p className="text-xl font-semibold">{result.pipsAtRisk} pips</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-2">Recommended Lot Size</p>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-background rounded-lg p-4 border-2 border-primary">
                                <p className="text-3xl font-bold text-primary">
                                    {result.lotSize} lots
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    ({(result.lotSize * 100000).toLocaleString()} units)
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={copyLotSize}
                                title="Copy to clipboard"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
                <p>💡 <strong>Note:</strong> This calculator assumes standard lot size (100,000 units) and $10 per pip value for major pairs.</p>
                <p>⚠️ Always verify lot size with your broker's specifications before placing trades.</p>
            </div>
        </div>
    );
};
