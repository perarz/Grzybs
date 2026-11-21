import { createContext, useContext } from 'react';

import type { SpeciesId } from '@/features/atlas/types';

import type { Find } from './storage';

export type Collection = {
  finds: Find[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  add: (speciesId: SpeciesId, uri: string) => Promise<void>;
  remove: (find: Find) => Promise<void>;
};
export const CollectionContext = createContext<Collection | null>(null);

export function useCollection() {
  const collection = useContext(CollectionContext);
  if (!collection) throw new Error('CollectionProvider is missing');
  return collection;
}
