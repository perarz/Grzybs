import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { LearningMode } from './learning';
import { EMPTY_STATS, readLearningStats, recordLearningSession } from './progressStorage';

export function useLearningProgress() {
  const db = useSQLiteContext();
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const request = useRef(0);
  const activeDatabase = useRef<typeof db | null>(null);
  const load = useCallback(async () => {
    if (activeDatabase.current !== db) return;
    const current = ++request.current;
    try {
      const next = await readLearningStats(db);
      if (current === request.current) {
        setStats(next);
        setError(null);
      }
    } catch {
      if (current === request.current)
        setError('Nie udało się odczytać wyników. Możesz nadal ćwiczyć.');
    } finally {
      if (current === request.current) setLoading(false);
    }
  }, [db]);
  useEffect(() => {
    activeDatabase.current = db;
    const pendingRequest = request;
    const current = ++request.current;
    readLearningStats(db)
      .then((next) => {
        if (current === request.current) {
          setStats(next);
          setError(null);
        }
      })
      .catch(() => {
        if (current === request.current)
          setError('Nie udało się odczytać wyników. Możesz nadal ćwiczyć.');
      })
      .finally(() => {
        if (current === request.current) setLoading(false);
      });
    return () => {
      activeDatabase.current = null;
      ++pendingRequest.current;
    };
  }, [db]);
  const refresh = useCallback(async () => {
    if (activeDatabase.current !== db) return;
    setLoading(true);
    await load();
  }, [db, load]);
  const record = useCallback(
    async (mode: LearningMode, score: number, total: number, sessionId: string) => {
      await recordLearningSession(db, mode, score, total, sessionId);
      // A failed refresh doesn't undo a successful save; expose a separate read error.
      await load();
    },
    [db, load],
  );
  return { stats, loading, error, refresh, record };
}
