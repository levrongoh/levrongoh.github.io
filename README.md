# Wildlife & Nature Photography Portfolio

A photo portfolio plus a field journal of travels and encounters, built with [Astro](https://astro.build).

| Page | What it shows |
|---|---|
| **Home** | A hero photo, your stats, featured work, and the latest journal entries |
| **Gallery** | Every photo, filterable by category, with a full-screen viewer (arrow keys and swipe work) |
| **Journal** | Trip and encounter stories. Each entry automatically lists the photos from that trip |
| **Map** | Every photo and journal entry on a map (locations are rounded to about 1 km) |
| **Species** | Your species list, built automatically from the photos |
| **About** | Your bio, from `src/pages/about.md` |

---

## Everyday use

Run these commands from inside this folder in Terminal.

**See the site on your computer while you edit:**

```bash
npm run dev
```

Then open http://localhost:4321. The page refreshes itself whenever you save a change.

### Add lots of photos at once

Drop images into the `photo-inbox/` folder, then run:

```bash
npm run import
```

The camera, lens, settings and date are filled in from each file. Species, location and category are set to `TBC`, so search the `.yaml` files for "TBC" to find what still needs filling in. Imported originals are moved to `photo-inbox/imported/`. JPEG, PNG, TIFF and iPhone HEIC files all work.

### Rate, hide and caption photos

```bash
npm run rate
```

This opens a photo manager in your browser. In it you can:

- **Star photos (1–5).** The site shows the most-starred photos first, then oldest first. Unrated photos come after all rated ones, oldest first.
- **Feature a photo** to put it on the home page. The first featured photo becomes the large photo at the top.
- **Hide a photo** to keep it off the site without deleting it.
- **Edit species, location, title and category.** The "Needs details" tab lists every photo that still says TBC or has an unconfirmed ID (one marked with `?`).

Changes save into the `.yaml` files straight away. Species marked with `?` don't appear on the Species page until you confirm them.

### Add photos one at a time

```bash
npm run add-photo -- ~/Pictures/owl.jpg
```

You can pass several files at once. For each photo the script:

1. reads the date, camera, lens, settings and GPS from the file
2. asks for the species, title, location, category, and which journal entry it belongs to
3. saves a web-sized copy (at most 3000px, with all metadata removed so exact locations stay private) plus a small `.yaml` file in `src/content/photos/`

To change anything later, open the photo's `.yaml` file and edit it. The fields are:

```yaml
title: Kingfisher on the boardwalk rail
image: ./collared-kingfisher.jpg
category: Birds            # Birds, Mammals, Reptiles & Amphibians, Insects, Landscapes, Other
species: Collared Kingfisher
scientific: Todiramphus chloris
date: 2026-08-16
location: Sungei Buloh Wetland Reserve
country: Singapore
coords: [1.4467, 103.7300] # optional: puts the photo on the map
trip: 2026-08-sungei-buloh # optional: the journal entry's file name, without .md
story: A short note shown on the photo's page.
settings: 500mm · f/6.3 · 1/1600s · ISO 800
featured: true             # shows it on the home page; the first featured photo is the hero
```

### Write a journal entry

```bash
npm run new-entry
```

To set a cover photo at the same time:

```bash
npm run new-entry -- ~/Pictures/cover.jpg
```

This creates a Markdown file in `src/content/journal/`. Write your story underneath the `---` block. New entries start as drafts, which show while you run `npm run dev` but are hidden on the live site. Delete the `draft: true` line to publish.

To put a photo inside the story, save the image next to the `.md` file and write `![description](./photo.jpg)`.

### Remove the sample content

Delete every file whose name starts with `sample-` from `src/content/photos/` and `src/content/journal/`. You can also delete `scripts/make-placeholders.mjs`.

### Personalise

- Your name, tagline, Instagram, email, and the map's location precision are in `src/site.config.ts`
- The About page is `src/pages/about.md`
- Colours and fonts are at the top of `src/styles/global.css`

---

## Putting it online (free)

1. Put this folder on GitHub (GitHub Desktop is the easiest way).
2. Sign in to [Netlify](https://netlify.com), [Cloudflare Pages](https://pages.cloudflare.com) or [Vercel](https://vercel.com), choose **Import from GitHub**, and pick the repository. The settings are detected automatically (build command `npm run build`, output folder `dist`).
3. From then on, each time you add photos or entries and push to GitHub, the site rebuilds and updates by itself.
4. Optional: connect your own domain in the host's settings, then set `site:` in `astro.config.mjs` to that domain.

## A note on sensitive species

`add-photo` strips the GPS position from every published image, and the map rounds coordinates (`mapPrecision` in `src/site.config.ts`). For nesting or roosting sites, or for rare species, you can leave out `coords` entirely and use a broad location such as "Central Singapore".
