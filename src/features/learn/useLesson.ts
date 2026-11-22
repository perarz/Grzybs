import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useReducer, useState } from 'react';

import { successHaptic, warningHaptic } from '@/features/feedback/haptics';
import { useLessonSounds } from '@/features/feedback/useLessonSounds';

import type { CourseLesson } from './course';
import { completeCourseStep } from './courseStorage';
import { lessonExercises } from './lessonExercises';
import {
  currentExercise,
  isComboMilestone,
  isFinished,
  lessonProgress,
  lessonXP,
  reduceLesson,
  startLesson,
} from './lessonSession';

// A test is passed with at most 20% of questions wrong the first time.
const TEST_PASS_SHARE = 0.2;

/** Runs one lesson: the exercise queue, feedback (sound, haptics) and saving the result. */
export function useLesson(lesson: CourseLesson) {
  const db = useSQLiteContext();
  const play = useLessonSounds();
  const [session, dispatch] = useReducer(reduceLesson, lesson, (value) =>
    startLesson(lessonExercises(value)),
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const finished = isFinished(session);
  const questions = session.queue.slice(0, session.total).filter((item) => item.kind === 'choice');
  const accuracy = questions.length
    ? Math.max(0, (questions.length - session.mistakes) / questions.length)
    : 1;
  const passed =
    !lesson.isTest || session.mistakes <= Math.floor(questions.length * TEST_PASS_SHARE);

  // Feedback follows the checked answer, not the button press, so it can never fire twice.
  useEffect(() => {
    if (session.status === 'correct') {
      successHaptic();
      play(isComboMilestone(session.combo) ? 'combo' : 'correct');
    } else if (session.status === 'wrong') {
      warningHaptic();
      play('wrong');
    }
    // Only a change of status should play a sound.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status]);

  useEffect(() => {
    if (finished && passed) play('complete');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  async function save() {
    if (saving || saved) return true;
    setSaving(true);
    setSaveError(null);
    try {
      await completeCourseStep(db, lesson.id, session.mistakes);
      setSaved(true);
      return true;
    } catch {
      setSaveError('Nie udało się zapisać postępu.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  return {
    session,
    exercise: currentExercise(session),
    progress: lessonProgress(session),
    finished,
    passed,
    accuracy,
    xp: lessonXP(lesson.isTest, session.mistakes),
    saving,
    saveError,
    select: (optionId: string) => dispatch({ type: 'select', optionId }),
    check: () => dispatch({ type: 'check' }),
    next: () => dispatch({ type: 'next' }),
    save,
  };
}
