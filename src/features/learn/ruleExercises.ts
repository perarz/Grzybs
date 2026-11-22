import { FIELD_RULES, type FieldRuleId } from '@/data/fieldRules';

import type { Exercise, Random } from './exercises';
import { shuffled } from './exerciseHelpers';

export function teachRule(ruleId: FieldRuleId): Exercise {
  return { kind: 'teach-rule', key: `rule:${ruleId}`, ruleId };
}

export function situation(ruleId: FieldRuleId, random: Random): Exercise {
  const { situation: question } = FIELD_RULES[ruleId];
  return {
    kind: 'choice',
    key: `situation:${ruleId}`,
    prompt: question.prompt,
    layout: 'list',
    options: shuffled(question.options, random),
    correctId: question.correctId,
    explanation: question.explanation,
  };
}
