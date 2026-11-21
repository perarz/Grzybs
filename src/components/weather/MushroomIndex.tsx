import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { checkMushroomAlert, updateAlertLocation } from '@/features/weather/mushroomAlerts';
import { MushroomAlertControl } from './MushroomAlertControl';
import { MushroomGauge } from './MushroomGauge';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { CloseIcon } from '@/components/icons/UiIcons';
import { PressableScale } from '@/components/PressableScale';
import { SPECIES } from '@/data/species';
import type { Month } from '@/features/atlas/types';
import { mushroomIndex } from '@/features/weather/mushroomIndex';
import type { WeatherForecast } from '@/features/weather/types';
import { layout, palette, radius, spacing } from '@/theme';
import { fieldPanel as ink } from '@/theme/field';

function Scale({ score, color }: { score: number; color: string }) {
  return (
    <View accessible={false} style={styles.track}>
      {Array.from({ length: 10 }, (_, i) => (
        <View key={i} style={[styles.segment, { backgroundColor: i < score ? color : ink.rule }]} />
      ))}
    </View>
  );
}
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
          <View style={styles.question}>
            <AppText variant="caption" color="text">
              ?
            </AppText>
          </View>
        </PressableScale>
      </View>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={close}
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <Pressable accessible={false} onPress={close} style={StyleSheet.absoluteFill} />
          <View accessibilityViewIsModal style={[styles.dialog, { borderTopColor: color }]}>
            <View style={styles.dialogHeader}>
              <AppText accessibilityRole="header" variant="title" style={styles.heading}>
                Na grzyby
              </AppText>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Zamknij wyjaśnienie"
                onPress={close}
                style={styles.iconButton}
              >
                <CloseIcon size={22} color={ink.text} />
              </PressableScale>
            </View>
            <ScrollView bounces={false} contentContainerStyle={styles.details}>
              <View style={styles.result}>
                <AppText variant="display" style={{ color }}>
                  {score || '—'}
                  {score > 0 && (
                    <AppText variant="heading" color="textMuted">
                      {' '}
                      / 10
                    </AppText>
                  )}
                </AppText>
                <AppText variant="bodyStrong" style={styles.heading}>
                  {rating}
                </AppText>
              </View>
              <Scale score={score} color={color} />
              <AppText>
                Ocena zależy głównie od ilości i regularności opadów z ostatnich 7 dni. Uwzględnia
                też temperaturę, a w Polsce sezon gatunków z atlasu.
              </AppText>
              {index ? (
                <AppText variant="caption" color="textMuted">
                  {stale ? 'Starsze dane' : 'Ostatnie 7 dni'} ·{' '}
                  {index.rain.toLocaleString('pl-PL', { maximumFractionDigits: 1 })} mm opadów ·
                  średnio {Math.round(index.mean)}°C
                </AppText>
              ) : (
                <AppText variant="caption" color="textMuted">
                  Do oceny potrzeba pełnego tygodnia danych.
                </AppText>
              )}
              <AppText variant="caption" color="textMuted">
                Wynik jest orientacyjny. Nawet 10/10 nie gwarantuje wysypu.
              </AppText>
              {open && <MushroomAlertControl forecast={forecast} />}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    width: 32,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: ink.muted,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: { flexDirection: 'row', gap: 3 },
  segment: { flex: 1, height: 4, borderRadius: 2 },
  overlay: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.dark.backdrop,
  },
  dialog: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '92%',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderTopWidth: 3,
    borderColor: ink.rule,
    backgroundColor: ink.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: ink.rule,
  },
  heading: { flex: 1 },
  details: { gap: spacing.md, paddingTop: spacing.sm },
  result: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
