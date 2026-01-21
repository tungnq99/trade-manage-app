import { getPipSize, STANDARD_PIP_VALUE } from '@/helpers/trading.constants';

/**
 * Interface cho input của risk calculator
 */
export interface RiskCalculationInput {
    accountBalance: number;
    riskPercent: number;
    entryPrice: number;
    stopLoss: number;
    symbol: string;
}

/**
 * Interface cho output của risk calculator
 */
export interface RiskCalculationResult {
    riskAmount: number;
    pipsAtRisk: number;
    lotSize: number;
}

/**
 * Validate input cho risk calculator
 * @throws Error nếu input không hợp lệ
 */
export const validateRiskInput = (input: RiskCalculationInput): void => {
    const { accountBalance, riskPercent, entryPrice, stopLoss } = input;

    if (!accountBalance || accountBalance <= 0) {
        throw new Error('Account balance must be greater than 0');
    }

    if (!entryPrice || !stopLoss) {
        throw new Error('Please fill all fields');
    }

    if (entryPrice === stopLoss) {
        throw new Error('Entry price and Stop Loss cannot be the same');
    }

    if (riskPercent <= 0 || riskPercent > 5) {
        throw new Error('Risk percent must be between 0.1% and 5%');
    }
};

/**
 * Tính toán lot size dựa trên risk parameters
 * Formula theo FDD: lotSize = riskAmount / (pipsAtRisk × pipValue)
 */
export const calculateLotSize = (input: RiskCalculationInput): RiskCalculationResult => {
    // Validate đầu vào
    validateRiskInput(input);

    const { accountBalance, riskPercent, entryPrice, stopLoss, symbol } = input;

    // Step 1: Calculate Risk Amount
    const riskAmount = accountBalance * (riskPercent / 100);

    // Step 2: Calculate Pips at Risk
    const pipSize = getPipSize(symbol);
    const pipsAtRisk = Math.abs(entryPrice - stopLoss) / pipSize;

    // Step 3: Calculate Lot Size
    const lotSize = riskAmount / (pipsAtRisk * STANDARD_PIP_VALUE);

    // Round kết quả
    return {
        riskAmount: Math.round(riskAmount * 100) / 100,
        pipsAtRisk: Math.round(pipsAtRisk * 10) / 10,
        lotSize: Math.round(lotSize * 100) / 100,
    };
};
