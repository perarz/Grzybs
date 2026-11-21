import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  deleteCar,
  deleteSpot,
  readFieldData,
  writeCar,
  writeSpot,
  type SpotInput,
  type ParkingFix,
  type Spot,
  type CarLocation,
} from './storage';

export function useFieldData() {
  const db = useSQLiteContext();
  const [data, setData] = useState<{ spots: Spot[]; car: CarLocation | null }>({
    spots: [],
    car: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const request = useRef(0);
  const mutation = useRef(false);
  const mounted = useRef(false);
  const refresh = useCallback(async () => {
    if (!mounted.current) return;
    const current = ++request.current;
    setLoading(true);
    try {
      const next = await readFieldData(db);
      if (mounted.current && current === request.current) {
        setData(next);
        setError(null);
      }
    } catch {
      if (mounted.current && current === request.current)
        setError('Nie udało się odczytać miejsc. Spróbuj ponownie.');
    } finally {
      if (mounted.current && current === request.current) setLoading(false);
    }
  }, [db]);
  useEffect(() => {
    mounted.current = true;
    const current = ++request.current;
    readFieldData(db)
      .then((next) => {
        if (mounted.current && current === request.current) {
          setData(next);
          setError(null);
        }
      })
      .catch(() => {
        if (mounted.current && current === request.current)
          setError('Nie udało się odczytać miejsc. Spróbuj ponownie.');
      })
      .finally(() => {
        if (mounted.current && current === request.current) setLoading(false);
      });
    return () => {
      mounted.current = false;
    };
  }, [db]);
  const mutate = async (operation: () => Promise<void>) => {
    if (mutation.current) throw new Error('Trwa zapis. Poczekaj chwilę.');
    mutation.current = true;
    try {
      await operation();
      // Read failures are separate from successful writes, so retry cannot duplicate a spot.
      await refresh();
    } finally {
      mutation.current = false;
    }
  };
  return {
    ...data,
    loading,
    error,
    refresh,
    saveSpot: (input: SpotInput) => mutate(() => writeSpot(db, input)),
    removeSpot: (id: number) =>
      mutate(async () => {
        await deleteSpot(db, id);
        if (mounted.current)
          setData((previous) => ({
            ...previous,
            spots: previous.spots.filter((spot) => spot.id !== id),
          }));
      }),
    park: (position: ParkingFix) =>
      mutate(async () => {
        const car = await writeCar(db, position);
        if (mounted.current) setData((previous) => ({ ...previous, car }));
      }),
    clearCar: () =>
      mutate(async () => {
        await deleteCar(db);
        if (mounted.current) setData((previous) => ({ ...previous, car: null }));
      }),
  };
}
