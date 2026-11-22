import type { FieldIconName } from '@/components/icons/FieldIcon';
import { COURSE_STAGES, type LessonPlan } from '@/data/courseStages';
import type { FieldRuleId } from '@/data/fieldRules';
import type { SpeciesId } from '@/features/atlas/types';

export const LESSONS_PER_STAGE = 5;
export const COURSE_LENGTH = COURSE_STAGES.length * LESSONS_PER_STAGE;
const TEST_POSITION = LESSONS_PER_STAGE - 1;

export type CourseLesson = {
  id: number;
  stage: number;
  position: number;
  title: string;
  icon: FieldIconName;
  isTest: boolean;
  /** The last test checks the whole course, not just its stage. */
  isFinal: boolean;
  newSpecies: SpeciesId[];
  rule?: FieldRuleId;
  /** Species from this stage met before this lesson – used for review questions. */
  stageSpecies: SpeciesId[];
  /** Every species met in the course before this lesson. */
  knownSpecies: SpeciesId[];
  /** Rules taught before or in this lesson. */
  knownRules: FieldRuleId[];
  /** Rules taught in this lesson's stage – a stage test checks these. */
  stageRules: FieldRuleId[];
};

export function courseLesson(id: number): CourseLesson | null {
  if (!Number.isInteger(id) || id < 0 || id >= COURSE_LENGTH) return null;
  const stage = Math.floor(id / LESSONS_PER_STAGE);
  const position = id % LESSONS_PER_STAGE;
  const isTest = position === TEST_POSITION;
  const plan = isTest ? null : COURSE_STAGES[stage].lessons[position];
  const earlier = lessonsBefore(stage, isTest ? TEST_POSITION : position);
  const stageSpecies = COURSE_STAGES[stage].lessons
    .slice(0, isTest ? TEST_POSITION : position)
    .flatMap((lesson) => lesson.newSpecies);
  return {
    id,
    stage,
    position,
    title: isTest
      ? stage === COURSE_STAGES.length - 1
        ? 'Egzamin grzybiarza'
        : 'Test etapu'
      : plan!.title,
    icon: isTest ? 'trophy' : plan!.icon,
    isTest,
    isFinal: isTest && stage === COURSE_STAGES.length - 1,
    newSpecies: plan?.newSpecies ?? [],
    rule: plan?.rule,
    stageSpecies,
    knownSpecies: earlier.flatMap((lesson) => lesson.newSpecies),
    knownRules: [...earlier, ...(plan ? [plan] : [])].flatMap((lesson) =>
      lesson.rule ? [lesson.rule] : [],
    ),
    stageRules: COURSE_STAGES[stage].lessons.flatMap((lesson) =>
      lesson.rule ? [lesson.rule] : [],
    ),
  };
}

function lessonsBefore(stage: number, position: number): LessonPlan[] {
  return COURSE_STAGES.flatMap((plan, index) =>
    index < stage ? plan.lessons : index === stage ? plan.lessons.slice(0, position) : [],
  );
}
