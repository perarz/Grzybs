import { useEffect, useRef, useState } from 'react';
import type { Species } from '@/features/atlas/types';
import { useCollection } from './CollectionContext';
import { pickPhoto } from './pickPhoto';

export function useAddFind(
  initialSpecies?: Species,
  initialPhoto: string | null = null,
  initialError?: string,
) {
  const collection = useCollection();
  const [photo, setPhoto] = useState<string | null>(initialPhoto);
  const [species, setSpecies] = useState(initialSpecies);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [photoUnavailable, setPhotoUnavailable] = useState(false);
  const mounted = useRef(true);
  const [saved, setSaved] = useState(false);
  const [isDiscovery, setDiscovery] = useState(false);
  const lock = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  function replacePhoto(uri: string | null) {
    setPhoto(uri);
    setPhotoUnavailable(false);
    setError(null);
  }
  function photoFailed() {
    setPhotoUnavailable(true);
    setError('Nie można odczytać zdjęcia. Wybierz inne zdjęcie, zanim zapiszesz znalezisko.');
  }

  async function choosePhoto(camera: boolean) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      const uri = await pickPhoto(camera);
      if (uri && mounted.current) replacePhoto(uri);
    } catch (cause) {
      if (!mounted.current) return;
      setError(
        cause instanceof Error
          ? cause.message
          : 'Nie udało się otworzyć zdjęcia. Spróbuj ponownie.',
      );
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  async function save() {
    if (!photo || !species || lock.current || saved || photoUnavailable) return;
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      const discovered = !collection.finds.some((find) => find.species_id === species.id);
      await collection.add(species.id, photo);
      if (!mounted.current) return;
      setDiscovery(discovered);
      setSaved(true);
    } catch {
      if (!mounted.current) return;
      setError('Nie udało się zapisać znaleziska. Zdjęcie pozostaje wybrane — spróbuj ponownie.');
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  return {
    photo,
    setPhoto: replacePhoto,
    photoFailed,
    photoUnavailable,
    species,
    setSpecies,
    busy,
    error,
    setError,
    saved,
    isDiscovery,
    choosePhoto,
    save,
  };
}
