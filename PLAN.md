# KGF Unisex Saloon website: implementation plan

A mobile-first catalogue customers open from a QR code in the shop. They browse, save favourites, build **My Look** and show a **Barber Card**. Every style, look and Learn post is also a public page that Google and AI assistants can index.

Content source: the "Barber Style Catalogue – Content (English v1)" documents (Overview, Hair styles, Beard styles, Moustache styles, Hair colours, Ready Looks, Learn, Search and AI visibility, Image prompts).

## Decisions

| Topic | Decision |
| --- | --- |
| Shops | One shop for now: **KGF Unisex Saloon**. Keep the data shape as a list so more shops can be added later. |
| Barber details | Not shown. Learn posts show "Updated [date]" only, and "From the chair" tips are in the shop's voice. |
| AI crawlers | Allow Googlebot, GPTBot and PerplexityBot in robots.txt. |
| Prices | Not shown for now. When added: one fixed NPR price each for haircut, beard and moustache, and a separate price per hair colour. |
| Scope | No booking calendar, product shop, team grid or sign-up. The screenshot is used for its visual language only. |

### Shop

| Field | Value |
| --- | --- |
| Name | KGF Unisex Saloon |
| Address | Jadibuti-32, Narephat, Kathmandu, Nepal |
| Phone | +977 981-8879895 |
| Hours | Open daily, 7 am – 8 pm (`Mo-Su 07:00-20:00`) |
| Map | https://share.google/9SL0tbgf0oUuEPHt0 (the Google listing currently says "KGF Unisex Hair Salon"; update it to match) |
| Public URL | /shops/kgf-unisex-saloon |

## Stack

| Choice | Why |
| --- | --- |
| Astro 7 + TypeScript | Every page is built as static HTML, which the SEO rules need. Very little JavaScript for cheap phones. |
| Preact islands + nanostores | Only Favourites, My Look, About you and the Barber Card need JavaScript. |
| Content collections + Zod | Every item is checked against a schema at build time. |
| Tailwind CSS v4 | Design tokens defined once with `@theme`. |
| astro:assets | WebP in several sizes, lazy-loaded (social-share previews stay JPG). |
| sessionStorage | Favourites and My Look last for this visit only. No login. |
| Cloudflare Pages | Free, fast in South Asia, a preview for every change. Pages are built one file each (`/styles` → `styles.html`), so they're served without a trailing-slash redirect. |
| Vitest + Playwright | Unit tests for the rules, smoke tests at 360 px. |

## Routes

| Route | Indexed |
| --- | --- |
| `/` Home | Yes |
| `/styles`, `/beards`, `/moustaches`, `/colours`, `/looks` | Yes |
| `/styles/low-fade` (same pattern per category) | Yes |
| `/learn`, `/learn/fade-vs-taper` | Yes |
| `/shops/kgf-unisex-saloon` (HairSalon JSON-LD, QR target) | Yes |
| `/about-you`, `/favourites`, `/my-look`, `/barber-card` | No (noindex) |
| `/ne/…`, `/hi/…` with hreflang | Yes (phase 7) |

## Design system

Flat, calm salon editorial, modelled on the Josh Wood Colour consultation screens: warm off-white, true black for type and actions, one orange accent, and colour-block photo backgrounds. Tokens live in `src/styles/global.css`.

| Token | Value | Use |
| --- | --- | --- |
| `paper` / `paper-2` / `card` | `#F7F4F0` / `#EDE8E2` / `#FBFAF8` | Page, quiet fills, panels |
| `ink` | `#111111` | Type, primary buttons, footer, Barber Card |
| `line` | `#DCD7D1` | 1 px outlines on options, panels and dividers |
| `muted` / `muted-dark` | `#67625D` / `#A8A39D` | Body and label text (5.1:1 on paper, 7.4:1 on ink) |
| `brand` | `#E0284F` | KGF crimson from the shop sign: logo block, hero panels, icons |
| `gold` / `gold-ink` (accent) | `#F2667F` / `#B0163A` | Crimson accent: highlights on dark (6.2:1), links and notes on light (10:1) |
| `block-*` | orange `#EC9465`, blush `#F7D9CE`, sky `#A9C9E8`, sage `#CADBD8`, sand `#D8CDBF`, plum `#B06A8F` | Colour-block photo backgrounds; placeholders pick one per item ID |

Token names `gold`, `gold-fill`, `shell` and `core` are kept from the earlier theme so components didn't need renaming: `gold-fill` is now the black primary fill (white inside dark areas), `shell` is a no-op and `core` is a flat outlined panel.

- **Type:** Jost (variable, one file) for everything; Mukta for Devanagari. Titles semibold (36 px page titles, 28 px section titles), body regular with slight letter-spacing, small grey labels like "Step 2/7" above titles.
- **Shape:** square corners everywhere except circles (icon badges, swatches, dots, the heart button).
- **Buttons:** solid black rectangles with letter-spaced labels; secondary is a 1 px outline. Options are outlined rectangles; the selected one gets a 2 px black outline. Text links use a thin trailing arrow.
- **Photos and cards:** frameless: a square photo on its colour block with the label underneath. Each item's backdrop colour comes from `src/lib/backdrop.ts`, shared by the placeholders and the image prompts, so a photo arrives on the same colour as its placeholder. Hair colour photos always use Sand so the shade reads true.
- **Brand:** the KGF block (white letters in a white frame on crimson) and the scissors mark (blade rings as eyes, moustache, smile), redrawn as vectors from the shop sign in `src/data/brand-marks.mjs`. `npm run brand` regenerates the favicon, app icons and social preview from them. The sign's film poster, product ad and model photo are not used.
- **Navigation:** flat top bar with the KGF logo centred ("Unisex Saloon" beside it from tablet up), back link left, languages right; flat bottom tab bar with a black indicator on the active tab.
- **Motion:** one easing curve, `cubic-bezier(0.32, 0.72, 0, 1)`; first screen rises in, content below fades up on scroll; off with reduced-motion; nothing hidden without JavaScript.

## Key screens

- **Home:** dark hero "Pick your style. / Show it to the barber." with the shop name, 5 category tiles, About you card, "While you wait" Learn card.
- **List:** sticky header with count and Edit, 2-column cards, matching styles first with a "Suits you" badge.
- **Detail:** square photo, name, Also called, description, Pick/Skip, Daily / Weekly / Next visit, Suits, FAQ, folded barber steps, sticky ♥ + Add to My Look.
- **My Look:** 4 slots, locked moustache when the beard includes one, colour switch, Show to Barber.
- **Barber Card:** full-screen dark, large numbered steps, A/A+, its own language switch.

## Data

- The source documents live in `content-source/`. `npm run import` turns them into `src/content/{hair,beards,moustaches,colours,looks}.json` and `src/content/learn/*.md`, including callout text from the Image prompts document. Edit the documents and re-run; never edit `src/content` by hand. Errors stop the import; warnings are printed for review.
- Item fields: `id, slug, name, shortLine, description, pickIf, skipIf, daily, weekly, nextVisit, atShop?, suits{face, hairType, thinHair, growth, skin, grey}, alsoCalled, mainPhoto, faq, barberSteps, barberNote?, callouts, moustacheMode?`
- Build checks: every referenced ID exists, look face shapes equal the overlap of their parts, meta descriptions ≤ 155 characters, every image has alt text.

## Core logic (pure TypeScript, unit tested)

- `matches(item, answers)`: "Not sure" ignored; questions apply only to their categories; Thin hair needs `thinHair`; Patchy needs growth "Any".
- `myLook` reducer: replace with toast, Shave off, B07/B08/B11/B12 lock the moustache, "Trimmed with beard" default, Ready Look fill after confirm.
- `barberCard(look, lang)`: sections in the order Hair, Beard, Moustache, Colour.

## SEO and performance

- Title, meta description, canonical, Article + BreadcrumbList JSON-LD, HairSalon JSON-LD on the shop page, visible FAQs, sitemap, OG images.
- robots.txt allows Googlebot, GPTBot and PerplexityBot. Private pages use a noindex meta tag rather than Disallow, so crawlers can read the tag.
- Budget: under 40 KB JS (gzipped) on detail pages, LCP under 2.5 s on 4G, Lighthouse 95+, AA contrast.

## Phases

| # | Deliverable | Done when |
| --- | --- | --- |
| 0 ✅ | Project setup, tokens, component page (`/dev/components`), home page | Components match the reference at 360 px, no horizontal scroll |
| 1 ✅ | Importer (`npm run import`), schemas (`src/content.config.ts`), build checks | All 120 entries build cleanly |
| 2 ✅ | Home, lists (`[category]/index.astro`), detail pages (`[category]/[slug].astro`) | All 112 catalogue pages render, with "Photo coming soon" placeholders |
| 3 ✅ | About you, Favourites, My Look, Barber Card. Rules in `src/lib/look.ts` and `src/lib/match.ts` | `npm test` (rules and prompts, 27 tests) and `npm run smoke` (13 browser checks) pass; all JS is 20 KB gzipped |
| 4 ✅ | Learn feed (`/learn`) and posts (`/learn/[slug]`) | 13 posts live; catalogue names in post text link to their pages; no broken internal links except the shop page (phase 5) |
| 5 ✅ | Shop page, structured data (Article, BreadcrumbList, HairSalon, WebSite), generated robots.txt, sitemap, social preview image and icons (`npm run brand`), 404 page | `npm run check:seo`: 0 errors across 134 pages. Rich Results Test and Search Console submission need the live domain |
| 6 ✅ | Offline (generated service worker, offline page and banner), one file per page (no redirect hop), font preloads, tap prefetch, skip link, accessibility fixes | `npm run qa` on a budget-phone profile: LCP 1.0–2.2 s, CLS ≤ 0.001, JS ≤ 15 KB per page, no axe WCAG 2.2 AA issues. `npm run smoke` includes an offline check |
| 7 ✅ (system) | Nepali and Hindi: translation sheets (`translations/ne.csv`, `hi.csv`, `npm run i18n`), every page under `/ne/` and `/hi/`, hreflang and sitemap alternates, language switch, Barber Card in the barber's language, English fallback | Pseudo-translation build (`PL_PSEUDO=1`): 401 pages, 0 SEO errors, no hard-coded English left. **Nepali fully drafted** (3,799 rows, status `draft`, glossary in `translations/glossary.md`); review build `PL_DRAFTS=1`: 269 pages, 0 SEO errors. **Hindi fully drafted** too. **Both live** with drafts (`useDrafts: true`): 401 pages, 0 SEO errors, smoke and QA (incl. /ne, /hi) pass. Native review continues in the sheets |
| ∥ | Image pipeline ✅: prompt sheet (`/dev/prompts`), photo slots (`src/assets/catalogue/ID.jpg`), resizing to WebP, alt text, per-item social preview and structured-data image, callout dots placed with `/dev/callouts` | Tested end to end with a sample photo (removed). Waiting on the 122 clean photos |

## Open items

- **Exact pin coordinates** (optional) for HairSalon JSON-LD `geo`. The map link is already used as `hasMap`.
- **Google Business Profile name:** the listing says "KGF Unisex Hair Salon" and the sign says "KGF Unisex Salon". The site uses "KGF Unisex Saloon"; rename the Google listing to match so search sees one consistent name.
- **Content warnings to review:** P08 short answer is 39 words (target 40–60). Three Learn mentions don't match catalogue names, so they aren't linked: "Skin Fade, high" (P03), "Henna" and "Hair dye (C01–C04)" (P11).
- **Google Business Profile** link, if the shop has one.
- **Domain** for the public site. Then: set `SITE` in `astro.config.mjs`, deploy, run Google's Rich Results Test, add the site to Search Console, submit the sitemap and turn on generative AI features.

## Adding photos

1. Open `/dev/prompts` on the dev server, or `image-prompts/ready-to-paste.md` (rebuilt with `npm run build && npm run prompts`). Generate the character reference first, then each item with its clean prompt, attaching the reference (the older one where marked). Every prompt names its backdrop colour.
2. Check each image against the Image prompts document's step 4: face matches, cut matches the barber steps.
3. Save it as `src/assets/catalogue/ID.jpg` (for example `H07.jpg`). The prompt sheet's counter goes up.
4. Open `/dev/callouts`, tap where each numbered label points, copy the JSON into `content-source/callout-positions.json`, then run `npm run import`.
5. Build. Cards, item pages, Favourites, the Barber Card, social previews and structured data all use the photo automatically.

## Adding translations

1. Send `translations/ne.csv` and `translations/hi.csv` to the translators with `translations/README.md`. Each has 3,799 rows: screen text, the catalogue and the Learn posts.
2. Put returned sheets back in `translations/` and run `npm run i18n` for progress. It keeps every translation, adds new rows, and marks rows whose English changed as `check`.
3. The Barber Card switch turns on for a language as soon as its 472 barber-step rows are done.
4. The site in a language goes live when its sheet is complete and `"publish": true` is set in `translations/config.json`. Then build, run `npm run check:seo`, and submit the sitemap again.
5. To preview unreviewed drafts: `PL_DRAFTS=1 npx astro build --outDir dist-review`, then `PL_DIST=dist-review npm run check:seo`. Drafts are merged with `node scripts/i18n-merge.mjs <locale> batch.json`.
6. To test the setup without translations: `PL_PSEUDO=1 npx astro build` fills every row with marked English and builds all languages. Rebuild normally afterwards.
