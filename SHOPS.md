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
| `"kgf"` (the key) | The shop's name in its address (`kgf` in `kgf.looksmenu.com`): lowercase letters, numbers and dashes only. |
| `barber` | The barber's name, shown in the welcome card. Leave it out to show "Welcome to {shop}". |
| `shop` | The shop's name. |
| `whatsapp` | The shop's WhatsApp number with country code. Every call, WhatsApp and feedback button uses it. |
| `logo`, `photo` | Paths inside `public/shops/`. Without a photo the card shows the shop's initials. |
| `welcome` | Optional. A welcome line (English only) that replaces "Choose your look. We'll make it a reality." |

`"default"` at the top of the file is the shop shown to everyone who opens the menu without a shop link.

Run `npm run check:shops` to make sure every file and number is in order.

## 3. The barber's address

Each shop opens at its own address, made from its key in `shops.json`:

```
https://kgf.looksmenu.com
```

That address shows the KGF welcome card, logo and WhatsApp number on every page. Put it in a QR code at the counter.

- `looksmenu.com` itself, `www.looksmenu.com` and any name that is not in `shops.json` (for example `foo.looksmenu.com`) show the standard menu with no welcome card.
- Nothing is saved on the phone: the address alone decides the shop.

### One-time setup in Cloudflare (looksmenu.com)

1. **DNS:** add a record of type `AAAA`, name `*`, value `100::`, with the orange cloud (Proxied) switched on.
2. **Route:** in Workers & Pages, open the looksmenu Worker, then Settings, Domains & Routes, and add the route `*.looksmenu.com/*` for the zone `looksmenu.com`. Keep the existing custom domain for `looksmenu.com` itself.
3. After that, every new shop needs nothing in Cloudflare: add it to `shops.json` and deploy.

To try a shop on your own computer, open `http://kgf.localhost:4500` (Chrome opens `*.localhost` addresses on your machine).

## 4. Publish

Commit the changes and deploy. The shop's address works as soon as the new build is live.
