import { useRef, useState } from 'react';
import { pickPhoto } from './pickPhoto';

type Draft = { photo: string | null; error?: string };

/** Opens the camera straight away; the photo then only needs a species. */
export function useQuickPhoto() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);

  async function takePhoto() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      const photo = await pickPhoto(true);
      if (photo) setDraft({ photo });
    } catch (cause) {
      setDraft({
        photo: null,
        error: cause instanceof Error ? cause.message : 'Nie udało się otworzyć aparatu.',
      });
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  return { draft, busy, takePhoto, close: () => setDraft(null) };
}
