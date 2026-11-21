import { useState } from 'react';
import { View } from 'react-native';

import { AlertBanner } from '@/components/AlertBanner';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { findLookalikes } from '@/features/atlas/findLookalikes';
import type { Species } from '@/features/atlas/types';
import { isDangerous } from '@/features/safety/danger';
import { spacing } from '@/theme';

type Props = {
  canSave?: boolean;
  species: Species;
  busy: boolean;
  onSave: () => void;
  onBack: () => void;
};

export function FindReview({ species, busy, onSave, onBack, canSave = true }: Props) {
  const [checked, setChecked] = useState<string[]>([]);
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
  const ready = checks.every(({ id }) => checked.includes(id));
  return (
    <View style={{ gap: spacing.lg }}>
      <AppText variant="heading">{species.namePl}</AppText>
      <AlertBanner
        tone={lookalikes.length || isDangerous(species.edibility) ? 'danger' : 'info'}
        title="Zapis obserwacji, nie ocena jadalności"
      >
        Odblokowanie gatunku nie potwierdza identyfikacji ani bezpieczeństwa spożycia. Jeśli nie
        masz pewności, wróć do wyboru gatunku i skonsultuj okaz z grzyboznawcą.
      </AlertBanner>
      {checks.map((check) => (
        <View key={check.id} style={{ gap: spacing.sm }}>
          <AppText variant="label">{check.trait}</AppText>
          <AppText>
            {species.namePl}: {check.own}
          </AppText>
          <AppText color="textMuted">
            {check.name}: {check.other}
          </AppText>
          <Chip
            label="Sprawdziłem tę cechę okazu"
            selected={checked.includes(check.id)}
            onPress={() => {
              if (!busy)
                setChecked((old) =>
                  old.includes(check.id) ? old.filter((id) => id !== check.id) : [...old, check.id],
                );
            }}
          />
        </View>
      ))}
      {!ready ? (
        <AppText color="textMuted">
          Sprawdź wszystkie powyższe cechy, aby zapisać wybrany gatunek.
        </AppText>
      ) : null}
      <Button
        label={busy ? 'Zapisuję…' : 'Zapisz znalezisko'}
        disabled={!ready || busy || !canSave}
        onPress={onSave}
      />
      <Button label="Wróć do wyboru gatunku" disabled={busy} variant="secondary" onPress={onBack} />
    </View>
  );
}
