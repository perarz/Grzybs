import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { courseXP, readCourseSteps } from './courseStorage';

export function useCourseProgress() {
  const db = useSQLiteContext();
  const [completed, setCompleted] = useState<number[] | null>(null);
  const [xp, setXP] = useState(0);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      readCourseSteps(db)
        .then((rows) => {
          if (active) {
            setCompleted(rows.map((row) => row.step_id));
            setXP(courseXP(rows));
            setError(false);
          }
        })
        .catch(() => {
          if (active) setError(true);
        });
      return () => {
        active = false;
      };
      // A manual retry must re-run the focused screen's read.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db, attempt]),
  );
  return { completed, xp, error, retry: () => setAttempt((value) => value + 1) };
}
