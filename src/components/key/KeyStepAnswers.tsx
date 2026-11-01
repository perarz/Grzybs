import type { SpeciesFilter } from '@/features/atlas/filterSpecies';
import type { KeyStep } from '@/features/atlas/identificationKey';
import {
  CAP_COLOR_LABELS,
  HABITAT_LABELS,
  toOptions,
  UNDERSIDE_LABELS,
} from '@/features/atlas/labels';
import type { CapColor, Habitat, Underside } from '@/features/atlas/types';
import { CAP_SWATCHES } from '@/theme/swatches';

import {
  ColorChangeIllustration,
  NoColorChangeIllustration,
  NoRingIllustration,
  NoVolvaIllustration,
  RingIllustration,
  VolvaIllustration,
} from './StemIllustrations';
import {
  GillsIllustration,
  PoresIllustration,
  RidgesIllustration,
  SmoothIllustration,
} from './UndersideIllustrations';
import {
  ConiferousIllustration,
  DeadWoodIllustration,
  DeciduousIllustration,
  MeadowIllustration,
} from './HabitatIllustrations';
import { KeyOptions, type KeyOption } from './KeyOptions';

type KeyStepAnswersProps = {
  step: KeyStep;
  filter: SpeciesFilter;
  countMatches: (filter: SpeciesFilter) => number;
  onAnswer: (filter: SpeciesFilter) => void;
};

const UNDERSIDE_OPTIONS: KeyOption<Underside>[] = [
  { value: 'gills', label: UNDERSIDE_LABELS.gills, Illustration: GillsIllustration },
  { value: 'pores', label: UNDERSIDE_LABELS.pores, Illustration: PoresIllustration },
  { value: 'ridges', label: UNDERSIDE_LABELS.ridges, Illustration: RidgesIllustration },
  { value: 'none', label: 'Nic – gładki', Illustration: SmoothIllustration },
];
const CAP_COLOR_OPTIONS: KeyOption<CapColor>[] = toOptions(CAP_COLOR_LABELS).map((option) => ({
  ...option,
  swatch: CAP_SWATCHES[option.value],
}));
const RING_OPTIONS: KeyOption<boolean>[] = [
  { value: true, label: 'Jest', Illustration: RingIllustration },
  { value: false, label: 'Brak', Illustration: NoRingIllustration },
];
const VOLVA_OPTIONS: KeyOption<boolean>[] = [
  { value: true, label: 'Jest', Illustration: VolvaIllustration },
  { value: false, label: 'Brak', Illustration: NoVolvaIllustration },
];
const COLOR_CHANGE_OPTIONS: KeyOption<boolean>[] = [
  { value: true, label: 'Tak', Illustration: ColorChangeIllustration },
  { value: false, label: 'Nie', Illustration: NoColorChangeIllustration },
];
const HABITAT_OPTIONS: KeyOption<Habitat>[] = [
  { value: 'deciduous', label: HABITAT_LABELS.deciduous, Illustration: DeciduousIllustration },
  { value: 'coniferous', label: HABITAT_LABELS.coniferous, Illustration: ConiferousIllustration },
  { value: 'meadow', label: HABITAT_LABELS.meadow, Illustration: MeadowIllustration },
  { value: 'deadWood', label: HABITAT_LABELS.deadWood, Illustration: DeadWoodIllustration },
];

/** The answer tiles for one question – each question sets a different field of the filter. */
export function KeyStepAnswers({ step, filter, countMatches, onAnswer }: KeyStepAnswersProps) {
  switch (step) {
    case 'underside':
      return (
        <KeyOptions
          options={UNDERSIDE_OPTIONS}
          selected={filter.underside}
          countFor={(underside) => countMatches({ ...filter, underside })}
          onSelect={(underside) => onAnswer({ ...filter, underside })}
        />
      );
    case 'capColor':
      return (
        <KeyOptions
          options={CAP_COLOR_OPTIONS}
          selected={filter.capColor}
          countFor={(capColor) => countMatches({ ...filter, capColor })}
          onSelect={(capColor) => onAnswer({ ...filter, capColor })}
        />
      );
    case 'ring':
      return (
        <KeyOptions
          options={RING_OPTIONS}
          selected={filter.ring}
          countFor={(ring) => countMatches({ ...filter, ring })}
          onSelect={(ring) => onAnswer({ ...filter, ring })}
        />
      );
    case 'volva':
      return (
        <KeyOptions
          options={VOLVA_OPTIONS}
          selected={filter.volva}
          countFor={(volva) => countMatches({ ...filter, volva })}
          onSelect={(volva) => onAnswer({ ...filter, volva })}
        />
      );
    case 'colorChange':
      return (
        <KeyOptions
          options={COLOR_CHANGE_OPTIONS}
          selected={filter.colorChange}
          countFor={(colorChange) => countMatches({ ...filter, colorChange })}
          onSelect={(colorChange) => onAnswer({ ...filter, colorChange })}
        />
      );
    case 'habitat':
      return (
        <KeyOptions
          options={HABITAT_OPTIONS}
          selected={filter.habitat}
          countFor={(habitat) => countMatches({ ...filter, habitat })}
          onSelect={(habitat) => onAnswer({ ...filter, habitat })}
        />
      );
  }
}
