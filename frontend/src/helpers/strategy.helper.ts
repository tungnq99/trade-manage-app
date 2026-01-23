import { goldSetups } from '@/data/goldSetups';
import type { SetupVariation } from '@/data/goldSetups';

/**
 * Get strategy variation details based on setup name and direction
 */
export function getStrategyVariation(setupName: string, direction: 'long' | 'short'): SetupVariation | null {
    const strategy = goldSetups.find(s => s.name === setupName);
    if (!strategy) return null;

    // Map direction to trend
    const trendKeyword = direction === 'long' ? 'tăng' : 'giảm';
    const variation = strategy.variations.find(v =>
        v.trend.toLowerCase().includes(trendKeyword)
    );

    return variation || null;
}
