# ShopAI Tools

A fast, dependency-free static directory for AI tools useful to online sellers. The source of truth for listings is [`tools.json`](tools.json). `npm run build` writes a ready-to-publish site to `dist/`.

## Set up

1. Edit [`config.json`](config.json): set `siteName`, the final HTTPS `siteUrl`, and a working `contactEmail` before publishing. The default `.example` URL and `example.com` email are placeholders.
2. Optionally set `formspreeEndpoint` to your Formspree form URL. With it blank, the submission form opens the visitor's email app with the fields filled in. This fallback depends on the visitor having an email app configured.
3. Replace `FEATURED_STRIPE_LINK` in `featuredStripeLink` with your Stripe Payment Link URL when ready. Until then, the page displays the $49 option but no payment button. Submission review and payment are separate steps.
4. Run `npm run build`. Open `dist/index.html` through a local static server for a full preview, for example `python3 -m http.server 8000 -d dist`.

## Add or edit a tool

Add **one object** to [`tools.json`](tools.json). Required fields are `name`, `slug`, `official_url`, `description`, `category`, `pricing_type`, `best_for`, `pros` (exactly three strings), `featured` (boolean), and `affiliate_url` (empty string for none). Category must be one of the eight existing category names. Pricing type is `free`, `freemium`, or `paid`. Use a unique lowercase hyphenated slug. A featured tool appears first in its category and in the full directory, with a badge. The tool's outbound button uses `affiliate_url` when present, otherwise `official_url`; the official link remains visible separately on the tool page. Rebuild after changes.

The directory's descriptions are editorial summaries. Verify product features, pricing, official domains, and any affiliate disclosures before launch and keep them current. No ratings, review counts, or performance claims are fabricated.

## Pages and SEO

The build script generates the home page, eight categories, 50 tool pages, five comparisons, five guides, a guide index, a comparison index, and a submission page. It also generates `sitemap.xml`, `robots.txt`, and `llms.txt`. The site has unique metadata and canonical URLs from `siteUrl`. Search is a tiny local script; the listings remain visible in static HTML to crawlers and visitors without JavaScript. Guides have FAQ structured data; categories have ItemList data; tools have SoftwareApplication data; home has Organization data.

## Render static site

Create a **Static Site** from this repository with:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Environment variables:** none required

Set `siteUrl` in `config.json` to the final Render or custom-domain URL and rebuild before launch. Clean URLs are emitted as directories with `index.html`. No server, database, image pipeline, or npm dependencies are required.

## Checks

Run `npm run check` to build and validate data, generated routes, canonical tags, schema, and internal links. The check does not verify live third-party pricing or uptime.
