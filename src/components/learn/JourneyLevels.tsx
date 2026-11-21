import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { LEVELS } from '@/features/learn/journey';
import { layout, spacing, useTheme } from '@/theme';

export function JourneyLevels({ xp }: { xp: number }) {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  return (
    <View>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Ścieżka poziomów"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        style={styles.toggle}
      >
        <AppText variant="bodyStrong">Ścieżka poziomów</AppText>
        <FieldIcon name={open ? 'arrowUp' : 'chevron'} size={layout.icon} color={colors.glow} />
      </PressableScale>
      {open &&
        LEVELS.map((level, index) => (
          <View key={level.xp} style={[styles.level, { borderColor: colors.border }]}>
            <AppText color={xp >= level.xp ? 'text' : 'textMuted'}>
              {index + 1}. {level.name}
            </AppText>
            <AppText variant="caption" color={xp >= level.xp ? 'accent' : 'textMuted'}>
              {xp >= level.xp ? '✓ ' : ''}
              {level.xp} XP
            </AppText>
          </View>
        ))}
    </View>
  );
}
const styles = StyleSheet.create({
  toggle: {
    minHeight: layout.touchTarget,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  level: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
  },
});
