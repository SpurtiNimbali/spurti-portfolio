import { useState, type ReactNode } from "react";

/**
 * App-style icon tiles.
 *
 * Each tile looks for a real logo file first and only falls back to the drawn
 * mark if that file is missing:
 *
 *   public/icons/spotify.svg
 *   public/icons/photos.svg
 *   public/icons/messages.svg
 *   public/icons/books.svg
 *
 * Drop the official assets in and they appear — no code change. They are not
 * committed here because they are the brands' trademarked artwork, not ours to
 * redistribute. Spotify publishes downloadable logo files and explicitly allows
 * using them to link to Spotify content; Apple's app icons (Photos, Messages,
 * Books) are covered by its identity guidelines, which restrict use inside
 * third-party interfaces — worth checking before this page goes public.
 *
 * `bare` tiles (a logo that is already a full rounded app icon) get no
 * background or padding, so the artwork isn't boxed inside a second tile.
 */

type TileProps = {
  title: string;
  /** File in public/icons/, without extension. */
  file: string;
  /** Class controlling the fallback's colour. */
  variant: string;
  /** Drawn mark, used only when the logo file is absent. */
  fallback: ReactNode;
};

/** Tried in order; first one that loads wins. */
const EXTS = ["svg", "png", "webp", "jpeg", "jpg"];

function Tile({ title, file, variant, fallback }: TileProps) {
  const [ext, setExt] = useState(0);
  const failed = ext >= EXTS.length;
  const src = failed ? "" : `/icons/${file}.${EXTS[ext]}`;

  if (failed) {
    return (
      <span className={`ab-tile ab-tile--${variant}`} role="img" aria-label={title}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {fallback}
        </svg>
      </span>
    );
  }

  return (
    <span className="ab-tile ab-tile--bare">
      <img
        src={src}
        alt={title}
        onError={() => setExt((i) => i + 1)}
      />
    </span>
  );
}

export function MusicTile({ title }: { title: string }) {
  return (
    <Tile
      title={title}
      file="spotify"
      variant="music"
      fallback={
        <>
          <rect x="5" y="10" width="2.6" height="4" rx="1.3" />
          <rect x="9.4" y="7" width="2.6" height="10" rx="1.3" />
          <rect x="13.8" y="9" width="2.6" height="6" rx="1.3" />
        </>
      }
    />
  );
}

export function PhotosTile({ title }: { title: string }) {
  const petals = [
    { r: -90, c: "#f5c518" },
    { r: -30, c: "#e8642f" },
    { r: 30, c: "#d94a8c" },
    { r: 90, c: "#7b5cd6" },
    { r: 150, c: "#3aa0e0" },
    { r: 210, c: "#4bb45f" },
  ];
  return (
    <Tile
      title={title}
      file="photos"
      variant="photos"
      fallback={
        <>
          {petals.map((p) => (
            <ellipse
              key={p.r}
              cx="12"
              cy="7.6"
              rx="3.1"
              ry="4.6"
              fill={p.c}
              opacity="0.88"
              transform={`rotate(${p.r} 12 12)`}
            />
          ))}
        </>
      }
    />
  );
}

export function MessagesTile({ title }: { title: string }) {
  return (
    <Tile
      title={title}
      file="messages"
      variant="messages"
      fallback={
        <path d="M12 4.5c4.4 0 7.8 2.8 7.8 6.4 0 3.5-3.4 6.3-7.8 6.3-.9 0-1.7-.1-2.5-.3-1 .7-2.4 1.4-3.9 1.6.7-.8 1.2-1.7 1.4-2.6-1.7-1.2-2.8-2.9-2.8-5 0-3.6 3.4-6.4 7.8-6.4z" />
      }
    />
  );
}

export function BooksTile({ title }: { title: string }) {
  return (
    <Tile
      title={title}
      file="books"
      variant="books"
      fallback={
        <path d="M12 7.4c-1.6-1.2-3.5-1.8-5.6-1.8-.5 0-.9.4-.9.9v9.1c0 .5.4.9.9.9 2.1 0 4 .6 5.6 1.8 1.6-1.2 3.5-1.8 5.6-1.8.5 0 .9-.4.9-.9V6.5c0-.5-.4-.9-.9-.9-2.1 0-4 .6-5.6 1.8zm0 0v10.4" />
      }
    />
  );
}
