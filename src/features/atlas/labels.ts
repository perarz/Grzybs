import type { CapColor, Edibility, Habitat, Month, Rarity, Underside } from './types';

export const EDIBILITY_LABELS: Record<Edibility, string> = {
  edible: 'Jadalny',
  inedible: 'Niejadalny',
  poisonous: 'Trujący',
  deadly: 'Śmiertelnie trujący',
};

/** Plural forms for the category chips – "show me the edible ones". */
export const EDIBILITY_CATEGORY_LABELS: Record<Edibility, string> = {
  edible: 'Jadalne',
  inedible: 'Niejadalne',
  poisonous: 'Trujące',
  deadly: 'Śmiertelnie trujące',
};

export const CAP_COLOR_LABELS: Record<CapColor, string> = {
  white: 'Biały',
  yellow: 'Żółty',
  orange: 'Pomarańczowy',
  red: 'Czerwony',
  pink: 'Różowy',
  brown: 'Brązowy',
  green: 'Zielonkawy',
};

export const UNDERSIDE_LABELS: Record<Underside, string> = {
  gills: 'Blaszki',
  pores: 'Rurki',
  ridges: 'Listewki',
  none: 'Brak',
};

export const HABITAT_LABELS: Record<Habitat, string> = {
  deciduous: 'Las liściasty',
  coniferous: 'Las iglasty',
  meadow: 'Łąka',
  deadWood: 'Martwe drewno',
};

/** Follows "Występowanie:" on the species screen, hence the neuter form. */
export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'częste',
  rare: 'rzadkie',
};

export const MONTH_NAMES: Record<Month, string> = {
  1: 'styczeń',
  2: 'luty',
  3: 'marzec',
  4: 'kwiecień',
  5: 'maj',
  6: 'czerwiec',
  7: 'lipiec',
  8: 'sierpień',
  9: 'wrzesień',
  10: 'październik',
  11: 'listopad',
  12: 'grudzień',
};

/** Roman numerals are the traditional Polish shorthand for months (e.g. 1 XI). */
export const MONTH_NUMERALS: Record<Month, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
  9: 'IX',
  10: 'X',
  11: 'XI',
  12: 'XII',
};

/** Turns a label map into chip options, keeping the order in which the labels are written. */
export function toOptions<T extends string>(labels: Record<T, string>) {
  // Object.keys always returns string[]; the Record type guarantees the keys are T.
  const values = Object.keys(labels) as T[];
  return values.map((value) => ({ value, label: labels[value] }));
}
