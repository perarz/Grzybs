import { StyleSheet, View } from 'react-native';

import { FieldIcon } from '@/components/icons/FieldIcon';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { layout, radius, spacing, useTheme } from '@/theme';

type Props = {
  title: string;
  description: string;
  sessions: number;
  best: number;
  loading: boolean;
  onPress: () => void;
};

export function LearningModeCard({ title, description, sessions, best, loading, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Rozpocznij: ${title}. 5 pytań.`}
      onPress={onPress}
      style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}
    >
      <View style={styles.heading}>
        <View style={styles.title}>
          <AppText variant="label" color="accent">
            5 pytań · bez pośpiechu
          </AppText>
          <AppText variant="title">{title}</AppText>
        </View>
        <FieldIcon name="arrowRight" size={layout.icon} color={colors.glow} />
      </View>
      <AppText color="textMuted">{description}</AppText>
      <View style={[styles.footer, { borderColor: colors.border }]}>
        <AppText variant="label" color="textMuted">
          {loading
            ? 'Wczytuję wyniki…'
            : sessions
              ? `Ukończone rundy: ${sessions}`
              : 'Zacznij pierwszą rundę'}
        </AppText>
        {!loading && sessions > 0 ? (
          <AppText variant="label" color="accent">
            Rekord {best}%
          </AppText>
        ) : null}
      </View>
    </PressableScale>
  );
}
const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  title: { flex: 1, gap: spacing.sm },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.md,
  },
});
