# Barber Style Catalogue – Content (English v1)

Oct 19, 2026 · @Istemlab

## How this doc works

This doc holds the English text for every screen and every item in the app: 42 hair styles, 16 beards, 12 moustaches, 12 hair colours and 25 Ready Looks, plus 13 Learn posts. Nepali and Hindi come after the English is approved, so we only translate text that is final.

- **This tab:** writing rules, photos, suitability options, Favourites, My Look and all screen text.
- **Catalogue tabs:** one per category. Every item uses the same fields, so the content can be turned straight into app data for the prototype. Each item has a short line for the list card, then a short description, Pick this if and Skip if lines, daily and weekly care, and the next barber visit for the detail screen.
- **The concept:** the customer scans the shop's QR code, browses, saves favourites, builds My Look, and shows the Barber Card. The barber cuts from the card.

Catalogue tabs: Hair styles · Beard styles · Moustache styles · Hair colours · Ready Looks

More tabs: Learn (posts for customers while they wait) · Search and AI visibility (rules every page follows)

Image prompts: Image prompts (a prompt for every catalogue image, with one consistent character and background)

## Writing rules

Barber steps use numbers and short commands, so they read the same in any language and need very little reading.

- One action per step, 6 words or fewer where possible.
- Write commands: "Cut sides short." Not "The sides should be cut short."
- Use numbers before words: machine number, fingers, mm, colour level.
- Keep words barbers already use: machine, trimmer, razor, scissors, fade, gel, wax. Keep them as they are in the Nepali and Hindi versions too.
- No idioms and no selling words on the Barber Card.
- Customer lines: one sentence, about 12 words.

### Customer text: built for a quick decision

Customers read this in the shop, often with a minute or two before the cut. Every item answers the same questions in the same order, so they can compare styles fast.

1. **Short line:** what it looks like, about 10 words. Shown on the list card.
2. **Description:** 1–2 short sentences on the look.
3. **Pick this if** and **Skip if:** one line each. This is where the decision happens.
4. **Daily**, **Weekly** and **Next barber visit:** the time it really takes. Write "Nothing" when there is nothing to do.
5. **Suits:** face shape, hair type and growth, matching the About you questions.

Every style and colour also ends with 3–5 FAQs: questions customers really ask, such as "What number is a buzz cut?", each answered in 1–2 sentences. They sit after Suits and before the barber steps, and they add new information rather than repeating the fields above.

Use product words people already know: wax, gel, cream, curl cream, beard oil, moustache wax. Give the plain name for the rest: dry wax (clay), shiny wax (pomade). Keep barber terms like point cut out of customer text.

### Machine numbers (hair clipper guards)

| Machine | Hair length left |
| --- | --- |
| #0 (no guard) | about 0.5–1 mm |
| #1 | 3 mm |
| #2 | 6 mm |
| #3 | 10 mm |
| #4 | 13 mm |
| #6 | 19 mm |
| #8 | 25 mm |

### Other measures

| Measure | Meaning |
| --- | --- |
| 1 finger | Width of one finger, about 2 cm of hair. "2 fingers long" = about 4 cm. |
| Trimmer mm | Beard and moustache length, as set on the trimmer. |
| Neck line | Where the beard stops on the neck. Default: 2 fingers above the Adam's apple. |

### Hair colour levels

The level number is the same across most dye brands. Tone codes after the dot are different between brands, so the app names the tone in words.

| Level | Colour |
| --- | --- |
| 1 | Black |
| 2 | Very dark brown (soft black) |
| 3 | Dark brown |
| 4 | Medium brown |
| 5 | Light brown |
| 6–7 | Dark to medium blonde (used for highlights) |
| 9–10 | Very light blonde (base for silver and ash grey) |

## Photos

Every item shows one main photo: the single angle that a customer and a barber understand at a glance. Front is the default. Styles that only show clearly from the side use a side photo: the fades, high and tight, undercut, slick back, pushed back, quiff, pompadour, mullet, man bun, chin strap, faded beard and mutton chops. Each catalogue entry names its main angle.

- **Grid and detail screen:** main photo only. If side or back photos exist, small dots under the photo show there are more, and the customer swipes to see them.
- **Barber Card:** main photo only, large.
- **Ready Looks:** one front photo of the full look on one person.
- **Same setup for every photo:** the colour-block backdrops, lighting, character and callout layout set in the Image prompts tab.
- **Models:** one consistent character, a Nepali man in his late twenties, plus an older version of the same man for grey-hair items, so the catalogue looks like one set.
- **Source:** AI images made from the Image prompts tab, your own photo shoots, or licensed stock. Do not copy photos from Instagram or Pinterest.

## Suitability options

Customers answer up to six simple questions, and every question has a "Not sure" option. Styles that match all answers get a "Suits you" badge and move to the top. Styles that do not match stay visible lower down, because the customer may still want them.

| Question | Options | Used for |
| --- | --- | --- |
| Face shape | Oval, Round, Square, Long, Heart | Hair, beard, moustache |
| Hair type | Straight, Wavy, Curly | Hair |
| Hair amount | Thin, Normal, Thick | Hair |
| Beard growth | Patchy, Medium, Full | Beard, moustache |
| Skin tone | Light, Medium, Deep (shown as colour swatches) | Colour |
| Grey hair | None, Some, Lots | Colour |

### Help text for face shape

Each option shows a simple face outline with this line under it.

| Face shape | How to tell |
| --- | --- |
| Oval | A bit longer than wide. Soft jaw. |
| Round | Same length and width. Soft jaw, full cheeks. |
| Square | Strong, wide jaw. Forehead and jaw about the same width. |
| Long | Much longer than wide. |
| Heart | Wide forehead, narrow chin. |

### Help text for beard growth

| Beard growth | How to tell |
| --- | --- |
| Patchy | Gaps on the cheeks or between beard and moustache. |
| Medium | Fills in, with a few thin spots. |
| Full | Thick all over, no gaps. |

## Favourites and My Look

Favourites is the customer's shortlist for this visit. My Look is the final pick that the barber sees.

### Favourites

- A heart icon sits on every grid card and every detail screen. Tap to save, tap again to remove.
- Any item can be saved: hair, beard, moustache, colour or a Ready Look.
- Saved on this phone for this visit only. No login. The list clears when the customer closes the page.
- The heart in the bottom bar shows a count of saved items.
- From Favourites, the customer can open an item or add it to My Look.

### My Look

- Four slots: Hair, Beard, Moustache, Colour. One item per slot.
- Adding an item to a filled slot replaces the old one and shows a short message.
- **An empty slot means "No change"** on the Barber Card, so the barber leaves that part as it is. One exception: with a beard marked "Trimmed with beard" (stubble, boxed, full, faded, ducktail or long beard), an empty Moustache slot means the barber trims the moustache to match the beard.
- The Moustache slot has one extra choice: **Shave off**.
- Clean Shave covers the beard area only. The moustache follows the Moustache slot, so a customer who wants everything shaved also picks "Shave off".
- Van Dyke, Circle Beard, Balbo and Anchor Beard already include a moustache. When one of them is picked, the Moustache slot shows "Part of your beard style" and is locked.
- The Colour slot has one extra switch: **Also colour beard and moustache** (default: off).
- Picking a Ready Look fills all its slots at once, after the customer confirms.
- "Show to Barber" works once at least one slot is filled.
- The Barber Card lists sections in this order: Hair, Beard, Moustache, Colour.

## Screen text

Every label, button and message in the app, screen by screen. Text in \[brackets\] is filled in by the app.

### On every screen

| Element | Text |
| --- | --- |
| Language switch (top right) | EN · नेपाली · हिंदी (each name in its own script; English is the default) |
| Bottom bar | Home · Learn · Favourites · My Look |
| Count on Favourites and My Look | \[number\] |

### Home

| Element | Text |
| --- | --- |
| Title | \[Shop name\] |
| Line under title | Pick your style. Show it to the barber. |
| Tile: Hair | Hair · 42 styles |
| Tile: Beard | Beard · 16 styles |
| Tile: Moustache | Moustache · 12 styles |
| Tile: Colour | Colour · 12 colours |
| Tile: Ready Looks | Ready Looks · Hair and beard sets |
| Suitability prompt | Find styles that suit your face. |
| Prompt button | Start |
| Small note at bottom | Results depend on your hair. Ask your barber. |
| While you wait card | While you wait: quick reads on face shape, fades and care. |
| While you wait button | Read |

### About you (suitability questions)

| Element | Text |
| --- | --- |
| Title | About you |
| Line under title | Answer what you know. Skip the rest. |
| Question labels | Face shape · Hair type · Hair amount · Beard growth · Skin tone · Grey hair |
| Option on every question | Not sure |
| Main button | Show styles |
| Second button | Clear all |

### Style list

| Element | Text |
| --- | --- |
| Header | \[Category\] · \[number\] styles |
| Link to questions | Edit |
| Badge on matching cards | Suits you |
| Card tags | \[Length\] · Upkeep \[dots\] |
| Note above list (when answers are set) | Styles that suit you are shown first. |
| No results | No styles match. Try fewer answers. |
| No results button | Clear answers |
| Card line | \[Short line from the catalogue\] |

### Style detail

| Element | Text |
| --- | --- |
| More photos hint | Swipe for more angles |
| Under the name | Also called: \[names\] |
| Section headings | Pick this if · Skip if · Daily · Weekly · Next barber visit · Suits |
| Extra labels | At the shop (colours and perm only) · Includes (Ready Looks only) · Also called |
| Suits labels | Face · Hair type · Thin hair · Beard growth · Skin tone · Grey hair |
| Folded section | What the barber will do |
| Heart button | Save / Saved |
| Main button | Add to My Look / In My Look |
| Description (under the name) | \[Description from the catalogue\] |
| FAQ heading | Common questions |

### Learn

| Element | Text |
| --- | --- |
| Title | Learn |
| Line under title | Quick reads while you wait. |
| Topic chips | All · Face shape · Haircuts · Beard · Colour · Care · Talk to your barber |
| Post card | \[Title\] · \[1 min read\] |
| Answer box label | Short answer |
| Styles section | Styles in this post |
| Style buttons | ♥ Save · Add to My Look |
| End of post | Was this helpful? Yes · No |
| Next button | Next post |
| Footer | Checked by \[barber name\] · Updated \[date\] |

### Favourites

| Element | Text |
| --- | --- |
| Title | Favourites |
| Line under title | Saved for this visit only. |
| Empty state | Tap ♥ on any style to save it here. |
| Item buttons | Add to My Look · Remove |

### My Look

| Element | Text |
| --- | --- |
| Title | My Look |
| Slot labels | Hair · Beard · Moustache · Colour |
| Empty slot | No change |
| Empty slot button | Choose |
| Filled slot buttons | Change · Remove |
| Extra moustache choice | Shave off |
| Locked moustache slot | Part of your beard style |
| Colour switch | Also colour beard and moustache |
| Main button | Show to Barber |
| Hint when all slots are empty | Choose at least one style. |

### Barber Card

| Element | Text |
| --- | --- |
| Header | For the Barber |
| Card language switch | Barber language: EN · नेपाली · हिंदी |
| Text size button | A / A+ |
| Section headings | HAIR · BEARD · MOUSTACHE · COLOUR |
| Empty slot line | No change. Leave as it is. |
| Shave off line | Shave off the moustache. |
| Beard-includes-moustache line | Moustache is part of the beard style. |
| Colour on beard line | Colour beard and moustache too. |
| Footer | Check with the customer before you start. |
| Back button | Back |
| Moustache trimmed with beard line | Moustache: trim to match the beard. |

### Short messages

| When | Text |
| --- | --- |
| Item saved | Saved to Favourites |
| Item unsaved | Removed from Favourites |
| Item added | Added to My Look |
| Slot replaced | \[Slot\] changed to \[Style\] |
| Moustache picked with a beard that has its own moustache | This beard already has a moustache. |
| Ready Look picked over existing choices | This will replace your choices. Continue? (Yes · No) |
| Photo missing | Photo coming soon |
| No internet | No internet. Showing saved styles. |
