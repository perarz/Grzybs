import { SPECIES } from '@/data/species';
import { UNDERSIDE_LABELS } from '@/features/atlas/labels';

import type { LearningQuestion } from './learning';

export function createQuizQuestions(): LearningQuestion[] {
  return SPECIES.flatMap((species, index) => {
    const latinQuestion: LearningQuestion = {
      id: `quiz:latin:${species.id}`,
      prompt: `Która nazwa łacińska oznacza gatunek „${species.namePl}”?`,
      options: [0, 1, 7, 13].map((offset) => {
        const candidate = SPECIES[(index + offset) % SPECIES.length];
        return { id: candidate.id, label: candidate.nameLatin };
      }),
      correctOptionId: species.id,
      explanation: `${species.namePl} to ${species.nameLatin}.`,
      speciesIds: [species.id],
    };
    // Puffballs and morels do not share the cap underside used in this question.
    if (species.features.underside === 'none') return [latinQuestion];
    return [
      latinQuestion,
      {
        id: `quiz:underside:${species.id}`,
        prompt: `Co znajduje się pod kapeluszem gatunku „${species.namePl}”?`,
        options: Object.entries(UNDERSIDE_LABELS).map(([id, label]) => ({
          id,
          label: id === 'none' ? 'Brak blaszek, rurek i listewek' : label,
        })),
        correctOptionId: species.features.underside,
        explanation: `${species.namePl} — pod kapeluszem: ${UNDERSIDE_LABELS[species.features.underside].toLocaleLowerCase('pl-PL')}.`,
        speciesIds: [species.id],
      },
    ];
  });
}
