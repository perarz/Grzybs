import { LESSONS_PER_STAGE } from './course';
import { LEVELS } from './journey';
import { lessonXP } from './lessonSession';

/** One rank per finished stage: five stages lead through the six ranks. */
export function rankIndex(completedSteps: number) {
  return Math.min(LEVELS.length - 1, Math.floor(completedSteps / LESSONS_PER_STAGE));
}

/** What earns experience, worked out from the same rule the lessons use. */
export const XP_RULES = {
  lesson: lessonXP(false, 1),
  test: lessonXP(true, 1),
  perfectBonus: lessonXP(false, 0) - lessonXP(false, 1),
};
