import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { courseLesson, LESSONS_PER_STAGE } from '@/features/learn/course';
import { durations, layout, spacing } from '@/theme';
import { CourseTrailNode } from './CourseTrailNode';

const bends = [0, 0.8, -0.2, -0.9, 0];
const nodeFrame = layout.courseNode + spacing.lg;

export function CourseTrail({ stage, next }: { stage: number; next: number }) {
  const { fontScale } = useWindowDimensions();
  const [width, setWidth] = useState(0);
  const [nodeHeights, setNodeHeights] = useState<Record<number, number>>({});
  const captionWidth = Math.min(width, layout.minimumCardWidth + spacing.lg);
  const spread = Math.max(0, (width - captionWidth) / 2 - spacing.sm);
  const rowHeight = nodeFrame + spacing.xxl + spacing.lg * Math.max(1, fontScale);
  const rowHeights = bends.map((_, index) =>
    Math.max(rowHeight, (nodeHeights[index] ?? 0) + spacing.xl),
  );
  const height = rowHeights.reduce((sum, row) => sum + row, 0);
  const points = bends.map((bend, index) => ({
    x: width / 2 + bend * spread,
    y: rowHeights.slice(0, index).reduce((sum, row) => sum + row, 0) + nodeFrame / 2,
  }));
  return (
    <View style={styles.trail} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      {width > 0 && (
        <View style={{ height }}>
          {points.map((point, position) => {
            const step = courseLesson(stage * LESSONS_PER_STAGE + position)!;
            return (
              <Animated.View
                key={step.id}
                entering={FadeInDown.delay(position * durations.fast).duration(durations.slow)}
                onLayout={(event) => {
                  const measured = event.nativeEvent.layout.height;
                  setNodeHeights((previous) =>
                    previous[position] === measured
                      ? previous
                      : { ...previous, [position]: measured },
                  );
                }}
                style={[
                  styles.node,
                  { left: point.x - captionWidth / 2, top: point.y - nodeFrame / 2 },
                ]}
              >
                <CourseTrailNode
                  step={step}
                  done={step.id < next}
                  active={step.id === next}
                  width={captionWidth}
                />
              </Animated.View>
            );
          })}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  trail: {
    width: '100%',
    maxWidth: layout.minimumCardWidth * 3,
    alignSelf: 'center',
    marginTop: spacing.lg,
  },
  node: { position: 'absolute' },
});
