import type { ErrorBoundaryProps } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { ErrorFallback } from '@/components/ErrorFallback';
import { MushroomCanvas } from '@/components/mushroom3d/MushroomCanvas';
import type { MushroomModelParams } from '@/features/atlas/mushroomModel';
import { useDragRotation } from '@/features/atlas/useDragRotation';
import { radius, spacing, useTheme } from '@/theme';

// Temporary presets for the 3D test – real parameters will live in species.json.
const PRESETS: { name: string; params: MushroomModelParams }[] = [
  {
    name: 'Borowik',
    params: {
      capShape: 'convex',
      capRadius: 1.05,
      capHeight: 0.62,
      stemHeight: 0.95,
      stemRadius: 0.3,
      stemBaseRadius: 0.48,
      capColor: '#7A4B2A',
      gillColor: '#E6DDB8',
      stemColor: '#E2D6BE',
    },
  },
  {
    name: 'Muchomor',
    params: {
      capShape: 'flat',
      capRadius: 1.15,
      capHeight: 0.55,
      stemHeight: 1.35,
      stemRadius: 0.18,
      stemBaseRadius: 0.3,
      capColor: '#C62A1E',
      gillColor: '#F4F0E6',
      stemColor: '#F1ECE0',
      spotColor: '#F7F3EA',
    },
  },
  {
    name: 'Kurka',
    params: {
      capShape: 'funnel',
      capRadius: 0.95,
      capHeight: 0.5,
      stemHeight: 0.75,
      stemRadius: 0.2,
      stemBaseRadius: 0.16,
      capColor: '#E8A41E',
      gillColor: '#EDB443',
      stemColor: '#E9AE35',
    },
  },
];

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorFallback {...props} />;
}

export default function ThreeDTestScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { rotation, gesture, spin } = useDragRotation();
  const [presetIndex, setPresetIndex] = useState(0);
  const [fps, setFps] = useState<number | null>(null);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <GestureDetector gesture={gesture}>
        <View style={styles.canvas}>
          <MushroomCanvas
            params={PRESETS[presetIndex].params}
            rotation={rotation}
            backgroundColor={colors.surfaceMuted}
            onFpsMeasured={setFps}
          />
        </View>
      </GestureDetector>

      <AppText variant="caption" color="textMuted" style={styles.centered}>
        Przeciągnij palcem, aby obrócić · {fps === null ? 'FPS: –' : `${fps} FPS w ruchu`}
      </AppText>

      <View style={styles.presets}>
        {PRESETS.map((preset, index) => (
          <Chip
            key={preset.name}
            label={preset.name}
            selected={index === presetIndex}
            onPress={() => {
              setPresetIndex(index);
              spin();
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
  },
  canvas: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  centered: {
    textAlign: 'center',
  },
  presets: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
