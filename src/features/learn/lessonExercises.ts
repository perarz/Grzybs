import type { FieldRuleId } from '@/data/fieldRules';
import type { SpeciesId } from '@/features/atlas/types';

import type { CourseLesson } from './course';
import type { Exercise, Random } from './exercises';
import { shuffled, pick } from './exerciseHelpers';
import { lookalike, pairFor } from './lookalikeQuestions';
import { situation, teachRule } from './ruleExercises';
import {
  basket,
  nameFromPhoto,
  photoFromName,
  teachSpecies,
  whereToLook,
} from './speciesQuestions';

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
  // Learning cards first, then the questions in a new order on every attempt.
  const cards = items.filter((item) => item.kind !== 'choice');
  const questions = items.filter((item) => item.kind === 'choice');
  return [...cards, ...shuffled(questions, random)];
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
