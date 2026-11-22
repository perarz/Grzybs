import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { PressableScale } from '@/components/PressableScale';
import type { Coordinate } from '@/features/navigation/geo';
import { useWeatherForecast } from '@/features/weather/useWeatherForecast';
import { weatherPeriods } from '@/features/weather/weather';
import { durations, layout, radius, spacing } from '@/theme';
import { fieldPanel as ink } from '@/theme/field';
import { MushroomIndex } from './MushroomIndex';
import { WeatherDetails } from './WeatherDetails';

type Props = { point: Coordinate | null; locationLabel: string };
export function WeatherSection({ point, locationLabel }: Props) {
  const w = useWeatherForecast(point);
  const [expanded, setExpanded] = useState(false);
  const busy = w.loadingCache || w.refreshing;
  const rows = w.forecast ? weatherPeriods(w.forecast, w.now) : [];
  const present = rows.some(
    (r) => r.temperature !== null || r.wind !== null || r.precipitation !== null,
  );
  const temp = rows[0]?.temperature;
  const summary = temp != null ? Math.round(temp) + '°' : 'Pogoda';
  const subtitle =
    w.stale && present
      ? 'Starsze dane'
      : present
        ? locationLabel
        : !point
          ? 'Brak lokalizacji'
          : busy
            ? 'Pobieranie…'
            : 'Brak prognozy';
  return (
    <View pointerEvents="box-none" style={styles.group}>
      <View pointerEvents="box-none" style={styles.topRow}>
        <View style={styles.panel}>
          <View style={styles.head}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={'Pogoda, ' + summary + ', ' + subtitle}
              accessibilityState={{ expanded }}
              onPress={() => setExpanded(!expanded)}
              style={styles.toggle}
            >
              <FieldIcon name="temperature" size={21} color={ink.accent} />
              <View style={styles.summary}>
                <AppText variant="heading" style={styles.text}>
                  {summary}
                </AppText>
              </View>
              <Animated.View
                style={{
                  transform: [{ rotate: expanded ? '180deg' : '0deg' }],
                  transitionProperty: 'transform',
                  transitionDuration: durations.fast,
                }}
              >
                <FieldIcon name="chevron" size={16} color={ink.muted} />
              </Animated.View>
            </PressableScale>
          </View>
        </View>
        <MushroomIndex forecast={w.forecast} now={w.now} stale={w.stale} />
      </View>
      {expanded && (
        <WeatherDetails
          rows={rows}
          present={present}
          stale={w.stale}
          point={point}
          busy={busy}
          error={w.error}
          cacheWarning={w.cacheWarning}
          onRefresh={() => void w.refresh()}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  group: { alignItems: 'flex-start', gap: spacing.xs, maxWidth: '100%' },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, maxWidth: '100%' },
  panel: {
    maxWidth: '100%',
    backgroundColor: ink.background,
    borderRadius: radius.lg,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingVertical: spacing.xs,
    flexShrink: 1,
    elevation: 3,
  },
  head: { flexDirection: 'row', alignItems: 'center' },
  toggle: {
    minHeight: layout.touchTarget,
    flexShrink: 1,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  summary: { flexShrink: 1, paddingVertical: spacing.xs },
  text: { color: ink.text },
});
