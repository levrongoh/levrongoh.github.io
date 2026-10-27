// Photo manager: rate, hide, feature and caption your photos in the browser.
//
//   npm run rate      → opens http://localhost:4400
//
// Changes save straight into each photo's .yaml file. Runs only on your
// computer; it isn't part of the published site.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import sharp from 'sharp';
import yaml from 'js-yaml';
import { CATEGORIES, PHOTOS } from './photo-utils.mjs';

const PORT = 4400;
const THUMBS = path.resolve('node_modules/.cache/photo-thumbs');
fs.mkdirSync(THUMBS, { recursive: true });

const EDITABLE = { rating: 'number', hidden: 'boolean', featured: 'boolean', title: 'string', species: 'string', scientific: 'string', location: 'string', category: 'string', story: 'string' };

const ids = () => fs.readdirSync(PHOTOS).filter((f) => /\.ya?ml$/.test(f)).map((f) => f.replace(/\.ya?ml$/, ''));
const yamlPath = (id) => {
  if (!ids().includes(id)) throw new Error('Unknown photo');
  return ['yaml', 'yml'].map((e) => path.join(PHOTOS, `${id}.${e}`)).find(fs.existsSync);
};
const load = (id) => yaml.load(fs.readFileSync(yamlPath(id), 'utf8'));

function list() {
  return ids()
    .map((id) => ({ id, ...load(id) }))
    .map((p) => ({ ...p, date: p.date instanceof Date ? p.date.toISOString().slice(0, 10) : String(p.date) }));
}

function save(id, changes) {
  const data = load(id);
  for (const [k, v] of Object.entries(changes)) {
    const type = EDITABLE[k];
    if (!type) continue;
    if (type === 'number') data[k] = Math.max(0, Math.min(5, Math.round(Number(v) || 0)));
    else if (type === 'boolean') data[k] = !!v;
    else if (k === 'category' && !CATEGORIES.includes(v)) continue;
    else data[k] = String(v).trim();
    // Keep files tidy: drop fields that are back to their defaults.
    if (data[k] === 0 || data[k] === false || data[k] === '') delete data[k];
  }
  if (data.date instanceof Date) data.date = data.date.toISOString().slice(0, 10);
  if (!data.title) data.title = data.species || 'Untitled';
  if (!data.location) data.location = 'TBC';
  fs.writeFileSync(yamlPath(id), yaml.dump(data, { flowLevel: 1, lineWidth: -1 }));
  return data;
}

async function thumb(id, size) {
  const data = load(id);
  const src = path.join(PHOTOS, data.image.replace(/^\.\//, ''));
  const out = path.join(THUMBS, `${id}-${size}.jpg`);
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(src).mtimeMs) {
    await sharp(src).resize({ width: size, height: size, fit: 'inside' }).jpeg({ quality: 80 }).toFile(out);
  }
  return fs.readFileSync(out);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (url.pathname === '/') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return res.end(PAGE);
    }
    if (url.pathname === '/api/photos') {
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ photos: list(), categories: CATEGORIES }));
    }
    const m = url.pathname.match(/^\/(thumb|large)\/([\w-]+)$/);
    if (m) {
      res.writeHead(200, { 'content-type': 'image/jpeg', 'cache-control': 'max-age=3600' });
      return res.end(await thumb(m[2], m[1] === 'thumb' ? 600 : 1800));
    }
    const s = url.pathname.match(/^\/api\/photos\/([\w-]+)$/);
    if (s && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const data = save(s[1], JSON.parse(body));
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify(data));
    }
    res.writeHead(404).end('Not found');
  } catch (err) {
    res.writeHead(400, { 'content-type': 'text/plain' }).end(err.message);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Photo manager running at ${url}  (Ctrl+C to stop)`);
  if (!process.argv.includes('--no-open')) execFile('open', [url]);
});

const PAGE = /* html */ `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Photo manager</title>
<style>
  :root { --bg:#11110e; --raised:#1b1b17; --line:#2e2d27; --text:#ece7dc; --muted:#9c968a; --accent:#d9b56c; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font:14px/1.5 system-ui, -apple-system, sans-serif; }
  header { position:sticky; top:0; z-index:5; background:rgba(17,17,14,.94); backdrop-filter:blur(8px); border-bottom:1px solid var(--line); padding:12px 16px; display:flex; gap:12px 20px; align-items:center; flex-wrap:wrap; }
  h1 { font:500 16px system-ui; margin:0; }
  .tabs { display:flex; gap:6px; flex-wrap:wrap; }
  .tabs button, select, input, textarea { font:inherit; color:var(--text); background:var(--raised); border:1px solid var(--line); border-radius:6px; padding:5px 10px; }
  .tabs button { cursor:pointer; border-radius:99px; color:var(--muted); }
  .tabs button[aria-pressed=true] { background:var(--text); color:var(--bg); }
  .hint { color:var(--muted); font-size:12px; margin-left:auto; }
  main { padding:16px; display:grid; grid-template-columns:repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap:16px; }
  .card { background:var(--raised); border:1px solid var(--line); border-radius:8px; overflow:hidden; }
  .card.is-hidden img { opacity:.25; }
  .card img { width:100%; aspect-ratio:3/2; object-fit:cover; display:block; cursor:zoom-in; background:#000; }
  .body { padding:10px 12px 12px; display:grid; gap:7px; }
  .row { display:flex; align-items:center; gap:8px; justify-content:space-between; }
  .stars button { background:none; border:0; color:#4a483f; font-size:22px; line-height:1; cursor:pointer; padding:0 1px; }
  .stars button.on { color:var(--accent); }
  .toggles { display:flex; gap:6px; }
  .toggles button { font-size:12px; background:none; border:1px solid var(--line); color:var(--muted); border-radius:99px; padding:3px 9px; cursor:pointer; }
  .toggles button.on { border-color:var(--accent); color:var(--accent); }
  .toggles button.hide.on { border-color:#c86b5a; color:#e08b7a; }
  label { display:grid; gap:2px; font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; }
  label input, label select { text-transform:none; letter-spacing:0; font-size:13px; width:100%; }
  .two { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .meta { color:var(--muted); font-size:12px; }
  .tbc { border-color:#6b5a2e; }
  .saved { color:var(--accent); font-size:12px; opacity:0; transition:opacity .3s; }
  .saved.show { opacity:1; }
  dialog { border:0; padding:0; background:#000; max-width:96vw; max-height:94vh; }
  dialog img { max-width:96vw; max-height:94vh; display:block; }
  dialog::backdrop { background:rgba(0,0,0,.85); }
</style></head>
<body>
<header>
  <h1>Photo manager</h1>
  <div class="tabs" id="tabs"></div>
  <span class="hint">Order on the site: most stars first, then newest first. Click a star again to clear it. Changes save automatically.</span>
</header>
<main id="grid"></main>
<dialog id="big"><img alt=""></dialog>
<script>
const grid = document.getElementById('grid'), tabs = document.getElementById('tabs'), big = document.getElementById('big');
let photos = [], categories = [], filter = 'all';
const FILTERS = { all: 'All', todo: 'Needs details', unrated: 'Unrated', rated: 'Rated', featured: 'Featured', hidden: 'Hidden' };
// TBC fields, or species IDs still marked with a ? (unconfirmed)
const isTodo = (p) => [p.species, p.title, p.location].includes('TBC') || /\?/.test(p.species || '');
const match = (p) => ({ all: true, todo: isTodo(p), unrated: !p.rating, rated: p.rating > 0, featured: p.featured, hidden: p.hidden })[filter];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => '&#' + c.charCodeAt(0) + ';');

async function load() {
  ({ photos, categories } = await (await fetch('/api/photos')).json());
  photos = photos.filter((p) => !p.sample);
  render();
}

function order(list) {
  return list.sort((a, b) => (b.rating || 0) - (a.rating || 0) || b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

function renderTabs() {
  tabs.innerHTML = Object.entries(FILTERS).map(([k, v]) =>
    '<button aria-pressed="' + (k === filter) + '" data-f="' + k + '">' + v + ' ' + photos.filter((p) => ({ all: true, todo: isTodo(p), unrated: !p.rating, rated: p.rating > 0, featured: p.featured, hidden: p.hidden })[k]).length + '</button>').join('');
}

function render() {
  renderTabs();
  grid.innerHTML = order(photos.filter(match)).map((p) => {
    const field = (k, label) => '<label>' + label + '<input data-k="' + k + '" value="' + esc(p[k] === 'TBC' ? '' : p[k]) + '" placeholder="' + (p[k] === 'TBC' ? 'TBC' : '') + '" class="' + (p[k] === 'TBC' ? 'tbc' : '') + '"></label>';
    return '<div class="card' + (p.hidden ? ' is-hidden' : '') + '" data-id="' + p.id + '">' +
      '<img loading="lazy" src="/thumb/' + p.id + '" alt="">' +
      '<div class="body">' +
        '<div class="row"><span class="stars">' + [1,2,3,4,5].map((n) => '<button data-star="' + n + '" class="' + (n <= (p.rating || 0) ? 'on' : '') + '" aria-label="' + n + ' stars">★</button>').join('') + '</span>' +
        '<span class="toggles"><button data-t="featured" class="' + (p.featured ? 'on' : '') + '">Featured</button><button data-t="hidden" class="hide ' + (p.hidden ? 'on' : '') + '">Hide</button></span></div>' +
        '<div class="two">' + field('species', 'Species') + field('location', 'Location') + '</div>' +
        '<div class="two">' + field('title', 'Title') + '<label>Category<select data-k="category">' + categories.map((c) => '<option' + (c === p.category ? ' selected' : '') + '>' + c + '</option>').join('') + '</select></label></div>' +
        '<div class="row meta"><span>' + esc(p.date) + ' · ' + esc(p.settings || '') + '</span><span class="saved">Saved ✓</span></div>' +
      '</div></div>';
  }).join('') || '<p class="meta">Nothing here.</p>';
}

async function save(id, changes, card) {
  const res = await fetch('/api/photos/' + id, { method: 'POST', body: JSON.stringify(changes) });
  if (!res.ok) return alert('Could not save: ' + await res.text());
  const i = photos.findIndex((p) => p.id === id);
  photos[i] = { ...photos[i], ...(await res.json()) };
  const s = card.querySelector('.saved'); s.classList.add('show'); setTimeout(() => s.classList.remove('show'), 1200);
  renderTabs();
}

tabs.addEventListener('click', (e) => { const f = e.target.closest('[data-f]')?.dataset.f; if (f) { filter = f; render(); } });
grid.addEventListener('click', (e) => {
  const card = e.target.closest('.card'); if (!card) return;
  const p = photos.find((x) => x.id === card.dataset.id);
  const star = e.target.closest('[data-star]'), t = e.target.closest('[data-t]');
  if (star) {
    const n = Number(star.dataset.star), rating = p.rating === n ? 0 : n;
    card.querySelectorAll('[data-star]').forEach((b) => b.classList.toggle('on', Number(b.dataset.star) <= rating));
    save(p.id, { rating }, card);
  } else if (t) {
    const v = !p[t.dataset.t]; t.classList.toggle('on', v);
    if (t.dataset.t === 'hidden') card.classList.toggle('is-hidden', v);
    save(p.id, { [t.dataset.t]: v }, card);
  } else if (e.target.tagName === 'IMG') {
    big.querySelector('img').src = '/large/' + p.id; big.showModal();
  }
});
grid.addEventListener('change', (e) => {
  const k = e.target.dataset.k; if (!k) return;
  const card = e.target.closest('.card');
  e.target.classList.remove('tbc');
  save(card.dataset.id, { [k]: e.target.value || (k === 'category' ? 'Other' : '') }, card);
});
big.addEventListener('click', () => big.close());
load();
</script></body></html>`;
