import { LOOKALIKE_PAIRS } from '@/data/lookalikes';
import { getSpecies } from '@/data/species';
import type { SpeciesId } from '@/features/atlas/types';

import type { Exercise, Random } from './exercises';
import { nameOf, shuffled } from './exerciseHelpers';

export function lookalike(pair: [SpeciesId, SpeciesId], random: Random): Exercise {
  const [wantedId, mistakeId] = pair;
  const wanted = getSpecies(wantedId);
  const difference = LOOKALIKE_PAIRS.find(
    ({ species }) => species[0] === wantedId && species[1] === mistakeId,
  )?.differences[0];
  return {
    kind: 'choice',
    key: `pair:${wantedId}:${mistakeId}`,
    prompt: `Który to ${nameOf(wanted).toLowerCase()}?`,
    layout: 'pair',
    options: shuffled([wantedId, mistakeId], random).map((id) => ({
      id,
      label: nameOf(getSpecies(id)),
      speciesId: id,
    })),
    correctId: wantedId,
    explanation: difference
      ? `${difference.trait}: ${nameOf(wanted).toLowerCase()} – ${difference.first}, ${nameOf(getSpecies(mistakeId)).toLowerCase()} – ${difference.second}.`
      : `To ${nameOf(wanted).toLowerCase()}.`,
  };
}

export function pairFor(
  speciesId: SpeciesId,
  allowed: Set<SpeciesId>,
): [SpeciesId, SpeciesId] | null {
  const pair = LOOKALIKE_PAIRS.find(
    ({ species }) => species.includes(speciesId) && species.every((id) => allowed.has(id)),
  );
  return pair ? pair.species : null;
}
