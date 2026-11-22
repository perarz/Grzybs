import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { CloseIcon } from '@/components/icons/UiIcons';
import { PressableScale } from '@/components/PressableScale';
import type { LocationFix } from '@/features/navigation/geo';
import type { CarLocation, Spot } from '@/features/spots/storage';
import { layout, spacing, useTheme } from '@/theme';
import { CarReturnPanel } from './CarReturnPanel';
import { SpotList } from './SpotList';

const CLOSE_ICON_SIZE = 22;

type Props = {
  car: CarLocation | null;
  spots: Spot[];
  position: LocationFix | null;
  heading: number | null;
  busy: boolean;
  onClose: () => void;
  onShow: (spot: Spot) => void;
  onShowCar: () => void;
  onAdd: () => void;
  onEdit: (spot: Spot) => void;
  onDelete: (spot: Spot) => void;
  onClearCar: () => void;
};

export function SavedPlacesSheet({ car, spots, position, heading, busy, ...actions }: Props) {
  const { colors } = useTheme();
  return (
    <BottomSheet
      onClose={actions.onClose}
      header={(close) => (
        <View style={styles.head}>
          <AppText variant="heading">Zapisane miejsca</AppText>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Zamknij zapisane miejsca"
            onPress={close}
            style={styles.close}
          >
            <CloseIcon size={CLOSE_ICON_SIZE} color={colors.textMuted} />
          </PressableScale>
        </View>
      )}
    >
      {() => (
        <ScrollView contentContainerStyle={styles.details}>
          {car && (
            <CarReturnPanel
              car={car}
              position={position}
              heading={position ? heading : null}
              busy={busy}
              onShow={actions.onShowCar}
              onClear={actions.onClearCar}
            />
          )}
          <SpotList
            spots={spots}
            busy={busy}
            onShow={actions.onShow}
            onAdd={actions.onAdd}
            onEdit={actions.onEdit}
            onDelete={actions.onDelete}
          />
        </ScrollView>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  close: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: { gap: spacing.lg, padding: spacing.lg },
});
