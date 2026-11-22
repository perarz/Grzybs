import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { checkMushroomAlert, updateAlertLocation } from '@/features/weather/alerts';
import { MushroomIndexDialog } from './MushroomIndexDialog';
import { MushroomGauge } from './MushroomGauge';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { PressableScale } from '@/components/PressableScale';
import { SPECIES } from '@/data/species';
import type { Month } from '@/features/atlas/types';
import { mushroomIndex } from '@/features/weather/mushroomIndex';
import type { WeatherForecast } from '@/features/weather/types';
import { layout, palette, radius, spacing } from '@/theme';
import { fieldPanel as ink } from '@/theme/field';

export function MushroomIndex({
  forecast,
  now,
  stale,
}: {
  forecast: WeatherForecast | null;
  now: number;
  stale: boolean;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!forecast || stale) return;
    void updateAlertLocation(forecast.point)
      .then(() => checkMushroomAlert(forecast))
      .catch(() => undefined);
  }, [forecast, stale]);
  const month = Number(forecast?.days[0]?.date.slice(5, 7)) as Month;
  const fraction = SPECIES.filter((s) => s.months.includes(month)).length / SPECIES.length;
  const index = mushroomIndex(forecast, now, fraction);
  const score = index?.score ?? 0;
  const color = !score
    ? ink.muted
    : score <= 3
      ? palette.dark.glow
      : score <= 6
        ? palette.dark.sun
        : palette.dark.season;
  const rating = !score
    ? 'Brak danych'
    : score <= 3
      ? 'Słabe warunki'
      : score <= 6
        ? 'Umiarkowane warunki'
        : 'Sprzyjające warunki';
  const close = () => setOpen(false);
  return (
    <>
      <View style={styles.panel}>
        <View
          accessible
          accessibilityLabel={`Na grzyby: ${score ? score + ' na 10' : 'brak danych'}${score && stale ? ', starsze dane' : ''}`}
          style={styles.line}
        >
          <View>
            <FieldIcon name="mushrooms" size={23} color={ink.accent} />
            {!!score && stale && <View style={styles.staleDot} />}
          </View>
          <MushroomGauge score={score} color={color} />
        </View>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Jak działa ocena warunków na grzyby?"
          onPress={() => setOpen(true)}
          hitSlop={{ top: 4, bottom: 4, right: 4 }}
          style={styles.helpButton}
        >
          <FieldIcon name="help" size={layout.icon} color={ink.muted} />
        </PressableScale>
      </View>
      <MushroomIndexDialog
        visible={open}
        onClose={close}
        score={score}
        color={color}
        rating={rating}
        index={index}
        forecast={forecast}
        stale={stale}
      />
    </>
  );
}
const styles = StyleSheet.create({
  panel: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ink.background,
    borderColor: ink.rule,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingVertical: spacing.xs,

    elevation: 3,
  },
  line: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  staleDot: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 5,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: palette.dark.glow,
  },
  helpButton: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
