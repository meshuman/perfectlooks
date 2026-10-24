# Catalogue photos

Put the **clean** version of each image here (no callouts, lines, dots or text), named by item ID:

    H07.jpg   B04.png   M02.webp   C02.jpg   L03.jpg

- One file per item. JPG, PNG, WebP or AVIF. Square, at least 1536 x 1536 px.
- The build resizes and converts each photo for phones, and uses it on cards, the item page,
  Favourites, the Barber Card, social previews and structured data.
- Items without a photo keep the "Photo coming soon" placeholder.
- Prompts for every item, with copy buttons: `/dev/prompts` on the dev server.
- Place the numbered label dots on each photo with `/dev/callouts`, then save the result to
  `content-source/callout-positions.json` and run `npm run import`.
