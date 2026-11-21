import { useRef, useState } from 'react';

import type { LocationFix } from '@/features/navigation/geo';

import type { Coordinate, Spot, SpotInput } from './storage';

// The point is fixed when the form opens: a spot is where the user stood when they tapped "add",
// however long typing its name takes.
export type SpotDraft = { point: Coordinate; spot?: Spot };

export function isFreshFix(fix: LocationFix | null, now = Date.now()): fix is LocationFix {
  if (!fix) return false;
  const age = Math.max(now, Date.now()) - fix.timestamp;
  return (
    Number.isFinite(age) &&
    age >= -5000 &&
    age <= 60000 &&
    fix.accuracy !== null &&
    Number.isFinite(fix.accuracy) &&
    fix.accuracy >= 0 &&
    fix.accuracy <= 100
  );
}

export function useSpotEditor(
  draft: SpotDraft,
  saveSpot: (input: SpotInput) => Promise<void>,
  onClose: () => void,
) {
  const [name, setName] = useState(draft.spot?.name ?? '');
  const [note, setNote] = useState(draft.spot?.note ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  async function save() {
    if (lock.current) return;
    if (!name.trim()) {
      setError('Nadaj temu miejscu nazwę.');
      return;
    }
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      await saveSpot({ ...draft.point, id: draft.spot?.id, name, note });
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Nie udało się zapisać miejsca. Spróbuj ponownie.',
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return { name, setName, note, setNote, busy, error, save };
}
