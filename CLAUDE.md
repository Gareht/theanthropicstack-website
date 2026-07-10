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

## Deployment

Hosted on Krystal (Apache, Pure-FTPd). Deploys are a mirror of `dist/` over FTPS.

```
cp .env.example .env     # fill in FTP_PASS, never commit it
brew install lftp
./scripts/deploy.sh          # dry run: builds, connects, reports, writes nothing
./scripts/deploy.sh --live   # uploads
```

Hard-won details, all of which cost time once:

- **Explicit FTPS on port 21**, not implicit on 990. In lftp that means the `ftp://` scheme plus `set ftp:ssl-force true`. Using `ftps://` hangs, retrying against a closed port 990.
- **`FTP_HOST` must be `adama-lon.krystal.uk`**, the name on Krystal's shared certificate. `ftp.theanthropicstack.com` resolves to the same box but fails certificate verification. Never "fix" that with `ssl:verify-certificate false`: the connection carries the FTP password.
- **`FTP_REMOTE_DIR` is `/`.** The FTP account logs straight into the web root. `/public_html` would create a nested folder that serves nothing.
- **`--delete` is opt-in** and requires `--live`. The web root holds `subscribe.php`, `.htaccess` and `cgi-bin`, none of which exist in `dist/`. A plain mirror leaves them alone.
- **Dotfiles must upload.** `set ftp:list-options -a` ensures `.htaccess` and `.well-known/` go up. Losing `.htaccess` silently breaks both the subscribe form and `/railway`.
- Secrets come from `.env` (gitignored) and reach lftp via `LFTP_PASSWORD`, never argv, so they stay out of `ps` on a shared host.

## Monetisation and Affiliate Links

One principle, non-negotiable: **affiliate links never appear inside editorial picks.** Not in Shiplog entries, not in Stack This Week items, not in tool reviews. The moment a recommendation carries a referral link, every honest recommendation becomes suspect. Referral links live in one disclosed line near the sign-off, or on `/stack`.

- **Branded redirects only.** Never publish a raw referral URL. Routes live in `public/.htaccess` as `RewriteRule` entries, so a destination can be swapped without editing a published issue or a profile bio. Current: `/railway` to `https://railway.com/?referralCode=theanthropicstack`.
- **Never add a redirect through the Krystal control panel.** Its UI appends a trailing slash after the query string, producing `?referralCode=theanthropicstack/`. That corrupts the code, Railway attributes nothing and the link looks perfectly healthy from the outside. This happened once already. `public/.htaccess` is the only source of truth, and it is version controlled precisely so a value like this cannot rot unseen.
- **Verify after every referral change.** `curl -sI https://theanthropicstack.com/railway | grep -i location` and read the code character by character.
- **`/stack`** (`src/pages/stack.astro`, data in `src/data/tools.ts`) is the scalable destination. Point at the page, never at a single product.
- **Disclosure travels with the link.** A tool with a `disclosure` field renders a `referral` tag and its disclosure line on the row itself. Lead with what the reader gains ("You get $20 in credits"), then state the commission plainly. The UK ASA and CMA expect this, and on a no-hype brand it builds trust rather than costing it.
- Referral anchors carry `rel="sponsored nofollow noopener"`. `/railway` is disallowed in `robots.txt`.

## Design Conventions

Tokens live in `src/styles/global.css` under `@theme`. That file is authoritative; the values below are a summary.

- **Background:** #0c0a09 (warm near-black), surfaces #1c1917
- **Accent:** #e8713a (warm orange)
- **Text:** #fafaf9 (primary), #a8a29e (secondary), #78716c (tertiary)
- **Borders:** #292524, warm variant #44403c
- **Fonts:** Cormorant Garamond (display), Outfit (body), IBM Plex Mono (labels/code)
- All fonts loaded from Google Fonts with `font-display: swap`
- A noise texture overlay and a mouse-tracking dot grid supply the warmth. Sections reveal on scroll via IntersectionObserver (`.reveal`, `.reveal-child`).

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

- `/stack` is served by Apache as `/stack/` (a 301 adds the directory slash). Expected, not a bug.
- A mirror without `--delete` leaves stale hashed files in `assets/` on the server. Harmless, but the directory grows over time.
- Hero headline wraps each word in a `.word` span (white-space: nowrap) to prevent mid-word breaks at intermediate viewport widths
- The icon SVG uses `currentColor` inline in the nav (adapts to white on dark) but fixed dark colours in `icon.svg` (for favicon on light browser tabs)
