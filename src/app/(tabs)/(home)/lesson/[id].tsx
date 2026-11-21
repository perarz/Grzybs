import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { View } from 'react-native';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { CourseQuizTask } from '@/components/learn/CourseQuizTask';
import { CoursePhotoTask } from '@/components/learn/CoursePhotoTask';
import { courseStep } from '@/features/learn/course';
import { useCourseProgress } from '@/features/learn/useCourseProgress';
import { completeCourseStep } from '@/features/learn/courseStorage';
import { spacing } from '@/theme';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Lesson key={id} id={id} />;
}

function Lesson({ id }: { id: string }) {
  const step = /^\d+$/.test(id ?? '') ? courseStep(Number(id)) : null;
  const db = useSQLiteContext();
  const progress = useCourseProgress();
  const [homePractice, setHomePractice] = useState(false);
  const [questionPage, setQuestionPage] = useState(0);
  const allowed = step && progress.completed && step.id <= progress.completed.length;
  async function finish() {
    if (!step) return;
    await completeCourseStep(db, step.id);
    router.dismissTo('/learn');
  }
  return (
    <Screen
      title={step?.title ?? 'Nie ma takiego kroku'}
      eyebrow={step ? `Etap ${step.stage + 1} · krok ${step.position + 1}/10` : 'Nauka'}
      showBack
      resetScrollKey={questionPage}
    >
      {!step ? (
        <Button label="Wróć do ścieżki" onPress={() => router.replace('/learn')} />
      ) : progress.error ? (
        <Button label="Ponów odczyt" onPress={progress.retry} />
      ) : !progress.completed ? (
        <AppText>Wczytuję…</AppText>
      ) : !allowed ? (
        <AppText>Najpierw ukończ poprzedni krok.</AppText>
      ) : step.kind === 'photo' && !homePractice ? (
        <View style={{ gap: spacing.lg }}>
          <CoursePhotoTask onComplete={finish} />
          <Button
            label="Ćwicz ze zdjęciem z atlasu"
            variant="secondary"
            onPress={() => setHomePractice(true)}
          />
        </View>
      ) : (
        <CourseQuizTask
          key={step.id}
          step={homePractice ? { ...step, kind: 'identify' } : step}
          onComplete={finish}
          onAdvance={() => setQuestionPage((page) => page + 1)}
        />
      )}
    </Screen>
  );
}
