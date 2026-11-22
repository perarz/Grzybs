import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { PressableScale } from '@/components/PressableScale';
import type { Coordinate } from '@/features/navigation/geo';
import type { WeatherPeriod } from '@/features/weather/weather';
import { durations, layout, radius, spacing } from '@/theme';
import { fieldPanel as ink } from '@/theme/field';
import { WeatherAttribution } from './WeatherAttribution';
import { WeatherTable } from './WeatherTable';

type Props = {
  rows: WeatherPeriod[];
  present: boolean;
  stale: boolean;
  point: Coordinate | null;
  busy: boolean;
  error: string | null;
  cacheWarning: string | null;
  onRefresh: () => void;
};

/** The expanded forecast: table, source, refresh button and any problems. */
export function WeatherDetails({
  rows,
  present,
  stale,
  point,
  busy,
  error,
  cacheWarning,
  onRefresh,
}: Props) {
  return (
    <Animated.View
      entering={FadeIn.duration(durations.fast).reduceMotion(ReduceMotion.System)}
      style={styles.body}
    >
      {stale && present && (
        <AppText variant="caption" style={styles.muted}>
          Starsze dane
        </AppText>
      )}
      {present && <WeatherTable rows={rows} />}
      <View style={styles.footer}>
        {present && <WeatherAttribution />}
        {point && (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Odśwież pogodę"
            accessibilityState={{ disabled: busy, busy }}
            disabled={busy}
            onPress={onRefresh}
            style={styles.refresh}
          >
            {busy ? (
              <ActivityIndicator size="small" color={ink.accent} />
            ) : (
              <FieldIcon name="refresh" size={17} color={ink.accent} />
            )}
          </PressableScale>
        )}
      </View>
      {error && (
        <AppText variant="caption" style={styles.muted} accessibilityRole="alert">
          Nie udało się odświeżyć prognozy.
        </AppText>
      )}
      {!present && !error && !busy && (
        <AppText variant="caption" style={styles.muted}>
          {point ? 'Brak danych godzinowych.' : 'Włącz GPS lub wybierz miejscówkę.'}
        </AppText>
      )}
      {cacheWarning && (
        <AppText variant="caption" style={styles.muted}>
          {cacheWarning}
        </AppText>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  refresh: {
    marginLeft: 'auto',
    minHeight: layout.touchTarget,
    width: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muted: { color: ink.muted },
  body: {
    width: 292,
    maxWidth: '100%',
    padding: spacing.sm,
    gap: spacing.sm,
    backgroundColor: ink.background,
    borderRadius: radius.lg,
    elevation: 3,
  },
});
