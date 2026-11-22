import type { FieldRuleId } from '@/data/fieldRules';
import type { SpeciesId } from '@/features/atlas/types';

export type ChoiceOption = {
  id: string;
  label: string;
  /** Shown as a photo tile instead of text. */
  speciesId?: SpeciesId;
};

export type Exercise =
  | { kind: 'teach-species'; key: string; speciesId: SpeciesId }
  | { kind: 'teach-rule'; key: string; ruleId: FieldRuleId }
  | {
      kind: 'choice';
      key: string;
      prompt: string;
      /** A photo the question is about. */
      photo?: SpeciesId;
      /** list – text answers, photos – a 2 × 2 grid, pair – two big photos side by side. */
      layout: 'list' | 'photos' | 'pair';
      options: ChoiceOption[];
      correctId: string;
      explanation: string;
    };

export type Random = () => number;
