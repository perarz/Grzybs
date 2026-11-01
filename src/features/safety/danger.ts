import type { Edibility } from '@/features/atlas/types';

export function isDangerous(edibility: Edibility): boolean {
  return edibility === 'poisonous' || edibility === 'deadly';
}
