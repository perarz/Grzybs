import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { MONTH_NAMES } from '@/features/atlas/labels';
import type { Month } from '@/features/atlas/types';
import { calendarDay, type LearningJourney } from '@/features/learn/journey';
import { localDate, monthOf } from '@/features/learn/streakCalendar';
import { durations, layout, radius, spacing, useTheme } from '@/theme';
import { MonthGrid } from './MonthGrid';

const DIALOG_MAX_WIDTH = 360;

type Props = { journey: LearningJourney; onClose: () => void };

/** A small month calendar of the days with learning – opened from the streak counter. */
export function StreakCalendar({ journey, onClose }: Props) {
  const { colors } = useTheme();
  const [today] = useState(() => calendarDay(Date.now()));
  const [shown, setShown] = useState(() => monthOf(today));
  const first = monthOf(journey.firstDay ?? today);
  const current = monthOf(today);
  const index = (value: { year: number; month: number }) => value.year * 12 + value.month;
  const canGoBack = index(shown) > index(first);
  const canGoForward = index(shown) < index(current);
  const move = (step: number) => {
    const total = index(shown) + step;
    setShown({ year: Math.floor(total / 12), month: total % 12 });
  };
  const active = new Set(journey.activeDays);
  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(durations.fast)}
        style={[styles.backdrop, { backgroundColor: colors.backdrop }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zamknij kalendarz"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View
          entering={ZoomIn.duration(durations.fast)}
          accessibilityViewIsModal
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={styles.row}>
            <FieldIcon name="flame" size={spacing.xl} color={colors.glow} />
            <AppText variant="title" style={styles.grow}>
              {journey.streak} {journey.streak === 1 ? 'dzień' : 'dni'} passy
            </AppText>
          </View>
          <AppText variant="caption" color="textMuted">
            {journey.firstDay === null
              ? 'Ukończ lekcję, aby zacząć passę.'
              : `Pierwsza nauka: ${localDate(journey.firstDay).toLocaleDateString('pl-PL')} · najdłuższa passa: ${journey.bestStreak}`}
          </AppText>
          <View style={styles.row}>
            <MonthArrow
              icon="back"
              label="Poprzedni miesiąc"
              enabled={canGoBack}
              onPress={() => move(-1)}
            />
            <AppText variant="bodyStrong" style={[styles.grow, styles.center]}>
              {MONTH_NAMES[(shown.month + 1) as Month]} {shown.year}
            </AppText>
            <MonthArrow
              icon="chevronRight"
              label="Następny miesiąc"
              enabled={canGoForward}
              onPress={() => move(1)}
            />
          </View>
          <MonthGrid year={shown.year} month={shown.month} active={active} today={today} />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

type ArrowProps = {
  icon: 'back' | 'chevronRight';
  label: string;
  enabled: boolean;
  onPress: () => void;
};

function MonthArrow({ icon, label, enabled, onPress }: ArrowProps) {
  const { colors } = useTheme();
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled}
      onPress={onPress}
      style={styles.arrow}
    >
      <FieldIcon name={icon} size={layout.icon} color={enabled ? colors.text : colors.border} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'center', padding: spacing.xl },
  card: {
    width: '100%',
    maxWidth: DIALOG_MAX_WIDTH,
    alignSelf: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  grow: { flex: 1 },
  center: { textAlign: 'center' },
  arrow: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
