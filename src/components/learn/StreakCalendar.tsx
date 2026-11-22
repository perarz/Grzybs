import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { DialogCard } from '@/components/DialogCard';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { MONTH_NAMES } from '@/features/atlas/labels';
import type { Month } from '@/features/atlas/types';
import { calendarDay, type LearningJourney } from '@/features/learn/journey';
import { localDate, monthOf } from '@/features/learn/streakCalendar';
import { layout, spacing, useTheme } from '@/theme';
import { MonthGrid } from './MonthGrid';

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
    <DialogCard closeLabel="Zamknij kalendarz" onClose={onClose}>
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
    </DialogCard>
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
