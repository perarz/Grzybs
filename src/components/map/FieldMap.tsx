import { Component, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { canShowNativeMap } from '@/features/spots/mapAvailability';
import { spacing } from '@/theme';
import type { FieldMapProps } from './FieldMap.types';
import { NativeFieldMap } from './NativeFieldMap';

class MapBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <View style={styles.note}>
        <AppText>Mapa jest niedostępna.</AppText>
        <Button label="Ponów" onPress={() => this.setState({ failed: false })} />
      </View>
    ) : (
      this.props.children
    );
  }
}

export function FieldMap(props: FieldMapProps) {
  if (!canShowNativeMap()) {
    return (
      <View style={styles.note}>
        <AppText>Ta wersja aplikacji nie ma klucza Map Google, więc mapa jest wyłączona.</AppText>
        <AppText color="textMuted">
          Zapisane miejsca, kompas i powrót do auta działają bez niej.
        </AppText>
      </View>
    );
  }
  return (
    <MapBoundary>
      <NativeFieldMap {...props} />
    </MapBoundary>
  );
}
const styles = StyleSheet.create({
  content: { gap: spacing.sm },
  note: { paddingHorizontal: spacing.lg, gap: spacing.sm },
});
