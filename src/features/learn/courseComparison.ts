import { getSpecies } from '@/data/species';
import { LOOKALIKE_PAIRS } from '@/data/lookalikes';
import type { Species } from '@/features/atlas/types';
import type { CourseUnit } from './courseUnits';

export function comparisonUnit(s: Species): CourseUnit {
  const pair = LOOKALIKE_PAIRS.find((p) => p.species[0] === s.id)!;
  const difference = pair.differences.find((d) => d.trait !== 'Smak' && d.first !== d.second)!;
  const other = getSpecies(pair.species[1]);
  return {
    id: `${s.id}:comparison`,
    title: difference.trait,
    visual: 'comparison',
    speciesIds: [...pair.species],
    facts: [
      { label: s.namePl, text: difference.first },
      { label: other.namePl, text: difference.second },
    ],
    question: {
      id: `${s.id}:comparison`,
      speciesIds: [...pair.species],
      prompt: `${difference.trait}: który opis pasuje do gatunku „${s.nameCommon ?? s.namePl}”?`,
      options: [
        { id: s.id, label: difference.first },
        { id: other.id, label: difference.second },
      ],
      correctOptionId: s.id,
      explanation: `${s.namePl}: ${difference.first}. ${other.namePl}: ${difference.second}.`,
    },
  };
}
