import { getSpecies, SPECIES } from '@/data/species';
import { HABITAT_LABELS } from '@/features/atlas/labels';
import type { Habitat, Species, SpeciesId } from '@/features/atlas/types';

import type { Exercise, Random } from './exercises';
import { firstSentence, lowerFirst, nameOf, shuffled } from './exerciseHelpers';

export function teachSpecies(speciesId: SpeciesId): Exercise {
  return { kind: 'teach-species', key: `teach:${speciesId}`, speciesId };
}

export function nameFromPhoto(speciesId: SpeciesId, random: Random): Exercise {
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

export function photoFromName(speciesId: SpeciesId, random: Random): Exercise {
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

export function basket(speciesId: SpeciesId): Exercise {
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

export function whereToLook(speciesId: SpeciesId, random: Random): Exercise | null {
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
