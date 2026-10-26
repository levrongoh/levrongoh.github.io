// Shared helpers for the photo import scripts.
import exifr from 'exifr';
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

export const PHOTOS = path.resolve('src/content/photos');
export const JOURNAL = path.resolve('src/content/journal');
export const CATEGORIES = ['Birds', 'Mammals', 'Reptiles & Amphibians', 'Insects', 'Landscapes', 'Other'];
export const IMAGE_EXT = /\.(jpe?g|png|tiff?|webp|heic|heif)$/i;

export const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-');

// EXIF times are local to wherever the photo was taken; keep that calendar day
// (toISOString would shift it to UTC, e.g. 7am in Singapore → the previous day).
const localDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const fmtShutter = (t) => (t >= 1 ? `${t}s` : `1/${Math.round(1 / t)}s`);

// Cameras and lenses report model codes; map the common ones to the names people know.
// Add your own gear here if it shows up oddly.
const FRIENDLY = [
  [/^SONY ILCE-7CM2$/i, 'Sony A7C II'],
  [/^SONY ILCE-7M4$/i, 'Sony A7 IV'],
  [/^SONY ILCE-7RM5$/i, 'Sony A7R V'],
  [/^SONY ILCE-1$/i, 'Sony A1'],
  [/^SONY ILCE-6700$/i, 'Sony A6700'],
  [/^E 70-300mm F4\.5-6\.3 A047$/i, 'Tamron 70-300mm F4.5-6.3 Di III RXD'],
  [/^E 150-500mm F5-6\.7 A057$/i, 'Tamron 150-500mm F5-6.7 Di III VC VXD'],
  [/^E 50-400mm F4\.5-6\.3 A067$/i, 'Tamron 50-400mm F4.5-6.3 Di III VC VXD'],
  [/^FE /, (m, s) => `Sony ${s}`],
];
const friendly = (s) => {
  for (const [re, name] of FRIENDLY) if (re.test(s)) return typeof name === 'function' ? name(null, s) : name;
  return s;
};

/** Reads date, camera, lens, settings, GPS and star rating from a photo's metadata. */
export async function readExif(file) {
  const e = (await exifr.parse(file, { gps: true, xmp: true }).catch(() => null)) ?? {};
  const make = (e.Make ?? '').trim();
  const model = (e.Model ?? '').trim();
  // "NIKON CORPORATION" + "NIKON Z 8" → "NIKON Z 8"; "Canon" + "Canon EOS R5" → "Canon EOS R5"
  const brand = make.split(/\s+/)[0] ?? '';
  const camera = friendly(brand && model.toLowerCase().startsWith(brand.toLowerCase()) ? model : [make, model].filter(Boolean).join(' '));
  const lens = friendly((e.LensModel ?? e.Lens ?? '').trim());
  const settings = [
    e.FocalLength && `${Math.round(e.FocalLength)}mm`,
    e.FNumber && `f/${e.FNumber}`,
    e.ExposureTime && fmtShutter(e.ExposureTime),
    (e.ISO ?? e.ISOSpeedRatings) && `ISO ${e.ISO ?? e.ISOSpeedRatings}`,
  ]
    .filter(Boolean)
    .join(' · ');
  const date = e.DateTimeOriginal ?? e.CreateDate;
  const coords = typeof e.latitude === 'number' ? [Number(e.latitude.toFixed(4)), Number(e.longitude.toFixed(4))] : undefined;
  return {
    date: date instanceof Date ? localDay(date) : undefined,
    camera: camera || undefined,
    lens: lens || undefined,
    settings: settings || undefined,
    coords,
    rating: Number.isInteger(e.Rating) && e.Rating > 0 ? Math.min(e.Rating, 5) : undefined, // Lightroom stars
  };
}

/** Saves a web-sized JPEG copy with all metadata (including GPS) removed. */
export async function saveWebCopy(src, dest) {
  // sharp can't decode iPhone HEIC files, so convert them with macOS's built-in `sips` first.
  let input = src;
  if (/\.hei[cf]$/i.test(src)) {
    input = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'heic-')), 'photo.jpg');
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '100', src, '--out', input], { stdio: 'ignore' });
  }
  await sharp(input)
    .rotate() // apply EXIF orientation before metadata is stripped
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(dest);
}
