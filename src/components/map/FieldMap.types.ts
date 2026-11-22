import type { Find } from '@/features/collection/storage';
import type { Coordinate, Spot, CarLocation } from '@/features/spots/storage';

export type FieldMapProps = {
  spots: Spot[];
  car: CarLocation | null;
  position: Coordinate | null;
  focus: Coordinate | null;
  focusDelta?: number;
  onCenteredChange?: (centered: boolean) => void;
  onPick?: (point: Coordinate) => void;
  onLongPress: (point: Coordinate) => void;
  onSpot: (spot: Spot) => void;
  /** Finds saved with a place; a tap on one opens its photo. */
  finds?: Find[];
  onFind?: (find: Find) => void;
};
