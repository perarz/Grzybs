import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AppText } from '@/components/AppText';
import { fieldPanel as ink } from '@/theme/field';

const SIZE = 48;
const RADIUS = 20;
const SWEEP = 280;

function arc(degrees: number) {
  const point = (angle: number) => {
    const radians = (angle * Math.PI) / 180;
    return `${24 + RADIUS * Math.cos(radians)} ${24 + RADIUS * Math.sin(radians)}`;
  };
  return `M ${point(130)} A ${RADIUS} ${RADIUS} 0 ${degrees > 180 ? 1 : 0} 1 ${point(130 + degrees)}`;
}

export function MushroomGauge({ score, color }: { score: number; color: string }) {
  return (
    <View style={styles.gauge} accessible={false} pointerEvents="none">
      <Svg width={SIZE} height={SIZE} viewBox="0 0 48 48" style={StyleSheet.absoluteFill}>
        <Path d={arc(SWEEP)} fill="none" stroke={ink.rule} strokeWidth={3} strokeLinecap="round" />
        {score > 0 && (
          <Path
            d={arc((Math.min(score, 10) / 10) * SWEEP)}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
          />
        )}
      </Svg>
      <AppText variant="heading" maxFontSizeMultiplier={1.2} style={[styles.number, { color }]}>
        {score || '—'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  gauge: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  number: { fontSize: 24, lineHeight: 32, marginTop: -3 },
});
