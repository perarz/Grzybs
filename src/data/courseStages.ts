import type { FieldIconName } from '@/components/icons/FieldIcon';
import type { FieldRuleId } from '@/data/fieldRules';
import type { SpeciesId } from '@/features/atlas/types';

export type LessonPlan = {
  title: string;
  icon: FieldIconName;
  /** Species met for the first time in this lesson. */
  newSpecies: SpeciesId[];
  rule?: FieldRuleId;
};

export type StagePlan = {
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
