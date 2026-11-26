# Adding a barber shop

Every shop's details live in one file, **`public/shops/shops.json`**. The pictures live in two folders next to it:

- `public/shops/photos/` : the barber's photo (square, at least 400 x 400 px, `.jpg`; the site shows it in a circle)
- `public/shops/logos/` : the shop's logo (`.png` or `.svg`, transparent background works best)

## 1. Put the pictures in the folders

Name them after the shop, for example `photos/kgf.jpg` and `logos/kgf.svg`. You need the barber's permission to show their photo.

## 2. Add the shop to `shops.json`

```json
"kgf": {
  "barber": "Karan Thakur",
  "shop": "KGF UniSex Salon",
  "whatsapp": "+977 9818879895",
  "logo": "logos/kgf.svg",
  "photo": "photos/kgf.jpg"
}
```

| Field | What it is |
| --- | --- |
| `"kgf"` (the key) | The shop's short name in the link: lowercase letters, numbers and dashes only. |
| `barber` | The barber's name, shown in the welcome card. Leave it out to show "Welcome to {shop}". |
| `shop` | The shop's name. |
| `whatsapp` | The shop's WhatsApp number with country code. Every call, WhatsApp and feedback button uses it. |
| `logo`, `photo` | Paths inside `public/shops/`. Without a photo the card shows the shop's initials. |
| `welcome` | Optional. A welcome line (English only) that replaces "Choose your look. We'll make it a reality." |

`"default"` at the top of the file is the shop shown to everyone who opens the menu without a shop link.

Run `npm run check:shops` to make sure every file and number is in order.

## 3. Give the barber their link

The barber opens the menu with their shop name in the link:

```
https://YOUR-SITE/?shop=kgf
```

That phone then shows their welcome card, logo and numbers on every page, including the landing page when the client comes back to it, even after the browser is closed. Put the link in a QR code at the counter and clients get the same.

The phone keeps the shop for **24 hours**. Opening another shop's link replaces it and starts the 24 hours again. To go back to the standard menu at once, open `https://YOUR-SITE/?shop=reset`.

## 4. Publish

Commit the changes and deploy. The shop's link works as soon as the new build is live.
