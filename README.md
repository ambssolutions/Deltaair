# Delta Air Solutions — website

Single-page marketing site for Delta Air Solutions Ltd, installable as a
mobile app (PWA), SEO-tagged, and ready to deploy on GitHub Pages.

## What's in here

```
index.html              The whole site (HTML/CSS/JS in one file)
manifest.webmanifest     PWA manifest — powers "Add to Home Screen"
sw.js                    Service worker — offline support + installability
robots.txt               Search engine crawl rules
sitemap.xml              Search engine sitemap
favicon.ico, favicon-*.png, apple-touch-icon.png   Browser tab / iOS icons
icons/                   App icons (192/512, incl. maskable) + social share image
```

## Deploy on GitHub Pages

1. Push this folder to a GitHub repo (root of the repo, or a `/docs` folder —
   just make sure the path you pick matches what you choose in step 2).
2. In the repo, go to **Settings → Pages**.
3. Under **Source**, pick the branch and folder these files live in, then save.
4. GitHub will publish at `https://<username>.github.io/<repo>/`.

### Using the real domain (deltaair.co.nz)

The site's meta tags and manifest already assume `https://deltaair.co.nz/`.
To use that domain on GitHub Pages:

1. Add a file named `CNAME` (no extension) to this folder containing just:
   ```
   deltaair.co.nz
   ```
2. At your domain registrar, point the domain at GitHub Pages:
   - `A` records for the apex domain to GitHub's IPs (see GitHub's
     [Pages docs](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)
     for the current list), or
   - a `CNAME` record if you're using a `www` subdomain instead.
3. Back in **Settings → Pages**, enter the custom domain and enable
   **Enforce HTTPS** once it's available.

If you deploy somewhere else (Netlify, Vercel, your own host), no changes
are needed — everything here uses relative paths.

## Installing it as an app

Because of `manifest.webmanifest` and `sw.js`, once the site is live on
**HTTPS** (required — this won't work over plain `http://` or from a local
`file://` open):

- **Android/Chrome**: a "Install app" / "Add to Home Screen" prompt appears
  automatically, or from the browser's ⋮ menu.
- **iOS/Safari**: Share button → **Add to Home Screen**.
- **Desktop Chrome/Edge**: an install icon appears in the address bar.

The service worker caches the page so it still opens (from cache) if the
connection drops, and bumps itself automatically — no action needed after
future deploys as long as you keep editing `index.html` in place. If you
change *which* files are cached (e.g. add new icons), bump `CACHE_VERSION`
at the top of `sw.js` so old caches get cleared.

## Before going live — things to double-check

A few placeholders were used when this site was first put together; search
`index.html` for `TODO` to find them:

- **Email address** — currently `info@deltaairsolutions.co.nz` (a guess)
- **NZBN** / company number for the footer
- **Opening hours** in the structured data (`openingHoursSpecification`)
- **Contact form endpoint** — the form currently only shows a fake "thanks"
  message and doesn't send anywhere. Wire it up to
  [Formspree](https://formspree.io) or similar, then delete the placeholder
  submit handler near the bottom of `index.html` (search for "Placeholder
  form handling").

## SEO

- Title, meta description, Open Graph, and Twitter Card tags are all set.
- `HVACBusiness` structured data (JSON-LD) describes the business, service
  area, and offerings to search engines.
- `robots.txt` and `sitemap.xml` are included — update `sitemap.xml`'s
  `<lastmod>` when you make significant content changes.
- Update `sitemap.xml` and the `canonical`/`og:url` tags in `index.html` if
  the domain ever changes.

## Local testing

Since the page registers a service worker, opening `index.html` directly as
a `file://` URL won't fully behave like production (service workers require
`http(s)://`). To test locally with everything working:

```bash
# from this folder
python3 -m http.server 8000
# then open http://localhost:8000 — localhost counts as a secure context
```
