import { SPECIES } from '@/data/species';
import { HABITAT_LABELS, MONTH_NAMES, UNDERSIDE_LABELS } from '@/features/atlas/labels';
import type { Species, SpeciesId } from '@/features/atlas/types';
import type { LearningQuestion } from './learning';

export type CourseUnit = {
  id: string;
  title: string;
  speciesIds: SpeciesId[];
  facts: { label: string; text: string }[];
  visual: 'photo' | 'underside' | 'comparison' | 'season' | 'habitat';
  question: LearningQuestion;
};
export function speciesUnits(s: Species): Record<string, CourseUnit> {
  const name = s.nameCommon ?? s.namePl;
  const base = { speciesIds: [s.id] };
  const feature = s.keyFeatures[0];
  const month = s.months[0];
  const season = s.months.map((m) => MONTH_NAMES[m]).join(' · ');
  const habitat = s.habitats.map((h) => HABITAT_LABELS[h]).join(' · ');
  function unit(
    key: string,
    title: string,
    visual: CourseUnit['visual'],
    facts: CourseUnit['facts'],
    question: Omit<LearningQuestion, 'id' | 'speciesIds'>,
  ): CourseUnit {
    return {
      ...base,
      id: `${s.id}:${key}`,
      title,
      visual,
      facts,
      question: { ...base, id: `${s.id}:${key}`, ...question },
    };
  }
  return {
    identity: unit(
      'identity',
      name,
      'photo',
      [
        { label: 'Zapamiętaj', text: feature },
        { label: 'Przyjrzyj się', text: s.keyFeatures[1] },
      ],
      {
        prompt: 'Który gatunek poznaliśmy na zdjęciu?',
        options: [s, ...SPECIES.filter((other) => other.id !== s.id).slice(0, 3)].map((other) => ({
          id: other.id,
          label: other.nameCommon ?? other.namePl,
        })),
        correctOptionId: s.id,
        explanation: `${s.namePl}. ${feature}`,
      },
    ),
    feature: unit(
      'feature',
      'Spójrz na trzon',
      'photo',
      [
        {
          label: name,
          text: s.features.ring ? 'Ma pierścień na trzonie.' : 'Nie ma pierścienia na trzonie.',
        },
        { label: 'Z atlasu', text: feature },
      ],
      {
        prompt: `Czy ${name} ma pierścień na trzonie?`,
        options: [
          { id: 'present', label: 'Ma pierścień' },
          { id: 'absent', label: 'Nie ma pierścienia' },
        ],
        correctOptionId: s.features.ring ? 'present' : 'absent',
        explanation: `${name}: ${s.features.ring ? 'ma pierścień' : 'nie ma pierścienia'} na trzonie.`,
      },
    ),
    underside: unit(
      'underside',
      'Zajrzyj pod kapelusz',
      'underside',
      [
        {
          label: name,
          text: `Pod kapeluszem: ${UNDERSIDE_LABELS[s.features.underside].toLocaleLowerCase('pl-PL')}.`,
        },
        { label: 'Zapamiętaj', text: 'Sam typ spodu nie przesądza o jadalności.' },
      ],
      {
        prompt: `Co ma pod kapeluszem ${name}?`,
        options: Object.entries(UNDERSIDE_LABELS)
          .filter(([id]) => id !== 'none')
          .map(([id, label]) => ({ id, label })),
        correctOptionId: s.features.underside,
        explanation: `${name}: ${UNDERSIDE_LABELS[s.features.underside]}.`,
      },
    ),
    season: unit(
      'season',
      'Kiedy go spotkasz?',
      'season',
      [
        { label: name, text: season },
        {
          label: 'W terenie',
          text: 'To sezon z atlasu. Termin pojawienia się grzybów zależy też od pogody.',
        },
      ],
      {
        prompt: `Który miesiąc należy do sezonu gatunku „${name}”?`,
        options: [
          month,
          ...Array.from({ length: 12 }, (_, i) => i + 1)
            .filter((m) => !s.months.some((value) => value === m))
            .slice(0, 3),
        ].map((m) => ({ id: String(m), label: MONTH_NAMES[m as keyof typeof MONTH_NAMES] })),
        correctOptionId: String(month),
        explanation: season,
      },
    ),
    habitat: unit(
      'habitat',
      'W jakim otoczeniu rośnie?',
      'habitat',
      [
        { label: name, text: habitat },
        { label: 'Wskazówka z atlasu', text: s.description },
      ],
      {
        prompt: `Gdzie według atlasu rośnie ${name}?`,
        options: Object.entries(HABITAT_LABELS)
          .filter(([id]) => id === s.habitats[0] || !s.habitats.some((h) => h === id))
          .map(([id, label]) => ({ id, label })),
        correctOptionId: s.habitats[0],
        explanation: habitat,
      },
    ),
  };
}
