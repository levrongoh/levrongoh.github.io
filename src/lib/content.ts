import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../site.config';

// Image sizes shared across pages, so the same files are reused rather than
// generated again (keeps the published site small). Quality 75 is visually
// indistinguishable from higher settings on screen.
export const IMG = {
  quality: 75,
  grid: [480, 800, 1400], // gallery tiles
  large: [800, 1400, 2000], // full-width photos; 2000 is also the full-screen viewer size
};

export type Photo = CollectionEntry<'photos'>;
export type Entry = CollectionEntry<'journal'>;

const newestFirst = <T extends { data: { date: Date } }>(a: T, b: T) =>
  b.data.date.valueOf() - a.data.date.valueOf();

/**
 * Photo order used everywhere on the site: highest-rated first, then earliest
 * date first. Unrated photos (rating 0) come after all rated ones.
 */
const byRatingThenOldest = (a: Photo, b: Photo) =>
  b.data.rating - a.data.rating || a.data.date.valueOf() - b.data.date.valueOf() || a.id.localeCompare(b.id);

export async function getPhotos(): Promise<Photo[]> {
  return (await getCollection('photos', (p) => !p.data.hidden)).sort(byRatingThenOldest);
}

export async function getEntries(): Promise<Entry[]> {
  return (await getCollection('journal', (e) => import.meta.env.DEV || !e.data.draft)).sort(newestFirst);
}

export function formatDate(d: Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return d.toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts });
}

export function formatRange(start: Date, end?: Date) {
  if (!end) return formatDate(start);
  return `${formatDate(start, { day: 'numeric', month: 'short' })} – ${formatDate(end)}`;
}

export function placeName(d: { location: string; country?: string }) {
  return d.country && d.country !== d.location ? `${d.location}, ${d.country}` : d.location;
}

/** Rounds coordinates so sensitive sites can't be pinpointed. */
export function fuzz([lat, lng]: [number, number]): [number, number] {
  const f = 10 ** site.mapPrecision;
  return [Math.round(lat * f) / f, Math.round(lng * f) / f];
}

/** A species name counts once it's filled in and not marked unconfirmed with "?". */
export const confirmedSpecies = (p: Photo) => {
  const s = p.data.species;
  return s && s !== 'TBC' && !s.includes('?') ? s : undefined;
};
