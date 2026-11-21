import { FIELD_RULES, type FieldRuleId } from '@/data/fieldRules';
import { LOOKALIKE_PAIRS } from '@/data/lookalikes';
import { getSpecies, SPECIES } from '@/data/species';
import { HABITAT_LABELS } from '@/features/atlas/labels';
import type { Habitat, Species, SpeciesId } from '@/features/atlas/types';

import type { CourseLesson } from './course';

export type ChoiceOption = {
  id: string;
  label: string;
  /** Shown as a photo tile instead of text. */
  speciesId?: SpeciesId;
};

export type Exercise =
  | { kind: 'teach-species'; key: string; speciesId: SpeciesId }
  | { kind: 'teach-rule'; key: string; ruleId: FieldRuleId }
  | {
      kind: 'choice';
      key: string;
      prompt: string;
      /** A photo the question is about. */
      photo?: SpeciesId;
      /** list – text answers, photos – a 2 × 2 grid, pair – two big photos side by side. */
      layout: 'list' | 'photos' | 'pair';
      options: ChoiceOption[];
      correctId: string;
      explanation: string;
    };

export type Random = () => number;

const TEST_LENGTH = 10;
const FINAL_LENGTH = 12;

export function lessonExercises(lesson: CourseLesson, random: Random = Math.random): Exercise[] {
  if (lesson.isTest) return testExercises(lesson, random);
  const items: Exercise[] = [];
  const known = lesson.knownSpecies;
  const [first, second] = lesson.newSpecies;

  for (const id of lesson.newSpecies) items.push(teachSpecies(id));
  if (first && second) {
    // Recall in a different form than the card just shown: find it among similar photos.
    items.push(photoFromName(first, random));
    items.push(nameFromPhoto(second, random));
    items.push(basket(random() < 0.5 ? first : second));
  } else if (first) {
    items.push(nameFromPhoto(first, random));
    items.push(basket(first));
  }
  const allowed = new Set([...known, ...lesson.newSpecies]);
  const pair = lesson.newSpecies.map((id) => pairFor(id, allowed)).find(Boolean);
  if (pair) items.push(lookalike(pair, random));
  if (lesson.rule) {
    items.push(teachRule(lesson.rule));
    items.push(situation(lesson.rule, random));
  }
  // Older species come back so they are not forgotten.
  const reviewCount = Math.max(1, 7 - items.length);
  const pool = known.length ? known : lesson.newSpecies;
  const asked = new Set(items.map((item) => item.key));
  items.push(...reviewExercises(pool, lesson.knownRules, allowed, reviewCount, random, asked));
  return items;
}

function testExercises(lesson: CourseLesson, random: Random): Exercise[] {
  const species = lesson.isFinal ? lesson.knownSpecies : lesson.stageSpecies;
  const rules = lesson.isFinal ? lesson.knownRules : lesson.stageRules;
  const length = lesson.isFinal ? FINAL_LENGTH : TEST_LENGTH;
  const allowed = new Set(lesson.knownSpecies);
  return reviewExercises(
    species,
    rules.length ? rules : lesson.knownRules,
    allowed,
    length,
    random,
  );
}

/** A varied mix of question kinds over the given species and rules. */
function reviewExercises(
  speciesIds: SpeciesId[],
  rules: FieldRuleId[],
  /** Species the learner already met – a lookalike pair may only use these. */
  allowed: Set<SpeciesId>,
  count: number,
  random: Random,
  /** Keys already in the lesson – a question never repeats within one lesson. */
  asked: Set<string> = new Set(),
): Exercise[] {
  const makers: ((id: SpeciesId) => Exercise | null)[] = [
    (id) => nameFromPhoto(id, random),
    (id) => photoFromName(id, random),
    (id) => basket(id),
    (id) => {
      const pair = pairFor(id, allowed);
      return pair ? lookalike(pair, random) : null;
    },
    (id) => whereToLook(id, random),
  ];
  const result: Exercise[] = [];
  const used = new Set(asked);
  const ruleQueue = shuffled(rules, random);
  let attempt = 0;
  while (result.length < count && attempt < count * 10) {
    attempt++;
    // Roughly every fourth question is a field situation, when rules are known.
    const exercise =
      ruleQueue.length && result.length % 4 === 3
        ? situation(ruleQueue.shift()!, random)
        : pick(makers, random)(pick(speciesIds, random));
    if (!exercise || used.has(exercise.key)) continue;
    if (exercise.key.startsWith('where:') && whereCount(result) >= MAX_WHERE) continue;
    used.add(exercise.key);
    result.push(exercise);
  }
  return result;
}

// Habitat questions are useful but samey – at most two per lesson.
const MAX_WHERE = 2;

function whereCount(items: Exercise[]) {
  return items.filter((item) => item.key.startsWith('where:')).length;
}

function teachSpecies(speciesId: SpeciesId): Exercise {
  return { kind: 'teach-species', key: `teach:${speciesId}`, speciesId };
}

function teachRule(ruleId: FieldRuleId): Exercise {
  return { kind: 'teach-rule', key: `rule:${ruleId}`, ruleId };
}

function nameOf(species: Species) {
  return species.nameCommon ?? species.namePl;
}

function nameFromPhoto(speciesId: SpeciesId, random: Random): Exercise {
  const species = getSpecies(speciesId);
  return {
    kind: 'choice',
    key: `name:${speciesId}`,
    prompt: 'Co to za grzyb?',
    photo: speciesId,
    layout: 'list',
    options: shuffled([species, ...similarSpecies(species, 3, random)], random).map((item) => ({
      id: item.id,
      label: nameOf(item),
    })),
    correctId: speciesId,
    explanation: `${nameOf(species)}: ${lowerFirst(species.keyFeatures[0])}`,
  };
}

function photoFromName(speciesId: SpeciesId, random: Random): Exercise {
  const species = getSpecies(speciesId);
  return {
    kind: 'choice',
    key: `photo:${speciesId}`,
    prompt: `Gdzie jest ${nameOf(species).toLowerCase()}?`,
    layout: 'photos',
    options: shuffled([species, ...similarSpecies(species, 3, random)], random).map((item) => ({
      id: item.id,
      label: nameOf(item),
      speciesId: item.id,
    })),
    correctId: speciesId,
    explanation: `${nameOf(species)}: ${lowerFirst(species.keyFeatures[0])}`,
  };
}

const VERDICT: Record<Species['edibility'], string> = {
  edible: 'jadalny',
  inedible: 'niejadalny',
  poisonous: 'trujący',
  deadly: 'śmiertelnie trujący',
};

function basket(speciesId: SpeciesId): Exercise {
  const species = getSpecies(speciesId);
  const edible = species.edibility === 'edible';
  return {
    kind: 'choice',
    key: `basket:${speciesId}`,
    prompt: 'Rozpoznajesz go na pewno. Co z nim robisz?',
    photo: speciesId,
    layout: 'list',
    options: [
      { id: 'take', label: 'Do koszyka' },
      { id: 'leave', label: 'Zostawiam w lesie' },
    ],
    correctId: edible ? 'take' : 'leave',
    explanation: edible
      ? `${nameOf(species)} – gatunek jadalny. ${species.edibilityNote ?? 'Zbieraj tylko, gdy nie masz żadnych wątpliwości.'}`
      : `${nameOf(species)} – gatunek ${VERDICT[species.edibility]}. ${firstSentence(species.poisoning ?? species.edibilityNote ?? species.description)}`,
  };
}

function lookalike(pair: [SpeciesId, SpeciesId], random: Random): Exercise {
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

function whereToLook(speciesId: SpeciesId, random: Random): Exercise | null {
  const species = getSpecies(speciesId);
  const correct = species.habitats[0];
  // Birches and oaks grow in pine woods too, so the other forest type is never a wrong answer.
  const forests: Habitat[] = ['deciduous', 'coniferous'];
  const others = (Object.keys(HABITAT_LABELS) as Habitat[]).filter(
    (habitat) =>
      !species.habitats.includes(habitat) &&
      !(forests.includes(correct) && forests.includes(habitat)),
  );
  if (others.length < 2) return null;
  return {
    kind: 'choice',
    key: `where:${speciesId}`,
    prompt: 'Gdzie najłatwiej znaleźć ten grzyb?',
    photo: speciesId,
    layout: 'list',
    options: shuffled([correct, ...shuffled(others, random).slice(0, 2)], random).map(
      (habitat) => ({ id: habitat, label: HABITAT_LABELS[habitat] }),
    ),
    correctId: correct,
    explanation: `${nameOf(species)}: ${species.habitats.map((habitat) => HABITAT_LABELS[habitat].toLowerCase()).join(', ')}.`,
  };
}

function situation(ruleId: FieldRuleId, random: Random): Exercise {
  const { situation: question } = FIELD_RULES[ruleId];
  return {
    kind: 'choice',
    key: `situation:${ruleId}`,
    prompt: question.prompt,
    layout: 'list',
    options: shuffled(question.options, random),
    correctId: question.correctId,
    explanation: question.explanation,
  };
}

function pairFor(speciesId: SpeciesId, allowed: Set<SpeciesId>): [SpeciesId, SpeciesId] | null {
  const pair = LOOKALIKE_PAIRS.find(
    ({ species }) => species.includes(speciesId) && species.every((id) => allowed.has(id)),
  );
  return pair ? pair.species : null;
}

/** Species a picker could confuse with this one: same underside and cap colour come first. */
function similarSpecies(species: Species, count: number, random: Random): Species[] {
  const scored = SPECIES.filter((other) => other.id !== species.id).map((other) => ({
    other,
    score:
      (other.features.underside === species.features.underside ? 2 : 0) +
      (other.features.capColors.some((color) => species.features.capColors.includes(color))
        ? 1
        : 0) +
      random(),
  }));
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ other }) => other);
}

function shuffled<T>(items: readonly T[], random: Random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function pick<T>(items: readonly T[], random: Random): T {
  return items[Math.floor(random() * items.length)];
}

function lowerFirst(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function firstSentence(text: string) {
  const end = text.search(/[.!?](\s|$)/);
  return end === -1 ? text : text.slice(0, end + 1);
}
