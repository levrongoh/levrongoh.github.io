// Generates soft "landscape" placeholder images for the sample content.
// Safe to delete once you've replaced the samples with your own photos.
import sharp from 'sharp';
import path from 'node:path';

const out = path.resolve('src/content');

const items = [
  // file, width, height, [sky top, sky bottom, far, near], sun?
  ['photos/sample-buffy-fish-owl.jpg', 1600, 2000, ['#1d2a22', '#5b6b47', '#2c3a26', '#141c12'], false],
  ['photos/sample-collared-kingfisher.jpg', 2400, 1600, ['#3d6f8a', '#a9c6c9', '#4f6d55', '#223428'], true],
  ['photos/sample-estuarine-crocodile.jpg', 2400, 1350, ['#59633f', '#b8a774', '#4b4a2c', '#262413'], false],
  ['photos/sample-smooth-coated-otters.jpg', 2400, 1600, ['#2b3f55', '#c98d5d', '#3a4148', '#1a1f24'], true],
  ['photos/sample-oriental-pied-hornbill.jpg', 1600, 2000, ['#7c9a8e', '#d9d2b0', '#40553d', '#1e2a1c'], false],
  ['photos/sample-mangrove-dawn.jpg', 2400, 1350, ['#24304f', '#e7a86b', '#3a3a4a', '#15161d'], true],
  ['photos/sample-rainforest-canopy.jpg', 2400, 1600, ['#9db7a0', '#e4e2c6', '#4c6b47', '#1c2b19'], false],
  ['photos/sample-black-and-yellow-broadbill.jpg', 2000, 2000, ['#1f3326', '#6b8a4f', '#2a4129', '#101a10'], false],
  ['photos/sample-common-birdwing.jpg', 2400, 1600, ['#3f5a2d', '#d4c35a', '#4a6631', '#1b2810'], true],
  ['journal/sample-sungei-buloh.jpg', 2400, 1350, ['#2b3a5a', '#f0b27a', '#38434d', '#161b20'], true],
  ['journal/sample-botanic-gardens.jpg', 2400, 1350, ['#24382a', '#8ea37a', '#2f4430', '#121a12'], false],
  ['journal/sample-taman-negara.jpg', 2400, 1350, ['#7f9fa0', '#e6dcb8', '#4b6650', '#1a2a1d'], true],
];

const hills = (w, h, base, amp, seed) => {
  let d = `M0 ${h}`;
  for (let x = 0; x <= w; x += w / 24) {
    const y = base + Math.sin(x / (w / 5) + seed) * amp + Math.sin(x / (w / 13) + seed * 2) * amp * 0.4;
    d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
  }
  return d + ` L${w} ${h} Z`;
};

for (const [i, [file, w, h, [top, bottom, far, near], sun]] of items.entries()) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
      <radialGradient id="vig" cx="0.5" cy="0.45" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#sky)"/>
    ${sun ? `<circle cx="${w * 0.68}" cy="${h * 0.5}" r="${Math.min(w, h) * 0.09}" fill="#fff2d6" opacity="0.55"/>` : ''}
    <path d="${hills(w, h, h * 0.62, h * 0.05, i)}" fill="${far}" opacity="0.85"/>
    <path d="${hills(w, h, h * 0.78, h * 0.06, i + 3)}" fill="${near}"/>
    <rect width="100%" height="100%" fill="url(#vig)"/>
    <text x="${w / 2}" y="${h * 0.9}" text-anchor="middle" font-family="Helvetica, Arial" font-size="${Math.round(w / 55)}" letter-spacing="${w / 160}" fill="#ffffff" opacity="0.35">SAMPLE IMAGE</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(path.join(out, file));
  console.log('✓', file);
}
