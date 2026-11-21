import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { EdibilityStamp } from '@/components/atlas/EdibilityStamp';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { PhotoCredit } from '@/components/PhotoCredit';
import { FIELD_RULES, type FieldRuleId } from '@/data/fieldRules';
import { getSpecies } from '@/data/species';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { HABITAT_LABELS } from '@/features/atlas/labels';
import { formatSeason } from '@/features/atlas/season';
import type { SpeciesId } from '@/features/atlas/types';
import { durations, layout, radius, spacing, useTheme } from '@/theme';

/** "Nowy gatunek": the photo, the name and what a picker looks at in the forest. */
export function TeachSpeciesCard({ speciesId }: { speciesId: SpeciesId }) {
  const { colors } = useTheme();
  const species = getSpecies(speciesId);
  const photo = SPECIES_PHOTOS[speciesId];
  const tips = [
    { label: 'Poznasz po', text: species.keyFeatures[0] },
    { label: 'Sprawdź też', text: species.keyFeatures[1] },
    {
      label: 'Szukaj',
      text: `${species.habitats.map((h) => HABITAT_LABELS[h].toLowerCase()).join(', ')} · ${formatSeason(species.months)}`,
    },
  ];
  return (
    <View style={styles.card}>
      <AppText variant="label" color="accent">
        Nowy gatunek
      </AppText>
      <Image
        source={photo.source}
        contentFit="cover"
        transition={durations.base}
        style={[styles.photo, { backgroundColor: colors.surfaceMuted }]}
        accessibilityLabel={species.namePl}
      />
      <PhotoCredit photo={photo} />
      <View style={styles.title}>
        <AppText variant="title">{species.nameCommon ?? species.namePl}</AppText>
        <EdibilityStamp edibility={species.edibility} />
      </View>
      {tips.map((tip, index) => (
        <Animated.View
          key={tip.label}
          entering={FadeInDown.delay(index * 120).duration(durations.base)}
          style={[styles.tip, { borderColor: colors.border }]}
        >
          <AppText variant="label" color="textMuted">
            {tip.label}
          </AppText>
          <AppText>{tip.text}</AppText>
        </Animated.View>
      ))}
    </View>
  );
}

/** "Zasada grzybiarza": one practical rule, with its official source. */
export function TeachRuleCard({ ruleId }: { ruleId: FieldRuleId }) {
  const { colors } = useTheme();
  const rule = FIELD_RULES[ruleId];
  return (
    <View style={styles.card}>
      <AppText variant="label" color="accent">
        Zasada grzybiarza
      </AppText>
      <View style={[styles.ruleIcon, { backgroundColor: colors.glow }]}>
        <FieldIcon name={rule.icon} size={RULE_ICON_SIZE} color={colors.onGlow} />
      </View>
      <AppText variant="title">{rule.title}</AppText>
      <AppText variant="bodyStrong">{rule.text}</AppText>
      <AppText variant="caption" color="textMuted">
        Źródło:{' '}
        {rule.source.includes('lasy.gov.pl') ? 'Lasy Państwowe' : 'Główny Inspektorat Sanitarny'}
      </AppText>
    </View>
  );
}

const RULE_ICON_SIZE = 40;

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  photo: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.lg },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tip: { gap: spacing.xs, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.sm },
  ruleIcon: {
    width: layout.touchTarget * 2,
    height: layout.touchTarget * 2,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: spacing.lg,
  },
});
