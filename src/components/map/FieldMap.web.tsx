import { AppText } from '@/components/AppText';
import type { FieldMapProps } from './FieldMap.types';

export function FieldMap(_props: FieldMapProps) {
  return (
    <AppText color="textMuted">
      Interaktywna mapa jest dostępna w aplikacji na telefonie. Zapisane punkty i współrzędne
      znajdziesz poniżej.
    </AppText>
  );
}
