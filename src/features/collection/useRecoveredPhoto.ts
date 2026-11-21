import { getPendingResultAsync } from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';

import { photoUri } from './photoResult';

type PendingPhoto = { photo: string | null; error?: string };

export function useRecoveredPhoto() {
  const [pending, setPending] = useState<PendingPhoto | null>(null);
  const [checking, setChecking] = useState(true);
  const request = useRef<ReturnType<typeof getPendingResultAsync> | null>(null);
  useEffect(() => {
    let active = true;
    request.current ??= getPendingResultAsync();
    request.current
      .then((result) => {
        if (!active) return;
        const uri = photoUri(result);
        if (uri) setPending({ photo: uri });
      })
      .catch(() => {
        if (active)
          setPending({
            photo: null,
            error: 'Nie udało się odzyskać zdjęcia z aparatu. Wybierz je ponownie.',
          });
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, []);
  return { pending, checking, clear: () => setPending(null) };
}
