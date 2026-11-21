import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown, ReduceMotion } from 'react-native-reanimated';
import { FieldIcon } from '@/components/icons/FieldIcon';
import { AppText } from '@/components/AppText';
import { PressableScale } from '@/components/PressableScale';
import { durations, layout, radius, spacing, useTheme } from '@/theme';

import { fieldPanel as ink } from '@/theme/field';

type Props = {
  onOpen: () => void;
  onAdd: () => void;
  onPark: () => void;
  busy: boolean;
  canPark: boolean;
};
export function MapActions({ onAdd, onPark, onOpen, busy, canPark }: Props) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.overlay}>
      {open && (
        <Animated.View
          entering={FadeInDown.duration(durations.base).reduceMotion(ReduceMotion.System)}
          exiting={FadeOutDown.duration(durations.fast).reduceMotion(ReduceMotion.System)}
          style={styles.menu}
        >
          {(
            [
              { icon: 'pin', text: 'Dodaj miejscówkę', run: onAdd, disabled: busy },
              { icon: 'car', text: 'Zapisz auto', run: onPark, disabled: busy || !canPark },
            ] as const
          ).map((item, index) => (
            <PressableScale
              key={item.text}
              accessibilityRole="button"
              accessibilityState={{ disabled: item.disabled }}
              disabled={item.disabled}
              style={[styles.item, index > 0 && styles.rule]}
              onPress={() => {
                setOpen(false);
                item.run();
              }}
            >
              <FieldIcon
                name={item.icon}
                size={20}
                color={item.disabled ? ink.muted : ink.accent}
              />
              <AppText variant="button" style={{ color: item.disabled ? ink.muted : ink.text }}>
                {item.text}
              </AppText>
            </PressableScale>
          ))}
          {!canPark && (
            <AppText variant="caption" style={{ color: ink.muted }}>
              Auto wymaga dokładnej pozycji GPS.
            </AppText>
          )}
        </Animated.View>
      )}
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Akcje na mapie"
        accessibilityState={{ expanded: open }}
        onPress={() => {
          if (!open) onOpen();
          setOpen(!open);
        }}
        style={[styles.circle, { backgroundColor: colors.glow }]}
      >
        <Animated.View
          style={{
            transform: [{ rotate: open ? '45deg' : '0deg' }],
            transitionProperty: 'transform',
            transitionDuration: durations.fast,
          }}
        >
          <FieldIcon name="plus" size={29} color={colors.onGlow} />
        </Animated.View>
      </PressableScale>
    </View>
  );
}
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: spacing.lg,
    bottom: spacing.xl,
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  menu: {
    backgroundColor: ink.background,
    elevation: 4,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderColor: ink.rule,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
  },
  rule: { borderTopColor: ink.rule, borderTopWidth: StyleSheet.hairlineWidth },
  item: {
    minHeight: layout.touchTarget + spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  circle: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
