import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { HABITAT_LABELS, MONTH_NAMES, MONTH_NUMERALS } from '@/features/atlas/labels';
import { formatSeason, getCurrentMonth } from '@/features/atlas/season';
import type { Month, Species } from '@/features/atlas/types';
import { radius, spacing, useTheme } from '@/theme';

export function SpeciesQuickFacts({ species }: { species: Species }) {
  const { colors } = useTheme();
  const current = getCurrentMonth();
  return (
    <View style={[styles.panel, { backgroundColor: colors.surface }]}>
      <View style={styles.habitat}>
        <FieldIcon name="pin" size={18} color={colors.primary} />
        <AppText variant="caption" style={styles.text}>
          {species.habitats.map((habitat) => HABITAT_LABELS[habitat]).join(' · ')}
        </AppText>
      </View>
      <View style={styles.habitat}>
        <AppText variant="caption" style={styles.text}>
          Sezon · {formatSeason(species.months)}
        </AppText>
        <AppText
          variant="caption"
          color={species.months.includes(current) ? 'accent' : 'textMuted'}
        >
          {species.months.includes(current) ? 'Teraz w sezonie' : 'Poza sezonem'}
        </AppText>
      </View>
      <View style={styles.months}>
        {Array.from({ length: 12 }, (_, i) => (i + 1) as Month).map((month) => {
          const active = species.months.includes(month);
          return (
            <View
              key={month}
              accessible
              accessibilityLabel={`${MONTH_NAMES[month]}: ${active ? 'w sezonie' : 'poza sezonem'}${month === current ? ', bieżący miesiąc' : ''}`}
              style={[
                styles.month,
                {
                  backgroundColor: active ? colors.primaryMuted : colors.background,
                  borderColor: month === current ? colors.glow : 'transparent',
                },
              ]}
            >
              <AppText
                variant="caption"
                maxFontSizeMultiplier={1.3}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
                style={styles.numeral}
                color={active ? 'accent' : 'textMuted'}
              >
                {MONTH_NUMERALS[month]}
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { padding: spacing.md, borderRadius: radius.md, gap: spacing.sm },
  habitat: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  text: { flex: 1 },
  months: { flexDirection: 'row', gap: spacing.xs / 2 },
  month: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  numeral: { fontSize: 12 },
});
