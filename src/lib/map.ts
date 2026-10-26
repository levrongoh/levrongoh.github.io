import { getImage } from 'astro:assets';
import type { MapPoint } from '../components/MapView.astro';
import { formatDate, formatRange, fuzz, placeName, type Entry, type Photo } from './content';

export async function photoPoints(photos: Photo[]): Promise<MapPoint[]> {
  return Promise.all(
    photos
      .filter((p) => p.data.coords)
      .map(async (p) => {
        const [lat, lng] = fuzz(p.data.coords!);
        const thumb = await getImage({ src: p.data.image, width: 160, height: 160, fit: 'cover', format: 'webp' });
        return {
          lat,
          lng,
          kind: 'photo' as const,
          title: p.data.species ?? p.data.title,
          sub: `${placeName(p.data)} · ${formatDate(p.data.date)}`,
          href: `/photos/${p.id}/`,
          thumb: thumb.src,
        };
      }),
  );
}

export async function tripPoints(entries: Entry[]): Promise<MapPoint[]> {
  return Promise.all(
    entries
      .filter((e) => e.data.coords)
      .map(async (e) => {
        const [lat, lng] = fuzz(e.data.coords!);
        const thumb = e.data.cover
          ? (await getImage({ src: e.data.cover, width: 160, height: 160, fit: 'cover', format: 'webp' })).src
          : undefined;
        return {
          lat,
          lng,
          kind: 'trip' as const,
          title: e.data.title,
          sub: `Journal · ${formatRange(e.data.date, e.data.endDate)}`,
          href: `/journal/${e.id}/`,
          thumb,
        };
      }),
  );
}
