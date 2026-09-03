# Content still needed

Everything the site is waiting on, in one place. Fill in the blanks and send it
back — each item says exactly which file and field it lands in, so nothing needs
guessing on the way in.

Generated from the codebase, not from memory: every line below corresponds to a
literal `TODO` marker or an unset value that renders as a placeholder today.

**Legend** — 🔴 shows as a visible placeholder to visitors · 🟡 renders but is
thin or unverified · ⚪️ internal, invisible to visitors

---

## 1. About page — `src/content/aboutPage.ts`

| # | Item | Status | What's needed |
|---|---|---|---|
| 1.0 | **Web3Forms access key** | 🔴 | The thread now sends to `spurtinimbali@gmail.com` for real, but only once this exists. Enter that address at web3forms.com and they mail a key back; put it in `.env.local` as `VITE_WEB3FORMS_KEY` and add the same name and value in Vercel → Settings → Environment Variables, then redeploy. Until then the thread falls back to opening your own mail app, which is what it did before |
| 1.1 | **CV link** | ⚪️ | No longer renders anywhere — the contact list that held it is gone, and its href was the literal string `TODO: add CV URL`. Send a URL and it goes in the composer's icon row beside GitHub and LinkedIn |
| 1.2 | **Message thread copy** | ⚪️ | You said the draft is fine — noting it only because it's my writing in her voice, not hers. Rewrite any time → `THREAD_OPENING`, `THREAD_SCRIPT` |
| 1.3 | **A poem to link "poems" at** | ⚪️ | The bio says "mostly poems" — you wanted that linked to a poem. Give me a URL (or the poem itself and I'll host it) → `ABOUT_LINKS.poems` |
| 1.4 | **Somewhere to link "articles or papers"** | ⚪️ | Same sentence, second half. A page, a Medium, a Drive folder — whatever collects the writing → `ABOUT_LINKS["articles or papers"]` |
| 1.5 | **LinkedIn URL** | 🔴 | The icon row is GitHub and LinkedIn now that the mail icon is gone, so with LinkedIn unset the row is a single icon. Built and waiting on the address → `ABOUT_PROFILES.linkedin` |

1.1 and 1.3–1.4 are ⚪️ rather than 🔴 on purpose: until a URL exists, the two
phrases render as ordinary text and the icon simply isn't drawn, so nothing on
the live page looks broken or dead. Each one is a one-line change when it
arrives.

Everything else on this page is filled: photos, playlist, album art. The poems
strip has been removed at your request, and the card corners now carry drawn
objects instead of the four service logos, so those four files in
`public/icons/` are no longer used by anything.

The photos card now carries your four photographs on a carousel rather than the
sticker photos on tabs. Two notes on the files: the card uses
`about-photo-childhood-cropped.webp`, and `about-photo-childhood.webp` is kept
only as the uncropped source — nothing references it, because the crop is what
loses the stray cursor and the burned-in timestamp. Send more photographs any
time; each is one entry in `ABOUT_PHOTOS`, and the carousel takes as many as
you give it.

---

## 2. Projects — `src/projects.ts`

### 2a. Entries that are mostly empty

These render with visible `TODO` text. They need real copy or they should be cut.

**Dares** — 5 gaps
- Year
- `detail` — what it's for and who it's for
- `full` — did it ship, did people use it, what broke
- Stack
- Link (repo? demo?)

**CS 278** — 4 gaps
- Year
- `line` and `detail` — currently both literally `TODO`
- `full` — and: is this separate from the CS 231N paper? If it's the same work it should be merged rather than duplicated. If it went badly, worth saying so plainly — that reads as a strength on this site, not a liability.

**Cardea** *(id is `ollie-hinkle`)* — 3 gaps
- Stack
- Link
- Naming: confirm this should read **Cardea** rather than the foundation name — the id and the display name currently disagree
- Is it live, and who's using it?

### 2b. Entries needing one field

| Project | Missing |
|---|---|
| Atria AI | repo URL, demo video URL |
| SaySo | marketplace URL |
| Orchestrate Support Agent | `full` — how it placed, and what it got wrong |
| Quantum AI Institute | stack |
| Airys Tech | link |
| Tricks for Tips *(NYC taxis)* | year |
| Tag Team Reader | year |
| EpiCare | year |
| Navigo | year |

**Years needed in one line, if that's easier:** Dares · CS 278 · Tricks for Tips
· Tag Team Reader · EpiCare · Navigo

---

## 3. Research — `src/research.ts`

| # | Item | Status | What's needed |
|---|---|---|---|
| 3.1 | **DysDiag paper URL** | 🔴 | The IJAARIT link is a dead `#`. This is the only peer-reviewed publication on the site, so it's the most valuable link here → `links` |
| 3.2 | **Embodily** | 🟡 | `area` is a placeholder — one line on what it is |

### 3.3 — "The Right Amount of Wrong" ⚠️

Deliberately **not linked** anywhere public. `research.ts` flags the draft as
containing stray editing marks, with several sentences ending mid-argument and
at least two citations still to verify.

**Needed before it goes public:** a proofread pass, citations checked, and your
go-ahead. Then it can join the research page.

---

## 4. Assets

| # | Item | Status | Where it goes |
|---|---|---|---|
| 4.1 | **Simba cut-out PNGs** | 🔴 | `public/simba/0.png` … `5.png` — six poses, quiet → undeniable, transparent cut-outs ~44px tall. The intensity slider renders a labelled placeholder box without them. Spec is in `public/simba/README.md` |

Done and in place: album art, sticker photographs.

---

## 5. Quick wins

If you only have ten minutes, these are the highest value — each is a single URL
that turns a placeholder, or a phrase that wants to be a link, into a real one:

1. **DysDiag paper URL** (3.1) — the only peer-reviewed publication on the site
2. **A poem, and where the articles live** (1.3, 1.4) — the two links your bio
   asks for
3. **LinkedIn, and a CV** (1.5, 1.1) — both slot straight into the say-hi card
4. **Atria AI repo + demo** (2b)
5. **SaySo marketplace URL** (2b)

---

## How to send it back

Whichever is easiest:

- Fill in this file and send it back
- Reply in chat with the item numbers and values
- Or just paste a list — I'll match things up

I'll wire it in and re-verify the pages.

---

*Counts at time of writing: 23 `TODO` markers across `projects.ts` (21) and
`research.ts` (2), plus one missing asset set. `aboutPage.ts` has none left —
every gap on that page is now an unset value that renders as nothing.*
