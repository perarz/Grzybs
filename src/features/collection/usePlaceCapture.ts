import { useEffect, useRef, useState } from 'react';
import { readCurrentPlace } from './currentPlace';
import type { Place } from './findDraft';

/** Reads the phone's position on request, with a busy flag and a readable error. */
export function usePlaceCapture(onPlace: (place: Place) => void) {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  async function capture() {
    if (locating) return;
    setLocating(true);
    setError(null);
    try {
      const place = await readCurrentPlace();
      if (mounted.current) onPlace(place);
    } catch (cause) {
      if (mounted.current) {
        setError(cause instanceof Error ? cause.message : 'Nie udało się ustalić pozycji.');
      }
    } finally {
      if (mounted.current) setLocating(false);
    }
  }
  return { locating, error, capture };
}
