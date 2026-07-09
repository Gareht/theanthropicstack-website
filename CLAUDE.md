# The Anthropic Stack — Landing Page

Static landing page for [The Anthropic Stack](https://theanthropicstack.substack.com) newsletter.

## Structure

```
src/pages/index.astro   — Landing page
src/pages/stack.astro   — Tools page (the only home for referral links)
src/data/tools.ts       — Tool list and per-tool disclosures
src/layouts/Layout.astro — Head, meta, JSON-LD schemas
src/components/         — Section components
public/                 — Static assets, robots.txt, sitemap.xml, .htaccess
index.html              — Legacy single-file version, superseded by the Astro build
```

Astro + Tailwind v4, static output, pnpm. `pnpm dev` to develop, `pnpm build` to produce `dist/`.

## Monetisation and Affiliate Links

One principle, non-negotiable: **affiliate links never appear inside editorial picks.** Not in Shiplog entries, not in Stack This Week items, not in tool reviews. The moment a recommendation carries a referral link, every honest recommendation becomes suspect. Referral links live in one disclosed line near the sign-off, or on `/stack`.

- **Branded redirects only.** Never publish a raw referral URL. Routes are declared in `astro.config.mjs` under `redirects`, so a destination can be swapped without editing a published issue or a profile bio. Current: `/railway` to the Railway referral URL. A host-level redirect, if configured, takes precedence over the generated fallback page.
- **`/stack`** (`src/pages/stack.astro`, data in `src/data/tools.ts`) is the scalable destination. Point at the page, never at a single product.
- **Disclosure travels with the link.** A tool with a `disclosure` field renders a `referral` tag and its disclosure line on the row itself. Lead with what the reader gains ("You get $20 in credits"), then state the commission plainly. The UK ASA and CMA expect this, and on a no-hype brand it builds trust rather than costing it.
- Referral anchors carry `rel="sponsored nofollow noopener"`. `/railway` is disallowed in `robots.txt`.

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

- Hosted on Krystal (Apache). The `/railway` redirect is configured there, and a host-level rule takes precedence over the `redirects` block in `astro.config.mjs`. Change the referral code in both, or delete the Astro block and keep Krystal as the single source of truth.
- Hero headline wraps each word in a `.word` span (white-space: nowrap) to prevent mid-word breaks at intermediate viewport widths
- The icon SVG uses `currentColor` inline in the nav (adapts to white on dark) but fixed dark colours in `icon.svg` (for favicon on light browser tabs)
