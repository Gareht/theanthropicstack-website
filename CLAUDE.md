# The Anthropic Stack — Landing Page

Static landing page for [The Anthropic Stack](https://theanthropicstack.substack.com) newsletter.

## Structure

```
index.html    — Single-file landing page (HTML + CSS + JS, no framework)
icon.svg      — Logo icon (stacked isometric layers + sparkle, black + orange)
```

No build step. No dependencies. Open `index.html` in a browser to develop.

## Design Conventions

- **Background:** #0a0a0a (near-black) with subtle navy gradients
- **Accent:** #e8713a (warm orange)
- **Text:** #f5f5f5 (primary), #888 (muted)
- **Cards:** #111111 with #1a1a1a borders
- **Fonts:** Instrument Serif (headings/logo), Inter (body), JetBrains Mono (code/stats)
- All fonts loaded from Google Fonts with `font-display: swap`

## Copy Rules

- British English throughout
- No contractions ("do not", "it is", "we will")
- No Oxford comma ("x, y and z")
- No em dashes or en dashes
- Direct, confident tone. No generic marketing language.

## Subscribe Form

Forms POST to:
```
https://theanthropicstack.substack.com/api/v1/free?noRedirect=true
```
Body: `{ "email": "..." }` as JSON. Fallback redirects to Substack subscribe page.

## Animations

- Hero headline: staggered character reveal, orange glow pulse on "actually"
- Terminal: typing effect with blinking cursor (IntersectionObserver triggered)
- Stats: count-up on scroll (eased cubic)
- Sections: fade + slide up on scroll, children staggered at 120ms
- Dot grid background: mouse-tracking orange radial glow
- Cards: 3D perspective tilt on hover
- Subscribe button: idle pulse, glowing border on focus, checkmark draw on success

## Gotchas

- Git remote still points to `Gareht/Infant-Mind-App.git` — update before pushing
- Hero headline wraps each word in a `.word` span (white-space: nowrap) to prevent mid-word breaks at intermediate viewport widths
- The icon SVG uses `currentColor` inline in the nav (adapts to white on dark) but fixed dark colours in `icon.svg` (for favicon on light browser tabs)
