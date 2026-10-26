// Bulk-imports every image in the photo-inbox/ folder.
//
//   npm run import
//
// For each image it saves a web-sized copy (metadata stripped) and a .yaml
// file in src/content/photos/, filled in from the EXIF data. Details that
// EXIF can't provide (species, location, category) are left as "TBC" for you
// to fill in. Originals are moved to photo-inbox/imported/ so nothing is
// imported twice.
import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';
import { IMAGE_EXT, PHOTOS, readExif, saveWebCopy, slugify } from './photo-utils.mjs';

const INBOX = path.resolve('photo-inbox');
const DONE = path.join(INBOX, 'imported');
fs.mkdirSync(DONE, { recursive: true });

const files = fs.readdirSync(INBOX).filter((f) => IMAGE_EXT.test(f)).sort();
if (!files.length) {
  console.log('No images found in photo-inbox/. Drop your JPEGs in there and run this again.');
  process.exit(0);
}

let ok = 0;
const failed = [];
for (const f of files) {
  const src = path.join(INBOX, f);
  try {
    const exif = await readExif(src);
    // "3-DSC01748.jpg" taken 22 Apr 2026 → "2026-04-22-dsc01748"
    const name = path.parse(f).name.replace(/^\d+[-_ ]+(?=\D)/, '');
    const base = slugify([exif.date, name].filter(Boolean).join('-')) || 'photo';
    let slug = base;
    for (let n = 2; fs.existsSync(path.join(PHOTOS, `${slug}.yaml`)); n++) slug = `${base}-${n}`;

    await saveWebCopy(src, path.join(PHOTOS, `${slug}.jpg`));
    const data = {
      title: 'TBC',
      image: `./${slug}.jpg`,
      category: 'Other',
      species: 'TBC',
      date: exif.date ?? new Date().toISOString().slice(0, 10),
      location: 'TBC',
      country: 'Singapore',
      ...(exif.coords && { coords: exif.coords }),
      ...(exif.camera && { camera: exif.camera }),
      ...(exif.lens && { lens: exif.lens }),
      ...(exif.settings && { settings: exif.settings }),
      ...(exif.rating && { rating: exif.rating }),
    };
    fs.writeFileSync(path.join(PHOTOS, `${slug}.yaml`), yaml.dump(data, { flowLevel: 1, lineWidth: -1 }));
    fs.renameSync(src, path.join(DONE, f));
    ok++;
    console.log(`✓ ${f} → ${slug}  ${[exif.camera, exif.lens, exif.settings].filter(Boolean).join(' | ') || '(no camera data found)'}`);
  } catch (err) {
    failed.push(f);
    console.log(`✗ ${f}: ${err.message}`);
  }
}

console.log(`\nImported ${ok} photo(s). Fill in species, category and location in src/content/photos/*.yaml (search for "TBC").`);
if (failed.length) console.log(`Couldn't read: ${failed.join(', ')}. Try exporting these as JPEG.`);
