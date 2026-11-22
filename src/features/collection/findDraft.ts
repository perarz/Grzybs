import type { FindDetails } from './storage';

export type Place = { latitude: number; longitude: number };

/** What the details form edits: the weight stays text while it is being typed. */
export type FindDraft = { weight: string; place: Place | null; note: string };

const MAX_WEIGHT_GRAMS = 20000;

export function draftFrom(details: FindDetails): FindDraft {
  return {
    weight: details.weight_grams ? String(details.weight_grams) : '',
    place:
      details.latitude !== null && details.longitude !== null
        ? { latitude: details.latitude, longitude: details.longitude }
        : null,
    note: details.note ?? '',
  };
}

/** Explains why the typed weight can't be saved, or returns null when it can (empty is fine). */
export function weightError(draft: FindDraft): string | null {
  const text = draft.weight.trim();
  if (!text) return null;
  const grams = Number(text);
  if (!/^\d+$/.test(text) || grams < 1 || grams > MAX_WEIGHT_GRAMS) {
    return `Podaj wagę w gramach – liczbę od 1 do ${MAX_WEIGHT_GRAMS}.`;
  }
  return null;
}

export function detailsFrom(draft: FindDraft): FindDetails {
  const weight = draft.weight.trim();
  const note = draft.note.trim();
  return {
    weight_grams: weight && !weightError(draft) ? Number(weight) : null,
    latitude: draft.place?.latitude ?? null,
    longitude: draft.place?.longitude ?? null,
    note: note || null,
  };
}

export function formatWeight(grams: number) {
  return grams < 1000
    ? `${grams} g`
    : `${(grams / 1000).toLocaleString('pl-PL', { maximumFractionDigits: 2 })} kg`;
}

export function formatPlace(place: Place) {
  return `${place.latitude.toFixed(4)}, ${place.longitude.toFixed(4)}`;
}
