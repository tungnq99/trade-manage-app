import cron from 'node-cron';
import { fetchAndStoreEvents } from '../services/newsFetcher.service';

/**
 * Setup cronjobs for the application
 */
export const setupCronJobs = (): void => {
    // Economic Calendar: Fetch news every 1 hour
    cron.schedule('0 * * * *', async () => {
        console.log('[Cronjob] Running economic calendar update...');
        await fetchAndStoreEvents();
    });

    console.log('[Cronjob] ✅ Economic calendar cronjob scheduled (every hour)');

    // Run immediately on server start
    fetchAndStoreEvents();
};
