import { SYMBOLS, PIP_VALUES, DOLLARS_PER_PIP, SESSION_TIME, INSTRUMENT_TYPES } from '@/constants/trade.constants';

/**
 * Detect instrument type
 */
const getInstrumentType = (symbol: string): 'forex' | 'gold' | 'commodity' => {
    const upper = symbol.toUpperCase();
    if (upper.includes(SYMBOLS.GOLD) || upper.includes(SYMBOLS.AlsoGOLD)) return INSTRUMENT_TYPES.GOLD;
    if (upper.includes(SYMBOLS.SILVER) || upper.includes(SYMBOLS.OIL) || upper.includes(SYMBOLS.BTC)) return INSTRUMENT_TYPES.COMMODITY;
    return INSTRUMENT_TYPES.FOREX;
};

/**
 * Tính pip value dựa vào symbol
 * - JPY pairs: 0.01
 * - Other forex: 0.0001
 * - XAUUSD/Gold: 0.10 (1 pip = 10 cents)
 * - Other commodities: 0.01
 */
export const getPipValue = (symbol: string): number => {
    const type = getInstrumentType(symbol);

    if (type === INSTRUMENT_TYPES.GOLD) return PIP_VALUES.GOLD;
    if (type === INSTRUMENT_TYPES.COMMODITY) return PIP_VALUES.COMMODITY;

    // Forex
    return symbol.includes(SYMBOLS.JPY) ? PIP_VALUES.FOREX_JPY : PIP_VALUES.FOREX_STD;
};

/**
 * Tính số pips giữa entry và exit
 */
export const calculatePips = (
    symbol: string,
    entryPrice: number,
    exitPrice: number,
    direction: 'long' | 'short'
): number => {
    const pipValue = getPipValue(symbol);
    const priceDiff = direction === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice;
    return Math.round((priceDiff / pipValue) * 10) / 10; // Round to 1 decimal
};

/**
 * Tính profit/loss (USD)
 * Formula varies by instrument:
 * - Forex: pips * lot size * contract size * pip value per standard lot
 * - Gold (XAUUSD): pips * lot size * $100 (1 lot = 100 oz, 1 pip = $0.10/oz)
 * - Standard forex: assume $10 per pip for 1 standard lot
 */
export const calculateProfitLoss = (
    pips: number,
    lotSize: number,
    symbol?: string
): number => {
    const type = symbol ? getInstrumentType(symbol) : INSTRUMENT_TYPES.FOREX;

    if (type === INSTRUMENT_TYPES.GOLD) {
        // XAUUSD: 1 lot = 100oz, 1 pip = $0.10/oz -> $10 per pip per lot
        return Math.round(pips * lotSize * DOLLARS_PER_PIP.GOLD_LOT * 100) / 100;
    }

    // Forex and commodities: $10 per pip for standard lot (simplified)
    return Math.round(pips * lotSize * DOLLARS_PER_PIP.STANDARD_LOT * 100) / 100;
};

/**
 * Tính profit/loss percentage
 */
export const calculateProfitLossPercent = (
    profitLoss: number,
    accountBalance: number
): number => {
    if (accountBalance === 0) return 0;
    return Math.round((profitLoss / accountBalance) * 10000) / 100; // 2 decimals
};

/**
 * Detect trading session từ time string (HH:mm)
 * Tính theo múi giờ GMT+7 (Vietnam)
 */
export const detectSession = (time: string): 'asian' | 'london' | 'newyork' => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;

    // GMT+7 times (Vietnam timezone)
    // Asian (Tokyo): 07:00 - 15:00 GMT+7
    // London: 15:00 - 20:00 GMT+7
    // NY: 20:00 - 07:00 GMT+7 (overnight)

    if (totalMinutes >= SESSION_TIME.ASIAN_START && totalMinutes < SESSION_TIME.LONDON_START) {
        // 07:00 - 15:00
        return 'asian';
    } else if (totalMinutes >= SESSION_TIME.LONDON_START && totalMinutes < SESSION_TIME.NY_START) {
        // 15:00 - 20:00
        return 'london';
    } else {
        // 20:00 - 07:00 (overnight)
        return 'newyork';
    }
};

/**
 * Format symbol (ensure uppercase, remove spaces)
 */
export const formatSymbol = (symbol: string): string => {
    return symbol.toUpperCase().replace(/\s+/g, '');
};
