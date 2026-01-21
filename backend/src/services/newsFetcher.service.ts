import axios from 'axios';
import EconomicEvent from '../models/EconomicEvent';

/**
 * Real Economic News Fetcher using Alpha Vantage API
 * Free API: https://www.alphavantage.co/
 * 
 * Alternative APIs:
 * - Finnhub: https://finnhub.io/docs/api/economic-calendar
 * - TradingEconomics: https://tradingeconomics.com/api (Paid)
 */

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const API_BASE_URL = 'https://www.alphavantage.co/query';

interface AlphaVantageEvent {
    date: string;
    currency: string;
    event: string;
    country: string;
    actual?: string;
    previous?: string;
    forecast?: string;
    impact?: string;
}

/**
 * Map impact from text to enum
 */
const mapImpact = (impactText?: string): 'High' | 'Medium' | 'Low' => {
    if (!impactText) return 'Medium';

    const lower = impactText.toLowerCase();
    if (lower.includes('high') || lower.includes('3')) return 'High';
    if (lower.includes('low') || lower.includes('1')) return 'Low';
    return 'Medium';
};

/**
 * Fetch economic calendar from Alpha Vantage
 */
const fetchFromAlphaVantage = async (): Promise<any[]> => {
    try {
        // Alpha Vantage doesn't have a dedicated economic calendar endpoint
        // We'll use their NEWS_SENTIMENT which includes economic events
        const response = await axios.get(API_BASE_URL, {
            params: {
                function: 'NEWS_SENTIMENT',
                topics: 'economy_fiscal,economy_monetary',
                apikey: ALPHA_VANTAGE_API_KEY
            },
            timeout: 10000
        });

        // Parse response (structure depends on actual API)
        const events: any[] = [];

        // TODO: Parse actual Alpha Vantage response structure
        // For now, return empty to fallback to mock
        if (response.data && response.data.feed) {
            // Process news items
            console.log('[News API] Alpha Vantage returned data');
        }

        return events;

    } catch (error) {
        console.error('[News API] Alpha Vantage error:', error);
        throw error;
    }
};

/**
 * Fetch from Finnhub (Alternative)
 */
const fetchFromFinnhub = async (): Promise<any[]> => {
    const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

    if (!FINNHUB_API_KEY) {
        throw new Error('FINNHUB_API_KEY not set');
    }

    try {
        const from = new Date().toISOString().split('T')[0];
        const to = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const response = await axios.get('https://finnhub.io/api/v1/calendar/economic', {
            params: {
                token: FINNHUB_API_KEY,
                from,
                to
            }
        });

        const events = response.data.economicCalendar?.map((item: any) => ({
            date: new Date(item.time),
            currency: item.country || 'USD',
            event: item.event,
            impact: mapImpact(item.impact),
            actual: item.actual,
            previous: item.previous,
            forecast: item.estimate,
            source: 'finnhub-api'
        })) || [];

        return events;

    } catch (error) {
        console.error('[News API] Finnhub error:', error);
        throw error;
    }
};

/**
 * Generate mock events (Fallback)
 */
const MOCK_EVENTS = [
    { currency: 'USD', event: 'Non-Farm Payrolls (NFP)', impact: 'High' as const },
    { currency: 'USD', event: 'FOMC Meeting Minutes', impact: 'High' as const },
    { currency: 'USD', event: 'Consumer Price Index (CPI)', impact: 'High' as const },
    { currency: 'USD', event: 'Retail Sales', impact: 'Medium' as const },
    { currency: 'EUR', event: 'ECB Interest Rate Decision', impact: 'High' as const },
    { currency: 'EUR', event: 'Eurozone CPI', impact: 'High' as const },
    { currency: 'GBP', event: 'BoE Interest Rate Decision', impact: 'High' as const },
    { currency: 'JPY', event: 'BoJ Policy Statement', impact: 'High' as const },
    { currency: 'AUD', event: 'RBA Interest Rate Decision', impact: 'High' as const },
];

const generateMockEvents = (): any[] => {
    const events = [];
    const now = new Date();

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const eventDate = new Date(now);
        eventDate.setDate(eventDate.getDate() + dayOffset);

        const eventsPerDay = Math.floor(Math.random() * 3) + 2;

        for (let i = 0; i < eventsPerDay; i++) {
            const mockEvent = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
            const hour = Math.floor(Math.random() * 9) + 8;
            eventDate.setHours(hour, 0, 0, 0);

            events.push({
                date: new Date(eventDate),
                currency: mockEvent.currency,
                event: mockEvent.event,
                impact: mockEvent.impact,
                forecast: Math.random() > 0.5 ? `${(Math.random() * 5).toFixed(1)}%` : null,
                previous: Math.random() > 0.5 ? `${(Math.random() * 5).toFixed(1)}%` : null,
                actual: null,
                source: 'mock-generator'
            });
        }
    }

    return events;
};

/**
 * Main fetch function with fallback strategy
 */
export const fetchAndStoreEvents = async (): Promise<void> => {
    try {
        console.log('[News Service] Fetching economic events...');

        let events: any[] = [];

        // Try Finnhub first (better for economic calendar)
        if (process.env.FINNHUB_API_KEY) {
            try {
                events = await fetchFromFinnhub();
                console.log(`[News Service] ✅ Fetched ${events.length} events from Finnhub`);
            } catch (error) {
                console.log('[News Service] Finnhub failed, trying Alpha Vantage...');
            }
        }

        // Fallback to Alpha Vantage
        if (events.length === 0 && ALPHA_VANTAGE_API_KEY !== 'demo') {
            try {
                events = await fetchFromAlphaVantage();
            } catch (error) {
                console.log('[News Service] Alpha Vantage failed, using mock data...');
            }
        }

        // Final fallback: Mock data
        if (events.length === 0) {
            console.log('[News Service] ℹ️  Using mock data (no API keys configured)');
            events = generateMockEvents();
        }

        // Store events
        let insertedCount = 0;
        let updatedCount = 0;

        for (const event of events) {
            const result = await EconomicEvent.updateOne(
                {
                    date: event.date,
                    currency: event.currency,
                    event: event.event
                },
                {
                    $set: {
                        ...event,
                        lastUpdated: new Date()
                    },
                    $setOnInsert: { createdAt: new Date() }
                },
                { upsert: true }
            );

            if (result.upsertedCount > 0) insertedCount++;
            else if (result.modifiedCount > 0) updatedCount++;
        }

        console.log(`[News Service] ✅ Completed: ${insertedCount} new, ${updatedCount} updated`);

    } catch (error) {
        console.error('[News Service] ❌ Error:', error);
    }
};
