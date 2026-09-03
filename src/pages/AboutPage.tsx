import { useRef, useState, type ReactNode } from "react";
import { BackLink } from "../components/BackLink";
import { CornerMeta } from "../components/CornerMeta";
import { DefinitionMark } from "../components/DefinitionMark";
import { StickerBoard, type Pinned } from "../components/HeroOverlay";
import { AboutThread } from "../components/AboutThread";
import { AboutMark } from "../components/AboutObjects";
import { AboutPhotos } from "../components/AboutPhotos";
import { printsFor } from "../lib/stickers";
import type { Definition } from "../content";
import {
  ABOUT_LINKS,
  ABOUT_PARAGRAPHS,
  ENTITY_DEFS,
  NOW_PLAYING,
  UP_NEXT,
  UP_NEXT_NOTE,
} from "../content/aboutPage";

const TOKEN = /\{\{([A-Za-z]+)\}\}|\[\[([^\]]+)\]\]/g;

/**
 * Splits a body string on its two markups: `{{Word}}` becomes a squiggle mark
 * that peels photos, `[[phrase]]` becomes a link to whatever ABOUT_LINKS holds
 * for it.
 *
 * A `[[phrase]]` with no URL yet renders as ordinary text, not as an anchor
 * with a placeholder href — the phrase reads the same either way, and a link
 * only exists once it can actually go somewhere.
 */
function renderBody(
  body: string,
  onSpawn: (definition: Definition, at: HTMLElement | null) => void,
): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;

  for (const m of body.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(body.slice(last, i));
    last = i + m[0].length;

    const [, entity, phrase] = m;

    if (phrase !== undefined) {
      const href = ABOUT_LINKS[phrase];
      out.push(
        href ? (
          <a key={`${i}-link`} className="ab-link" href={href} target="_blank" rel="noreferrer">
            {phrase}
          </a>
        ) : (
          phrase
        ),
      );
      continue;
    }

    const def = ENTITY_DEFS[entity];
    if (!def) {
      out.push(m[0]);
      continue;
    }
    out.push(
      <DefinitionMark key={`${i}-${entity}`} definition={def} onSpawn={onSpawn}>
        <span className="ab-ent">{entity}</span>
      </DefinitionMark>,
    );
  }

  if (last < body.length) out.push(body.slice(last));
  return out;
}

/**
 * Card header: an eyebrow on the left and the card's object in the top-right
 * corner, where the reference puts an app icon and where every other page on
 * this site puts an extruded object.
 */
function CardHead({ label, mark }: { label: string; mark: ReactNode }) {
  return (
    <header className="ab-cardhead">
      <h2 className="ab-label">{label}</h2>
      {mark}
    </header>
  );
}

/**
 * About page mockup.
 *
 * Layout is marco.fyi/about: a copy card on the left holding every section, and
 * a widget grid on the right where each card carries an eyebrow, an object in
 * its corner, and a meta line or action pill at the bottom.
 *
 * The header is the site's standard one — BackLink over CornerMeta — so it
 * matches every other content page rather than inventing its own nav.
 *
 * The surface — cream paper, dot grid, liquid backdrop, squiggle marks and
 * peel-off photos — is this site's own theme.
 *
 * One viewport, no scrolling — see styles/about.css for the width budget.
 */
export function AboutPage() {
  const [pinned, setPinned] = useState<Pinned[]>([]);
  const nextId = useRef(1);

  const handleSpawn = (definition: Definition, at: HTMLElement | null) => {
    const key = definition.sticker;
    if (!key || !at) return;
    const from = at.getBoundingClientRect();
    const queue = printsFor(key);
    setPinned((prev) => {
      const existing = prev.filter((p) => p.key === key);
      if (existing.length >= queue.length) {
        return prev.map((p) => (p.key === key ? { ...p, nudge: p.nudge + 1 } : p));
      }
      const start = existing.length;
      return [
        ...prev,
        ...queue.slice(start).map((_, i) => ({
          id: nextId.current++,
          key,
          printIndex: start + i,
          from,
          nudge: 0,
        })),
      ];
    });
  };

  return (
    <section className="ab">
      <header className="ab-top">
        <BackLink />
        <CornerMeta />
      </header>

      <p className="ab-hint">
        <span aria-hidden="true">➤</span> Click around&hellip;
      </p>

      <div className="ab-grid">
        {/* No visible heading over the bio — the copy is the card. The h1 is
            kept for screen readers so the page still has a document title
            above the widget cards' h2s. */}
        <article className="ab-card ab-card--copy">
          <h1 className="sr-only">About</h1>
          <div className="ab-secs">
            {ABOUT_PARAGRAPHS.map((para) => (
              <p key={para.id} className="ab-body">
                {renderBody(para.body, handleSpawn)}
              </p>
            ))}
          </div>
        </article>

        <div className="ab-widgets">
          {/* Photos: the photograph is the card. The object and the dots float
              over it; see AboutPhotos for why there are no longer any tabs. */}
          <article className="ab-card ab-card--photos">
            <AboutPhotos />

            <span className="ab-icon--float">
              <AboutMark kind="prints" />
            </span>
          </article>

          {/* Now playing, after the reference's music card. */}
          <article className="ab-card ab-card--listen">
            <header className="ab-cardhead">
              <span className="ab-art">
                <span className="ab-art__fill" aria-hidden="true" />
                {NOW_PLAYING.art ? (
                  <img
                    className="ab-art__img"
                    src={NOW_PLAYING.art}
                    alt={`${NOW_PLAYING.album} cover`}
                    onError={(e) => {
                      // No cover file committed — leave the plain sleeve showing.
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
              </span>
              <AboutMark kind="cassette" />
            </header>

            <p className="ab-listen__note">{NOW_PLAYING.note}</p>

            <p className="ab-now">
              <strong>{NOW_PLAYING.title}</strong>
              <span>
                {NOW_PLAYING.artist} — {NOW_PLAYING.album}
              </span>
            </p>

            {/* The queue, as a track listing rather than as rows of UI: one
                rule for the whole group instead of one per track, and a name
                trailed by its credit instead of two aligned columns. */}
            <div className="ab-next">
              <p className="ab-next__label">{UP_NEXT_NOTE}</p>

              <ol className="ab-uplist" aria-label="Up next">
                {UP_NEXT.map((track) => (
                  <li key={track.title}>
                    <a
                      href={`https://open.spotify.com/search/${encodeURIComponent(
                        `${track.title} ${track.artist}`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      title={`Find ${track.title} on Spotify`}
                    >
                      <span>{track.title}</span>
                      <em>{track.artist}</em>
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="ab-transport" role="group" aria-label="Playback">
              <button type="button" disabled title="No queue on this page" aria-label="Queue">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M2 3h12v1.5H2zM2 6.5h12V8H2zM2 10h7v1.5H2z" />
                </svg>
              </button>
              <button type="button" disabled title="Single track" aria-label="Previous">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M13 3v10L7 8zM7 3v10L1 8z" />
                </svg>
              </button>
              <a
                className="ab-transport__play"
                href={NOW_PLAYING.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Play ${NOW_PLAYING.title} by ${NOW_PLAYING.artist} on Spotify`}
              >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M4 2.5l9 5.5-9 5.5z" />
                </svg>
              </a>
              <button type="button" disabled title="Single track" aria-label="Next">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 3v10l6-5zM9 3v10l6-5z" />
                </svg>
              </button>
              <button type="button" disabled title="Nothing to play here" aria-label="Volume">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 2.5v11L4.5 11H2V5h2.5zM11 5.5a3.5 3.5 0 010 5v-5z" />
                </svg>
              </button>
            </div>
          </article>

          {/* Contact as a message thread. Not a form — nothing collects input.
              The compose bar is a mailto link. */}
          <article className="ab-card ab-card--thread">
            <CardHead label="say hi" mark={<AboutMark kind="envelope" />} />
            <AboutThread />
          </article>
        </div>
      </div>

      <StickerBoard pinned={pinned} onClear={() => setPinned([])} />
    </section>
  );
}
