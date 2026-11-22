const DAY = 86_400_000;

/** One square of the calendar: a day number (as in `calendarDay`) and the day of the month. */
export type CalendarCell = { day: number; date: number } | null;

/** The weeks of one month, Monday first, with empty cells before the 1st and after the last day. */
export function monthWeeks(year: number, month: number): CalendarCell[][] {
  const first = Date.UTC(year, month, 1) / DAY;
  const length = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const offset = (new Date(first * DAY).getUTCDay() + 6) % 7;
  const cells: CalendarCell[] = [
    ...Array<CalendarCell>(offset).fill(null),
    ...Array.from({ length }, (_, index) => ({ day: first + index, date: index + 1 })),
  ];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, week) => cells.slice(week * 7, week * 7 + 7));
}

/** Year and month (0–11) of a calendar day number. */
export function monthOf(day: number) {
  const date = new Date(day * DAY);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
}

/** A calendar day number as a local date, ready for `toLocaleDateString`. */
export function localDate(day: number) {
  const date = new Date(day * DAY);
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}
