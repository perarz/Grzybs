import { useCallback, useState } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { learningJourney, type LearningRecord } from './journey';

export function useLearningJourney(sessionOpen: boolean) {
  const db = useSQLiteContext();
  const [records, setRecords] = useState<LearningRecord[] | null>(null);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [retry, setRetry] = useState(0);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      let request = 0;
      async function load() {
        const current = ++request;
        try {
          const rows = await db.getAllAsync<LearningRecord>(
            'SELECT score, total, completed_at FROM learning_sessions UNION ALL SELECT 0 AS score, 1 AS total, completed_at FROM course_steps UNION ALL SELECT 0 AS score, 1 AS total, completed_at FROM course_activity',
          );
          if (active && current === request) {
            setRecords(rows);
            setNow(Date.now());
            setError(false);
          }
        } catch {
          if (active && current === request) setError(true);
        }
      }
      void load();
      const subscription = AppState.addEventListener('change', (state) => {
        if (state === 'active') void load();
      });
      const timer = setInterval(() => setNow(Date.now()), 60_000);
      return () => {
        active = false;
        subscription.remove();
        clearInterval(timer);
      };
      // Re-read persisted sessions when the sheet closes or the user retries.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db, sessionOpen, retry]),
  );
  return {
    journey: records ? learningJourney(records, now) : null,
    error,
    retry: () => setRetry((value) => value + 1),
  };
}
