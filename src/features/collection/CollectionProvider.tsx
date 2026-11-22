import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import { AddFindSheet } from '@/components/collection/AddFindSheet';
import type { SpeciesId } from '@/features/atlas/types';

import { CollectionContext } from './CollectionContext';
import {
  deleteFind,
  readFinds,
  saveFind,
  updateFindDetails,
  type Find,
  type FindDetails,
} from './storage';
import { useRecoveredPhoto } from './useRecoveredPhoto';

export { useCollection } from './CollectionContext';

export function CollectionProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [finds, setFinds] = useState<Find[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const status = useRef<'loading' | 'ready' | 'error'>('loading');
  const request = useRef(0);
  const saving = useRef(false);
  const recovery = useRecoveredPhoto();
  const reload = useCallback(async () => {
    if (saving.current) return;
    const current = ++request.current;
    status.current = 'loading';
    setLoading(true);
    setError(null);
    try {
      const rows = await readFinds(db);
      if (current !== request.current) return;
      setFinds(rows);
      status.current = 'ready';
    } catch {
      if (current !== request.current) return;
      status.current = 'error';
      setError('Nie udało się odczytać kolekcji. Spróbuj ponownie.');
    } finally {
      if (current === request.current) setLoading(false);
    }
  }, [db]);
  useEffect(() => {
    let active = true;
    const current = ++request.current;
    readFinds(db)
      .then((rows) => {
        if (!active || current !== request.current) return;
        setFinds(rows);
        status.current = 'ready';
      })
      .catch(() => {
        if (!active || current !== request.current) return;
        status.current = 'error';
        setError('Nie udało się odczytać kolekcji. Spróbuj ponownie.');
      })
      .finally(() => {
        if (active && current === request.current) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [db]);

  async function add(speciesId: SpeciesId, uri: string, details: FindDetails) {
    if (saving.current || status.current !== 'ready') throw new Error('Kolekcja nie jest gotowa.');
    saving.current = true;
    try {
      const find = await saveFind(db, speciesId, uri, details);
      setFinds((previous) => [find, ...previous]);
    } finally {
      saving.current = false;
    }
  }

  async function update(find: Find, details: FindDetails) {
    if (saving.current) throw new Error('Kolekcja zapisuje zmiany. Spróbuj za chwilę.');
    saving.current = true;
    try {
      await updateFindDetails(db, find.id, details);
      setFinds((previous) =>
        previous.map((item) => (item.id === find.id ? { ...item, ...details } : item)),
      );
    } finally {
      saving.current = false;
    }
  }

  async function remove(find: Find) {
    if (saving.current) throw new Error('Kolekcja zapisuje zmiany. Spróbuj za chwilę.');
    saving.current = true;
    try {
      await deleteFind(db, find);
      setFinds((previous) => previous.filter((item) => item.id !== find.id));
    } finally {
      saving.current = false;
    }
  }

  return (
    <CollectionContext.Provider
      value={{ finds, loading: loading || recovery.checking, error, reload, add, update, remove }}
    >
      {children}
      {recovery.pending && !loading ? (
        <AddFindSheet
          initialPhoto={recovery.pending.photo}
          initialError={recovery.pending.error}
          onClose={recovery.clear}
        />
      ) : null}
    </CollectionContext.Provider>
  );
}
