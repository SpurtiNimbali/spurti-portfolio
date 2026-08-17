# Logo files for the /about-preview widget tiles

Drop the official assets here and the cards pick them up automatically — no code
change. `.svg` is tried first, then `.png`, then the drawn fallback in
`src/components/AppTiles.tsx`.

    spotify.svg    (or .png)   -> "on repeat" card
    photos.svg                 -> photos card
    messages.svg               -> "say hi" card
    books.svg                  -> "a poem" card

Where to get them legitimately:

- Spotify   https://developer.spotify.com/documentation/design
            Downloadable logo files. Their guidelines permit using the mark to
            link to Spotify content, with rules on colour, clear space and
            minimum size.
- Apple     https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html
            Apple's app icons (Photos, Messages, Books) are covered by its
            identity guidelines, which restrict use of its app icons inside
            third-party interfaces. Worth reading before this page is public —
            generic glyphs may be the safer call for those three.

These files are intentionally not committed: they are the brands' trademarked
artwork, not this project's to redistribute.
