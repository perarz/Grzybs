import type { SpeciesFilter } from './filterSpecies';
import { CAP_COLOR_LABELS, HABITAT_LABELS, UNDERSIDE_LABELS } from './labels';

/** The questions of the identification key, in the order a picker checks a mushroom in hand. */
export const KEY_STEPS = [
  'underside',
  'capColor',
  'ring',
  'volva',
  'colorChange',
  'habitat',
] as const;

export type KeyStep = (typeof KEY_STEPS)[number];

export const KEY_QUESTIONS: Record<KeyStep, { question: string; hint: string }> = {
  underside: {
    question: 'Co jest pod kapeluszem?',
    hint: 'Odwróć grzyb i spójrz od spodu.',
  },
  capColor: {
    question: 'Jaki kolor ma kapelusz?',
    hint: 'Wybierz najbliższy – barwa zmienia się z wiekiem i pogodą.',
  },
  ring: {
    question: 'Czy na trzonie jest pierścień?',
    hint: 'Błoniasta „spódniczka” tuż pod kapeluszem.',
  },
  volva: {
    question: 'Czy u nasady jest pochwa?',
    hint: 'Ostrożnie odkop podstawę trzonu. Błoniasty woreczek to znak muchomorów.',
  },
  colorChange: {
    question: 'Czy miąższ zmienia barwę?',
    hint: 'Przekrój albo naciśnij – czy sinieje, żółknie lub czerwienieje?',
  },
  habitat: {
    question: 'Gdzie rośnie?',
    hint: 'Najbliższe drzewa mówią o grzybie bardzo dużo.',
  },
};

/** A short name of an answered question, e.g. "Blaszki" or "Pierścień: jest" – null when unanswered. */
export function describeAnswer(filter: SpeciesFilter, step: KeyStep): string | null {
  switch (step) {
    case 'underside':
      return filter.underside ? UNDERSIDE_LABELS[filter.underside] : null;
    case 'capColor':
      return filter.capColor ? `Kapelusz ${CAP_COLOR_LABELS[filter.capColor].toLowerCase()}` : null;
    case 'ring':
      return filter.ring === null ? null : `Pierścień: ${filter.ring ? 'jest' : 'brak'}`;
    case 'volva':
      return filter.volva === null ? null : `Pochwa: ${filter.volva ? 'jest' : 'brak'}`;
    case 'colorChange':
      return filter.colorChange === null
        ? null
        : `Zmienia barwę: ${filter.colorChange ? 'tak' : 'nie'}`;
    case 'habitat':
      return filter.habitat ? HABITAT_LABELS[filter.habitat] : null;
  }
}

export function clearAnswer(filter: SpeciesFilter, step: KeyStep): SpeciesFilter {
  return { ...filter, [step]: null };
}

/** E.g. 1 gatunek, 3 gatunki, 12 gatunków, 22 gatunki – Polish plurals depend on the last digits. */
export function formatSpeciesCount(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  if (count === 1) return '1 gatunek';
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return `${count} gatunki`;
  }
  return `${count} gatunków`;
}
