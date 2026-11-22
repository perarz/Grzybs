import { useState } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { AlertBanner } from '@/components/AlertBanner';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { findLookalikes } from '@/features/atlas/findLookalikes';
import type { Species } from '@/features/atlas/types';
import { SPECIES_PHOTOS } from '@/data/speciesPhotos';
import { FindDetailsForm } from './FindDetailsForm';
import {
  detailsFrom,
  draftFrom,
  weightError,
  type FindDraft,
} from '@/features/collection/findDraft';
import { NO_DETAILS, type FindDetails } from '@/features/collection/storage';
import { isDangerous } from '@/features/safety/danger';
import { layout, radius, spacing } from '@/theme';

type Props = {
  canSave?: boolean;
  species: Species;
  busy: boolean;
  onSave: (details: FindDetails) => void;
  onBack: () => void;
};

export function FindReview({ species, busy, onSave, onBack, canSave = true }: Props) {
  const [confirmed, setConfirmed] = useState(false);
  const [draft, setDraft] = useState<FindDraft>(() => draftFrom(NO_DETAILS));
  const lookalikes = findLookalikes(species.id).filter(
    (item) => isDangerous(item.species.edibility) || isDangerous(species.edibility),
  );
  const checks = lookalikes.flatMap(({ species: other, pair }) =>
    pair.differences.map((difference, index) => ({
      id: `${other.id}-${index}`,
      name: other.namePl,
      trait: difference.trait,
      own: pair.species[0] === species.id ? difference.first : difference.second,
      other: pair.species[0] === species.id ? difference.second : difference.first,
    })),
  );
  const risky = checks.length > 0;
  const ready = !risky || confirmed;
  return (
    <View style={{ gap: spacing.lg }}>
      <View style={styles.species}>
        <Image
          source={SPECIES_PHOTOS[species.id].source}
          style={styles.thumbnail}
          contentFit="cover"
          accessibilityLabel={`Zdjęcie z atlasu: ${species.namePl}`}
        />
        <View style={styles.names}>
          <AppText variant="label" color="textMuted">
            Twój okaz to
          </AppText>
          <AppText variant="heading">{species.namePl}</AppText>
          <AppText variant="latinSmall" color="textMuted">
            {species.nameLatin}
          </AppText>
        </View>
      </View>
      {risky ? (
        <AlertBanner tone="danger" title="Uwaga na sobowtóra">
          Porównaj okaz z cechami poniżej. Zapis nie potwierdza, że grzyb jest jadalny.
        </AlertBanner>
      ) : null}
      {checks.map((check) => (
        <AppText key={check.id} variant="caption" color="textMuted">
          <AppText variant="caption">{check.trait}: </AppText>
          {check.own} (a {check.name.toLowerCase()}: {check.other})
        </AppText>
      ))}
      {risky ? (
        <Chip
          label="Porównałem cechy okazu"
          selected={confirmed}
          onPress={() => {
            if (!busy) setConfirmed((value) => !value);
          }}
        />
      ) : null}
      <FindDetailsForm draft={draft} onChange={setDraft} disabled={busy} />
      <Button
        label={busy ? 'Zapisuję…' : 'Zapisz znalezisko'}
        disabled={!ready || busy || !canSave || Boolean(weightError(draft))}
        onPress={() => onSave(detailsFrom(draft))}
      />
      <Button label="Wróć do wyboru gatunku" disabled={busy} variant="secondary" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  species: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  thumbnail: { width: layout.thumbnail, height: layout.thumbnail, borderRadius: radius.md },
  names: { flex: 1, gap: spacing.xs },
});
