# Copy — Home & About

Every human-readable string that ships on `/` and `/about`, quoted verbatim and grouped
top-to-bottom in the order it appears on screen. Nothing here has been corrected or
reworded; anything that looked like a mistake is listed at the very bottom instead.

**How to read this**

- Each section heading is followed by an italic attribution line pointing at the source
  file and the const or field the text lives in.
- Text you can only hear (screen-reader labels, `title` tooltips) is marked
  **[a11y]** or **[tooltip]** so you can tell it apart from text that is drawn on screen.
- Text that the site generates at runtime rather than reading from a string is marked
  **[dynamic]** — you can edit the wrapper around it, not the value.

---

# Home page — `/`

## 1. Header / status strip

*`src/components/CornerMeta.tsx`*

Top-left pair:

> Stanford

> **[dynamic]** the current time in `America/Los_Angeles`, `hh:mm:ss AM/PM`, ticking once a
> second. Rendered from `Date.toLocaleTimeString`, so there is no string to edit — only the
> format (12-hour, seconds shown, narrow no-break space before AM/PM).

Top-right, a `mailto:` link whose visible text is the address itself:

> snimbali@stanford.edu

---

## 2. Hero name

*`src/components/HeroLine.tsx`; handle from `src/content.ts: GITHUB_USER`*

At rest the sentence opens with just her first name:

> Spurti

On hover / focus the name widens and swaps to the GitHub handle, with a wink glued to it
(the leading space is part of the wink span):

> @SpurtiNimbali :}

**[a11y]** link label, built as `` `Spurti — GitHub, @${GITHUB_USER}` ``:

> Spurti — GitHub, @SpurtiNimbali

A handwritten tag floats out beside the swapped handle — *`src/components/HeroOverlay.tsx: GitTag`*:

> github

(followed by a drawn ↗ arrow, not a character)

---

## 3. Hero sentence — the six tone variants

*`src/content.ts: INTENSITY_LEVELS`. Each level is an array of `parts`; the sentence below is
those parts joined, reading after the name.*

The axis has six levels, `0`–`5`. The page opens at **level 2** (`DEFAULT_INTENSITY = 2`).
In every variant the words **Stanford**, **Slack**, **SAIL** and **Simba** are the underlined
squiggle marks that peel photos when clicked.

### Level 0 — `label: "quiet"`

> Spurti writes software at Stanford with Simba.

### Level 1 — `label: "modest"`

> Spurti studies CS at Stanford and writes software with Simba.

### Level 2 — `label: "warm"` *(default on load)*

> Spurti builds small AI things at Stanford with Simba and likes it when they work.

### Level 3 — `label: "confident"`

> Spurti builds AI and writes software at Stanford with Slack, and Simba.

### Level 4 — `label: "bold"`

*`src/content.ts: LEVEL_4_BOLD` — two versions exist, switched by the `SAIL_IS_REAL` flag,
currently `true`.*

**Live (`SAIL_IS_REAL = true`):**

> Spurti builds AI at Stanford, Slack, and SAIL. Simba supervises.

**Alternate, not currently shipping (`SAIL_IS_REAL = false`):**

> Spurti builds AI at Stanford and ships software at Slack. Simba supervises.

### Level 5 — `label: "undeniable"`

*`src/content.ts: LEVEL_5_UNDENIABLE` — same `SAIL_IS_REAL` switch.*

**Live (`SAIL_IS_REAL = true`):**

> Spurti builds AI at Stanford, ships it at Slack, does the research at SAIL, and is not especially humble about any of it. Simba agrees.

**Alternate, not currently shipping (`SAIL_IS_REAL = false`):**

> Spurti builds AI at Stanford, ships it at Slack, and you dragged this all the way up, so. Simba agrees.

### The underlined words, side by side

Handy if you want to see the four marks and their five levels of context at a glance:

| Level | label | Stanford | Slack | SAIL | Simba |
| --- | --- | --- | --- | --- | --- |
| 0 | quiet | ✓ | | | ✓ |
| 1 | modest | ✓ | | | ✓ |
| 2 | warm | ✓ | | | ✓ |
| 3 | confident | ✓ | ✓ | | ✓ |
| 4 | bold | ✓ | ✓ | ✓ | ✓ |
| 5 | undeniable | ✓ | ✓ | ✓ | ✓ |

---

## 4. Tone control (the axis under the sentence)

*`src/components/IntensityAxis.tsx`*

Two labels with hairline arrows, left and right of a gap. Visible text:

> nonchalant

> try hard

**[a11y]** the group and the two buttons:

> Tone of the sentence above

> Say it more nonchalantly

> Try harder

### State readout

**[a11y, dynamic]** *`src/components/IntensityAxis.tsx` — visually hidden (`.tone-axis__status`),
announced to screen readers only.* Built as
`` `Tone ${intensity + 1} of ${INTENSITY_MAX + 1} — ${simbaAriaText(intensity)}` ``, so the
editable part is the word "Tone", the word "of", and the pose phrases below:

> Tone 3 of 6 — warm — sitting

*(example at the default level; the numbers and the trailing phrase change with the axis)*

**Simba pose phrases** — *`src/lib/simba.ts: SIMBA_POSES`*, one per tone level, rendered as
`` `${label} — ${pose}` ``:

| Level | label | pose |
| --- | --- | --- |
| 0 | quiet | curled up asleep |
| 1 | modest | lying down, head up |
| 2 | warm | sitting |
| 3 | confident | standing, ears up |
| 4 | bold | play bow, mid-bark |
| 5 | undeniable | up on hind legs, mid-leap |

---

## 5. Sticker layer (after you click an underlined word)

*`src/components/HeroOverlay.tsx: StickerBoard`. Also used on `/about`.*

The dismiss button under the stickers. It reads differently if any of the pinned photos are
Simba's:

> shoo simba

> tidy up

The photos themselves carry `alt=""` — they are decorative and announce nothing.

---

## 6. Nav deck (the three cards)

*`src/content.ts: NAV`, rendered by `src/components/NavDeck.tsx`*

Each card shows a filename pill; on hover / focus a detail block appears with the filename
again, a hint line, and a call to action.

### Card 1 — Projects

> projects.py  *(pill, and repeated in bold in the hover detail — `file`)*

> things that shipped  *(`hint`)*

> View projects  *(`cta`)*

**[a11y]** link label — *`title`*, not drawn on screen:

> Projects

### Card 2 — Research

> research.md  *(`file`)*

> papers & explorations  *(`hint`)*

> View research  *(`cta`)*

**[a11y]** link label — *`title`*:

> Research

### Card 3 — Read Me (goes to `/about`)

> readme.txt  *(`file`)*

> the longer note  *(`hint`)*

> Read the note  *(`cta`)*

**[a11y]** link label — *`title`*:

> Read Me

**[a11y]** the nav element itself — *`src/components/NavDeck.tsx`*:

> Primary

---

## 7. Text inside the nav-card artwork

*`src/components/PixelMarks.tsx`. These float out of the cards on hover. The whole artwork
stage is `aria-hidden`, so this is visible-but-unspoken text.*

### On the Projects card

A keycap:

> ⌘K

### On the Read Me card — the terminal window

*`src/components/PixelMarks.tsx: ReadMeMark`*

Window title bar:

> ~/spurti

Body, line by line (the `$` is a styled prompt glyph, the last line is a blinking block cursor):

> $ whoami

> $ ls ~/things

> poems/ papers/ simba.jpg

> $

---

## 8. Underlined-word labels (shared by both pages)

*`src/content.ts: ENTITY` and `definitionLabel()`; the about page's copy uses the same shapes
via `src/content/aboutEntities.ts: ENTITY_DEFS`.*

**[a11y]** Each squiggle mark is a button whose label is `` `${entity} — ${role}` ``:

| Word on screen | Announced label | Photos peel? |
| --- | --- | --- |
| Stanford | Stanford CS — building in public | yes (`sticker: "stanford"`) |
| Slack | Slack — software intern | yes (`sticker: "slack"`) |
| SAIL | SAIL — translational AI | no sticker set |
| Simba | Simba — moral support | yes (`sticker: "simba"`) |

*`src/lib/stickers.ts` holds only image files, sizes and tilts — there are no captions on the
photos, so there is nothing to write there.*

---

# About page — `/about`

## 1. Header

*`src/components/BackLink.tsx` and `src/components/CornerMeta.tsx`*

Back link, top-left:

> ← home

Then the same status strip as the home page:

> Stanford

> **[dynamic]** the ticking Pacific-time clock

> snimbali@stanford.edu

---

## 2. Invitation line

*`src/pages/AboutPage.tsx` — the `.ab-hint` paragraph. The ➤ is a decorative glyph.*

> ➤ Click around…

---

## 3. Copy card (left) — title and rule

*`src/content/aboutPage.ts: ABOUT_TITLE`*

> What I'm about.

---

## 4. Copy card — the six sections

*`src/content/aboutPage.ts: ABOUT_SECTIONS`, in array order. Each has a lowercase `label` and a
`body`. `{{Stanford}}`, `{{Slack}}` and `{{Simba}}` are tokens: the braces are stripped at
render and the word inside becomes an underlined, photo-peeling mark. Keep the braces if you
want the mark; drop them for plain text.*

> **HARD CONSTRAINT** noted in the source: the page must hold one viewport with no scrolling,
> ceiling roughly 34 words per answer. If you add a sentence, cut one.

### `id: "from"`

**where i'm from**

> Delhi. I was head girl at DPS R.K. Puram and spent most of high school building things for science fairs, which is how I ended up doing research with CSIR before my first CS class.

### `id: "used-to-do"`

**what i used to do**

> Medical things, without much equipment. A dyslexia and dysgraphia screener for young kids. A pipeline that found oral cancer in slide images. An epilepsy app that calls for help on its own.

### `id: "do-now"`

**what i do now**

> CS and data science at {{Stanford}}. Software engineering intern at {{Slack}}, undergraduate researcher at the AI Lab, and I teach — TA for CS 51/52, returning as instructor.

### `id: "working-on"`

**what i'm working on**

> Hackspace at BASES — Stanford's largest hackathon, weekly HackerHours with Microsoft's Founders Hub, and demo days. Plus two lab projects I can't talk about yet.

### `id: "at-now"`

**where i'm at now**

> Stanford mostly, San Francisco midweek. When I'm not working I'm with {{Simba}}, who is a dog and is unmoved by everything on this page.

### `id: "looking-for"`

**what i'm looking for**

> Work where a model has to survive contact with an actual person — a patient, a clinician, a kid being screened. That's where the interesting failures live.

---

## 5. Photos card (widget grid, top-left)

*`src/pages/AboutPage.tsx` and `src/content/aboutPage.ts: PHOTO_TABS`*

The photo fills the card and is itself a button.

**[a11y]** button label:

> Click to scatter more photos

The image's `alt` is whatever the active tab is called, so it reads as one of the four labels
below.

App icon tile in the corner — **[a11y]** its label, from `title="Photos"`:

> Photos

**[a11y]** the segmented tab bar:

> Photo sets

The four tabs are icon-only. Each label is both the **[tooltip]** and the **[a11y]** name, and
doubles as the photo's `alt` text:

> All

> Stanford

> Work

> Simba

---

## 6. Music card (widget grid, top-right)

*`src/content/aboutPage.ts: NOW_PLAYING` and `UP_NEXT`, rendered in `src/pages/AboutPage.tsx`*

App icon tile — **[a11y]** label from `title="Music"`:

> Music

Eyebrow line above the track — *`NOW_PLAYING.note`*:

> Spurti is listening to

Now playing, in bold — *`NOW_PLAYING.title`*:

> Yellow

Underneath, rendered as `` `${artist} — ${album}` `` from *`NOW_PLAYING.artist`* and
*`NOW_PLAYING.album`*:

> Coldplay — Parachutes

**[a11y]** cover-art `alt`, built as `` `${album} cover` `` (only shown if a cover file exists;
none is committed):

> Parachutes cover

### Up next

**[a11y]** the list:

> Up next

*`src/content/aboutPage.ts: UP_NEXT`* — each row is a link to a Spotify search, with the title
first and the artist in italics:

| Title | Artist |
| --- | --- |
| Sparks | Coldplay |
| Stargazing | Myles Smith |
| WHERE IS MY HUSBAND! | RAYE |
| Sunflower | Post Malone & Swae Lee |

**[tooltip, dynamic]** each row, built as `` `Find ${title} on Spotify` `` — e.g.

> Find Sparks on Spotify

### Transport row

*`src/pages/AboutPage.tsx`. Only the play control is a real link; the rest are deliberately
inert and say so in their tooltips.*

**[a11y]** the group:

> Playback

| Control | **[a11y]** label | **[tooltip]** |
| --- | --- | --- |
| Queue | Queue | No queue on this page |
| Previous | Previous | Single track |
| Play (real link out) | **[dynamic]** `Play ${title} by ${artist} on Spotify` → "Play Yellow by Coldplay on Spotify" | — |
| Next | Next | Single track |
| Volume | Volume | Nothing to play here |

---

## 7. "say hi" card — the message thread (widget grid, bottom-left)

*`src/pages/AboutPage.tsx`, `src/components/AboutThread.tsx`, strings in
`src/content/aboutPage.ts`*

Card eyebrow:

> say hi

App icon tile — **[a11y]** label from `title="Messages"`:

> Messages

### Her side of the conversation

Sender name above her first bubble — *`THREAD_WHO.name`*:

> Spurti

Opening message, shown before you type anything — *`THREAD_OPENING`*:

> want to work together? just want to chat? message me here.

Then the script, in order — *`THREAD_SCRIPT`*. Each entry has an `ask` (her message), a
`placeholder` (greyed text in the input while that question is live), and a `reply` (what she
says after you answer):

**Step 1**

> who am I talking to?  *(`ask`)*

> iMessage  *(`placeholder`)*

> nice to meet you  *(`reply`)*

**Step 2**

> what did you want to talk about?  *(`ask`)*

> a sentence is plenty  *(`placeholder`)*

> got it — I read everything, usually same day.  *(`reply`)*

**[a11y]** typing indicator, built as `` `${THREAD_WHO.name} is typing` ``:

> Spurti is typing

While a reply is being composed the input placeholder becomes a literal ellipsis character:

> …

### Composer row

**[a11y] + [tooltip]** the two icon links:

> Email instead

> GitHub

**[a11y]** the hidden label on the text input is whatever question is currently live, so it
reads as "who am I talking to?" then "what did you want to talk about?".

**[a11y]** send button:

> Send

Once both questions are answered the input is replaced by a single link (followed by a
decorative ↗):

> Open this in your mail app

Small print under the card:

> Nothing is sent from here — the last step opens your own mail app.

**[dynamic]** the prefilled mail this generates — subject is `` `hello from ${name}` `` if you
gave a name, otherwise just:

> hello

and the body is your own answer followed by `` `— ${name}` ``.

---

## 8. "poems" card (widget grid, bottom-right)

*`src/content/aboutPage.ts: ABOUT_BOOK`, rendered in `src/pages/AboutPage.tsx`*

Card eyebrow:

> poems

Title, in bold — *`ABOUT_BOOK.title`*:

> My Paperboats

Subtitle, in italics — *`ABOUT_BOOK.subtitle`*:

> With Whirling Words

Meta line — *`ABOUT_BOOK.meta`*:

> 40+ poems · OrangeBooks Publication

**[a11y]** the links nav:

> Where to find the book

The two outbound links — *`ABOUT_BOOK.links`*, each followed by a decorative ↗:

> Google Books

> Flipkart

---

## 9. Sticker layer

Identical to the home page — clicking **Stanford**, **Slack** or **Simba** in the copy, or the
photo card itself, peels photos onto the page, dismissed with **shoo simba** / **tidy up**.
See *Home page § 5* and *§ 8* above.

---

# Written but not currently rendered

These strings live in the source for these two pages but nothing draws them today. Worth
knowing about before you rewrite, since they may be intended to come back.

### Contact row

*`src/content/aboutPage.ts: ABOUT_CONTACT` — defined and exported, but never imported by
`AboutPage.tsx`. The message thread card replaced it.*

| Label | Destination |
| --- | --- |
| Email Me | `mailto:snimbali@stanford.edu` |
| GitHub | `https://github.com/SpurtiNimbali` |
| LinkedIn | `https://www.linkedin.com/in/spurti-nimbali/` |
| CV | `TODO: add CV URL` |

### Books app tile

*`src/components/AppTiles.tsx: BooksTile` — exported but not used; the poems card has no icon
tile. If it were wired up, its **[a11y]** label would be "Books".*

### Nav-card artwork fallbacks

*`src/components/PixelMarks.tsx`. These little UI mock cards only render their text when no
screenshot is supplied, and screenshots are always supplied, so none of this shows today.*

Projects card: "All Projects", "Select project type", "Mobile app design".
Research card: "Abode", "Swift", "Node".

---

# Possible typos / inconsistencies

Nothing below has been changed. Listed only so you can decide.

1. **A `TODO:` string is shipping as a URL.** `src/content/aboutPage.ts: ABOUT_CONTACT` has
   `{ label: "CV", href: "TODO: add CV URL" }`. Currently harmless because `ABOUT_CONTACT` is
   not rendered, but the placeholder is still in the content file. (`CONTENT-TODO.md` already
   tracks this as item 1.1.)

2. **Third person in a first-person page.** The music card eyebrow is
   `"Spurti is listening to"` (`src/content/aboutPage.ts: NOW_PLAYING.note`), while every
   about-page body and thread line is written as "I". The home page is third person, so this
   may be deliberate — flagging because the two voices sit on the same page.

3. **Inconsistent sentence punctuation in the thread script.**
   `src/content/aboutPage.ts: THREAD_SCRIPT` — the first reply is `"nice to meet you"` with no
   full stop, the second is `"got it — I read everything, usually same day."` with one. The
   opening line `"want to work together? just want to chat? message me here."` and the asks
   (`"who am I talking to?"`, `"what did you want to talk about?"`) are lowercase-initial,
   which reads as intentional texting voice, but `"who am I talking to?"` capitalises `I` while
   nothing else in those strings is capitalised.

4. **Doubled em dash in the tone readout.** `src/components/IntensityAxis.tsx` builds
   `` `Tone ${n} of ${total} — ${simbaAriaText(intensity)}` `` and `simbaAriaText`
   (`src/lib/simba.ts`) itself returns `` `${label} — ${pose}` ``, so the announced string is
   e.g. "Tone 3 of 6 — warm — sitting". Screen-reader-only, so nobody sees it, but the two
   dashes read oddly aloud.

5. **"at Stanford with Slack" in the confident variant.**
   `src/content.ts: INTENSITY_LEVELS[3]` reads
   `"builds AI and writes software at Stanford with Slack, and Simba."` — every other level
   uses "with" for Simba only and a preposition of employment for Slack ("ships software at
   Slack", "ships it at Slack"), so this one puts Slack and a dog in the same grammatical slot.

6. **The "All" photo tab shows a photo of Simba.** `src/content/aboutPage.ts: PHOTO_TABS` maps
   `{ id: "all", label: "All" }` to `sticker-simba-2.webp` and `{ id: "simba", label: "Simba" }`
   to `sticker-simba-4.webp`, so "All" and "Simba" are both Simba pictures.

7. **Photo `alt` text is just the tab name.** `src/pages/AboutPage.tsx` renders
   `alt={PHOTO_TABS[photoTab].label}`, so a screen reader hears "All" or "Work" rather than a
   description of the photo.

8. **The email address is written out in three places.**
   `src/components/CornerMeta.tsx`, `src/components/AboutThread.tsx` (`const EMAIL`) and
   `src/content/aboutPage.ts: ABOUT_CONTACT`. Changing it means changing all three.

9. **Publisher name worth double-checking.** `ABOUT_BOOK.meta` reads
   `"40+ poems · OrangeBooks Publication"` — singular "Publication", and "OrangeBooks" set as
   one word.

10. **`SAIL` is underlined but has no photos.** `src/content.ts: ENTITY.SAIL` has no `sticker`
    key, so at tone levels 4 and 5 the word carries the same squiggle as Stanford, Slack and
    Simba but clicking it does nothing. Its label, "SAIL — translational AI", is also the only
    one that is announced without any visible payoff.
