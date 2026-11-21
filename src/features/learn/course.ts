import type { FieldIconName } from '@/components/icons/FieldIcon';
import type { FieldRuleId } from '@/data/fieldRules';
import type { SpeciesId } from '@/features/atlas/types';

type LessonPlan = {
  title: string;
  icon: FieldIconName;
  /** Species met for the first time in this lesson. */
  newSpecies: SpeciesId[];
  rule?: FieldRuleId;
};

type StagePlan = {
  title: string;
  subtitle: string;
  lessons: [LessonPlan, LessonPlan, LessonPlan, LessonPlan];
};

// Five stages, each a little of everything: a few species around one theme, their dangerous
// lookalikes and the practical rules a picker needs at that point. Every stage ends with a test.
export const COURSE_STAGES: StagePlan[] = [
  {
    title: 'Pierwszy koszyk',
    subtitle: 'Grzyby z gąbką · koszyk · pewniaki',
    lessons: [
      {
        title: 'Prawdziwek i podgrzybek',
        icon: 'book',
        newSpecies: ['boletus-edulis', 'imleria-badia'],
        rule: 'sure',
      },
      {
        title: 'Kozak i maślak',
        icon: 'mushrooms',
        newSpecies: ['leccinum-scabrum', 'suillus-luteus'],
        rule: 'pores',
      },
      {
        title: 'Gorzki sobowtór',
        icon: 'compare',
        newSpecies: ['tylopilus-felleus'],
        rule: 'basket',
      },
      { title: 'Jak zbierać', icon: 'refresh', newSpecies: [], rule: 'twist' },
    ],
  },
  {
    title: 'Kurki i kępy',
    subtitle: 'Kurka · rydz · opieńka i ich sobowtóry',
    lessons: [
      {
        title: 'Prawdziwa kurka',
        icon: 'mushrooms',
        newSpecies: ['cantharellus-cibarius', 'hygrophoropsis-aurantiaca'],
        rule: 'small',
      },
      {
        title: 'Rydz czy wełnianka?',
        icon: 'compare',
        newSpecies: ['lactarius-deliciosus', 'lactarius-torminosus'],
        rule: 'taste',
      },
      {
        title: 'Grzyby w kępach',
        icon: 'search',
        newSpecies: ['armillaria-mellea', 'hypholoma-fasciculare'],
      },
      { title: 'Gdy nie masz pewności', icon: 'info', newSpecies: [], rule: 'sanepid' },
    ],
  },
  {
    title: 'Kania i muchomory',
    subtitle: 'Najgroźniejsza pomyłka w polskim lesie',
    lessons: [
      {
        title: 'Kania i sromotnikowy',
        icon: 'compare',
        newSpecies: ['macrolepiota-procera', 'amanita-phalloides'],
      },
      {
        title: 'Zielony kapelusz',
        icon: 'search',
        newSpecies: ['russula-virescens', 'amanita-pantherina'],
        rule: 'poisoning',
      },
      { title: 'Muchomory', icon: 'mushrooms', newSpecies: ['amanita-muscaria', 'amanita-virosa'] },
      { title: 'Zanim zjesz', icon: 'info', newSpecies: [], rule: 'children' },
    ],
  },
  {
    title: 'Łąka i polana',
    subtitle: 'Pieczarki · purchawki · krowiak',
    lessons: [
      {
        title: 'Pieczarka z łąki',
        icon: 'search',
        newSpecies: ['agaricus-campestris', 'agaricus-xanthodermus'],
      },
      {
        title: 'Purchawka czy tęgoskór?',
        icon: 'compare',
        newSpecies: ['lycoperdon-perlatum', 'scleroderma-citrinum'],
      },
      {
        title: 'Koźlarz i krowiak',
        icon: 'mushrooms',
        newSpecies: ['leccinum-aurantiacum', 'paxillus-involutus'],
      },
      { title: 'Powtórka z łąki', icon: 'refresh', newSpecies: [] },
    ],
  },
  {
    title: 'Wiosna i pułapki',
    subtitle: 'Smardz · piestrzenica · hełmówka · zakazy',
    lessons: [
      {
        title: 'Wiosenne grzyby',
        icon: 'calendar',
        newSpecies: ['morchella-esculenta', 'gyromitra-esculenta'],
      },
      { title: 'Hełmówka przy opieńce', icon: 'compare', newSpecies: ['galerina-marginata'] },
      { title: 'Gdzie nie wchodzić', icon: 'lock', newSpecies: [], rule: 'closed' },
      { title: 'Wielka powtórka', icon: 'refresh', newSpecies: [] },
    ],
  },
];

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
