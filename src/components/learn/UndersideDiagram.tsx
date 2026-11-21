import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { AppText } from '@/components/AppText';
import { UNDERSIDE_LABELS } from '@/features/atlas/labels';
import type { Underside } from '@/features/atlas/types';
import { layout, radius, spacing, useTheme } from '@/theme';

const kinds = ['pores', 'gills', 'ridges'] as const;
const captions = {
  pores: 'Drobne pory',
  gills: 'Cienkie blaszki',
  ridges: 'Grube, rozwidlone fałdy',
};
export function UndersideDiagram({ selected }: { selected: Underside }) {
  const { colors } = useTheme();
  return (
    <View style={styles.content}>
      <AppText variant="label" color="textMuted">
        Schemat spodu kapelusza
      </AppText>
      <View style={styles.row}>
        {kinds.map((kind) => {
          const color = selected === kind ? colors.glow : colors.textMuted;
          return (
            <View
              key={kind}
              style={[
                styles.item,
                {
                  borderColor: selected === kind ? colors.glow : colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <Svg width="100%" height={layout.courseNode} viewBox="0 0 100 80" accessible={false}>
                <Ellipse
                  cx="50"
                  cy="40"
                  rx="43"
                  ry="32"
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                />
                {kind === 'pores'
                  ? Array.from({ length: 5 }, (_, row) =>
                      Array.from({ length: 7 }, (_, col) => {
                        const x = 20 + col * 10;
                        const y = 20 + row * 10;
                        return ((x - 50) / 37) ** 2 + ((y - 40) / 26) ** 2 < 1 ? (
                          <Circle key={`${row}:${col}`} cx={x} cy={y} r="2" fill={color} />
                        ) : null;
                      }),
                    )
                  : Array.from({ length: kind === 'gills' ? 22 : 9 }, (_, i) => {
                      const angle = (i / (kind === 'gills' ? 22 : 9)) * Math.PI * 2;
                      const x = 50 + Math.cos(angle) * 40;
                      const y = 40 + Math.sin(angle) * 29;
                      const middleX = 50 + Math.cos(angle) * 25;
                      const middleY = 40 + Math.sin(angle) * 18;
                      return (
                        <Path
                          key={i}
                          d={
                            kind === 'gills'
                              ? `M50 40L${x} ${y}`
                              : `M50 40Q${middleX - 4} ${middleY} ${x} ${y}M${middleX} ${middleY}l${Math.cos(angle + 0.4) * 13} ${Math.sin(angle + 0.4) * 12}`
                          }
                          fill="none"
                          stroke={color}
                          strokeWidth={kind === 'gills' ? 1 : 3}
                          strokeLinecap="round"
                        />
                      );
                    })}
                <Ellipse
                  cx="50"
                  cy="40"
                  rx="7"
                  ry="5"
                  fill={colors.surface}
                  stroke={color}
                  strokeWidth="2"
                />
              </Svg>
              <AppText
                variant="bodyStrong"
                style={styles.center}
                color={selected === kind ? 'accent' : 'text'}
              >
                {UNDERSIDE_LABELS[kind]}
              </AppText>
              <AppText variant="caption" color="textMuted" style={styles.center}>
                {captions[kind]}
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  content: { gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  item: { flex: 1, padding: spacing.xs, borderWidth: 1, borderRadius: radius.md, gap: spacing.xs },
  center: { textAlign: 'center' },
});
