import { getSpecies } from '@/data/species';
import type { SpeciesId } from '@/features/atlas/types';
import { speciesUnits, type CourseUnit } from './courseUnits';
import { comparisonUnit } from './courseComparison';

export const COURSE_STAGES = [
  {
    title: 'Pierwsze kroki w lesie',
    subtitle: 'Borowik · rurki · pierwsze różnice',
    speciesId: 'boletus-edulis',
  },
  {
    title: 'Uważne spojrzenie',
    subtitle: 'Podgrzybek · trzon · otoczenie',
    speciesId: 'imleria-badia',
  },
  {
    title: 'Nie każda kurka to kurka',
    subtitle: 'Pieprznik · listewki · sobowtór',
    speciesId: 'cantharellus-cibarius',
  },
  {
    title: 'Liczą się szczegóły',
    subtitle: 'Kania · łuski · porównanie',
    speciesId: 'macrolepiota-procera',
  },
  {
    title: 'Świadomy obserwator',
    subtitle: 'Pieczarka · blaszki · utrwalenie',
    speciesId: 'agaricus-campestris',
  },
] satisfies { title: string; subtitle: string; speciesId: SpeciesId }[];
export const STEPS_PER_STAGE = 10;
export const COURSE_LENGTH = COURSE_STAGES.length * STEPS_PER_STAGE;
const steps = [
  { title: 'Poznaj grzyba', icon: 'book', kind: 'quiz' },
  { title: 'Znaki szczególne', icon: 'mushrooms', kind: 'observe' },
  { title: 'Pod kapeluszem', icon: 'search', kind: 'underside' },
  { title: 'Rozpoznaj zdjęcie', icon: 'camera', kind: 'identify' },
  { title: 'Znajdź różnicę', icon: 'compare', kind: 'lookalikes' },
  { title: 'Kiedy rośnie?', icon: 'calendar', kind: 'season' },
  { title: 'Gdzie szukać?', icon: 'pin', kind: 'habitat' },
  { title: 'Twoje znalezisko', icon: 'camera', kind: 'photo' },
  { title: 'Połącz wskazówki', icon: 'refresh', kind: 'quiz' },
  { title: 'Sprawdź się', icon: 'trophy', kind: 'checkpoint' },
] as const;
export function courseStep(id: number, month = new Date().getMonth() + 1) {
  if (!Number.isInteger(id) || id < 0 || id >= COURSE_LENGTH) return null;
  const stage = Math.floor(id / STEPS_PER_STAGE);
  const position = id % STEPS_PER_STAGE;
  const base = steps[position];
  const species = getSpecies(COURSE_STAGES[stage].speciesId);
  const photoSeason = species.months.some((value) => value === month);
  return {
    ...base,
    id,
    stage,
    position,
    species,
    photoSeason,
    title: base.kind === 'photo' && !photoSeason ? 'Ćwicz ze zdjęciem' : base.title,
    kind: base.kind === 'photo' && !photoSeason ? ('identify' as const) : base.kind,
  };
}
export type CourseStep = NonNullable<ReturnType<typeof courseStep>>;
export function courseUnits(step: CourseStep): CourseUnit[] {
  const units = speciesUnits(step.species);
  const compare = comparisonUnit(step.species);
  if (step.kind === 'checkpoint')
    return [units.identity, units.feature, compare, units.season, units.habitat];
  if (step.position === 8) return [units.underside, compare, units.habitat];
  if (step.position === 0) return [units.identity, units.underside];
  switch (step.kind) {
    case 'observe':
      return [units.feature];
    case 'underside':
      return [units.underside];
    case 'lookalikes':
      return [compare];
    case 'season':
      return [units.season];
    case 'habitat':
      return [units.habitat];
    default:
      return [units.identity];
  }
}
export function courseQuestions(step: CourseStep) {
  return courseUnits(step).map((unit) => ({
    ...unit.question,
    options: shuffled(unit.question.options),
  }));
}
function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
