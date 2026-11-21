import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { FieldIcon, type FieldIconName } from '@/components/icons/FieldIcon';
import type { WeatherPeriod } from '@/features/weather/weather';
import { spacing } from '@/theme';
import { fieldPanel as ink } from '@/theme/field';

const columns = [
  { key: 'temperature', icon: 'temperature', unit: '°C', label: 'Temperatura' },
  { key: 'precipitation', icon: 'rain', unit: 'mm', label: 'Opady' },
  { key: 'wind', icon: 'wind', unit: 'km/h', label: 'Wiatr' },
] as const satisfies readonly {
  key: 'temperature' | 'precipitation' | 'wind';
  icon: FieldIconName;
  unit: string;
  label: string;
}[];
function amount(v: number | null, decimals: number) {
  return v === null ? '—' : v.toLocaleString('pl-PL', { maximumFractionDigits: decimals });
}
export function WeatherTable({ rows }: { rows: WeatherPeriod[] }) {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.period} />
        {columns.map((col) => (
          <View
            key={col.key}
            accessible
            accessibilityLabel={col.label + ' (' + col.unit + ')'}
            style={styles.column}
          >
            <FieldIcon name={col.icon} size={15} color={ink.accent} />
            <AppText variant="caption" style={{ color: ink.muted }}>
              {col.unit}
            </AppText>
          </View>
        ))}
      </View>
      {rows.map((period, i) => (
        <View key={period.label} style={[styles.row, styles.data, { borderColor: ink.rule }]}>
          <AppText
            variant="caption"
            color={i === 0 ? 'accent' : 'text'}
            style={[styles.period, { color: i === 0 ? ink.accent : ink.text }]}
          >
            {period.label}
          </AppText>
          {columns.map((col) => (
            <AppText
              key={col.key}
              variant="button"
              accessibilityLabel={col.label + ' ' + amount(period[col.key], 1) + ' ' + col.unit}
              style={[styles.value, { color: ink.text }]}
            >
              {amount(period[col.key], col.key === 'precipitation' ? 1 : 0)}
            </AppText>
          ))}
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 28 },
  period: { flex: 1.45 },
  column: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  data: { borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: spacing.xs },
  value: { flex: 1, textAlign: 'right', fontVariant: ['tabular-nums'] },
});
