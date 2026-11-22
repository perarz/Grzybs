import type { Species } from '@/features/atlas/types';

import type { Random } from './exercises';

export function nameOf(species: Species) {
  return species.nameCommon ?? species.namePl;
}

export function shuffled<T>(items: readonly T[], random: Random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export function pick<T>(items: readonly T[], random: Random): T {
  return items[Math.floor(random() * items.length)];
}

export function lowerFirst(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

export function firstSentence(text: string) {
  const end = text.search(/[.!?](\s|$)/);
  return end === -1 ? text : text.slice(0, end + 1);
}
