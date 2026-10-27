# Website Guide

A step-by-step guide to publishing and maintaining your site.

- [Part 1: Create the GitHub repository](#part-1-create-the-github-repository-one-time) (one time)
- [Part 2: Publish the website](#part-2-publish-the-website-one-time) (one time)
- [Part 3: The everyday routine](#part-3-the-everyday-routine)
- [Part 4: How to add photos](#part-4-how-to-add-photos)
- [Part 5: How to delete photos](#part-5-how-to-delete-photos)
- [Part 6: How to edit photo details manually](#part-6-how-to-edit-photo-details-manually)
- [Part 7: How to edit journal entries and the About page](#part-7-how-to-edit-journal-entries-and-the-about-page)
- [Part 8: When something goes wrong](#part-8-when-something-goes-wrong)

**How it works:** your website lives in the folder `Portfolio Website` on your Desktop. GitHub keeps an online copy of that folder. Every time you send changes to GitHub (called "pushing"), GitHub rebuilds your site and publishes it, usually within 2–3 minutes. You never upload anything by hand.

```
Your Mac  ──push──▶  GitHub (stores the code)  ──builds──▶  your website goes live
```

---

## Part 1: Create the GitHub repository (one time)

A *repository* ("repo") is a folder stored on GitHub. We'll use **GitHub Desktop**, a free app that does this with buttons instead of commands.

### 1.1 Create a GitHub account
1. Go to [github.com/signup](https://github.com/signup) and create an account.
2. **Choose your username carefully.** Your website address will be `https://YOUR-USERNAME.github.io`, so pick something like your name.

### 1.2 Install GitHub Desktop
1. Download it from [desktop.github.com](https://desktop.github.com) and drag it into your Applications folder.
2. Open it and choose **Sign in to GitHub.com**. A browser window opens; approve the sign-in there.

### 1.3 Keep your email address private (recommended)
Every save ("commit") is labelled with an email address, and on a public repository anyone can see it.
1. On github.com, open **Settings** (click your profile picture, top right) → **Emails**.
2. Tick **Keep my email addresses private**. GitHub shows you a private address that looks like `12345678+username@users.noreply.github.com`. Copy it.
3. In GitHub Desktop, open **GitHub Desktop → Settings → Git** and paste that address into **Email**.
4. Your first commit was already made with your Gmail address. To relabel it before anything is published, open Terminal (see [Opening Terminal](#opening-terminal-in-the-website-folder)) and run these two commands one at a time, replacing the address with the one you copied:
   ```bash
   git config user.email "12345678+username@users.noreply.github.com"
   ```
   ```bash
   git commit --amend --reset-author --no-edit
   ```

### 1.4 Tell the site its address
Open `astro.config.mjs` in TextEdit and change the `site:` line to your future address:

```js
site: 'https://YOUR-USERNAME.github.io',
```

This makes link previews (on WhatsApp, Instagram and so on) show the right photo.

### 1.5 Add your folder to GitHub Desktop
1. In GitHub Desktop: **File → Add Local Repository…**
2. Click **Choose…**, select the `Portfolio Website` folder on your Desktop, and click **Add Repository**.
3. You'll see your changes listed on the left. At the bottom left, type a short summary such as `Set site address`, then click **Commit to main**.

### 1.6 Publish the repository
1. Click **Publish repository** (top bar).
2. **Name:** type exactly `YOUR-USERNAME.github.io`, using your own username. For example, if your username is `levrongoh`, the name is `levrongoh.github.io`. This special name makes your site live at `https://levrongoh.github.io` with no extra setup.
3. **Untick "Keep this code private."** Free GitHub Pages sites need a public repository. (Read [the note on hidden photos](#a-note-on-privacy) first.)
4. Click **Publish Repository**. The first upload is about 300 MB, so give it a few minutes.

---

## Part 2: Publish the website (one time)

### 2.1 Turn on GitHub Pages
1. On github.com, open your repository (GitHub Desktop: **Repository → View on GitHub**).
2. Click **Settings** (the tab along the top) → **Pages** (in the left menu).
3. Under **Build and deployment → Source**, choose **GitHub Actions**. That's the only setting needed.

### 2.2 Run the first build
1. Click the **Actions** tab at the top of your repository.
2. You'll see **Deploy to GitHub Pages**. If the run from your first upload shows a red ✗ (it ran before Pages was switched on), click it and choose **Re-run all jobs**. If no run is listed, click **Deploy to GitHub Pages** on the left → **Run workflow** → **Run workflow**.
3. Wait for the green ✓ (2–3 minutes).
4. Visit `https://YOUR-USERNAME.github.io`. 🎉

From now on, **every push publishes automatically**. You never need to repeat Part 2.

### 2.3 Optional: use your own domain
If you buy a domain (for example `levrongoh.com` from Namecheap, Cloudflare or Porkbun):
1. **Settings → Pages → Custom domain**: type the domain and click **Save**.
2. GitHub shows the DNS records to add at the company where you bought the domain. Follow GitHub's on-screen instructions.
3. Tick **Enforce HTTPS** once it's available (this can take up to a day).
4. Change `site:` in `astro.config.mjs` to the new domain, then commit and push.

### A note on privacy
Because the repository is public, **everything in it can be seen on GitHub**, including photos you've marked `hidden: true`. Hiding only removes a photo from the website. If a photo must stay private (for example the three photos of people), [delete it](#part-5-how-to-delete-photos) rather than hiding it, or keep it out of the folder entirely.

---

## Part 3: The everyday routine

Every update follows the same four steps:

| Step | What you do |
|---|---|
| **1. Change** | Add photos, edit details, write a journal entry (Parts 4–6) |
| **2. Preview** | Run `npm run dev` and check http://localhost:4321 |
| **3. Commit** | GitHub Desktop: type a summary → **Commit to main** |
| **4. Push** | GitHub Desktop: click **Push origin** → live in 2–3 minutes |

### Opening Terminal in the website folder
Most commands below are typed into Terminal. To open it in the right folder, do either of these:
- In Finder, right-click the `Portfolio Website` folder → **Services → New Terminal at Folder**.
- Or open Terminal (⌘ Space, type *Terminal*) and paste:
  ```bash
  cd ~/Desktop/"Portfolio Website"
  ```

### Previewing your changes
```bash
npm run dev
```
Open **http://localhost:4321** in your browser. The page updates every time you save a file. Press **Ctrl + C** in Terminal to stop it.

Journal entries marked `draft: true` show up here, but not on the live site.

### Pushing your changes
1. Open GitHub Desktop. Your changed files are listed on the left.
2. Bottom left: write what you did (for example `Add Sungei Buloh photos`) → **Commit to main**.
3. Click **Push origin** at the top.
4. Optional: watch it build under the **Actions** tab on GitHub.

> **New Mac?** Install [Node.js](https://nodejs.org) (the LTS version) and GitHub Desktop, clone your repository with **File → Clone Repository**, then run `npm install` once in the folder.

---

## Part 4: How to add photos

### Export from Lightroom first
- **Format:** JPEG (Quality 85–100). iPhone HEIC files also work, but RAW files (`.ARW`) don't.
- **Size:** any. The import shrinks photos to 2400 px automatically.
- **Metadata:** set it to **All Metadata**, or at least **All Except Camera Raw Info**. This is how the site gets your camera, lens and settings. If you set star ratings in Lightroom, those are imported too.

### Option A: Many photos at once (recommended)
1. Copy your exported photos into the **`photo-inbox`** folder.
2. In Terminal:
   ```bash
   npm run import
   ```
   Each photo is resized, its GPS location is removed, and its camera details are read. The originals move to `photo-inbox/imported/`, which never gets uploaded. You can delete that folder whenever you like; your own copies stay in Lightroom.
3. Fill in the details using the photo manager:
   ```bash
   npm run rate
   ```
   Your browser opens the manager. Click the **Needs details** tab and, for each photo, fill in:
   - **Species** (leave it blank for landscapes)
   - **Location**
   - **Title** (defaults to the species name)
   - **Category**
   - **Stars**, if you want it near the top

   Everything saves as you type. Press **Ctrl + C** in Terminal when you're done.
4. Preview, then commit and push ([Part 3](#part-3-the-everyday-routine)).

> **Tip:** Or just tell Claude "I've put new photos in the inbox", along with where and when you shot them. Claude can run the import, suggest species IDs and fill in the locations for you.

### Option B: One photo at a time
```bash
npm run add-photo -- ~/Pictures/owl.jpg
```
Terminal asks you questions one by one (species, location, and so on). Press **Return** to accept the suggestion shown in [brackets].

### Controlling the order
- **Stars (1–5)** decide what shows first. The order is 5★ → 4★ → … → unrated, and within each group the newest photo comes first.
- **Visitors can re-sort the gallery** with the **Sort** menu: *Top rated* (the default), *Newest first* or *Oldest first*. The browser remembers their choice.
- **Featured** puts a photo on the home page. The first featured photo becomes the large photo at the top.
- Set both in the photo manager (`npm run rate`) or in the photo's `.yaml` file ([Part 6](#part-6-how-to-edit-photo-details-manually)).

---

## Part 5: How to delete photos

You have two options:

### Hide it (reversible)
Keeps the photo but takes it off the website.
- In the photo manager (`npm run rate`), click **Hide** on the photo. Click it again to bring the photo back.
- Or add `hidden: true` to its `.yaml` file.

⚠️ Hidden photos are still visible to anyone browsing your GitHub repository (see [the note on privacy](#a-note-on-privacy)).

### Delete it (permanent)
1. **Find the photo's name.** It's the last part of its web address. For example, `…/photos/2026-08-19-dsc00719/` is named `2026-08-19-dsc00719`.
2. Open the folder `Portfolio Website → src → content → photos`.
3. Move **both** files with that name to the Bin:
   - `2026-08-19-dsc00719.jpg`
   - `2026-08-19-dsc00719.yaml`

   Delete both. If the `.yaml` file is left behind without its `.jpg`, the build fails. If the `.jpg` is left behind, it just takes up space.
4. **Check your journal entries.** If an entry uses this photo as its `cover:` or shows it in the story (`![…](../photos/2026-08-19-dsc00719.jpg)`), remove that line too. The preview (`npm run dev`) shows an error if you've missed one.
5. Commit and push.

> **Note:** deleted photos disappear from the website, but older versions stay in your GitHub history. For anything truly sensitive, ask Claude to help remove it from the history as well.

---

## Part 6: How to edit photo details manually

Every photo has a small text file next to it, in `src/content/photos/`, with the same name and the extension `.yaml`.

### Opening the file
- **Easiest:** use the photo manager (`npm run rate`) for species, location, title, category, stars, Featured and Hide.
- **For any other field:** right-click the `.yaml` file → **Open With → TextEdit**.
  - If TextEdit shows formatting buttons, choose **Format → Make Plain Text**.
  - A free code editor such as [Visual Studio Code](https://code.visualstudio.com) is nicer for this, because it highlights mistakes as you type.

### What a photo file looks like
```yaml
title: Stork-billed Kingfisher
image: ./2026-08-19-dsc00719.jpg
category: Birds
species: Stork-billed Kingfisher
scientific: Pelargopsis capensis
date: '2026-08-19'
location: Singapore Botanic Gardens
country: Singapore
coords: [1.3138, 103.8159]
camera: Sony A7C II
lens: Sony FE 100-400mm F4.5-5.6 GM OSS
settings: 400mm · f/5.6 · 1/1000s · ISO 1600
story: It dropped into the pond three times before it finally caught something.
rating: 5
featured: true
```

### Every field explained

| Field | What it does | Example |
|---|---|---|
| `title` | Caption shown under the species name | `Stork-billed Kingfisher` |
| `image` | The photo file. **Don't change it.** | `./2026-08-19-dsc00719.jpg` |
| `category` | Gallery filter. Must be **exactly** one of: `Birds`, `Mammals`, `Reptiles & Amphibians`, `Insects`, `Landscapes`, `Other` | `Birds` |
| `species` | Common name. Add `?` at the end if you're unsure, which keeps it off the Species page | `Lilac Kingfisher` |
| `scientific` | Latin name, shown in italics | `Cittura cyanotis` |
| `date` | Date taken, as `'YYYY-MM-DD'` | `'2026-08-19'` |
| `location` | Where it was taken | `Pasir Ris Park` |
| `country` | Country | `Indonesia` |
| `coords` | Map pin as `[latitude, longitude]`. Get these by right-clicking a spot in Google Maps. Delete the line to keep a photo off the map | `[1.381, 103.953]` |
| `trip` | Links the photo to a journal entry: the entry's file name, without `.md` | `2026-05-tangkoko` |
| `story` | A sentence or two shown on the photo's page | `It didn't move for an hour.` |
| `camera` / `lens` / `settings` | Shown in the full-screen viewer and on the photo page. Filled in automatically, but you can edit them | `Sony A7C II` |
| `rating` | 1–5 stars. Higher shows first | `5` |
| `featured` | `true` puts it on the home page | `true` |
| `hidden` | `true` takes it off the site | `true` |
| `alt` | Description for screen readers (optional) | `Kingfisher on a branch over a pond` |

### Rules that prevent errors
1. **Keep the format `name: value`,** with a space after the colon.
2. **Don't indent lines.** Every line starts at the left edge.
3. **If a value contains a colon (`:`) or starts with a symbol, wrap it in quotes:**
   `story: "Dawn: the owl finally appeared"`
4. **Spell categories exactly** as listed above, including capitals and the `&`.
5. **To remove a field,** delete the whole line.
6. Save, then check the preview. If something's wrong, the preview page and Terminal say which file and line has the problem.

---

## Part 7: How to edit journal entries and the About page

Journal entries and the About page are plain text files written in **Markdown**, a simple way to add formatting with symbols. Open them the same way as photo files: right-click → **Open With → TextEdit** (in plain-text mode), or use Visual Studio Code.

Keep `npm run dev` running while you write. Every time you save, the preview page in your browser updates.

### Markdown in 2 minutes

| You type | You get |
|---|---|
| `## Day 1: Kuala Tahan` | A section heading |
| `### Smaller heading` | A smaller heading |
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `- Leech socks` | A bullet point (one per line) |
| `1. First step` | A numbered list |
| `> Keep your distance.` | A highlighted quote (shown large, with a gold bar) |
| `[my Instagram](https://instagram.com/levrongoh)` | A link |
| `![Owl at dusk](../photos/2026-10-09-dsc02907.jpg)` | A photo (see [Adding photos to the text](#adding-photos-to-the-text)) |
| `---` on its own line | A divider line |

- **Paragraphs:** leave an **empty line** between paragraphs. Lines that sit directly under each other are joined into one paragraph.
- **Notes to yourself:** anything between `<!--` and `-->` is hidden on the site.

### Journal entries

All entries live in `src/content/journal/`, one `.md` file each. The file name becomes the web address: `2026-05-tangkoko.md` appears at `/journal/2026-05-tangkoko/`.

#### Start a new entry
```bash
npm run new-entry
```
Answer the questions. This creates a file named like `2026-11-sungei-buloh.md`, marked as a draft.

#### Anatomy of an entry
Everything between the two `---` lines is the **settings block**. Everything below it is your **story**.

```markdown
---
title: "Four Kingfishers in Tangkoko"
date: 2026-05-30
endDate: 2026-05-31
location: "Tangkoko Nature Reserve, North Sulawesi"
country: "Indonesia"
coords: [1.56, 125.16]
cover: ../photos/2026-05-30-dsc03173.jpg
summary: "Two days in North Sulawesi, east of the Wallace Line."
draft: true
---

Your story starts here...

## Day 1: The forest floor

More story...
```

| Setting | What it does |
|---|---|
| `title` | The headline. Wrap it in "quotes" |
| `date` | Start date, `YYYY-MM-DD`. Entries are listed newest first |
| `endDate` | Optional. For trips longer than a day; shows as "30 May – 31 May 2026" |
| `location` / `country` | Shown above the title |
| `coords` | Optional. Puts the trip on the Map page as a ringed pin |
| `cover` | Optional. The big photo at the top, and the thumbnail in the journal list |
| `summary` | One sentence, shown on the journal list and in link previews |
| `draft` | `true` = only visible in your preview. **Delete this line to publish** |

#### Adding photos to the text
**A photo from your gallery** (easiest). Use its name from `src/content/photos/`:
```markdown
![Great-billed Kingfisher on a branch](../photos/2026-05-31-dsc04275.jpg)
```
The words in `[ ]` describe the photo for screen readers. They don't appear on the page.

**A photo that isn't in your gallery** (a landscape, a selfie, the boat ride):
1. Export it as a JPEG and put it in `src/content/journal/`.
2. Refer to it with `./` (meaning "in this same folder"):
   ```markdown
   ![The boat to Kuala Tahan](./boat-ride.jpg)
   ```
3. Keep it under about 2400 px wide, so the site stays small.

The same rule applies to `cover:`. Use `../photos/NAME.jpg` for a gallery photo, or `./NAME.jpg` for an image in the journal folder.

#### Linking gallery photos to an entry
Add `trip: ` followed by the entry's file name (without `.md`) to each photo's `.yaml` file:
```yaml
trip: 2026-05-tangkoko
```
Those photos then appear in a grid at the bottom of the entry, along with a list of the species and a small map. The photo pages also link back to the entry once it's published.

#### Publishing, renaming and deleting
- **Publish:** delete the `draft: true` line, then commit and push.
- **Take an entry offline:** add `draft: true` back.
- **Rename (changes the web address):** rename the `.md` file, then update `trip:` in its photos to the new name. Old links shared elsewhere will stop working.
- **Delete:** move the `.md` file to the Bin, along with any images in the journal folder that only it used. Photos still pointing at it with `trip:` keep working; they just stop showing the link. You can remove those lines whenever you like.

> **The three `sample-…` entries** are placeholders and can be deleted. Delete each `.md` file and the `.jpg` with the same name.

### The home page introduction

The "Hi, I'm Levron." text at the top of the home page is in **`src/home.md`**:

```markdown
---
greeting: "Hi, I'm Levron."
---

I photograph birds and wildlife around Singapore...
```

- Change the big heading with `greeting:`.
- Write two or three short paragraphs below the `---`, with an empty line between them.
- **The photo beside it** is your first **Featured** photo. Set it with the photo manager (`npm run rate`) or with `featured: true` in a photo's `.yaml` file.

The other home page sections fill themselves in:
- **Recent outings:** your last four trips out, grouped by date and place.
- **A few favourites:** your Featured and 4–5★ photos. Until you've rated any, it shows one photo of each species.
- **Stories from the field:** your newest published journal entries.

### The About page

The About page is `src/pages/about.md`. Edit it like a journal entry. The settings block only has `title:`, and the `layout:` line must stay exactly as it is.

```markdown
---
layout: ../layouts/Prose.astro
title: About
---

I'm a wildlife photographer based in Singapore...

## Gear

- Sony A7C II
```

- **Delete the line** `*This is placeholder text…*` at the top, and replace the paragraphs with your own words. The **Ethics** and **Prints & licensing** sections are suggestions: keep, edit or remove them.
- **To add a photo of yourself:**
  1. Create a folder called `assets` inside `src`.
  2. Put the photo there, for example `src/assets/me.jpg`.
  3. Write this where you want it to appear:
     ```markdown
     ![Me in the field](../assets/me.jpg)
     ```

### Things that live elsewhere
Some text on the site doesn't come from these pages. It's set in **`src/site.config.ts`**:

| Setting | Where it shows |
|---|---|
| `name` | Top-left of every page and in the footer |
| `tagline` | Not shown on the page; kept for reference. The home page heading is in `src/home.md` |
| `description` | Search engine and link-preview text |
| `basedIn` | Footer ("Based in Singapore") |
| `social.instagram` | Instagram link in the footer. Use the format `https://instagram.com/levrongoh`, with no `@` |
| `social.email` | Email link in the footer. Leave it as `''` to hide it |

Keep the 'single quotes' around each value and the comma at the end of the line.

---

## Part 8: When something goes wrong

| Problem | Fix |
|---|---|
| **Red ✗ in the Actions tab** | Click the failed run → **build** → read the red lines. It's almost always a typo: a misspelled category or a missing space after `:` in a `.yaml` file, or a photo path in a journal entry that doesn't match a real file. Fix it, then commit and push again. Your old site stays online until the fix goes through. |
| **Photo isn't showing** | Check for `hidden: true` in its `.yaml` file. The photo might also be further down the list: unrated photos appear after rated ones, newest first. |
| **Journal entry isn't showing** | It still has `draft: true`. |
| **Text in a journal entry runs together** | Leave an empty line between paragraphs. |
| **A photo in a journal entry is broken** | Check the path: `../photos/NAME.jpg` for gallery photos, `./NAME.jpg` for images in the journal folder. Names must match exactly, including `.jpg`. |
| **Site hasn't updated** | Did you click **Push origin**? Check the **Actions** tab for a green ✓, then hard-refresh your browser (⌘ Shift R). |
| **`npm: command not found`** | Install [Node.js](https://nodejs.org) (LTS), then close and reopen Terminal. |
| **`npm run dev` says the port is in use** | Another preview is still running. Close the other Terminal window, or use the address it prints (for example `localhost:4322`). |

### Size limits to know about
- Each photo adds about **1.4 MB** to the published site. GitHub Pages allows **1 GB**, which is roughly **600 photos**.
- When you're getting close, ask Claude about trimming image sizes or moving to a host with a higher limit (such as Cloudflare Pages). Your content stays the same either way.
