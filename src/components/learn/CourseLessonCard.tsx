import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { getSpecies } from '@/data/species';
import type { CourseUnit } from '@/features/learn/courseUnits';
import { layout, radius, spacing, useTheme } from '@/theme';
import { CourseSpecimenPhoto } from './CourseSpecimenPhoto';
import { UndersideDiagram } from './UndersideDiagram';

const monthLabels = [
  'Sty',
  'Lut',
  'Mar',
  'Kwi',
  'Maj',
  'Cze',
  'Lip',
  'Sie',
  'Wrz',
  'Paź',
  'Lis',
  'Gru',
];
export function CourseLessonCard({ unit }: { unit: CourseUnit }) {
  const { colors } = useTheme();
  const species = getSpecies(unit.speciesIds[0]);
  return (
    <View style={styles.content}>
      <AppText variant="title">{unit.title}</AppText>
      {unit.visual === 'comparison' ? (
        <View style={styles.pair}>
          {unit.speciesIds.map((id) => (
            <View key={id} style={styles.half}>
              <CourseSpecimenPhoto id={id} />
            </View>
          ))}
        </View>
      ) : unit.visual === 'underside' ? (
        <UndersideDiagram selected={species.features.underside} />
      ) : (
        <CourseSpecimenPhoto id={species.id} />
      )}
      {unit.visual === 'season' && (
        <View style={styles.months}>
          {monthLabels.map((label, index) => {
            const active = species.months.some((m) => m === index + 1);
            return (
              <View
                key={label}
                style={[styles.month, { backgroundColor: active ? colors.glow : colors.surface }]}
              >
                <AppText variant="caption" color={active ? 'onGlow' : 'textMuted'}>
                  {label}
                </AppText>
              </View>
            );
          })}
        </View>
      )}
      {unit.facts.map((fact, index) => (
        <View key={fact.label} style={[styles.fact, { borderColor: colors.border }]}>
          <FieldIcon
            name={
              unit.visual === 'habitat'
                ? 'pin'
                : unit.visual === 'season'
                  ? 'calendar'
                  : index === 0
                    ? 'search'
                    : 'info'
            }
            color={colors.glow}
            size={layout.icon}
          />
          <View style={styles.words}>
            <AppText variant="label" color="textMuted">
              {fact.label}
            </AppText>
            <AppText variant="bodyStrong">{fact.text}</AppText>
          </View>
        </View>
      ))}
      {unit.visual === 'comparison' && (
        <AppText variant="caption" color="textMuted">
          To ćwiczenie obserwacji. Jedna cecha ani zdjęcie nie potwierdzają jadalności.
        </AppText>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  pair: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  half: { flex: 1, minWidth: layout.minimumCardWidth },
  words: { flex: 1, gap: spacing.sm },
  fact: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderTopWidth: 1,
    paddingTop: spacing.lg,
  },
  months: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  month: {
    width: '15%',
    minHeight: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
});
