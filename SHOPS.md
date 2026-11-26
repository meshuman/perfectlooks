# Adding a barber shop

Every shop's full record lives in **`data/shops.json`**. This file is private: it is never uploaded with the website.
(Keep the GitHub repository **private** too, because the file holds owners' phone numbers and locations.)

The pictures live in two public folders:

- `public/shops/photos/` : the owner's photo (square, at least 400 x 400 px, `.jpg`; the site shows it in a circle)
- `public/shops/logos/` : the shop's logo (`.png` or `.svg`, transparent background works best, at least 400 px wide)

Name them after the shop, for example `photos/kgf.jpg` and `logos/kgf.png`. You need the owner's permission to show their photo.

## 1. What a shop record holds

```json
"kgf": {
  "shop": "KGF UniSex Salon",
  "short": "KGF",
  "type": "unisex",
  "logo": "logos/kgf.png",
  "whatsapp": "+977 9818879895",
  "mobile": "+977 9818879895",
  "phone": "", "email": "", "website": "",
  "owners": [
    { "name": "Karan Thakur", "role": "Owner", "photo": "photos/kgf.jpg",
      "whatsapp": "+977 9818879895", "mobile": "", "email": "" }
  ],
  "location": { "address": "Jadibuti-32, Narephat", "area": "Narephat", "city": "Kathmandu",
    "district": "Kathmandu", "country": "NP", "lat": null, "lng": null, "mapsUrl": "" },
  "established": null,
  "openingHours": "Open daily, 7 am - 8 pm",
  "services": [], "staff": null, "chairs": null, "languages": ["Nepali"],
  "social": { "facebook": "", "instagram": "", "tiktok": "", "youtube": "" },
  "lead": { "status": "active", "source": "direct", "handledBy": "", "firstContact": "",
    "lastContact": "", "consentToMarketing": null, "notes": "" }
}
```

| Field | What it is | Shown on the website? |
| --- | --- | --- |
| key (`"kgf"`) | The shop's name in its address, `kgf.looksmenu.com`. Lowercase letters, numbers, dashes. | in the address |
| `shop`, `short` | Full name; short name (12 letters or fewer) under the app icon. | yes |
| `logo` | Path inside `public/shops/`. Header logo and app icon. Without it the shop's name is shown. | yes |
| `whatsapp` | The shop's WhatsApp number, for your records. The website does not show or use it: contact, WhatsApp and feedback on every address go to looksmenu's number. | **no** |
| `owners[0]` | `name` and `photo` appear in the welcome card. More owners can be added to the list. | name and photo only |
| `mobile`, `phone`, `email`, `website`, `owners[].mobile / email / whatsapp` | Contact details for you. | **no** |
| `location` (address, area, city, district, country, `lat`, `lng`, `mapsUrl`) | Where the shop is. Use `lat` and `lng` as numbers, e.g. `27.7172` and `85.3240`. | **no** |
| `established`, `openingHours`, `services`, `staff`, `chairs`, `languages`, `social`, `type` | Business facts for marketing: year (e.g. `2016`), hours, what they offer, team size, languages, Facebook / Instagram links, `men` / `women` / `unisex`. | **no** |
| `lead` | Your follow-up: `status` (`lead`, `contacted`, `demo`, `active`, `paused`, `lost`, `test`), `source`, `handledBy`, dates, `consentToMarketing` (`true` / `false` once you know), `notes`. | **no** |

Only the website fields above are copied into the public file `public/shops/shops.json`, automatically before every build (`scripts/build-shops.mjs`). Everything marked **no** stays in `data/shops.json`.

## 2. Check it, and use the data

- `npm run check:shops` checks every record (numbers, location, year, files) and lists what is still missing for each shop.
- `npm run shops:export` writes `exports/shops.csv`, one row per shop with every field, for a spreadsheet. The `exports/` folder is never committed. Please only market to owners who agreed to it (`consentToMarketing`).

## 3. The barber's address

Each shop opens at its own address, made from its key in `data/shops.json`:

```
https://kgf.looksmenu.com
```

That address shows the KGF logo in the header, the welcome card, and "Powered by looksmenu.com". Contact, WhatsApp and feedback stay exactly as on the landing page (looksmenu's number); feedback answers also say which shop address was scanned. Put it in a QR code at the counter.

- `looksmenu.com` itself, `www.looksmenu.com` and any name that is not in `data/shops.json` (for example `foo.looksmenu.com`) show the standard menu with no welcome card.
- Nothing is saved on the phone: the address alone decides the shop.

### One-time setup in Cloudflare (looksmenu.com)

1. **DNS:** add a record of type `AAAA`, name `*`, value `100::`, with the orange cloud (Proxied) switched on.
2. **Route:** in Workers & Pages, open the looksmenu Worker, then Settings, Domains & Routes, and add the route `*.looksmenu.com/*` for the zone `looksmenu.com`. Keep the existing custom domain for `looksmenu.com` itself.
3. After that, every new shop needs nothing in Cloudflare: add it to `data/shops.json` and deploy.

To try a shop on your own computer, open `http://kgf.localhost:4500` (Chrome opens `*.localhost` addresses on your machine).

## 4. QR code and installing the app

Make a QR code that opens the shop's address (`https://kgf.looksmenu.com`) and put it at the counter. When a client scans it:

- **Android and Chrome:** the page offers to install, and the page's **Install the app** button does the same. The app appears on the home screen with the shop's own logo and name (for example "KGF").
- **iPhone (Safari):** tap **Install the app** for the steps: Share, then Add to Home Screen. The icon and name are the shop's.
- The installed app opens straight to that shop's menu, with the shop's welcome card, and works offline once it has been opened.

The icons come from the shop's logo, and the app name is the shop's name. For a shorter name under the icon, add `"short": "KGF"` to the entry (12 letters or fewer). A shop without a logo gets the looksmenu icon. The install files are made automatically at every build by `scripts/pwa-assets.mjs`.

For the best icon, use a logo that is square or wide, on a transparent or plain background, at least 400 px wide.

## 5. Publish

Commit the changes and deploy. The shop's address works as soon as the new build is live.
