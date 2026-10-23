import { repopulateBeerNews } from '../../server/app';
import { loadBeerNewsDatabase, BEER_NEWS_CRON_SCHEDULE, BEER_NEWS_CRON_INTERVAL_HOURS } from '../../server/beerNewsDb';

/**
 * Netlify Scheduled CRON Function (Runs automatically every 2 days / 48 hours)
 * Automatically fetches the latest Beer News and refreshes the Beer News database.
 */
export const handler = async () => {
  try {
    console.log(`[Netlify Scheduled Cron] Executing 2-day (${BEER_NEWS_CRON_SCHEDULE}) Beer News database refresh...`);
    const articles = await repopulateBeerNews(true);
    const db = loadBeerNewsDatabase();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        cronSchedule: BEER_NEWS_CRON_SCHEDULE,
        cronIntervalHours: BEER_NEWS_CRON_INTERVAL_HOURS,
        articlesCount: articles.length,
        updatedAt: db?.lastUpdatedIso || new Date().toISOString(),
        nextScheduledUpdateAt: db?.nextScheduledUpdateIso || null,
      }),
    };
  } catch (err: any) {
    console.error('[Netlify Scheduled Cron] Error refreshing Beer News database:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: err?.message || 'Failed to execute 2-day Beer News CRON job',
      }),
    };
  }
};
