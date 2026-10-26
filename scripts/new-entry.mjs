// Creates a new journal entry.
//
//   npm run new-entry
//   npm run new-entry -- ~/Pictures/cover.jpg     (optional cover photo)
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { saveWebCopy } from './photo-utils.mjs';

const JOURNAL = path.resolve('src/content/journal');
const rl = readline.createInterface({ input, output });
const lines = rl[Symbol.asyncIterator]();
const ask = async (q, def = '') => {
  output.write(def ? `${q} [${def}]: ` : `${q}: `);
  const { value = '' } = await lines.next();
  return value.trim() || def;
};
const slugify = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-');

const today = new Date().toISOString().slice(0, 10);
const title = await ask('Title (e.g. A Week in Borneo)');
const date = await ask('Start date (YYYY-MM-DD)', today);
const endDate = await ask('End date (optional, for multi-day trips)');
const location = await ask('Location');
const country = await ask('Country', 'Singapore');
const coords = await ask('Coordinates "lat, lng" (optional, for the map)');
const summary = await ask('One-line summary');
rl.close();

const slug = `${date.slice(0, 7)}-${slugify(title)}`;
const file = path.join(JOURNAL, `${slug}.md`);
if (fs.existsSync(file)) {
  console.log(`✗ ${file} already exists`);
  process.exit(1);
}

let cover = '';
const coverSrc = process.argv[2];
if (coverSrc) {
  const out = `${slug}.jpg`;
  await saveWebCopy(path.resolve(coverSrc.replace(/^~/, process.env.HOME)), path.join(JOURNAL, out));
  cover = `cover: ./${out}\n`;
}

const q = (s) => JSON.stringify(s);
fs.writeFileSync(
  file,
  `---
title: ${q(title)}
date: ${date}
${endDate ? `endDate: ${endDate}\n` : ''}location: ${q(location)}
country: ${q(country)}
${coords ? `coords: [${coords}]\n` : ''}${cover}summary: ${q(summary)}
draft: true   # change to false (or delete this line) to publish
---

Write your story here. Markdown works: **bold**, *italic*, [links](https://example.com), lists, and

## Headings

To add a photo inside the text, put the image file next to this one and write:

![Description of the photo](./my-photo.jpg)

To list photos from this trip at the bottom of the page automatically, set
\`trip: ${slug}\` in each photo's .yaml file (add-photo asks you for this).
`,
);
console.log(`\n✓ Created src/content/journal/${slug}.md (marked as a draft)`);
