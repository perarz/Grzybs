export type LearningRecord = { score: number; total: number; completed_at: number };
export const LEVELS = [
  { name: 'Początkujący', xp: 0 },
  { name: 'Odkrywca', xp: 100 },
  { name: 'Obserwator', xp: 250 },
  { name: 'Tropiciel', xp: 500 },
  { name: 'Znawca atlasu', xp: 900 },
  { name: 'Zaawansowany', xp: 1400 },
] as const;
const DAY = 86_400_000;
// Calendar days, not elapsed 24-hour periods: a DST change must not break a streak.
export function calendarDay(timestamp: number) {
  const date = new Date(timestamp);
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY;
}
export function roundXP(score: number, total: number) {
  return 10 + Math.round((20 * score) / total);
}
export function learningJourney(records: LearningRecord[], now: number) {
  const today = calendarDay(now);
  const days = new Set<number>();
  let xp = 0;
  for (const record of records) {
    if (record.completed_at > now || !Number.isFinite(record.completed_at)) continue;
    if (
      !Number.isInteger(record.total) ||
      record.total <= 0 ||
      !Number.isInteger(record.score) ||
      record.score < 0 ||
      record.score > record.total
    )
      continue;
    xp += roundXP(record.score, record.total);
    days.add(calendarDay(record.completed_at));
  }
  const completedToday = days.has(today);
  let streak = 0;
  for (let day = completedToday ? today : today - 1; days.has(day); day--) streak++;
  let bestStreak = 0;
  let run = 0;
  let previous = -Infinity;
  for (const day of [...days].sort((a, b) => a - b)) {
    run = day === previous + 1 ? run + 1 : 1;
    bestStreak = Math.max(bestStreak, run);
    previous = day;
  }
  const levelIndex = LEVELS.reduce(
    (current, level, index) => (xp >= level.xp ? index : current),
    0,
  );
  const level = LEVELS[levelIndex];
  const next = LEVELS[levelIndex + 1];
  return {
    xp,
    streak,
    bestStreak,
    completedToday,
    level,
    next,
    levelNumber: levelIndex + 1,
    fraction: next ? (xp - level.xp) / (next.xp - level.xp) : 1,
    week: Array.from({ length: 7 }, (_, index) => {
      const day = today - 6 + index;
      return {
        day,
        done: days.has(day),
        label: ['N', 'P', 'W', 'Ś', 'C', 'P', 'S'][new Date(day * DAY).getUTCDay()],
      };
    }),
  };
}
export type LearningJourney = ReturnType<typeof learningJourney>;
