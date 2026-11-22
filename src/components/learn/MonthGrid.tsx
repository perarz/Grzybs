import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { monthWeeks } from '@/features/learn/streakCalendar';
import { layout, radius, spacing, useTheme } from '@/theme';

const WEEKDAYS = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'];

type Props = { year: number; month: number; active: Set<number>; today: number };

/** One month, Monday first: days with learning are filled, today has an outline. */
export function MonthGrid({ year, month, active, today }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.grid}>
      <View style={styles.week}>
        {WEEKDAYS.map((name, position) => (
          <AppText key={position} variant="label" color="textMuted" style={styles.cell}>
            {name}
          </AppText>
        ))}
      </View>
      {monthWeeks(year, month).map((week, row) => (
        <View key={row} style={styles.week}>
          {week.map((cell, position) =>
            cell ? (
              <View
                key={position}
                accessible
                accessibilityLabel={`${cell.date}${active.has(cell.day) ? ', nauka' : ''}`}
                style={[
                  styles.cell,
                  styles.day,
                  {
                    backgroundColor: active.has(cell.day) ? colors.glow : 'transparent',
                    borderColor: cell.day === today ? colors.aqua : 'transparent',
                  },
                ]}
              >
                <AppText variant="caption" color={active.has(cell.day) ? 'onGlow' : 'textMuted'}>
                  {cell.date}
                </AppText>
              </View>
            ) : (
              <View key={position} style={styles.cell} />
            ),
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: spacing.xs },
  week: { flexDirection: 'row', gap: spacing.xs },
  cell: { flex: 1, textAlign: 'center' },
  day: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    borderWidth: layout.accentStroke,
  },
});
