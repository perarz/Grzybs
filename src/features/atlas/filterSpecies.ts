import type { CapColor, Edibility, Habitat, Month, Species, Underside } from './types';

/** null means "any" – the filter doesn't care about that feature. */
export type SpeciesFilter = {
  query: string;
  edibility: Edibility | null;
  underside: Underside | null;
  capColor: CapColor | null;
  ring: boolean | null;
  volva: boolean | null;
  colorChange: boolean | null;
  habitat: Habitat | null;
  inSeasonOnly: boolean;
};

export const EMPTY_FILTER: SpeciesFilter = {
  query: '',
  edibility: null,
  underside: null,
  capColor: null,
  ring: null,
  volva: null,
  colorChange: null,
  habitat: null,
  inSeasonOnly: false,
};

export function filterSpecies(
  species: Species[],
  filter: SpeciesFilter,
  currentMonth: Month,
): Species[] {
  const query = normalizeForSearch(filter.query.trim());

  return species.filter(
    (item) =>
      matchesQuery(item, query) &&
      matchesOption(filter.edibility, item.edibility) &&
      matchesOption(filter.underside, item.features.underside) &&
      matchesOption(filter.ring, item.features.ring) &&
      matchesOption(filter.volva, item.features.volva) &&
      matchesOption(filter.colorChange, item.features.colorChange) &&
      (filter.capColor === null || item.features.capColors.includes(filter.capColor)) &&
      (filter.habitat === null || item.habitats.includes(filter.habitat)) &&
      (!filter.inSeasonOnly || item.months.includes(currentMonth)),
  );
}

/** How many questions of the identification key are answered. */
export function countFeatureFilters(filter: SpeciesFilter): number {
  const answers = [
    filter.underside,
    filter.capColor,
    filter.ring,
    filter.volva,
    filter.colorChange,
    filter.habitat,
  ];
  return answers.filter((answer) => answer !== null).length;
}

/** Clears the key's answers but keeps the search, the category and the season switch. */
export function clearFeatureFilters(filter: SpeciesFilter): SpeciesFilter {
  return {
    ...EMPTY_FILTER,
    query: filter.query,
    edibility: filter.edibility,
    inSeasonOnly: filter.inSeasonOnly,
  };
}

const PLAIN_LETTERS: Record<string, string> = {
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l',
  ń: 'n',
  ó: 'o',
  ś: 's',
  ź: 'z',
  ż: 'z',
};

/** Lowercase without Polish diacritics, so "kozlarz" finds "Koźlarz". */
export function normalizeForSearch(text: string): string {
  return text.toLowerCase().replace(/[ąćęłńóśźż]/g, (letter) => PLAIN_LETTERS[letter] ?? letter);
}

function matchesQuery(species: Species, normalizedQuery: string): boolean {
  if (normalizedQuery === '') return true;
  const names = [species.namePl, species.nameLatin, ...species.otherNames];
  return names.some((name) => normalizeForSearch(name).includes(normalizedQuery));
}

function matchesOption<T>(wanted: T | null, actual: T): boolean {
  return wanted === null || wanted === actual;
}
