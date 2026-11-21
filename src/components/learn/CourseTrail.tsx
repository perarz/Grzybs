import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { courseStep, STEPS_PER_STAGE } from '@/features/learn/course';
import { layout, spacing, useTheme } from '@/theme';
import { CourseTrailNode } from './CourseTrailNode';

const bends = [0, 1, 0.6, -0.7, -1, 0, 1, 0.6, -0.6, 0];
const nodeFrame = layout.courseNode + spacing.lg;

export function CourseTrail({ stage, next }: { stage: number; next: number }) {
  const { colors } = useTheme();
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
  const segments = points.slice(1).map((point, index) => {
    const previous = points[index];
    const middleY = (previous.y + point.y) / 2;
    return `M ${previous.x} ${previous.y} C ${previous.x} ${middleY}, ${point.x} ${middleY}, ${point.x} ${point.y}`;
  });
  return (
    <View style={styles.trail} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      {width > 0 && (
        <View style={{ height }}>
          <Svg width={width} height={height} style={StyleSheet.absoluteFill} accessible={false}>
            {segments.map((path, index) => {
              const reached = stage * STEPS_PER_STAGE + index < next;
              return (
                <Path
                  key={index}
                  d={path}
                  fill="none"
                  stroke={reached ? colors.primary : colors.border}
                  strokeWidth={spacing.sm}
                  strokeLinecap="round"
                  strokeDasharray={reached ? undefined : `${spacing.xs} ${spacing.md}`}
                />
              );
            })}
          </Svg>
          {points.map((point, position) => {
            const step = courseStep(stage * STEPS_PER_STAGE + position)!;
            return (
              <View
                key={step.id}
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
              </View>
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
