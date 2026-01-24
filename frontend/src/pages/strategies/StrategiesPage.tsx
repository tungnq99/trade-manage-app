import { ArrowUp, ArrowDown } from 'lucide-react';
import { allSetups, top3Setups } from '@/data/goldSetups';
import type { GoldSetup } from '@/data/goldSetups';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const StrategiesPage = () => {
    const renderTrendIcon = (trend: string) => {
        if (trend.toLowerCase().includes('tăng')) {
            return <ArrowUp className="w-4 h-4 text-green-500 inline-block" />;
        }
        if (trend.toLowerCase().includes('giảm')) {
            return <ArrowDown className="w-4 h-4 text-red-500 inline-block" />;
        }
        return null;
    };

    const getTrendColor = (trend: string) => {
        if (trend.toLowerCase().includes('tăng')) {
            return 'text-green-600 font-medium';
        }
        if (trend.toLowerCase().includes('giảm')) {
            return 'text-red-600 font-medium';
        }
        return 'text-muted-foreground';
    };

    const getActionColor = (action?: string) => {
        if (!action) return '';
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes('mua') && !lowerAction.includes('bán')) {
            return 'text-green-600 font-medium';
        }
        if (lowerAction.includes('bán') && !lowerAction.includes('mua')) {
            return 'text-red-600 font-medium';
        }
        return '';
    };

    // Desktop Table View
    const renderTable = (setups: GoldSetup[], showAction: boolean = true) => {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-semibold text-foreground text-xs">SETUP</TableHead>
                        <TableHead className="font-semibold text-foreground text-xs">XU HƯỚNG</TableHead>
                        <TableHead className="font-semibold text-foreground text-xs">CVD TRADES</TableHead>
                        <TableHead className="font-semibold text-foreground text-xs">CVD VOLUME</TableHead>
                        <TableHead className="font-semibold text-foreground text-xs">GIÁ</TableHead>
                        <TableHead className="font-semibold text-foreground text-xs">Ý NGHĨA</TableHead>
                        {showAction && (
                            <TableHead className="font-semibold text-foreground">HÀNH ĐỘNG</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {setups.map((setup) => (
                        setup.variations.map((variation, idx) => (
                            <TableRow key={`${setup.id}-${idx}`}>
                                {idx === 0 && (
                                    <TableCell
                                        className="font-semibold text-foreground text-xs border-r border-border uppercase"
                                        rowSpan={setup.variations.length}
                                    >
                                        {setup.name}
                                    </TableCell>
                                )}
                                <TableCell>
                                    <span className={`flex items-center gap-1 ${getTrendColor(variation.trend)}`}>
                                        {variation.trend} {renderTrendIcon(variation.trend)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{variation.cvdTrades}</TableCell>
                                <TableCell className="text-muted-foreground">{variation.cvdVolume}</TableCell>
                                <TableCell className="text-muted-foreground">{variation.priceAction}</TableCell>
                                <TableCell className="text-muted-foreground">{variation.meaning}</TableCell>
                                {showAction && (
                                    <TableCell className={getActionColor(variation.action)}>
                                        {variation.action || '-'}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ))}
                </TableBody>
            </Table>
        );
    };

    // Mobile Card View
    const renderMobileCards = (setups: GoldSetup[], showAction: boolean = true) => {
        return (
            <div className="space-y-4">
                {setups.map((setup) => (
                    <div key={setup.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
                        <h3 className="font-semibold text-foreground text-lg">{setup.name}</h3>
                        {setup.variations.map((variation, idx) => (
                            <div key={idx} className="space-y-2 pb-3 border-b border-border last:border-b-0 last:pb-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Xu hướng:</span>
                                    <span className={`flex items-center gap-1 text-sm ${getTrendColor(variation.trend)}`}>
                                        {variation.trend} {renderTrendIcon(variation.trend)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-1.5 text-sm">
                                    <div>
                                        <span className="text-xs text-muted-foreground">CVD Trades: </span>
                                        <span className="text-foreground">{variation.cvdTrades}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground">CVD Volume: </span>
                                        <span className="text-foreground">{variation.cvdVolume}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground">Giá: </span>
                                        <span className="text-foreground">{variation.priceAction}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-muted-foreground">Ý nghĩa: </span>
                                        <span className="text-foreground">{variation.meaning}</span>
                                    </div>
                                    {showAction && variation.action && (
                                        <div>
                                            <span className="text-xs text-muted-foreground">Hành động: </span>
                                            <span className={getActionColor(variation.action)}>{variation.action}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6 p-4 md:p-6 mb-20 md:mb-0">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Chiến Lược Giao Dịch Vàng
                </h1>
                <p className="text-sm text-muted-foreground">
                    Tổng hợp các setup giao dịch vàng (Phân tích CVD & Giá)
                </p>
            </div>

            {/* Table 1: All Setups (7 setups) */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="p-4 md:p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">
                        Bảng Tổng Hợp 7 Setup Giao Dịch Vàng
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Phân tích CVD & Giá (Kết quả)
                    </p>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block p-4 md:p-6">
                    {renderTable(allSetups, true)}
                </div>

                {/* Mobile View */}
                <div className="md:hidden p-4">
                    {renderMobileCards(allSetups, true)}
                </div>
            </div>

            {/* Table 2: Top 3 Reliable Setups */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="p-4 md:p-6 border-b border-border bg-secondary/20">
                    <h2 className="text-lg font-semibold text-foreground">
                        Bảng Riêng Cho 3 Setup Ưu Tiên Nhất
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Tập trung vào các setup có độ tin cậy cao nhất
                    </p>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block p-4 md:p-6">
                    {renderTable(top3Setups, false)}
                </div>

                {/* Mobile View */}
                <div className="md:hidden p-4">
                    {renderMobileCards(top3Setups, false)}
                </div>

                <div className="p-4 md:p-6 border-t border-border bg-secondary/10">
                    <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Lưu ý:</strong> CVD Trades cho biết đám đông đang làm gì.
                        CVD Volume cho biết tay to đang làm gì. Giá quyết định ai thắng.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StrategiesPage;
