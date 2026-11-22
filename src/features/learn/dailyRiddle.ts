import type { Species } from '@/features/atlas/types';
import { formatSeason } from '@/features/atlas/season';

export type DailyRiddle = {
  /** Hints that don't give the name away: two key features and the season. */
  clues: string[];
  /** The answer and two other species, in a fixed but mixed order. */
  options: Species[];
  /** One thing worth remembering, shown after the answer. */
  fact: string;
};

const CLUE_COUNT = 2;

/** Word stems of every name of a species, to keep hints from naming it. */
function nameStems(species: Species) {
  return [species.namePl, species.nameCommon ?? '', ...species.otherNames]
    .flatMap((name) => name.toLowerCase().split(/\s+/))
    .filter((word) => word.length >= 4)
    .map((word) => word.slice(0, 5));
}

function firstSentence(text: string) {
  return text.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? text;
}

/** Builds the riddle for a species from the atlas text only – no facts of its own. */
export function dailyRiddle(species: Species, all: readonly Species[]): DailyRiddle {
  const stems = nameStems(species);
  const clues = species.keyFeatures
    .filter((feature) => !stems.some((stem) => feature.toLowerCase().includes(stem)))
    .slice(0, CLUE_COUNT);
  const index = all.findIndex((item) => item.id === species.id);
  // Look-alike distractors first: species with the same kind of underside are harder to tell apart.
  const others = all.filter((item) => item.id !== species.id);
  const similar = others.filter((item) => item.features.underside === species.features.underside);
  const pool = similar.length >= 2 ? similar : others;
  const distractors = [pool[index % pool.length], pool[(index + 3) % pool.length]];
  const unique = distractors[0].id === distractors[1].id ? [pool[0], pool[1]] : distractors;
  const options = [species, ...unique];
  const shift = index % options.length;
  return {
    clues: [...clues, `Sezon: ${formatSeason(species.months)}.`],
    options: [...options.slice(shift), ...options.slice(0, shift)],
    fact: firstSentence(
      species.poisoning ?? species.edibilityNote ?? species.protectionNote ?? species.description,
    ),
  };
}
