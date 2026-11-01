import { LOOKALIKE_PAIRS } from '@/data/lookalikes';
import { getSpecies } from '@/data/species';

import type { LookalikePair, Species, SpeciesId } from './types';

export type Lookalike = {
  species: Species;
  pair: LookalikePair;
};

/** Every species confused with the given one – pairs are stored once, so look on both sides. */
export function findLookalikes(id: SpeciesId): Lookalike[] {
  return LOOKALIKE_PAIRS.filter((pair) => pair.species.includes(id)).map((pair) => {
    const [first, second] = pair.species;
    return { species: getSpecies(first === id ? second : first), pair };
  });
}

/** For ids from a URL – returns undefined when no such pair exists. */
export function findPair(firstId: string, secondId: string): LookalikePair | undefined {
  return LOOKALIKE_PAIRS.find(
    ({ species: [first, second] }) => first === firstId && second === secondId,
  );
}
