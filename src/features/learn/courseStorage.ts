import type { SQLiteDatabase } from 'expo-sqlite';

import { COURSE_LENGTH, courseLesson } from './course';
import { lessonXP } from './lessonSession';

export type CourseStepRecord = { step_id: number; completed_at: number; mistakes: number };

export function readCourseSteps(db: SQLiteDatabase): Promise<CourseStepRecord[]> {
  return db.getAllAsync<CourseStepRecord>(
    'SELECT step_id, completed_at, mistakes FROM course_steps WHERE step_id < ? ORDER BY step_id ASC',
    COURSE_LENGTH,
  );
}

export async function completeCourseStep(
  db: SQLiteDatabase,
  stepId: number,
  mistakes = 0,
): Promise<void> {
  if (!Number.isInteger(stepId) || stepId < 0 || stepId >= COURSE_LENGTH) {
    throw new Error('Nieprawidłowy krok nauki.');
  }
  const safeMistakes = Number.isInteger(mistakes) && mistakes > 0 ? mistakes : 0;
  const now = Date.now();
  const date = new Date(now);
  const day = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
  await db.withExclusiveTransactionAsync(async (transaction) => {
    // The condition is part of the write, so a lesson cannot skip an unfinished predecessor.
    // A replay keeps the first completion date and remembers the best result.
    await transaction.runAsync(
      `INSERT INTO course_steps (step_id, completed_at, mistakes)
       SELECT ?, ?, ? WHERE (SELECT COUNT(*) FROM course_steps WHERE step_id < ?) = ?
       ON CONFLICT(step_id) DO UPDATE SET mistakes = MIN(mistakes, excluded.mistakes)`,
      stepId,
      now,
      safeMistakes,
      stepId,
      stepId,
    );
    const completed = await transaction.getFirstAsync<{ step_id: number }>(
      'SELECT step_id FROM course_steps WHERE step_id = ?',
      stepId,
    );
    if (!completed) throw new Error('Najpierw ukończ wcześniejsze lekcje.');
    // Replaying a completed lesson also keeps the daily habit, without unlocking another one.
    await transaction.runAsync(
      `INSERT INTO course_activity (day_key, completed_at) VALUES (?, ?)
       ON CONFLICT(day_key) DO NOTHING`,
      day,
      now,
    );
  });
}

/** Total experience from finished lessons. */
export function courseXP(records: CourseStepRecord[]) {
  return records.reduce(
    (sum, record) => sum + lessonXP(courseLesson(record.step_id)?.isTest ?? false, record.mistakes),
    0,
  );
}
