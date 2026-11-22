import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { DialogCard } from '@/components/DialogCard';
import { FieldIcon, type FieldIconName } from '@/components/icons/FieldIcon';
import { LEVELS } from '@/features/learn/journey';
import { rankIndex, XP_RULES } from '@/features/learn/ranks';
import { spacing, useTheme } from '@/theme';

const RANK_ICONS: FieldIconName[] = ['mushroom', 'search', 'identify', 'places', 'book', 'trophy'];
const EARNINGS: { icon: FieldIconName; label: string; xp: number }[] = [
  { icon: 'book', label: 'Ukończona lekcja', xp: XP_RULES.lesson },
  { icon: 'trophy', label: 'Zaliczony test etapu', xp: XP_RULES.test },
  { icon: 'check', label: 'Bez ani jednego błędu', xp: XP_RULES.perfectBonus },
];

type Props = { xp: number; completed: number; onClose: () => void };

/** What experience is for: how to earn it and the ranks along the course. */
export function XpGuide({ xp, completed, onClose }: Props) {
  const { colors } = useTheme();
  const current = rankIndex(completed);
  return (
    <DialogCard closeLabel="Zamknij" onClose={onClose}>
      <View style={styles.row}>
        <FieldIcon name="mushrooms" size={spacing.xl} color={colors.glow} />
        <AppText variant="title" style={styles.grow}>
          {xp} XP
        </AppText>
      </View>
      <AppText variant="label" color="accent">
        Za co dostajesz XP
      </AppText>
      {EARNINGS.map((item) => (
        <View key={item.label} style={styles.row}>
          <FieldIcon name={item.icon} size={spacing.lg} color={colors.aqua} />
          <AppText style={styles.grow}>{item.label}</AppText>
          <AppText variant="bodyStrong" color="accent">
            +{item.xp}
          </AppText>
        </View>
      ))}
      <AppText variant="label" color="accent" style={styles.section}>
        Rangi – jedna za każdy etap
      </AppText>
      {LEVELS.map((level, index) => {
        const reached = index <= current;
        return (
          <View key={level.name} style={styles.row}>
            <FieldIcon
              name={RANK_ICONS[index]}
              size={spacing.lg}
              color={reached ? colors.glow : colors.textMuted}
            />
            <View style={styles.grow}>
              <AppText
                variant={index === current ? 'bodyStrong' : 'body'}
                color={reached ? 'text' : 'textMuted'}
              >
                {level.name}
              </AppText>
              <AppText variant="caption" color="textMuted">
                {index === 0 ? 'Na start' : `Po ${index}. etapie`}
              </AppText>
            </View>
            {index === current ? (
              <AppText variant="label" color="accent">
                Teraz
              </AppText>
            ) : (
              <FieldIcon
                name={reached ? 'check' : 'lock'}
                size={spacing.lg}
                color={reached ? colors.season : colors.textMuted}
              />
            )}
          </View>
        );
      })}
    </DialogCard>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  grow: { flex: 1 },
  section: { marginTop: spacing.sm },
});
