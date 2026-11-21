import { useEffect, useRef } from 'react';
import { AppState, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { warningHaptic } from '@/features/feedback/haptics';
import type { Daylight } from '@/features/navigation/daylight';
import { radius, spacing, useTheme } from '@/theme';

type Props = { daylight: Daylight; active: boolean; compact?: boolean; hasLocation: boolean };

export function DaylightStrip({ daylight, active, hasLocation, compact }: Props) {
  const { colors } = useTheme();
  const warned = useRef<string | null>(null);
  const warning = daylight.state === 'soon' || daylight.state === 'night';
  useEffect(() => {
    if (!active || !hasLocation || !warning || AppState.currentState !== 'active') return;
    const key = (daylight.sunset ?? new Date()).toLocaleDateString();
    if (warned.current === key) return;
    warned.current = key;
    warningHaptic();
  }, [active, hasLocation, warning, daylight.sunset]);
  const sunset = daylight.sunset?.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  });
  if (compact)
    return warning && hasLocation ? (
      <View pointerEvents="none" style={[styles.banner, { backgroundColor: colors.surface }]}>
        <AppText variant="caption" color="accent">
          {daylight.state === 'night'
            ? 'Słońce poniżej horyzontu'
            : `Zachód za ${daylight.minutesLeft} min`}
        </AppText>
      </View>
    ) : null;
  return (
    <View style={[styles.strip, { borderColor: warning ? colors.glow : colors.border }]}>
      <AppText variant="label" color="accent">
        {!hasLocation
          ? 'Światło w lesie'
          : daylight.state === 'night'
            ? 'Słońce poniżej horyzontu'
            : daylight.state === 'soon'
              ? 'Zaplanuj powrót'
              : sunset
                ? `Zachód słońca · ${sunset}`
                : 'Światło w lesie'}
      </AppText>
      <AppText variant="caption" color="textMuted">
        {!hasLocation
          ? 'Włącz GPS, aby sprawdzić czas zachodu w Twojej okolicy.'
          : daylight.state === 'night'
            ? 'Jest noc lub czas przed wschodem. W lesie widoczność może być bardzo ograniczona.'
            : daylight.minutesLeft !== null
              ? `Do zachodu około ${daylight.minutesLeft} min.`
              : 'Nie można teraz podać godziny zachodu dla tej lokalizacji.'}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  banner: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  strip: { borderLeftWidth: spacing.xs, paddingLeft: spacing.md, gap: spacing.sm },
});
