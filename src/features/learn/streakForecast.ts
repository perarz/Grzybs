import type { LearningJourney } from './journey';

/** The streak after finishing a lesson now: today's first lesson adds a day, the next ones don't. */
export function streakAfterLesson(journey: Pick<LearningJourney, 'streak' | 'completedToday'>) {
  return {
    before: journey.streak,
    after: journey.completedToday ? journey.streak : journey.streak + 1,
    grows: !journey.completedToday,
  };
}
