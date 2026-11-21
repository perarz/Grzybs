import { LOOKALIKE_PAIRS } from '@/data/lookalikes';
import { getSpecies, SPECIES } from '@/data/species';
import type { Species, SpeciesId } from '@/features/atlas/types';

import { createQuizQuestions } from './quizQuestions';

export type LearningMode = 'quiz' | 'lookalikes';
export type LearningQuestion = {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
  explanation: string;
  speciesIds: SpeciesId[];
};

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function getDailySpecies(date = new Date()): Species {
  if (!Number.isFinite(date.getTime())) throw new RangeError('Invalid calendar date');
  // UTC arithmetic on local date parts avoids skipping/repeating a day around DST changes.
  const day = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MILLISECONDS_PER_DAY,
  );
  return SPECIES[((day % SPECIES.length) + SPECIES.length) % SPECIES.length];
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function createLookalikeQuestions(): LearningQuestion[] {
  return LOOKALIKE_PAIRS.flatMap((pair) => {
    const first = getSpecies(pair.species[0]);
    const second = getSpecies(pair.species[1]);
    return pair.differences.flatMap((difference, index) => {
      // A beginner game must not teach tasting unknown mushrooms as an identification step.
      if (difference.trait === 'Smak' || difference.first === difference.second) return [];
      return [first, second].map((target) => ({
        id: `lookalikes:${first.id}:${second.id}:${index}:${target.id}`,
        prompt: `${target.namePl} i ${target.id === first.id ? second.namePl : first.namePl}. Który opis pasuje do gatunku „${target.namePl}”? Cecha: ${difference.trait.toLocaleLowerCase('pl-PL')}.`,
        options: [
          { id: first.id, label: difference.first },
          { id: second.id, label: difference.second },
        ],
        correctOptionId: target.id,
        explanation: `${difference.trait} — ${first.namePl}: ${difference.first}. ${second.namePl}: ${difference.second}.`,
        speciesIds: [...pair.species],
      }));
    });
  });
}

export function createSession(
  mode: LearningMode,
  count = 5,
  random: () => number = Math.random,
  include: (question: LearningQuestion) => boolean = () => true,
): LearningQuestion[] {
  if (!Number.isFinite(count) || count < 1) return [];
  const pool = mode === 'quiz' ? createQuizQuestions() : createLookalikeQuestions();
  const selected: LearningQuestion[] = [];
  const usedSubjects = new Set<string>();
  for (const question of shuffled(pool.filter(include), random)) {
    const subject = question.speciesIds.join(':');
    if (usedSubjects.has(subject)) continue;
    usedSubjects.add(subject);
    selected.push({ ...question, options: shuffled(question.options, random) });
    if (selected.length >= Math.floor(count)) break;
  }
  return selected;
}
