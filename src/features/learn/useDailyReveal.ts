import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { readRevealedDay, saveRevealedDay, todayKey } from './dailyReveal';

/** The daily species starts hidden; once uncovered it stays visible until midnight. */
export function useDailyReveal() {
  const db = useSQLiteContext();
  const [revealedDay, setRevealedDay] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    readRevealedDay(db)
      .then((day) => {
        if (active) setRevealedDay(day);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [db]);
  function reveal() {
    const today = todayKey();
    setRevealedDay(today);
    // If saving fails, the card is simply hidden again on the next start.
    void saveRevealedDay(db, today).catch(() => undefined);
  }
  return { revealed: revealedDay === todayKey(), reveal };
}
