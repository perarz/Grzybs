import type { SQLiteDatabase } from 'expo-sqlite';

import type { LearningMode } from './learning';

export type LearningStats = Record<LearningMode, { sessions: number; best: number }>;
export const EMPTY_STATS: LearningStats = {
  quiz: { sessions: 0, best: 0 },
  lookalikes: { sessions: 0, best: 0 },
};

export async function readLearningStats(db: SQLiteDatabase): Promise<LearningStats> {
  const rows = await db.getAllAsync<{ mode: LearningMode; sessions: number; best: number }>(
    `SELECT mode, COUNT(*) AS sessions, MAX(ROUND(100.0 * score / total)) AS best
     FROM learning_sessions GROUP BY mode`,
  );
  const stats = { ...EMPTY_STATS };
  for (const row of rows) stats[row.mode] = { sessions: row.sessions, best: row.best };
  return stats;
}

export async function recordLearningSession(
  db: SQLiteDatabase,
  mode: LearningMode,
  score: number,
  total: number,
  sessionId: string,
): Promise<void> {
  if (
    !sessionId ||
    !Number.isInteger(score) ||
    !Number.isInteger(total) ||
    total < 1 ||
    score < 0 ||
    score > total
  ) {
    throw new Error('Invalid learning result');
  }
  // Retrying after a completed write must never count the same round twice.
  await db.runAsync(
    `INSERT INTO learning_sessions (id, mode, score, total, completed_at)
     VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`,
    sessionId,
    mode,
    score,
    total,
    Date.now(),
  );
}
