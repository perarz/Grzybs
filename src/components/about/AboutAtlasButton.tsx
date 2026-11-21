import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { layout, spacing } from '@/theme';

import { AboutAtlasSheet } from './AboutAtlasSheet';

export function AboutAtlasButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PressableScale
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={styles.button}
      >
        <AppText variant="label" color="textMuted">
          O atlasie · źródła i licencje ↗
        </AppText>
      </PressableScale>
      {open ? <AboutAtlasSheet onClose={() => setOpen(false)} /> : null}
    </>
  );
}
const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    marginRight: layout.touchTarget + spacing.sm,
    minHeight: layout.touchTarget,
    justifyContent: 'center',
  },
});
