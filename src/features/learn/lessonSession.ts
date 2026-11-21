import type { Exercise } from './exercises';

export type LessonSession = {
  queue: Exercise[];
  index: number;
  /** Exercises in the original lesson – the progress bar's 100%. */
  total: number;
  /** Exercises finished correctly (or teaching cards read). */
  done: number;
  selected: string | null;
  status: 'answering' | 'correct' | 'wrong';
  mistakes: number;
  combo: number;
  bestCombo: number;
};

export type LessonAction =
  { type: 'select'; optionId: string } | { type: 'check' } | { type: 'next' };

export function startLesson(exercises: Exercise[]): LessonSession {
  return {
    queue: exercises,
    index: 0,
    total: exercises.length,
    done: 0,
    selected: null,
    status: 'answering',
    mistakes: 0,
    combo: 0,
    bestCombo: 0,
  };
}

export function currentExercise(session: LessonSession): Exercise | null {
  return session.queue[session.index] ?? null;
}

export function isFinished(session: LessonSession) {
  return session.index >= session.queue.length;
}

export function lessonProgress(session: LessonSession) {
  return session.total === 0 ? 1 : session.done / session.total;
}

export function reduceLesson(session: LessonSession, action: LessonAction): LessonSession {
  const exercise = currentExercise(session);
  if (!exercise) return session;
  switch (action.type) {
    case 'select':
      if (exercise.kind !== 'choice' || session.status !== 'answering') return session;
      return { ...session, selected: action.optionId };
    case 'check': {
      if (exercise.kind !== 'choice' || session.status !== 'answering' || !session.selected)
        return session;
      if (session.selected === exercise.correctId) {
        const combo = session.combo + 1;
        return {
          ...session,
          status: 'correct',
          combo,
          bestCombo: Math.max(session.bestCombo, combo),
        };
      }
      // A wrong answer comes back at the end of the lesson, until it is answered correctly.
      // The answers move one place, so the repeat can't be passed by remembering a position.
      const [first, ...rest] = exercise.options;
      return {
        ...session,
        status: 'wrong',
        combo: 0,
        mistakes: session.mistakes + 1,
        queue: [...session.queue, { ...exercise, options: [...rest, first] }],
      };
    }
    case 'next': {
      if (exercise.kind === 'choice' && session.status === 'answering') return session;
      const counts = exercise.kind !== 'choice' || session.status === 'correct';
      return {
        ...session,
        index: session.index + 1,
        done: session.done + (counts ? 1 : 0),
        selected: null,
        status: 'answering',
      };
    }
  }
}

/** Experience for a finished lesson: tests are worth more, a lesson without mistakes earns a bonus. */
export function lessonXP(isTest: boolean, mistakes: number) {
  return (isTest ? 20 : 10) + (mistakes === 0 ? 5 : 0);
}

/** A combo is worth celebrating every third correct answer in a row. */
export function isComboMilestone(combo: number) {
  return combo > 0 && combo % 3 === 0;
}
