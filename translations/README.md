# Translating the KGF Unisex Saloon website

There is one sheet per language: `ne.csv` (Nepali) and `hi.csv` (Hindi). Open it in Excel or Google Sheets, fill in the **translation** column, and save it as CSV (UTF-8) with the same name.

## Columns

| Column | What it is |
| --- | --- |
| key | Where the text is used. Don't change it. |
| where | The page or item, to give you context. |
| english | The English text. Don't change it. |
| translation | **Your text goes here.** Empty rows show English on the site. |
| status | `draft` means the row was translated but no native speaker has checked it yet. Correct it if needed, then clear `draft`. `check` means the English changed after you translated it. Review the row, update the translation if needed, then clear `check`. Rows marked `draft` or `check` aren't used on the live site. |
| note | Tips for that row. |

## Rules

- **Write naturally, not word for word.** Customers read this in the shop, often with a minute before their cut.
- **Keep barber words** that barbers already use: machine, trimmer, razor, scissors, fade, gel, wax.
- **Keep numbers and measures** as they are: `#2`, `6 mm`, `2 fingers`, `Level 2`, `2–3 weeks`.
- **Keep `{words in braces}`.** The site fills them in, for example `{name}` or `{minutes}`.
- **Keep link tags** like `<a href="...">NHS</a>` and Markdown in Learn posts (`## headings`, `- lists`, `| tables |`, `[links](/...)`). Translate the words inside them.
- **Barber steps** (keys ending in `.step.1`, `.step.2`, ...) are short commands, 6 words or fewer where possible.
- **Style names** (keys ending in `.name`) can stay in English if that's what customers say.

## Reviewing drafts

Both sheets are fully drafted (Nepali and Hindi). Word choices are listed in [glossary.md](glossary.md). Please keep to them, or change them there and everywhere at once.

**Both languages are live with their drafts** (`"useDrafts": true` in `config.json`), so you can review on the real site: each row you correct and clear simply replaces the draft. To make a language show only reviewed rows, set `"useDrafts": false` (unreviewed rows then fall back to English, and the language goes offline until every row is reviewed).

To see drafts in a separate build instead, run `PL_DRAFTS=1 npx astro build --outDir dist-review` and open `dist-review`. The live build (`npm run build`) never uses drafts.

Review in this order: **barber steps first** (they turn on the Barber Card switch), then screen text, then the catalogue, then Learn.

## Going live

1. Send the filled sheet back, or put it in this folder.
2. Run `npm run i18n` to see progress. It also adds any new rows and marks changed English as `check`.
3. **The Barber Card switch** turns on as soon as all barber steps in a language are done, even before the rest.
4. **The website** in a language goes live when every row is done and `"publish": true` is set for it in `config.json`.
