import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

import { ChoiceExercise } from '@/components/lesson/ChoiceExercise';
import { LessonFooter } from '@/components/lesson/LessonFooter';
import { LessonResult } from '@/components/lesson/LessonResult';
import { LessonTopBar } from '@/components/lesson/LessonTopBar';
import { TeachRuleCard, TeachSpeciesCard } from '@/components/lesson/TeachCards';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { NotFound } from '@/components/NotFound';
import { courseLesson, type CourseLesson } from '@/features/learn/course';
import { useCourseProgress } from '@/features/learn/useCourseProgress';
import { useLesson } from '@/features/learn/useLesson';
import { durations, layout, spacing, useTheme } from '@/theme';

export default function LessonScreen() {
  // Typed explicitly: generated route types exist only while the dev server runs.
  const { id = '' } = useLocalSearchParams<{ id?: string }>();
  const lesson = /^\d+$/.test(id) ? courseLesson(Number(id)) : null;
  const progress = useCourseProgress();
  const [attempt, setAttempt] = useState(0);

  if (!lesson) return <NotFound message="Nie ma takiej lekcji." />;
  if (progress.completed && lesson.id > progress.completed.length) {
    return <NotFound message="Najpierw ukończ wcześniejsze lekcje." />;
  }
  // A new key starts the lesson over with freshly drawn questions.
  return <Lesson key={attempt} lesson={lesson} onRetry={() => setAttempt((value) => value + 1)} />;
}

function Lesson({ lesson, onRetry }: { lesson: CourseLesson; onRetry: () => void }) {
  const { colors } = useTheme();
  const run = useLesson(lesson);
  const exercise = run.exercise;
  const [quitting, setQuitting] = useState(false);

  function leave() {
    if (run.finished) return router.back();
    setQuitting(true);
  }

  // The Android back button asks first too, instead of dropping the lesson silently.
  useEffect(() => {
    if (run.finished) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setQuitting(true);
      return true;
    });
    return () => subscription.remove();
  }, [run.finished]);

  async function finish() {
    if (run.passed && !(await run.save())) return;
    router.back();
  }

  if (run.finished || !exercise) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <LessonResult
          title={lesson.title}
          passed={run.passed}
          xp={run.xp}
          accuracy={run.accuracy}
          bestCombo={run.session.bestCombo}
          perfect={run.session.mistakes === 0}
          saving={run.saving}
          error={run.saveError}
          onContinue={() => void finish()}
          onRetry={onRetry}
        />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <LessonTopBar progress={run.progress} combo={run.session.combo} onClose={leave} />
      <ScrollView contentContainerStyle={styles.body}>
        {/* Each card slides in from the right, like turning a page in a field notebook. */}
        <Animated.View
          key={run.session.index}
          entering={(run.session.index === 0 ? FadeIn : SlideInRight).duration(durations.base)}
        >
          {exercise.kind === 'teach-species' ? (
            <TeachSpeciesCard speciesId={exercise.speciesId} />
          ) : exercise.kind === 'teach-rule' ? (
            <TeachRuleCard ruleId={exercise.ruleId} />
          ) : (
            <ChoiceExercise
              exercise={exercise}
              selected={run.session.selected}
              status={run.session.status}
              onSelect={run.select}
            />
          )}
        </Animated.View>
      </ScrollView>
      <LessonFooter
        mode={exercise.kind === 'choice' ? run.session.status : 'teach'}
        canCheck={run.session.selected !== null}
        explanation={exercise.kind === 'choice' ? exercise.explanation : undefined}
        combo={run.session.combo}
        onCheck={run.check}
        onNext={run.next}
      />
      {quitting && (
        <ConfirmDialog
          title="Przerwać lekcję?"
          message={
            run.progress > 0
              ? `Masz za sobą ${Math.round(run.progress * 100)}% lekcji. Jeśli wyjdziesz, postęp przepadnie.`
              : 'Jeśli wyjdziesz, postęp tej lekcji przepadnie.'
          }
          cancelLabel="Ucz się dalej"
          confirmLabel="Przerwij"
          onCancel={() => setQuitting(false)}
          onConfirm={() => {
            setQuitting(false);
            router.back();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  body: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
