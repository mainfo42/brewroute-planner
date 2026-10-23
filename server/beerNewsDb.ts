import fs from 'fs';
import path from 'path';
import os from 'os';
import { BeerNewsArticle } from '../src/types';
import { getDynamicCuratedBeerNews, getTwoDayCronEpoch, TWO_DAYS_MS } from '../src/data/beerNewsData';

export interface BeerNewsDatabaseRecord {
  version: number;
  cronSchedule: string;
  cronIntervalHours: number;
  twoDayEpoch: number;
  lastUpdatedAt: number;
  lastUpdatedIso: string;
  nextScheduledUpdateAt: number;
  nextScheduledUpdateIso: string;
  refreshCount: number;
  source: 'live' | 'curated';
  articles: BeerNewsArticle[];
}

export const BEER_NEWS_CRON_SCHEDULE = '0 0 */2 * *'; // Every 2 days at 00:00 UTC
export const BEER_NEWS_CRON_INTERVAL_HOURS = 48; // 48 hours (2 days)
export const BEER_NEWS_CRON_INTERVAL_MS = TWO_DAYS_MS; // 48 * 60 * 60 * 1000 ms

const PRIMARY_DB_DIR = path.resolve(process.cwd(), 'server', 'data');
const PRIMARY_DB_PATH = path.join(PRIMARY_DB_DIR, 'beerNewsDatabase.json');
const TMP_DB_PATH = path.join(os.tmpdir(), 'brewhop-beerNewsDatabase.json');

let memoryDb: BeerNewsDatabaseRecord | null = null;

/**
 * Loads the persisted Beer News database from disk (or initializes it if not yet created).
 */
export function loadBeerNewsDatabase(): BeerNewsDatabaseRecord {
  if (memoryDb) {
    return memoryDb;
  }

  const candidatePaths = [PRIMARY_DB_PATH, TMP_DB_PATH];
  for (const filePath of candidatePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw) as BeerNewsDatabaseRecord;
        if (parsed && Array.isArray(parsed.articles) && parsed.articles.length > 0) {
          memoryDb = parsed;
          return parsed;
        }
      }
    } catch (err) {
      // Continue to next candidate path
    }
  }

  // Seed initial 2-day epoch database record immediately so startup and reads never block
  const nowMs = Date.now();
  const initialArticles = getDynamicCuratedBeerNews(getTwoDayCronEpoch(nowMs));
  return saveBeerNewsDatabase(initialArticles, 'curated', 0, nowMs);
}

/**
 * Persists the refreshed Beer News database to disk and memory.
 */
export function saveBeerNewsDatabase(
  articles: BeerNewsArticle[],
  source: 'live' | 'curated',
  refreshCount: number,
  nowMs: number = Date.now()
): BeerNewsDatabaseRecord {
  const nextUpdateMs = nowMs + BEER_NEWS_CRON_INTERVAL_MS;
  const record: BeerNewsDatabaseRecord = {
    version: 2,
    cronSchedule: BEER_NEWS_CRON_SCHEDULE,
    cronIntervalHours: BEER_NEWS_CRON_INTERVAL_HOURS,
    twoDayEpoch: getTwoDayCronEpoch(nowMs),
    lastUpdatedAt: nowMs,
    lastUpdatedIso: new Date(nowMs).toISOString(),
    nextScheduledUpdateAt: nextUpdateMs,
    nextScheduledUpdateIso: new Date(nextUpdateMs).toISOString(),
    refreshCount,
    source,
    articles,
  };

  memoryDb = record;

  // Write to primary server/data/beerNewsDatabase.json
  try {
    if (!fs.existsSync(PRIMARY_DB_DIR)) {
      fs.mkdirSync(PRIMARY_DB_DIR, { recursive: true });
    }
    fs.writeFileSync(PRIMARY_DB_PATH, JSON.stringify(record, null, 2), 'utf8');
  } catch (primaryErr) {
    // Fallback to os.tmpdir() in read-only serverless containers
    try {
      fs.writeFileSync(TMP_DB_PATH, JSON.stringify(record, null, 2), 'utf8');
    } catch (tmpErr) {
      // In-memory cache still holds the latest record
    }
  }

  return record;
}

/**
 * Checks whether the Beer News database needs to be refreshed by the 2-day CRON cycle.
 */
export function isBeerNewsDatabaseExpired(db: BeerNewsDatabaseRecord | null, nowMs: number = Date.now()): boolean {
  if (!db || !Array.isArray(db.articles) || db.articles.length === 0) {
    return true;
  }
  const elapsedMs = nowMs - db.lastUpdatedAt;
  const currentEpoch = getTwoDayCronEpoch(nowMs);
  if (elapsedMs >= BEER_NEWS_CRON_INTERVAL_MS) {
    return true;
  }
  if (db.twoDayEpoch !== currentEpoch) {
    return true;
  }
  return false;
}
