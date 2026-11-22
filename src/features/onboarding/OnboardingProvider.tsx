import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import type { Experience } from './questions';

type Profile = { experience: Experience; score: number | null };
const Context = createContext<{
  profile: Profile | null;
  resetDevelopment: () => void;
}>({
  profile: null,
  resetDevelopment: () => {},
});
export const useOnboarding = () => useContext(Context);
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const devReset = useRef<() => void>(() => {});
  useEffect(() => {
    let active = true;
    db.getFirstAsync<Profile>('SELECT experience, score FROM user_profile WHERE id = 1')
      .then((row) => {
        if (active) {
          setProfile(row);
          setOpen(!row);
        }
      })
      .catch(() => {
        if (active) {
          setError('Nie udało się odczytać profilu. Spróbuj ponownie.');
          setOpen(true);
        }
      });
    return () => {
      active = false;
    };
  }, [db]);
  async function finish(experience: Experience, score: number | null) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(null);
    try {
      await db.runAsync(
        'INSERT INTO user_profile (id, experience, score) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET experience = excluded.experience, score = excluded.score',
        experience,
        score,
      );
      setProfile({ experience, score });
      setOpen(false);
    } catch {
      setError('Nie udało się zapisać. Spróbuj jeszcze raz.');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  useEffect(() => {
    if (!__DEV__) return;
    let active = true;
    devReset.current = () => {
      if (!active || lock.current) return;
      lock.current = true;
      db.runAsync('DELETE FROM user_profile WHERE id = 1')
        .then(() => {
          if (!active) return;
          setProfile(null);
          setError(null);
          setOpen(true);
        })
        .catch(() => Alert.alert('Reset nieudany', 'Nie udało się zresetować profilu.'))
        .finally(() => {
          lock.current = false;
        });
    };
    return () => {
      active = false;
      devReset.current = () => {};
    };
  }, [db]);
  return (
    <Context.Provider
      value={{
        profile,
        resetDevelopment: () => {
          if (__DEV__) devReset.current();
        },
      }}
    >
      {children}
      {open && (
        <OnboardingFlow
          initialExperience={profile?.experience}
          busy={busy}
          error={error}
          onFinish={finish}
          onDismiss={profile ? () => setOpen(false) : undefined}
        />
      )}
    </Context.Provider>
  );
}
