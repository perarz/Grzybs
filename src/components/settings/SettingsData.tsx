import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useCollection } from '@/features/collection/CollectionProvider';
import { resetCourse } from '@/features/learn/courseStorage';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { spacing } from '@/theme';
import { SettingsRow } from './SettingsRow';

type Pending = 'course' | 'finds' | null;

/** Starting over: the course, the collection or the welcome questions. */
export function SettingsData() {
  const db = useSQLiteContext();
  const collection = useCollection();
  const { showOnboarding } = useOnboarding();
  const [pending, setPending] = useState<Pending>(null);
  const [message, setMessage] = useState<{ text: string; failed: boolean } | null>(null);
  const count = collection.finds.length;

  async function confirm() {
    const action = pending;
    setPending(null);
    try {
      if (action === 'course') await resetCourse(db);
      if (action === 'finds') await collection.removeAll();
      setMessage({
        text: action === 'course' ? 'Kurs zaczyna się od nowa.' : 'Kolekcja jest pusta.',
        failed: false,
      });
    } catch {
      setMessage({ text: 'Nie udało się. Spróbuj ponownie.', failed: true });
    }
  }

  return (
    <View style={{ gap: spacing.sm }}>
      <SettingsRow
        icon="bulb"
        title="Pokaż powitanie ponownie"
        caption="Pytania z pierwszego uruchomienia"
        onPress={showOnboarding}
      />
      <SettingsRow
        icon="refresh"
        title="Zacznij kurs od nowa"
        caption="Lekcje i XP od zera, passa zostaje"
        onPress={() => setPending('course')}
        danger
      />
      <SettingsRow
        icon="camera"
        title="Usuń wszystkie znaleziska"
        caption={count ? `Zdjęcia w kolekcji: ${count}` : 'Kolekcja jest pusta'}
        onPress={() => setPending('finds')}
        disabled={!count || collection.loading}
        danger
      />
      {message ? (
        <AppText
          variant="caption"
          color={message.failed ? 'danger' : 'textMuted'}
          accessibilityRole="alert"
        >
          {message.text}
        </AppText>
      ) : null}
      {pending && (
        <ConfirmDialog
          title={pending === 'course' ? 'Zacząć kurs od nowa?' : 'Usunąć wszystkie znaleziska?'}
          message={
            pending === 'course'
              ? 'Ukończone lekcje i XP znikną. Tego nie da się cofnąć.'
              : `Zdjęcia (${count}) znikną z kolekcji i z pamięci telefonu. Tego nie da się cofnąć.`
          }
          cancelLabel="Zostaw"
          confirmLabel={pending === 'course' ? 'Zacznij od nowa' : 'Usuń'}
          icon={pending === 'course' ? 'refresh' : 'camera'}
          onCancel={() => setPending(null)}
          onConfirm={() => void confirm()}
        />
      )}
    </View>
  );
}
