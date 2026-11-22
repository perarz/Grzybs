import { useEffect, useRef, useState } from 'react';

import { useDaylight } from '@/features/navigation/useDaylight';
import { useFieldLocation } from '@/features/navigation/useFieldLocation';

import type { Coordinate, Spot } from './storage';
import { useFieldData } from './useFieldData';
import { isFreshFix, type SpotDraft } from './useSpotEditor';

export function useMapNotebook(active: boolean) {
  const field = useFieldData();
  const location = useFieldLocation(active);
  const [draft, setDraft] = useState<SpotDraft | null>(null);
  const [focus, setFocus] = useState<Coordinate | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  const [parkingOpen, setParkingOpen] = useState(false);
  /** What waits for the user's confirmation before it is deleted. */
  const [removal, setRemoval] = useState<Spot | 'car' | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, [active]);
  const freshPosition =
    location.status === 'tracking' && isFreshFix(location.position, now) ? location.position : null;
  const daylight = useDaylight(location.position ?? field.car, active);
  async function act(action: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      await action();
      return true;
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Nie udało się zapisać zmiany. Spróbuj ponownie.',
      );
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function addHere() {
    if (!isFreshFix(location.position)) {
      setError(
        'Poczekaj na świeżą pozycję z dokładnością do 100 m lub przytrzymaj wybrane miejsce na mapie.',
      );
      return;
    }
    setDraft({ point: location.position });
  }
  function park() {
    setError(null);
    setParkingOpen(true);
  }
  async function confirmParking() {
    const fix = location.status === 'tracking' ? location.position : null;
    if (!isFreshFix(fix)) {
      setError('Poczekaj na dokładną pozycję GPS i spróbuj ponownie.');
      return;
    }
    if (await act(() => field.park(fix))) setParkingOpen(false);
  }
  function confirmRemoval() {
    const target = removal;
    setRemoval(null);
    if (target === 'car') void act(field.clearCar);
    else if (target) void act(() => field.removeSpot(target.id));
  }
  return {
    field,
    location,
    freshPosition,
    daylight,
    draft,
    setDraft,
    focus,
    setFocus,
    busy,
    error,
    addHere,
    park,
    parkingOpen,
    setParkingOpen,
    confirmParking,
    removal,
    remove: (spot: Spot) => setRemoval(spot),
    clearCar: () => setRemoval('car'),
    cancelRemoval: () => setRemoval(null),
    confirmRemoval,
  };
}
