import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { CloseIcon } from '@/components/icons/UiIcons';
import { PressableScale } from '@/components/PressableScale';
import { mushroomIndex } from '@/features/weather/mushroomIndex';
import type { WeatherForecast } from '@/features/weather/types';
import { layout, palette, radius, spacing } from '@/theme';
import { fieldPanel as ink } from '@/theme/field';
import { MushroomAlertControl } from './MushroomAlertControl';

type Props = {
  visible: boolean;
  onClose: () => void;
  score: number;
  color: string;
  rating: string;
  index: ReturnType<typeof mushroomIndex>;
  forecast: WeatherForecast | null;
  stale: boolean;
};

function Scale({ score, color }: { score: number; color: string }) {
  return (
    <View accessible={false} style={styles.track}>
      {Array.from({ length: 10 }, (_, i) => (
        <View key={i} style={[styles.segment, { backgroundColor: i < score ? color : ink.rule }]} />
      ))}
    </View>
  );
}

/** Explains how the mushroom index is calculated and hosts the alert switch. */
export function MushroomIndexDialog({
  visible,
  onClose,
  score,
  color,
  rating,
  index,
  forecast,
  stale,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable accessible={false} onPress={onClose} style={StyleSheet.absoluteFill} />
        <View accessibilityViewIsModal style={[styles.dialog, { borderTopColor: color }]}>
          <View style={styles.dialogHeader}>
            <AppText accessibilityRole="header" variant="title" style={styles.heading}>
              Na grzyby
            </AppText>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Zamknij wyjaśnienie"
              onPress={onClose}
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
              Ocena zależy głównie od ilości i regularności opadów z ostatnich 7 dni. Uwzględnia też
              temperaturę, a w Polsce sezon gatunków z atlasu.
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
            {visible && (
              <View style={styles.alerts}>
                <MushroomAlertControl forecast={forecast} />
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  alerts: {
    borderTopColor: ink.rule,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.sm,
  },
  iconButton: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: { flexDirection: 'row', gap: spacing.xs },
  segment: { flex: 1, height: spacing.xs, borderRadius: radius.xs },
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
