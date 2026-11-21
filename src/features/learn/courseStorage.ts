import type { SQLiteDatabase } from 'expo-sqlite';

export type CourseStepRecord = { step_id: number; completed_at: number };

export function readCourseSteps(db: SQLiteDatabase): Promise<CourseStepRecord[]> {
  return db.getAllAsync<CourseStepRecord>(
    'SELECT step_id, completed_at FROM course_steps ORDER BY step_id ASC LIMIT 50',
  );
}

export async function completeCourseStep(db: SQLiteDatabase, stepId: number): Promise<void> {
  if (!Number.isInteger(stepId) || stepId < 0 || stepId >= 50) {
    throw new Error('Nieprawidłowy krok nauki.');
  }
  const now = Date.now();
  const date = new Date(now);
  const day = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
  await db.withExclusiveTransactionAsync(async (transaction) => {
    // The condition is part of the write, so a step cannot skip an unfinished predecessor.
    await transaction.runAsync(
      `INSERT INTO course_steps (step_id, completed_at)
       SELECT ?, ? WHERE (SELECT COUNT(*) FROM course_steps WHERE step_id < ?) = ?
       ON CONFLICT(step_id) DO NOTHING`,
      stepId,
      now,
      stepId,
      stepId,
    );
    const completed = await transaction.getFirstAsync<{ step_id: number }>(
      'SELECT step_id FROM course_steps WHERE step_id = ?',
      stepId,
    );
    if (!completed) throw new Error('Najpierw ukończ wcześniejsze kroki nauki.');
    // Replaying a completed lesson also keeps the daily habit, without granting another step.
    await transaction.runAsync(
      `INSERT INTO course_activity (day_key, completed_at) VALUES (?, ?)
       ON CONFLICT(day_key) DO NOTHING`,
      day,
      now,
    );
  });
}
