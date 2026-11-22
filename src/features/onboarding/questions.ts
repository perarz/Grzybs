import type { SpeciesId } from '@/features/atlas/types';
import type { FieldIconName } from '@/components/icons/FieldIcon';
export type Experience = 'new' | 'regular' | 'expert';
export const EXPERIENCES = [
  { id: 'new', title: 'Pierwszy koszyk', subtitle: 'Dopiero zaczynam', icon: 'mushrooms' },
  { id: 'regular', title: 'Znam swoje lasy', subtitle: 'Wracam co sezon', icon: 'pin' },
  { id: 'expert', title: 'Stary wyjadacz', subtitle: 'Miejscówki mam utajnione', icon: 'locate' },
] as const;
export type OnboardingQuestion = {
  icon: FieldIconName;
  title: string;
  answers: readonly string[];
  correct: number;
  fun?: true;
  format?: 'photo' | 'boolean' | 'scenario';
  photos?: readonly SpeciesId[];
};
const BEGINNER_QUESTIONS: readonly OnboardingQuestion[] = [
  {
    icon: 'mushrooms',
    format: 'photo',
    title: 'Która z nich to kurka?',
    answers: ['Zdjęcie A', 'Zdjęcie B'],
    photos: ['lactarius-deliciosus', 'cantharellus-cibarius'],
    correct: 1,
  },
  {
    icon: 'camera',
    format: 'boolean',
    title: 'Sam kapelusz wystarczy, żeby rozpoznać każdy grzyb.',
    answers: ['Prawda', 'Fałsz'],
    correct: 1,
  },
  {
    icon: 'pin',
    format: 'scenario',
    title: '15% baterii. Auto za lasem. Wracasz…',
    answers: [
      'Znanym szlakiem, nawet jeśli jest dłuższy',
      'Prosto za strzałką GPS, przez zarośla',
      'Dalej po grzyby — telefon jeszcze działa',
    ],
    correct: 0,
  },
  {
    icon: 'mushrooms',
    title: 'Pod kapeluszem jest „gąbka”. Co to takiego?',
    answers: ['Gęsto ułożone blaszki', 'Rurki zakończone porami', 'Warstwa grzybni'],
    correct: 1,
  },
];
export const QUESTIONS: readonly OnboardingQuestion[] = [
  {
    icon: 'places',
    title: 'W czym wracają zbiory?',
    answers: ['W przewiewnym koszyku', 'W reklamówce po bułkach', 'W kieszeniach. Wszystkich.'],
    correct: 0,
  },
  {
    icon: 'car',
    title: 'Auto zostało gdzieś za drzewami…',
    answers: [
      'Każde drzewo wygląda znajomo',
      'Zapisuję punkt przed wyjściem',
      'Liczę na pilota i szczęście',
    ],
    correct: 1,
  },
  {
    icon: 'mushrooms',
    title: 'Piękny okaz. Ale nie masz pewności.',
    answers: [
      'Ślimak jadł, więc można',
      'Zdjęcie wystarczy, żeby zjeść',
      'Nie zbieram do jedzenia',
    ],
    correct: 2,
  },
  {
    icon: 'pin',
    title: 'Koszyk pełny. Miejscówka?',
    answers: [
      'W lesie. Między drzewami.',
      'Wrzucam dokładny pin wszystkim',
      'Podaję współrzędne na głos',
    ],
    correct: 0,
    fun: true,
  },
  {
    icon: 'wind',
    title: 'Mech na pniu. Gdzie jest północ?',
    answers: [
      'Zawsze tam, gdzie mech',
      'Nie ustalam jej po samym mchu',
      'Tam, gdzie większy prawdziwek',
    ],
    correct: 1,
  },
  {
    icon: 'places',
    title: 'Jedna świetna miejscówka to…',
    answers: [
      'Gwarancja pełnego kosza co tydzień',
      'Powód, żeby nie sprawdzać pogody',
      'Szansa, nie obietnica wysypu',
    ],
    correct: 2,
  },
] as const;
export function onboardingQuestions(experience: Experience): readonly OnboardingQuestion[] {
  if (experience === 'new') return BEGINNER_QUESTIONS;
  return experience === 'expert' ? QUESTIONS : QUESTIONS.slice(0, 4);
}
export function onboardingScore(experience: Experience, answers: number[]) {
  const questions = onboardingQuestions(experience);
  return questions.reduce<number>(
    (score, q, i) => score + (!('fun' in q) && answers[i] === q.correct ? 1 : 0),
    0,
  );
}
