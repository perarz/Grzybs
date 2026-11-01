import { MONTH_NAMES } from './labels';
import type { Month } from './types';

export const ALL_MONTHS: Month[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function getCurrentMonth(date = new Date()): Month {
  return ALL_MONTHS[date.getMonth()];
}

type MonthRange = { from: Month; to: Month };

/** Groups months into continuous ranges, e.g. [5, 6, 7, 10] → May–July and October. */
export function getSeasonRanges(months: Month[]): MonthRange[] {
  const inSeason = new Set(months);
  const offSeasonIndex = ALL_MONTHS.findIndex((month) => !inSeason.has(month));
  if (offSeasonIndex === -1) return [{ from: 1, to: 12 }];

  // Walk the year starting right after an off-season month,
  // so a season that crosses New Year (e.g. November–February) stays one range.
  const ranges: MonthRange[] = [];
  let rangeStart: Month | null = null;
  let previous = ALL_MONTHS[offSeasonIndex];

  for (let step = 1; step <= ALL_MONTHS.length; step++) {
    const month = ALL_MONTHS[(offSeasonIndex + step) % ALL_MONTHS.length];
    if (inSeason.has(month) && rangeStart === null) {
      rangeStart = month;
    }
    if (!inSeason.has(month) && rangeStart !== null) {
      ranges.push({ from: rangeStart, to: previous });
      rangeStart = null;
    }
    previous = month;
  }
  return ranges;
}

/** E.g. "maj – listopad" or "cały rok". */
export function formatSeason(months: Month[]): string {
  if (months.length === 0) return 'brak danych';
  if (new Set(months).size === ALL_MONTHS.length) return 'cały rok';

  return getSeasonRanges(months)
    .map(({ from, to }) =>
      from === to ? MONTH_NAMES[from] : `${MONTH_NAMES[from]} – ${MONTH_NAMES[to]}`,
    )
    .join(', ');
}
