// Adds a photo to the gallery.
//
//   npm run add-photo -- ~/Pictures/owl.jpg [more.jpg ...]
//
// For each image it:
//   • reads date, camera, lens, settings and GPS from the EXIF data
//   • asks you for the title, species, location, category and journal trip
//   • saves a web-sized copy (max 2400px, all metadata stripped, so the exact
//     GPS position isn't published) plus a .yaml file in src/content/photos/
import yaml from 'js-yaml';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { CATEGORIES, JOURNAL, PHOTOS, readExif, saveWebCopy, slugify } from './photo-utils.mjs';

const files = process.argv.slice(2);
if (!files.length) {
  console.log('Usage: npm run add-photo -- path/to/photo.jpg [another.jpg ...]');
  process.exit(1);
}

const rl = readline.createInterface({ input, output });
const lines = rl[Symbol.asyncIterator]();
const ask = async (q, def = '') => {
  output.write(def ? `${q} [${def}]: ` : `${q}: `);
  const { value = '' } = await lines.next();
  return value.trim() || def;
};

const trips = fs
  .readdirSync(JOURNAL)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''))
  .sort()
  .reverse();

for (const file of files) {
  const src = path.resolve(file.replace(/^~/, process.env.HOME));
  if (!fs.existsSync(src)) {
    console.log(`✗ Not found: ${src}`);
    continue;
  }
  console.log(`\n── ${path.basename(src)} ──`);

  const { date, camera, lens, settings, coords: gps } = await readExif(src);
  if (date || camera || settings) console.log(`  EXIF: ${[date, camera, lens, settings].filter(Boolean).join(' | ')}`);

  const species = await ask('Species (blank for landscapes etc.)');
  const scientific = species ? await ask('Scientific name (optional)') : '';
  const title = await ask('Title / caption', species);
  const category = await ask(`Category (${CATEGORIES.join(', ')})`, species ? 'Birds' : 'Landscapes');
  const location = await ask('Location (e.g. Sungei Buloh Wetland Reserve)');
  const country = await ask('Country', 'Singapore');
  const coords = await ask('Coordinates "lat, lng" (optional, rounded on the map)', gps ? gps.join(', ') : '');
  if (trips.length) console.log(`  Journal entries: ${trips.join(', ')}`);
  const trip = await ask('Link to journal entry (optional)');
  const story = await ask('Short story / note (optional)');
  const featured = /^y/i.test(await ask('Feature on home page? (y/n)', 'n'));

  const base = slugify(species || title || path.parse(src).name) || 'photo';
  let slug = base;
  for (let n = 2; fs.existsSync(path.join(PHOTOS, `${slug}.yaml`)); n++) slug = `${base}-${n}`;

  await saveWebCopy(src, path.join(PHOTOS, `${slug}.jpg`));

  const data = {
    title,
    image: `./${slug}.jpg`,
    category: CATEGORIES.find((c) => c.toLowerCase() === category.toLowerCase()) ?? 'Other',
    ...(species && { species }),
    ...(scientific && { scientific }),
    date: date ?? new Date().toISOString().slice(0, 10),
    location: location || 'Unknown',
    ...(country && { country }),
    ...(coords && { coords: coords.split(',').map((n) => Number(Number(n.trim()).toFixed(4))) }),
    ...(trip && { trip }),
    ...(story && { story }),
    ...(camera && { camera }),
    ...(lens && { lens }),
    ...(settings && { settings }),
    ...(featured && { featured }),
  };
  fs.writeFileSync(path.join(PHOTOS, `${slug}.yaml`), yaml.dump(data, { flowLevel: 1, lineWidth: -1 }));
  console.log(`✓ Added src/content/photos/${slug}.yaml (edit it any time)`);
}

rl.close();
