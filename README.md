# Delta Air Solutions — website

Marketing site for Delta Air Solutions Ltd (Gordonton, Hamilton — serving
Auckland and Waikato). Static HTML, installable as a mobile app (PWA),
SEO-tagged, and deployable to Vercel or GitHub Pages with no build step.

## Files

```
index.html               Homepage — hero, solutions overview, specials, contact form
solutions.html           Seven HVAC solutions, each with its own CTA
calculator.html          Heat pump sizing calculator + contact form
about.html               Company background
giveaway.html            Daikin Alira giveaway — links to the Google entry form

shared.css               Header, nav, logo, promo banner and buttons for EVERY page.
                         Edit chrome here, not in the individual pages.

sw.js                    Service worker — offline support, cache busting, PWA install
version.json             Deploy version, read by the "new version available" banner
manifest.webmanifest     PWA manifest for the main site
calculator.webmanifest   PWA manifest so the calculator installs as its own app

sitemap.xml              Search engine sitemap
robots.txt               Crawl rules
vercel.json              Cache headers and security headers for Vercel

icon-192.png             App icons. The -maskable versions carry ~19% safe margin
icon-512.png             so Android can crop them to a circle without clipping
icon-192-maskable.png    the logo.
icon-512-maskable.png
apple-touch-icon.png     iOS home screen icon
og-image.png             Social share preview image
favicon.ico              Browser tab icons
favicon-16x16.png
favicon-32x32.png
air-wave.png             Decorative wave graphic
```

## Deploying

**Vercel** — connect the repo and deploy. `vercel.json` sets the cache headers
that matter: `sw.js` and `version.json` must never be cached, or visitors keep
running an old build.

**GitHub Pages** — push to the repo root and enable Pages in Settings. Everything
is static; there is nothing to build.

## Releasing a change

Bump the version in **three** places, or returning visitors keep the cached site:

1. `sw.js` — `CACHE_VERSION`
2. `version.json` — `version`
3. `<meta name="app-version">` in all four HTML pages

They must all match. The page polls `version.json`, notices the mismatch, and
shows a "Refresh" banner rather than reloading underneath someone mid-form.

## Editing

**Header, nav, logo or promo banner** — edit `shared.css`. Every page links it,
so one change applies everywhere. Each page also carries a small inline copy of
the critical chrome rules as a fallback if `shared.css` fails to load.

**Giveaway** — `GIVEAWAY_DEADLINE` near the top of each page's script. The promo
bar removes itself automatically once that passes; no manual edit needed on the
day. `GIVEAWAY_ENABLED` pulls it early if required.

**Forms** — both contact forms post to Web3Forms. Access keys are in the submit
handlers. The file field must stay named `attachment`; Web3Forms rejects any
other name, and an empty file input has to be stripped before sending or the
whole submission is refused.

**Calculator limits** — `MAX_AUTO_VOLUME_M3` (160 m³) caps when the tool will
recommend a product automatically. Above it, or when the load exceeds the
largest active product, it refers to a site assessment instead.

## Known follow-ups

- Each page still carries duplicated CSS beyond the shared chrome; stripping it
  would roughly halve the page sizes.
- Calculator product prices are placeholders pending the final installed-price list.
- NZBN is still a TODO in the footer.
