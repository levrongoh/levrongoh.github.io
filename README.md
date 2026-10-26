# Wildlife & Nature Photography Portfolio

A photo portfolio plus a field journal of travels and encounters, built with [Astro](https://astro.build) and published on GitHub Pages.

**👉 For step-by-step instructions on publishing, adding, deleting and editing photos, see [GUIDE.md](GUIDE.md).**

| Page | What it shows |
|---|---|
| **Home** | A hero photo, your stats, featured work, and the latest journal entries |
| **Gallery** | Every photo, filterable by category, with a full-screen viewer showing camera, lens and settings |
| **Journal** | Trip and encounter stories. Each entry automatically lists the photos from that trip |
| **Map** | Every photo and journal entry on a map (locations are rounded to about 1 km) |
| **Species** | Your species list, built automatically from confirmed IDs |
| **About** | Your bio, from `src/pages/about.md` |

## Commands

Run these in Terminal from inside this folder.

| Command | What it does |
|---|---|
| `npm run dev` | Preview the site at http://localhost:4321 while you edit |
| `npm run import` | Import every photo in `photo-inbox/` |
| `npm run rate` | Open the photo manager: stars, hide, feature, and edit details |
| `npm run add-photo -- photo.jpg` | Add a single photo, answering questions as you go |
| `npm run new-entry` | Start a new journal entry (it begins as a draft) |
| `npm run build` | Build the site into `dist/` (GitHub does this for you when you push) |

## Where things live

| Path | Contents |
|---|---|
| `src/content/photos/` | Each photo: a `.jpg` plus a `.yaml` details file |
| `src/content/journal/` | Journal entries (`.md` files) |
| `src/site.config.ts` | Your name, tagline, social links, gallery categories, and map precision |
| `src/pages/about.md` | The About page |
| `src/styles/global.css` | Colours and fonts |
| `.github/workflows/deploy.yml` | Publishes the site automatically on every push |

## A note on sensitive species

Imported photos have their GPS position removed, and the map rounds coordinates (`mapPrecision` in `src/site.config.ts`). For nesting or roosting sites, or for rare species, leave out `coords` entirely and use a broad location such as "Central Singapore".
