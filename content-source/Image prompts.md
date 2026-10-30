# Image prompts

Every catalogue image uses the same man, flat colour-block backdrops from one palette, and the same callout layout as the reference image: a large main view, a smaller second view in the lower right, and 4–5 labelled callouts. That way the whole catalogue looks like one set.

## How to use these prompts

Each prompt is built from four parts:

1. **Fixed block:** the character, light, background and layout. Never change it.
2. **Category block:** what stays the same within hair, beard, moustache, colour or Ready Look images.
3. **Item block:** the exact style and its callouts, listed further down this tab. The prompt sheet in the app adds the item's BACKDROP colour (see Backdrop colours).
4. **Avoid list.**

**Steps**

1. Generate the character reference once (below), pick the best result and save it.
2. For every image, attach that reference using your tool's image or character reference option. Use the same seed each time if your tool allows it.
3. Make two versions of each image:
   - **With labels:** English callouts, for social media and print.
   - **Clean:** remove the callout instructions instead of contradicting them: drop the callout sentences from LAYOUT and the category block, drop the item's CALLOUTS list and the shade-name label on colour swatches, change the avoid list's "any text other than the callout labels" to "any text", and end with "Keep the right side as clean background: the app adds its own labels. No callouts, lines, dots or text." The prompt sheet in the app (**Copy clean**) does this for you. The app draws the labels itself, so customers can switch between English, Nepali and Hindi.
4. Check every image before using it: the face matches the reference, the cut matches the barber steps, and every label is spelled correctly. Image tools often misspell text.
5. Check that your image tool's terms allow commercial use.

## Prompt order and the man's traits

The prompt sheet in the app (and `image-prompts/ready-to-paste.md`) assembles every prompt in the order image tools weigh most heavily, keeping every line of the four parts:

1. The photo type, then the item: ITEM, STYLE (or PARTS), HAIR FOR THIS ITEM, SWATCH.
2. Who: CHARACTER, any CHARACTER NOTE, then TRAITS FOR THIS STYLE.
3. Views: the category rules, then the item's MAIN VIEW, which overrides them.
4. BACKDROP, BACKGROUND and LIGHT.
5. LAYOUT, then CALLOUTS (labelled version only).
6. AVOID, last.

**TRAITS FOR THIS STYLE.** The man is always the same person: eyes, eyebrows, nose, lips, ears, skin and build never change, and very fair, smooth skin suits every item. His face shape follows the style, because an oval face suits everything and so says nothing about who a style is for. Each item is shown on the face shape it does most for: round for styles that add height or slim the face, long for styles that add width, square for sharp, strong cuts, heart where a fringe or layers balance a wide forehead. Styles that suit every face, and all hair colours, keep his oval face. The other traits come from each item's Suits data:

| Catalogue says | Trait in the prompt |
| --- | --- |
| Hair type: curly or wavy only | Natural, defined curls |
| Hair type: straight only | Straight and smooth |
| Face shapes the style suits | The face shape the style does most for (round, long, square, heart), or oval if it suits every face |
| Thin hair: not suitable | Thick, full hair with no thinning on top |
| Growth needed: full | Thick, dense beard or moustache growth with no gaps |
| Growth needed: medium or full | Even beard or moustache growth with no patches |
| OLDER VERSION | About 50, as in the older reference |

So every photo shows the style on someone it actually suits.

## Character reference (make this first)

```text
Photorealistic character reference sheet of one man, Arjun, shown four times in a row: front view, three-quarter view facing left, left side profile, and back of the head. Arjun is a 28-year-old Nepali man with a very fair, smooth skin tone, an oval face with a clean, defined jawline, dark brown almond-shaped eyes, thick straight black eyebrows, a straight nose, medium-full lips, small ears that sit close to the head, and a slim athletic build. Calm, confident expression, mouth closed. Natural black hair in a classic taper cut, about 4 cm on top, combed to the side. Light even stubble. Plain black crew-neck T-shirt. Soft, even studio light. Plain, flat warm sand background (#D8CDBF). No text.
```

**Older version, only for items marked OLDER VERSION** (grey-hair colours and mature looks):

```text
The same man, Arjun, at about 50: identical face shape, eyes, nose, ears and skin tone, with light lines at the eyes and slightly fuller cheeks. Natural black hair with salt-and-pepper grey at the temples and through the top. Same four views, clothing, light and background as the main reference sheet. No text.
```

## Fixed block (start every prompt with this)

```text
Photorealistic studio image for a barbershop style guide. Square 1:1, at least 1536 x 1536 px.
CHARACTER (identical in every image): Arjun, a 28-year-old Nepali man with a very fair, smooth skin tone, an oval face with a clean, defined jawline, dark brown almond-shaped eyes, thick straight black eyebrows, a straight nose, medium-full lips, small ears close to the head, slim athletic build. Calm, confident expression, mouth closed. Plain black crew-neck T-shirt. No glasses, jewellery, tattoos, piercings or hats. Natural black hair unless the item says otherwise. Match the attached character reference exactly.
LIGHT: soft, diffused key light from the front left, gentle fill from the right, subtle rim light separating the hair from the background. True-to-life skin tones and natural skin texture. Sharp focus on hair and beard detail, 85 mm portrait lens look.
BACKGROUND: one flat, seamless studio backdrop in the solid colour named in BACKDROP, evenly lit like a painted colour-block wall. No gradient, texture, props or background shadows.
LAYOUT: the main view, head and shoulders, on the left, filling about 60% of the width. A second, smaller view in the lower right, slightly overlapping the main view, with a soft fade at its edge. Four or five callouts on the right: a thin charcoal line (#3A3A3A) runs from a small white dot with a thin grey outline, placed on the feature, to its label. Each label has a bold title in charcoal (#1E1E1E) and one line of description below it in mid grey (#6B6B6B), in a clean modern sans-serif, left-aligned, with generous spacing. Labels never cover the face.
```

## Backdrop colours

Each image sits on one flat colour, like the colour-block walls in fashion and salon photography. The colours rotate across the catalogue so lists look varied, and each item always gets the same one, matching its placeholder in the app. The prompt sheet in the app adds the BACKDROP line to every item automatically.

| Colour | Hex |
| --- | --- |
| Orange | #EC9465 |
| Blush | #F7D9CE |
| Sky blue | #A9C9E8 |
| Sage | #CADBD8 |
| Sand | #D8CDBF |
| Plum | #B06A8F |

Hair colour images always use Sand, so the backdrop doesn't tint the shade the customer is judging.

## Category blocks (add after the fixed block)

**Hair styles**

```text
HAIR IMAGE RULES: the beard and moustache are the same in every hair image: light even stubble, 1-2 mm, with a clean curved neck line. Main view as the item says. Second view: back of the head, showing the back of the cut and the nape. Callouts point to the top, the sides, the blend or line, the back and the nape.
```

**Beards**

```text
BEARD IMAGE RULES: the haircut is the same in every beard image unless the item says otherwise: a classic taper cut, short tapered sides, about 4 cm on top combed neatly to the side, natural black. Main view: three-quarter front facing left, showing the cheek line and chin. Second view: left side profile from chin to ear, showing the jaw and neck line. Callouts point to the cheek line, sideburn, chin, moustache and neck line.
```

**Moustaches**

```text
MOUSTACHE IMAGE RULES: the haircut is the same classic taper cut as in beard images. Cheeks, chin and neck are clean-shaven unless the moustache itself runs down to the jaw. Main view: straight front, head and shoulders. Second view: close-up of the mouth area at a three-quarter angle. Callouts point to the lip line, the ends, the shape and any shaved areas.
```

**Hair colours**

```text
COLOUR IMAGE RULES: the haircut is the same in every colour image: a classic side part, about 6 cm on top combed to the side, tapered sides, so the colour shows across the top. Face clean-shaven. Backdrop always Sand (#D8CDBF), so the shade reads true. Main view: three-quarter front facing left, in soft daylight-balanced light so the true tone shows. Second view: close-up of the top of the head in brighter light, showing the shine and the roots. Add a small round colour swatch in the top right corner with the shade name and level below it. Callouts point to the shade, grey coverage, shine and hairline.
```

**Ready Looks**

```text
READY LOOK IMAGE RULES: show every part listed in the item, and nothing else changes. Main view: three-quarter front facing left. Second view: left side profile. One callout for each part (hair, beard, moustache, colour), plus one finishing note.
```

## Avoid list (add at the end of every prompt)

```text
AVOID: any text other than the callout labels, misspelled words, logos, watermarks, brand names, extra people, hands in frame, hats, glasses, jewellery, tattoos, props, gradient, busy or textured backgrounds, harsh shadows, distorted or extra ears, mismatched eyes, a different face from the reference, blurry or smudged hair edges, cartoon or illustration style, 3D render look, plastic skin, oversharpening.
```

## Full example: H13 Slick Back

All four parts joined into one prompt, ready to paste. The callouts follow the reference image.

```text
Photorealistic studio image for a barbershop style guide. Square 1:1, at least 1536 x 1536 px.
CHARACTER (identical in every image): Arjun, a 28-year-old Nepali man with a very fair, smooth skin tone, an oval face with a clean, defined jawline, dark brown almond-shaped eyes, thick straight black eyebrows, a straight nose, medium-full lips, small ears close to the head, slim athletic build. Calm, confident expression, mouth closed. Plain black crew-neck T-shirt. No glasses, jewellery, tattoos, piercings or hats. Natural black hair. Match the attached character reference exactly.
LIGHT: soft, diffused key light from the front left, gentle fill from the right, subtle rim light separating the hair from the background. True-to-life skin tones and natural skin texture. Sharp focus on hair detail, 85 mm portrait lens look.
BACKGROUND: one flat, seamless studio backdrop in the solid colour named in BACKDROP, evenly lit like a painted colour-block wall. No gradient, texture, props or background shadows.
LAYOUT: the main view, head and shoulders, on the left, filling about 60% of the width. A second, smaller view in the lower right, slightly overlapping the main view, with a soft fade at its edge. Five callouts on the right: a thin charcoal line (#3A3A3A) runs from a small white dot with a thin grey outline, placed on the feature, to its label. Each label has a bold title in charcoal (#1E1E1E) and one line of description below it in mid grey (#6B6B6B), in a clean modern sans-serif, left-aligned. Labels never cover the face.
HAIR IMAGE RULES: light even stubble, 1-2 mm, with a clean curved neck line. Second view: back of the head, showing the back of the cut and the nape.
ITEM: H13 Slick Back
BACKDROP: Plum (#B06A8F).
MAIN VIEW: left side profile
STYLE: sides machine #2, tapering to #1 at the neck with a smooth blend; top 8-10 cm, longest at the front, combed straight back with a smooth, shiny pomade finish; neat, tidy back; clean nape tapering naturally into the neck line.
CALLOUTS:
1. Keep weight on top: Enough length to comb straight back.
2. Sides kept short: Machine #2, neat and tight.
3. Blend smooth: No harsh line between top and sides.
4. Back kept neat: Tidy and well blended.
5. Nape clean: Tapers naturally into the neck line.
AVOID: any text other than the callout labels, misspelled words, logos, watermarks, brand names, extra people, hands in frame, hats, glasses, jewellery, tattoos, props, gradient, busy or textured backgrounds, harsh shadows, distorted or extra ears, mismatched eyes, a different face from the reference, blurry or smudged hair edges, cartoon or illustration style, 3D render look, plastic skin, oversharpening.
```

## Hair style prompts

Paste the fixed block, the hair category block, the item block below, then the avoid list. The second view is always the back of the head.

### H01 Buzz Cut

```text
ITEM: H01 Buzz Cut
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: three-quarter front, facing left
STYLE: one even length all over, machine #2 (about 6 mm); dense, uniform texture with the scalp faintly visible; soft natural hairline at the front; clean, trimmed edges around the ears; neat natural neck line.
CALLOUTS:
1. Even all over: Machine #2 on the whole head.
2. Soft hairline: Natural front, not lined up.
3. Clean around ears: Edges trimmed neat.
4. Neat nape: Neck line cleaned with a trimmer.
```

### H02 Crew Cut

```text
ITEM: H02 Crew Cut
BACKDROP: Sage (#CADBD8).
MAIN VIEW: three-quarter front, facing left
STYLE: sides and back machine #2, blended smoothly into a short top about 2 cm long, slightly longer at the front and pushed forward and up; ears fully clear; neat natural neck line.
CALLOUTS:
1. Short sides: Machine #2, even and neat.
2. Short top: About 2 cm, scissor cut.
3. Longer front: Pushed forward and up.
4. Smooth blend: No line between top and sides.
5. Tidy nape: Natural, clean neck line.
```

### H03 Ivy League

```text
ITEM: H03 Ivy League
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: three-quarter front, facing left
STYLE: sides machine #2 blending to #3; top about 4 cm, slightly longer at the front, combed into a soft side part above the outer left eyebrow; light cream finish with a low natural shine.
CALLOUTS:
1. Soft side part: Above the outer eyebrow.
2. Longer front: Combs neatly to the side.
3. Short sides: #2 blending to #3.
4. Natural finish: Light cream, low shine.
```

### H04 Caesar Cut

```text
ITEM: H04 Caesar Cut
BACKDROP: Plum (#B06A8F).
MAIN VIEW: three-quarter front, facing left
STYLE: sides and back machine #2; top about 2 cm, all combed forward; a short, straight, level fringe sitting high on the forehead; matte natural finish.
CALLOUTS:
1. Straight fringe: Short and level.
2. Forward top: Combed toward the face.
3. Even sides: Machine #2.
4. Tidy nape: Clean natural neck line.
```

### H05 French Crop

```text
ITEM: H05 French Crop
BACKDROP: Orange (#EC9465).
MAIN VIEW: three-quarter front, facing left
STYLE: sides machine #1 blending to #3; top about 4 cm with choppy texture, pushed forward; short, slightly uneven fringe about 2 cm above the eyebrows; matte finish.
CALLOUTS:
1. Rough top: Choppy, pushed forward.
2. Short fringe: Above the eyebrows.
3. Tight sides: #1 blending to #3.
4. Matte finish: Dry wax, no shine.
```

### H06 Taper Cut

```text
ITEM: H06 Taper Cut
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: three-quarter front, facing left
STYLE: classic short cut; sides and back machine #3, getting gradually shorter to #1 near the ears and neck with no skin showing; top about 4 cm, combed loosely to the side; soft, natural rounded neck line.
CALLOUTS:
1. Gradual taper: Shorter toward ears and neck.
2. No skin: Shortest point stays at #1.
3. Natural top: Combed loosely to the side.
4. Soft nape: Natural, not squared.
```

### H07 Low Fade

```text
ITEM: H07 Low Fade
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: left side profile
STYLE: fade line one finger above the ear; bare skin (#0) below, blending smoothly up through #1 and #2; top about 4 cm, textured and pushed up and slightly to the side; crisp, clean line around the ear; faded nape.
CALLOUTS:
1. Low fade line: Starts just above the ear.
2. Smooth blend: #0 up to #2, no lines.
3. Textured top: About 4 cm, pushed up.
4. Clean ear line: Sharp edge around the ear.
5. Faded nape: Skin at the neck, blended up.
```

### H08 Mid Fade

```text
ITEM: H08 Mid Fade
BACKDROP: Sage (#CADBD8).
MAIN VIEW: left side profile
STYLE: fade starts at the temple, halfway up the side of the head; bare skin at the bottom blending through #1, #2 and #3; top about 5 cm, pushed up and to the side; clean edges around the ears and neck.
CALLOUTS:
1. Mid fade line: At temple height.
2. Even blend: #0 up to #3.
3. Top shape: 5 cm, up and to the side.
4. Clean edges: Around ears and neck.
```

### H09 Skin Fade

```text
ITEM: H09 Skin Fade
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: left side profile
STYLE: high skin fade; sides shaved to bare skin up to the top corner of the head, blending quickly through #0, #1 and #2 into a matte, textured top about 4 cm long; very clean, high-contrast outline.
CALLOUTS:
1. High skin fade: Bare skin up to the corner.
2. Fast blend: Skin to #2, no lines.
3. Matte top: About 4 cm, textured.
4. Crisp outline: Sharp around ears and neck.
```

### H10 Classic Side Part

```text
ITEM: H10 Classic Side Part
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: three-quarter front, facing left
STYLE: sides machine #3, tapering to #2 at the neck; top about 6 cm combed neatly to the side from a natural part above the outer left eyebrow; soft shine from light pomade; polished and neat.
CALLOUTS:
1. Clear part: Above the outer eyebrow.
2. Combed top: 6 cm, smooth and neat.
3. Tapered sides: #3 down to #2.
4. Soft shine: Light pomade finish.
```

### H11 Comb Over Fade

```text
ITEM: H11 Comb Over Fade
BACKDROP: Sage (#CADBD8).
MAIN VIEW: left side profile
STYLE: mid fade from #0 to #2 on the sides; top about 6 cm combed over to one side from a part above the outer eyebrow; a thin shaved part line; polished shine.
CALLOUTS:
1. Shaved part: Thin line above the eyebrow.
2. Combed over: 6 cm swept to the side.
3. Mid fade: #0 to #2.
4. Clean blend: Top flows into the fade.
```

### H12 Undercut

```text
ITEM: H12 Undercut
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: left side profile
STYLE: sides and back cut to one length, machine #1, with a sharp disconnected line at the top corner of the head; top about 8 cm, swept back loosely; strong contrast between the long top and the short sides.
CALLOUTS:
1. Long top: About 8 cm, swept back.
2. Hard line: Clear edge, no blend.
3. Short sides: Machine #1 all round.
4. Clean back: Tidy nape.
```

### H13 Slick Back

```text
ITEM: H13 Slick Back
BACKDROP: Plum (#B06A8F).
MAIN VIEW: left side profile
STYLE: sides machine #2, tapering to #1 at the neck with a smooth blend; top 8-10 cm, longest at the front, combed straight back with a smooth, shiny pomade finish; neat, tidy back; clean nape tapering naturally into the neck line.
CALLOUTS:
1. Keep weight on top: Enough length to comb straight back.
2. Sides kept short: Machine #2, neat and tight.
3. Blend smooth: No harsh line between top and sides.
4. Back kept neat: Tidy and well blended.
5. Nape clean: Tapers naturally into the neck line.
```

### H14 Quiff

```text
ITEM: H14 Quiff
BACKDROP: Orange (#EC9465).
MAIN VIEW: left side profile
STYLE: sides faded from #1 to #3; top about 8 cm at the front, lifted up and back with volume, shorter (about 4 cm) toward the crown; natural wax finish.
CALLOUTS:
1. Lifted front: Blow-dried up and back.
2. Height at front: Longest hair at the front.
3. Shorter crown: About 4 cm at the back.
4. Faded sides: #1 to #3.
```

### H15 Pompadour

```text
ITEM: H15 Pompadour
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: left side profile
STYLE: big rounded height across the whole top, about 10 cm at the front and 6 cm at the back, swept up and back with a smooth pomade shine; sides machine #2, or faded #1 to #3.
CALLOUTS:
1. Big height: Rounded volume, up and back.
2. Long front: About 10 cm.
3. Smooth shine: Pomade finish.
4. Short sides: Clean and tight.
```

### H16 Spiky

```text
ITEM: H16 Spiky
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: three-quarter front, facing left
STYLE: sides machine #2 blending to #3; top about 3 cm, pulled up into separate, defined spikes with gel; light wet-look shine.
CALLOUTS:
1. Defined spikes: Pulled up with gel.
2. Short top: About 3 cm.
3. Even sides: #2 blending to #3.
4. Gel finish: Light wet shine.
```

### H17 Faux Hawk

```text
ITEM: H17 Faux Hawk
BACKDROP: Sage (#CADBD8).
MAIN VIEW: three-quarter front, facing left
STYLE: sides faded from #1 to #3, short but not shaved bare; a centre strip of the top, about 6 cm, pushed up into a soft ridge; the edges of the top shorter, about 4 cm.
CALLOUTS:
1. Centre ridge: Middle pushed up to a point.
2. Lower edges: Top sides kept shorter.
3. Faded sides: Short, not shaved.
4. Clean nape: Neat neck line.
```

### H18 Two-Block

```text
ITEM: H18 Two-Block
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: three-quarter front, facing left
STYLE: lower sides and back machine #3, one length, hidden under a soft, longer top of 8-10 cm that falls over them; soft fringe to the eyebrows, slightly parted; thinned for an airy, light texture; natural matte finish.
CALLOUTS:
1. Soft top: Falls over the short sides.
2. Fringe to brows: Soft, not straight.
3. Hidden sides: #3 underneath.
4. Airy texture: Thinned and light.
```

### H19 Middle Part

```text
ITEM: H19 Middle Part
BACKDROP: Plum (#B06A8F).
MAIN VIEW: three-quarter front, facing left
STYLE: medium hair, 10-12 cm on top, parted in the centre; front pieces fall to both sides at about eye level like curtains; sides scissor cut, half covering the ears; soft natural movement.
CALLOUTS:
1. Centre part: Even on both sides.
2. Curtain front: Falls to eye level.
3. Soft sides: Half over the ears.
4. Natural movement: Light layers.
```

### H20 Medium Flow

```text
ITEM: H20 Medium Flow
BACKDROP: Sage (#CADBD8).
MAIN VIEW: three-quarter front, facing left
STYLE: medium-length hair, 12-15 cm, pushed back, with the ends flowing behind the ears and touching the collar; natural slight wave; layered to remove weight; natural neck line.
CALLOUTS:
1. Pushed back: Natural, no shine.
2. Behind the ears: Ends flow back.
3. Collar length: Back touches the collar.
4. Light layers: Weight removed.
```

### H21 Buzz Fade

```text
ITEM: H21 Buzz Fade
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: left side profile
STYLE: even buzz on top, machine #2; sides fade from bare skin one finger above the ear up through #1 to #2; clean edges around the ears and at the nape.
CALLOUTS:
1. Buzz top: Even machine #2.
2. Skin fade: Starts above the ear.
3. Smooth blend: Skin up to #2.
4. Clean edges: Ears and nape sharp.
```

### H22 High and Tight

```text
ITEM: H22 High and Tight
BACKDROP: Plum (#B06A8F).
MAIN VIEW: left side profile
STYLE: sides and back machine #1, cut high up to the top corner of the head, with a short blend into a flat, even top about 2 cm long; neat military finish.
CALLOUTS:
1. High sides: #1 up to the corner.
2. Flat top: Even, about 2 cm.
3. Short blend: Small step into the top.
4. Neat nape: Clean military finish.
```

### H23 Taper Fade

```text
ITEM: H23 Taper Fade
BACKDROP: Orange (#EC9465).
MAIN VIEW: left side profile
STYLE: sides machine #3; a small fade to skin only at the sideburn and at the back of the neck, blending up to #3; top about 5 cm, combed lightly.
CALLOUTS:
1. Faded sideburn: Skin, small area only.
2. Faded nape: Clean at the neck.
3. Natural sides: Machine #3.
4. Neat top: About 5 cm.
```

### H24 Drop Fade

```text
ITEM: H24 Drop Fade
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: left side profile
STYLE: fade line above the ear that curves down behind it and drops low at the back near the neck; skin below, blending through #1 to #3; textured top about 6 cm.
CALLOUTS:
1. Curved line: Drops behind the ear.
2. Low at the back: Follows the head shape.
3. Smooth blend: Skin up to #3.
4. Textured top: About 6 cm.
```

### H25 Fade with Line Design

```text
ITEM: H25 Fade with Line Design
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: left side profile
STYLE: low fade; one clean straight line about 2 mm wide shaved diagonally across the side above the ear; top about 4 cm, textured.
CALLOUTS:
1. Shaved line: Clean, 2 mm wide.
2. Low fade: Skin blended up.
3. Sharp edges: Cleaned with a razor.
4. Short top: About 4 cm.
```

### H26 Curly Top Fade

```text
ITEM: H26 Curly Top Fade
BACKDROP: Sage (#CADBD8).
MAIN VIEW: three-quarter front, facing left
CHARACTER NOTE: same man, with natural tight curls for this style.
STYLE: defined natural curls on top, 5-6 cm, shaped round and slightly higher in the middle; sides low-to-mid fade from #0 to #2; soft curl-cream definition, no frizz.
CALLOUTS:
1. Defined curls: Natural, shaped round.
2. Higher middle: Soft rounded top.
3. Faded sides: #0 to #2.
4. Curl cream: Soft, no frizz.
```

### H27 Side Fringe

```text
ITEM: H27 Side Fringe
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: three-quarter front, facing left
STYLE: sides machine #3; top about 8 cm; a long fringe swept across the forehead to one side, reaching the eyebrows, longer on the swept side; smooth with a light shine.
CALLOUTS:
1. Swept fringe: Across the forehead.
2. Longer on one side: Falls to the brow.
3. Short sides: Machine #3.
4. Smooth finish: Blow-dried, light wax.
```

### H28 Wolf Cut

```text
ITEM: H28 Wolf Cut
BACKDROP: Plum (#B06A8F).
MAIN VIEW: three-quarter front, facing left
STYLE: shaggy layered cut; choppy short layers on the crown with volume; layered sides over the ears; longer back reaching the collar; messy fringe to the eyebrows; tousled natural wave.
CALLOUTS:
1. Shaggy top: Choppy layers with volume.
2. Messy fringe: To the eyebrows.
3. Layered sides: Over the ears.
4. Longer back: Reaches the collar.
```

### H29 Man Bun

```text
ITEM: H29 Man Bun
BACKDROP: Orange (#EC9465).
MAIN VIEW: left side profile
CHARACTER NOTE: same man, with hair grown long for this style.
STYLE: long hair, shoulder length when down, pulled back smoothly and tied into a neat bun at the back of the head at crown level; long sides, no undercut; soft natural texture.
CALLOUTS:
1. Smooth pull-back: No bumps on top.
2. Neat bun: Back of the head.
3. Healthy ends: Trimmed, no split ends.
4. Soft tie: Loose, not tight.
```

### H30 Head Shave

```text
ITEM: H30 Head Shave
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: three-quarter front, facing left
CHARACTER NOTE: same man, with his head shaved.
STYLE: whole head shaved smooth with a razor; even skin tone; subtle, healthy sheen; no stubble or nicks.
CALLOUTS:
1. Smooth scalp: Razor close, no stubble.
2. Even outline: Clean around the ears.
3. Healthy sheen: Moisturised, not greasy.
4. Smooth nape: Shaved clean.
```

### H31 Crop Fade

```text
ITEM: H31 Crop Fade
BACKDROP: Plum (#B06A8F).
MAIN VIEW: three-quarter front, facing left
STYLE: French crop top about 4 cm, choppy and pushed forward, with a short, slightly uneven fringe; sides mid fade from skin to #2; matte finish.
CALLOUTS:
1. Rough top: Choppy, pushed forward.
2. Short fringe: Above the eyebrows.
3. Mid skin fade: #0 to #2.
4. Matte finish: Dry wax.
```

### H32 Burst Fade

```text
ITEM: H32 Burst Fade
BACKDROP: Orange (#EC9465).
MAIN VIEW: left side profile
STYLE: fade curving in a half circle around the ear, bare skin at the ear blending out to #3; back of the head left longer at #4; top about 6 cm.
CALLOUTS:
1. Half circle: Fade curves around the ear.
2. Longer back: Machine #4 behind.
3. Smooth blend: Skin to #3.
4. Top length: About 6 cm.
```

### H33 Mohawk

```text
ITEM: H33 Mohawk
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: three-quarter front, facing left
STYLE: a strip about 4 cm wide (2 fingers) from forehead to crown, about 7 cm long, standing straight up with strong gel; sides very short, #0 to #1; strip edges slightly blended.
CALLOUTS:
1. Standing strip: 2 fingers wide.
2. Straight up: Strong gel hold.
3. Very short sides: #0 to #1.
4. Blended edges: Soft strip line.
```

### H34 Modern Mullet

```text
ITEM: H34 Modern Mullet
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: left side profile
STYLE: short sides with a low fade; textured top about 6 cm with a short, messy fringe; longer hair at the back of the neck, 9-10 cm, blended into the top.
CALLOUTS:
1. Short sides: Low fade.
2. Textured top: About 6 cm.
3. Long back: Blended, 4-5 fingers.
4. Messy fringe: Short and loose.
```

### H35 Mushroom Cut

```text
ITEM: H35 Mushroom Cut
BACKDROP: Sage (#CADBD8).
MAIN VIEW: three-quarter front, facing left
STYLE: rounded top about 10 cm that falls evenly all around like a cap; full fringe to the eyebrows; short #2 underneath at the lower sides and back; soft, smooth finish.
CALLOUTS:
1. Rounded shape: Falls evenly all round.
2. Full fringe: To the eyebrows.
3. Short underneath: #2 at the lower sides.
4. Soft finish: Smooth, light spray.
```

### H36 Comma Hair

```text
ITEM: H36 Comma Hair
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: three-quarter front, facing left
STYLE: top about 9 cm; fringe parted to one side and curled inward at the end like a comma, falling to the eyebrows; sides two-block at #3; soft, glossy finish.
CALLOUTS:
1. Comma curl: Fringe curls inward.
2. Side part: Fringe falls to one side.
3. Brow length: Reaches the eyebrows.
4. Short sides: Two-block underneath.
```

### H37 Korean Perm

```text
ITEM: H37 Korean Perm
BACKDROP: Plum (#B06A8F).
MAIN VIEW: three-quarter front, facing left
STYLE: two-block base; top about 9 cm with soft, loose, even S-shaped perm waves; airy volume; wavy fringe to the eyebrows.
CALLOUTS:
1. Soft waves: Loose perm curls.
2. Airy volume: Light, not frizzy.
3. Wavy fringe: To the eyebrows.
4. Short sides: Two-block base.
```

### H38 Brush Up

```text
ITEM: H38 Brush Up
BACKDROP: Orange (#EC9465).
MAIN VIEW: three-quarter front, facing left
STYLE: sides machine #2 blending to #3; top about 5 cm, brushed straight up evenly from the forehead; light wax hold.
CALLOUTS:
1. Brushed up: Even height across the top.
2. Top length: About 5 cm.
3. Short sides: #2 to #3.
4. Light hold: Wax, natural shine.
```

### H39 Natural Curls

```text
ITEM: H39 Natural Curls
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: three-quarter front, facing left
CHARACTER NOTE: same man, with natural curls for this style.
STYLE: medium curls, 9-10 cm on top and about 6 cm on the sides, with a round, even outline; defined with curl cream; bulk removed.
CALLOUTS:
1. Defined curls: Curl cream, no frizz.
2. Even outline: Round, balanced shape.
3. Shorter sides: About 6 cm.
4. Light weight: Bulk thinned out.
```

### H40 Shoulder Length

```text
ITEM: H40 Shoulder Length
BACKDROP: Plum (#B06A8F).
MAIN VIEW: three-quarter front, facing left
CHARACTER NOTE: same man, with hair grown to his shoulders.
STYLE: long straight-to-wavy hair worn loose to the shoulders, with light face-framing layers and healthy ends.
CALLOUTS:
1. Shoulder length: Worn loose.
2. Face-framing layers: Light around the face.
3. Healthy ends: No split ends.
4. Natural movement: Soft and light.
```

### H41 School Cut

```text
ITEM: H41 School Cut
BACKDROP: Orange (#EC9465).
MAIN VIEW: three-quarter front, facing left
STYLE: neat, conservative short cut; sides and back machine #2; top about 3 cm, combed neatly; ears fully clear; fringe above the eyebrows; collar clear; no fade and no design.
CALLOUTS:
1. Ears clear: Sides short and neat.
2. Above the brows: Front kept short.
3. Collar clear: Tidy back.
4. Neat top: About 3 cm, combed.
```

### H42 Pushed Back

```text
ITEM: H42 Pushed Back
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: left side profile
STYLE: sides machine #3, tapering to #2 at the neck; top about 8 cm pushed back from the forehead with a soft matte finish and natural movement; no shine.
CALLOUTS:
1. Pushed back: Soft and natural.
2. Matte finish: No shine.
3. Tapered sides: #3 to #2.
4. Clean nape: Neat neck line.
```

### H43 Dandy Cut

```text
ITEM: H43 Dandy Cut
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: three-quarter front, facing left
STYLE: sides machine #3, tapering to #2 at the neck; top about 7 cm swept softly to one side with natural volume at the roots; light fringe falling to the eyebrows; soft matte finish.
CALLOUTS:
1. Soft sweep: Top swept to one side.
2. Light fringe: To the eyebrows.
3. Tapered sides: #3 to #2.
4. Natural volume: Lifted at the roots.
```

### H44 See-Through Bangs

```text
ITEM: H44 See-Through Bangs
BACKDROP: Sage (#CADBD8).
MAIN VIEW: straight front, head and shoulders
STYLE: sides machine #3, clean and tidy; top about 7 cm; thin, wispy see-through fringe to the eyebrows with the forehead showing through the strands; airy, soft texture; light matte finish.
CALLOUTS:
1. Wispy fringe: Forehead shows through.
2. Brow length: Reaches the eyebrows.
3. Airy texture: Thinned and light.
4. Short sides: Neat and tidy.
```

### H45 Leaf Cut

```text
ITEM: H45 Leaf Cut
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: straight front, head and shoulders
STYLE: top about 9 cm, layered and parted in the centre; fringe in two soft pieces falling to the cheekbones with the ends flicking outward like leaves; sides short and tidy at #3; soft, airy finish.
CALLOUTS:
1. Centre part: Even on both sides.
2. Leaf flick: Ends curl outward.
3. Face-framing: Falls to the cheekbones.
4. Light layers: Soft and airy.
```

### H46 Down Perm

```text
ITEM: H46 Down Perm
BACKDROP: Plum (#B06A8F).
MAIN VIEW: left side profile
STYLE: sides about 1.5 cm lying flat and smooth against the head after a down perm; top about 7 cm, natural and full, pushed slightly up and back; slim, neat head shape with no puffy sides; soft matte finish.
CALLOUTS:
1. Flat sides: Lie close to the head.
2. Full top: Natural volume.
3. Neat shape: Slim, no puff.
4. Easy daily: Almost no styling.
```

### H47 Regent Cut

```text
ITEM: H47 Regent Cut
BACKDROP: Orange (#EC9465).
MAIN VIEW: left side profile
STYLE: sides machine #3, tapering to #2 at the neck; top about 9 cm swept back and slightly to the sides from a soft part; a little lift at the front; soft natural shine from light pomade; tidy nape.
CALLOUTS:
1. Swept back: Soft part, natural lift.
2. Front lift: A little volume.
3. Tapered sides: #3 to #2.
4. Soft shine: Light pomade.
```

### H48 Hush Cut

```text
ITEM: H48 Hush Cut
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: three-quarter front, facing left
STYLE: medium-length layered cut; soft feathery layers around the face falling to the cheeks; top about 10 cm with light layers; back reaching the collar; ends lightly thinned; sides over the ears; smooth, airy, natural finish.
CALLOUTS:
1. Soft layers: Feathery, not choppy.
2. Face-framing: Falls to the cheeks.
3. Light ends: Thinned and airy.
4. Natural flow: Easy movement.
```

### H49 Edgar Cut

```text
ITEM: H49 Edgar Cut
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: straight front, head and shoulders
STYLE: mid skin fade on the sides, #0 up to #3; top about 6 cm, thick and even, combed forward; blunt fringe cut dead straight across the forehead, just above the eyebrows; sharp, clean edges; matte finish.
CALLOUTS:
1. Blunt fringe: Straight across.
2. Mid skin fade: #0 to #3.
3. Thick top: Full and even.
4. Sharp edges: Cleaned with a razor.
```

### H50 Flat Top

```text
ITEM: H50 Flat Top
BACKDROP: Orange (#EC9465).
MAIN VIEW: straight front, head and shoulders
STYLE: top about 3 cm brushed straight up and trimmed perfectly flat and level; sides and back machine #1, short and tight; sharp square corners where the top meets the sides; clean neck line; matte finish.
CALLOUTS:
1. Flat top: Level like a table.
2. Tight sides: Machine #1.
3. Square corners: Sharp at the top edge.
4. Clean nape: Neat neck line.
```

### H51 Natural Afro

```text
ITEM: H51 Natural Afro
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: straight front, head and shoulders
STYLE: tight, natural curls about 9 cm long on top and sides, picked out into a full, round, even shape; neatly edged hairline and sideburns; defined curls with no frizz; soft sheen.
CALLOUTS:
1. Full curls: Round and even.
2. Neat edges: Hairline lined up.
3. Even outline: Balanced shape.
4. Curl cream: Soft, no frizz.
```

### H52 Textured Fringe

```text
ITEM: H52 Textured Fringe
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: straight front, head and shoulders
STYLE: low taper on the sides, #1 at the bottom blending to #3; top about 6 cm, choppy and textured, pushed forward into an uneven fringe that covers the upper forehead; matte finish.
CALLOUTS:
1. Textured fringe: Choppy, pushed forward.
2. Low taper: #1 to #3.
3. Messy top: Matte texture.
4. Clean neck: Tidy nape.
```

### H53 Hard Part

```text
ITEM: H53 Hard Part
BACKDROP: Sage (#CADBD8).
MAIN VIEW: three-quarter front, facing left
STYLE: sides machine #2, tapering to #1 at the neck; top about 6 cm combed neatly to the side; a thin, clean line shaved along the side parting; light pomade shine.
CALLOUTS:
1. Shaved part: Thin, sharp line.
2. Side-combed top: Neat and smart.
3. Tapered sides: #2 to #1.
4. Light shine: Pomade.
```

### H54 Temple Fade

```text
ITEM: H54 Temple Fade
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: left side profile
STYLE: top about 4 cm and sides about 2 cm, at natural length; a small fade from skin to #2 only around the temples, sideburns and nape; sharp lined-up hairline at the forehead and temples; square sideburns; matte finish.
CALLOUTS:
1. Temple fade: Skin to #2.
2. Line-up: Sharp hairline.
3. Square sideburns: Clean edges.
4. Faded nape: Neat back.
```

### H55 V-Cut

```text
ITEM: H55 V-Cut
BACKDROP: Plum (#B06A8F).
MAIN VIEW: left side profile
STYLE: sides machine #2, tapering down; top about 5 cm combed back; the hairline at the back of the neck cut into a sharp V pointing down at the centre, with clean shaved skin below it; tidy, matte finish.
CALLOUTS:
1. V neckline: Sharp point at the back.
2. Clean below: Shaved with a razor.
3. Tapered sides: Short and neat.
4. Easy top: Combed back.
```

### H56 Ponytail

```text
ITEM: H56 Ponytail
BACKDROP: Orange (#EC9465).
MAIN VIEW: left side profile
CHARACTER NOTE: same man, with hair grown to the shoulders for this style.
STYLE: shoulder-length hair pulled back smoothly and tied low at the nape, the ponytail hanging to the upper back; long sides, no undercut; soft natural texture.
CALLOUTS:
1. Low tie: At the nape.
2. Smooth pull-back: No bumps on top.
3. Healthy ends: Trimmed, no split ends.
4. Soft tie: Loose, not tight.
```

### H57 Top Knot

```text
ITEM: H57 Top Knot
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: left side profile
CHARACTER NOTE: same man, with long hair on top for this style.
STYLE: sides and back machine #1 with a clean line where they meet the top; top hair about 18 cm, pulled back smoothly and tied into a neat knot at the crown; soft natural texture.
CALLOUTS:
1. Crown knot: Tied high.
2. Short sides: Machine #1.
3. Clean line: Where sides meet the top.
4. Smooth pull-back: No bumps.
```

### H58 Half Bun

```text
ITEM: H58 Half Bun
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: left side profile
CHARACTER NOTE: same man, with hair grown past the chin for this style.
STYLE: hair between chin and shoulder length; the top half, from the temples up, gathered back and tied into a small bun at the back of the crown; the lower half hangs loose over the ears and neck; light layers; soft natural texture.
CALLOUTS:
1. Half bun: Top half tied up.
2. Hair down: Lower half loose.
3. Light layers: Soft movement.
4. Healthy ends: Trimmed.
```

### H59 Dreadlocks

```text
ITEM: H59 Dreadlocks
BACKDROP: Sage (#CADBD8).
MAIN VIEW: straight front, head and shoulders
CHARACTER NOTE: same man, with mature dreadlocks grown for this style.
STYLE: neat, even dreadlocks about 1 cm thick, reaching the shoulders; tidy roots in even square sections; clean hairline; healthy, matte locks.
CALLOUTS:
1. Even locks: About 1 cm thick.
2. Neat roots: Square sections.
3. Clean hairline: Tidy edges.
4. Shoulder length: Healthy ends.
```

### H60 Tapered Afro

```text
ITEM: H60 Tapered Afro
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: straight front, head and shoulders
STYLE: tight natural curls about 5 cm long on top, picked out into a short, full, even shape; sides and nape tapered close from #3 down to #1; neat edged hairline and sideburns; defined curls with no frizz; soft sheen.
CALLOUTS:
1. Full top: Short, even curls.
2. Tapered sides: #3 down to #1.
3. Neat edges: Hairline lined up.
4. Curl cream: Soft, no frizz.
```

### H61 Curly Curtains

```text
ITEM: H61 Curly Curtains
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: straight front, head and shoulders
STYLE: medium-length natural curls, about 8 cm on top, parted in the centre and falling softly to each side of the face over the ears; sides tapered neatly at the nape; defined curls with no frizz; soft natural shine.
CALLOUTS:
1. Centre part: Even on both sides.
2. Soft curtains: Fall to the cheeks.
3. Defined curls: No frizz.
4. Neat nape: Tapered tidy.
```

### H62 Tousled Waves

```text
ITEM: H62 Tousled Waves
BACKDROP: Sage (#CADBD8).
MAIN VIEW: straight front, head and shoulders
STYLE: medium-length natural waves, about 9 cm on top, left loose and tousled with soft texture; sides over the ears blended softly; tidy nape; matte, natural finish with no frizz.
CALLOUTS:
1. Loose waves: Natural movement.
2. Messy top: Soft texture.
3. Blended sides: Over the ears.
4. Tidy nape: Neat at the collar.
```

### H63 Low Mullet

```text
ITEM: H63 Low Mullet
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: left side profile
CHARACTER NOTE: same man, with hair grown a little longer at the back for this style.
STYLE: sides machine #2 blending into a top of about 5 cm; the back left a little longer, 3–4 cm, falling softly to the nape in a subtle point; tidy ears; light matte finish.
CALLOUTS:
1. Longer back: Just a little extra.
2. Short sides: Machine #2.
3. Neat top: About 5 cm.
4. Soft point: At the nape.
```

### H64 Mid Mullet

```text
ITEM: H64 Mid Mullet
BACKDROP: Plum (#B06A8F).
MAIN VIEW: left side profile
CHARACTER NOTE: same man, with hair grown longer at the back for this style.
STYLE: sides machine #2, blending up to a textured top of about 7 cm; the back left to the collar at 8–10 cm with soft layers; clean ears; natural matte finish.
CALLOUTS:
1. Balanced length: Back to the collar.
2. Textured top: About 7 cm.
3. Short sides: Machine #2.
4. Soft layers: Top meets back.
```

### H65 High Mullet

```text
ITEM: H65 High Mullet
BACKDROP: Orange (#EC9465).
MAIN VIEW: left side profile
CHARACTER NOTE: same man, with hair grown long at the back for this style.
STYLE: sides faded high from #0 to #3 up to the temples; textured top of about 8 cm; the back left long at 12–15 cm, reaching the collar with soft layers; strong contrast between sides and back; matte finish.
CALLOUTS:
1. High fade: Sides #0 to #3.
2. Long back: To the collar.
3. Textured top: About 8 cm.
4. Strong contrast: Short to long.
```

### H66 Full Mullet

```text
ITEM: H66 Full Mullet
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: left side profile
CHARACTER NOTE: same man, with hair grown long for this style.
STYLE: short top of about 6 cm and sides at machine #2; the back left long, reaching the shoulders with soft long layers; clean ears; relaxed natural texture.
CALLOUTS:
1. Long back: To the shoulders.
2. Short top: About 6 cm.
3. Short sides: Machine #2.
4. Long layers: Soft movement.
```

### H67 Korean Mullet

```text
ITEM: H67 Korean Mullet
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: straight front, head and shoulders
CHARACTER NOTE: same man, with hair grown out at the back for this style.
STYLE: soft layered mullet: sides machine #3 tapering to #2; top about 8 cm in light layers; a thin wispy fringe to the eyebrows; the back left to the collar with feathered layers; airy, natural finish.
CALLOUTS:
1. Wispy fringe: Thin and light.
2. Soft layers: Airy, not choppy.
3. Longer back: To the collar.
4. Tapered sides: #3 to #2.
```

### H68 Greaser

```text
ITEM: H68 Greaser
BACKDROP: Sage (#CADBD8).
MAIN VIEW: left side profile
STYLE: sides machine #1, tight and tapered; top about 9 cm combed back and slightly up from the forehead, with a small lift at the front and a high-shine pomade finish; clean neck line.
CALLOUTS:
1. Combed-back top: High and shiny.
2. Front lift: A little height.
3. Tight sides: Machine #1.
4. Pomade shine: Strong hold.
```

### H69 Curly Crop

```text
ITEM: H69 Curly Crop
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: straight front, head and shoulders
STYLE: short, tight natural curls about 3–4 cm on top in a neat round crop; sides tapered from #2 down to #1; clean edged hairline; defined curls with no frizz; soft sheen.
CALLOUTS:
1. Cropped curls: Short and defined.
2. Neat taper: #2 down to #1.
3. Round shape: Even outline.
4. Clean edges: Hairline lined up.
```

### H70 Angular Fringe

```text
ITEM: H70 Angular Fringe
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: straight front, head and shoulders
STYLE: sides machine #2 tapering to #1; top about 5 cm; the fringe combed across the forehead and cut at a sharp diagonal angle, longer to the eyebrow on one side; clean neck line; matte finish.
CALLOUTS:
1. Angled fringe: Sharp diagonal cut.
2. Short sides: Machine #2.
3. Matte finish: A little clay.
4. Clean nape: Neat neck line.
```

### H71 Asymmetrical Cut

```text
ITEM: H71 Asymmetrical Cut
BACKDROP: Sage (#CADBD8).
MAIN VIEW: straight front, head and shoulders
STYLE: asymmetrical cut: one side short at machine #2 and tapered, the other side left long at about 7 cm and swept diagonally across the forehead; textured top; clean neck line; matte finish.
CALLOUTS:
1. Swept side: Long and diagonal.
2. Short side: Machine #2.
3. Textured top: Soft and light.
4. Clean nape: Neat neck line.
```

### H72 Blowout Taper

```text
ITEM: H72 Blowout Taper
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: straight front, head and shoulders
STYLE: full, voluminous top of about 8 cm blow-dried up and back with soft body; sides tapered from #2 down to #1; clean neck line; natural light shine.
CALLOUTS:
1. Full top: Blow-dried up and back.
2. Soft body: Light layers.
3. Clean taper: #2 down to #1.
4. Light shine: Natural finish.
```

### H73 Curtain Fringe

```text
ITEM: H73 Curtain Fringe
BACKDROP: Plum (#B06A8F).
MAIN VIEW: straight front, head and shoulders
STYLE: medium-length straight hair about 8 cm on top, parted in the centre, the fringe falling softly to each side past the eyebrows like curtains; sides tapered tidy; soft natural finish.
CALLOUTS:
1. Centre part: Even on both sides.
2. Soft curtains: Fall past the brows.
3. Tapered sides: Tidy and short.
4. Natural finish: Light cream.
```

### H74 Layered Long Cut

```text
ITEM: H74 Layered Long Cut
BACKDROP: Orange (#EC9465).
MAIN VIEW: straight front, head and shoulders
STYLE: long hair reaching below the shoulders with soft, even layers for movement; face-framing layers falling to the chin; healthy, smooth ends; natural shine.
CALLOUTS:
1. Long layers: Soft movement.
2. Face-framing: Falls to the chin.
3. Healthy ends: Trimmed, no split ends.
4. Natural shine: Smooth finish.
```

### H75 Shaggy Cut

```text
ITEM: H75 Shaggy Cut
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: straight front, head and shoulders
STYLE: shaggy cut with choppy, uneven layers all over, about 9 cm on top; a loose fringe to the eyebrows; the sides and back falling over the ears and collar; messy, lived-in matte texture.
CALLOUTS:
1. Choppy layers: Uneven and messy.
2. Loose fringe: To the eyebrows.
3. Lived-in texture: Matte, not neat.
4. Easy shape: Relaxed outline.
```

### H76 Bro Flow

```text
ITEM: H76 Bro Flow
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: straight front, head and shoulders
STYLE: medium-to-long hair of about 14 cm, swept back off the forehead and flowing over the ears towards the collar, with light layers; healthy shine; natural, relaxed finish.
CALLOUTS:
1. Flowing length: Back over the ears.
2. Light layers: Soft movement.
3. Healthy shine: Smooth, not dry.
4. Neat ends: Trimmed tidy.
```

### H77 Broccoli Cut

```text
ITEM: H77 Broccoli Cut
BACKDROP: Sage (#CADBD8).
MAIN VIEW: straight front, head and shoulders
STYLE: full, rounded top of about 8 cm with light layers, like the head of a broccoli, over short tapered sides at machine #2; a soft fringe to the eyebrows; natural, fluffy finish.
CALLOUTS:
1. Round top: Full and even.
2. Short sides: Machine #2.
3. Soft fringe: To the eyebrows.
4. Light layers: Body and movement.
```

### H78 Fluffy Hair

```text
ITEM: H78 Fluffy Hair
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: straight front, head and shoulders
STYLE: soft, airy top of about 7 cm with natural volume and light layers; a gentle fringe to the eyebrows; short tapered sides; light, fluffy finish with no heavy product.
CALLOUTS:
1. Fluffy top: Soft and airy.
2. Light layers: Natural body.
3. Gentle fringe: To the eyebrows.
4. Tidy sides: Short and tapered.
```

### H79 Surfer Hair

```text
ITEM: H79 Surfer Hair
BACKDROP: Plum (#B06A8F).
MAIN VIEW: straight front, head and shoulders
STYLE: loose natural waves about 12 cm long on top, with a windswept, beachy texture; long sides falling over the ears; light layers; soft, sun-kissed matte finish.
CALLOUTS:
1. Loose waves: Natural and beachy.
2. Windswept top: Messy, relaxed.
3. Long sides: Over the ears.
4. Salt texture: Matte, not oily.
```

### H80 Warrior Cut

```text
ITEM: H80 Warrior Cut
BACKDROP: Sage (#CADBD8).
MAIN VIEW: straight front, head and shoulders
STYLE: long, heavy fringe of about 9 cm falling over the forehead to the eyebrows, over short tidy sides at machine #2; thick, straight hair; strong shape; matte finish.
CALLOUTS:
1. Heavy fringe: Long and bold.
2. Short sides: Machine #2.
3. Strong shape: Sharp outline.
4. Matte finish: A little clay.
```

### H81 Spin Swallow Perm

```text
ITEM: H81 Spin Swallow Perm
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: straight front, head and shoulders
STYLE: Korean spin swallow perm: top about 9 cm in loose spiral curls swept out to the sides with a soft fringe; sides machine #3, tapered; airy volume, no frizz; soft natural shine.
CALLOUTS:
1. Spiral curls: Swirled to the sides.
2. Airy volume: Full and soft.
3. Soft fringe: To the eyebrows.
4. Tapered sides: Short and tidy.
```

### H82 Off-Centre Part

```text
ITEM: H82 Off-Centre Part
BACKDROP: Plum (#B06A8F).
MAIN VIEW: straight front, head and shoulders
STYLE: sides machine #3 tapering to #2; top about 7 cm with a part set just off the middle, hair sweeping softly to both sides; natural shine; neat, relaxed finish.
CALLOUTS:
1. Off-centre part: Just off the middle.
2. Soft sweep: Falls to both sides.
3. Tapered sides: #3 to #2.
4. Natural shine: Light cream.
```

### H83 Shadow Perm

```text
ITEM: H83 Shadow Perm
BACKDROP: Orange (#EC9465).
MAIN VIEW: straight front, head and shoulders
STYLE: Korean shadow perm: top about 8 cm with soft, subtle waves and natural volume at the roots; a light see-through fringe; sides machine #3, tapered; soft matte shine, no frizz.
CALLOUTS:
1. Subtle waves: Soft and loose.
2. Root volume: Natural body.
3. Light fringe: See-through.
4. Tapered sides: Short and tidy.
```

### H84 Nerd Perm

```text
ITEM: H84 Nerd Perm
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: straight front, head and shoulders
STYLE: Korean round perm: top about 8 cm in soft, even, rounded curls forming a neat boyish outline, with a light fringe to the eyebrows; sides machine #3, tapered; soft shine, no frizz.
CALLOUTS:
1. Round curls: Soft and even.
2. Neat outline: Boyish shape.
3. Light fringe: To the eyebrows.
4. Tapered sides: Short and tidy.
```

### H85 Korean Fade

```text
ITEM: H85 Korean Fade
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: left side profile
STYLE: clean mid fade on the sides and back from #0 to #3; soft textured top of about 7 cm falling slightly forward with a light see-through fringe; clean neck line; soft matte finish.
CALLOUTS:
1. Clean fade: #0 to #3.
2. Soft top: Textured, falls forward.
3. Light fringe: See-through.
4. Clean nape: Sharp neck line.
```

### H86 Permed Waves

```text
ITEM: H86 Permed Waves
BACKDROP: Sage (#CADBD8).
MAIN VIEW: straight front, head and shoulders
STYLE: loose permed waves about 10 cm long on top and over the ears, with natural movement and body; light layers; soft shine, no frizz; relaxed finish.
CALLOUTS:
1. Loose waves: Natural movement.
2. Soft body: Light layers.
3. Smooth shine: No frizz.
4. Easy length: Over the ears.
```

### H87 Layered Undercut Sweep

```text
ITEM: H87 Layered Undercut Sweep
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: left side profile
STYLE: sides machine #1 with a clean undercut line; top about 9 cm in light layers swept to one side across the forehead with texture and movement; clean neck line; matte finish.
CALLOUTS:
1. Swept top: Layered, to one side.
2. Undercut sides: Machine #1.
3. Light layers: Texture and movement.
4. Matte finish: Clay or paste.
```

### H88 Korean Ivy League

```text
ITEM: H88 Korean Ivy League
BACKDROP: Plum (#B06A8F).
MAIN VIEW: straight front, head and shoulders
STYLE: sides machine #2 tapering to #1; top about 5 cm with a soft side part and a light see-through fringe; soft, natural texture; neat, smart finish with a gentle matte shine.
CALLOUTS:
1. Soft side part: Neat and natural.
2. Light fringe: See-through.
3. Tapered sides: #2 to #1.
4. Soft finish: Light wax.
```

### H89 K-Pop Cut

```text
ITEM: H89 K-Pop Cut
BACKDROP: Orange (#EC9465).
MAIN VIEW: straight front, head and shoulders
STYLE: soft layered Korean idol cut: sides machine #3 tapering to #2; top about 8 cm in smooth layers; a light see-through fringe to the eyebrows; tidy neck line; smooth, glossy natural finish.
CALLOUTS:
1. Soft layers: Smooth and light.
2. See-through fringe: To the eyebrows.
3. Tidy sides: #3 to #2.
4. Glossy finish: Light wax.
```

## Beard prompts

Paste the fixed block, the beard category block, the item block below, then the avoid list. The haircut stays the same classic taper cut unless the item says otherwise.

### H90 Low Fade Quiff

```text
ITEM: H90 Low Fade Quiff
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: left side profile
STYLE: low fade: bare skin to #1 at the nape and just above the ear, blending to #3 low on the sides; top about 8 cm at the front, lifted up and back with volume, shorter (about 4 cm) toward the crown; natural wax finish.
CALLOUTS:
1. Lifted front: Blown up and back.
2. Low fade: Starts above the ear.
3. Height at front: About 8 cm.
4. Clean blend: Fade into the top.
```

### H91 Mid Fade Quiff

```text
ITEM: H91 Mid Fade Quiff
BACKDROP: Plum (#B06A8F).
MAIN VIEW: left side profile
STYLE: mid fade starting at the temple, halfway up the side of the head, bare skin at the bottom blending through #1, #2 and #3; top about 8 cm at the front, lifted up and back with volume, shorter (about 4 cm) toward the crown; natural wax finish.
CALLOUTS:
1. Lifted front: Blown up and back.
2. Mid fade: Starts at the temple.
3. Height at front: About 8 cm.
4. Clean blend: Fade into the top.
```

### H92 High Fade Quiff

```text
ITEM: H92 High Fade Quiff
BACKDROP: Orange (#EC9465).
MAIN VIEW: left side profile
STYLE: high fade starting high near the temple line, bare skin at the bottom blending quickly through #1 and #2; top about 8 cm at the front, lifted up and back with volume, shorter (about 4 cm) toward the crown; natural wax finish.
CALLOUTS:
1. Lifted front: Blown up and back.
2. High fade: Starts near the temple.
3. Strong contrast: Short sides, tall top.
4. Clean blend: Fade into the top.
```

### H93 Taper Fade Quiff

```text
ITEM: H93 Taper Fade Quiff
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: left side profile
STYLE: taper fade: sides machine #3, tapering to #1 only at the sideburns and nape with a smooth blend and no bare skin; top about 8 cm at the front, lifted up and back with volume, shorter (about 4 cm) toward the crown; natural wax finish.
CALLOUTS:
1. Lifted front: Blown up and back.
2. Soft taper: Sideburns and neck only.
3. Height at front: About 8 cm.
4. Natural sides: Short, but not skin.
```

### H94 Textured Quiff

```text
ITEM: H94 Textured Quiff
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: left side profile
STYLE: sides machine #2 tapering to #1 at the neck; top about 8 cm at the front, lifted up and back with loose, messy texture and visible separation, shorter toward the crown; dry, matte clay finish with no shine.
CALLOUTS:
1. Loose lift: Up and back, not stiff.
2. Matte texture: Visible separation.
3. Height at front: About 8 cm.
4. Tapered sides: #2 to #1.
```

### H95 Iron Perm

```text
ITEM: H95 Iron Perm
BACKDROP: Sage (#CADBD8).
MAIN VIEW: straight front, head and shoulders
STYLE: sides machine #3 tapering to #2; top about 9 cm in soft layers with loose, gentle bends and lift at the roots; a light fringe to the eyebrows; natural, soft sheen.
CALLOUTS:
1. Root lift: Soft volume at the roots.
2. Gentle bends: Loose, not curly.
3. Light fringe: To the brows.
4. Tidy sides: #3 to #2.
```

### H96 Baby Perm

```text
ITEM: H96 Baby Perm
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: straight front, head and shoulders
STYLE: sides machine #3 tapering to #2; top about 6 cm of small, soft, loose curls with airy volume and a short fringe to the forehead; natural matte finish with no frizz.
CALLOUTS:
1. Small curls: Soft and loose.
2. Airy volume: Fluffy top.
3. Short fringe: Above the brows.
4. Tidy sides: #3 to #2.
```

### H97 C-Curl Perm

```text
ITEM: H97 C-Curl Perm
BACKDROP: Plum (#B06A8F).
MAIN VIEW: straight front, head and shoulders
STYLE: sides machine #3 tapering to #2; top about 8–9 cm with the ends and the fringe curling gently inward in a soft C shape; a medium fringe to the eyebrows; smooth natural shine.
CALLOUTS:
1. C-curve ends: Curl inward.
2. Soft fringe: To the brows.
3. Smooth top: Even layers.
4. Tidy sides: #3 to #2.
```

### H98 S-Curl Perm

```text
ITEM: H98 S-Curl Perm
BACKDROP: Orange (#EC9465).
MAIN VIEW: straight front, head and shoulders
STYLE: sides machine #3 tapering to #2; top about 9 cm in soft, flowing S-shaped waves with natural movement, pushed slightly off the forehead with a light fringe; matte natural finish.
CALLOUTS:
1. S-waves: Flowing and soft.
2. Natural movement: Not tight.
3. Light fringe: Parted gently.
4. Tidy sides: #3 to #2.
```

### H99 Garma Perm

```text
ITEM: H99 Garma Perm
BACKDROP: Blush (#F7D9CE).
MAIN VIEW: straight front, head and shoulders
STYLE: sides machine #3 tapering to #2; top about 9 cm parted in the centre or slightly off-centre, with soft waves falling to each side and a gentle curve over the forehead; smooth natural shine.
CALLOUTS:
1. Centre part: Slightly off-centre.
2. Soft waves: Fall to both sides.
3. Gentle curve: Over the forehead.
4. Tidy sides: #3 to #2.
```

### B01 Clean Shave

```text
ITEM: B01 Clean Shave
BACKDROP: Sky blue (#A9C9E8).
STYLE: completely clean-shaven face with smooth skin; no stubble shadow, redness or bumps; fresh, hot-towel finish.
CALLOUTS:
1. Smooth cheeks: No stubble shadow.
2. Clean jaw: Close razor finish.
3. Smooth neck: No bumps or redness.
4. Fresh skin: Calm after aftershave.
```

### B02 Light Stubble

```text
ITEM: B02 Light Stubble
BACKDROP: Sage (#CADBD8).
STYLE: even 1-2 mm stubble across the cheeks, chin, upper lip and jaw; natural cheek line; curved neck line 2 fingers above the Adam's apple, shaved clean below.
CALLOUTS:
1. Even stubble: 1-2 mm all over.
2. Natural cheek line: Stray hairs removed.
3. Neck line: 2 fingers above the Adam's apple.
4. Shaved below: Clean neck.
```

### B03 Heavy Stubble

```text
ITEM: B03 Heavy Stubble
BACKDROP: Sand (#D8CDBF).
STYLE: even 5 mm beard, like one week of growth; clean natural cheek line; neck line 2 fingers above the Adam's apple; moustache at the same length with a clear lip line.
CALLOUTS:
1. Even 5 mm: About one week of growth.
2. Clean cheek line: Follows the natural line.
3. Neck line: 2 fingers above the Adam's apple.
4. Lip line: Moustache kept off the lip.
```

### B04 Short Boxed Beard

```text
ITEM: B04 Short Boxed Beard
BACKDROP: Plum (#B06A8F).
STYLE: short beard, 6 mm on the sides and 9 mm on the chin; sharp, straight cheek lines made with a razor; square corners at the jaw; neck line 2 fingers above the Adam's apple; moustache trimmed above the lip.
CALLOUTS:
1. Sharp cheek line: Straight, razor clean.
2. Square corners: Boxed at the jaw.
3. Fuller chin: 9 mm.
4. Neck line: 2 fingers above the Adam's apple.
```

### B05 Full Beard

```text
ITEM: B05 Full Beard
BACKDROP: Orange (#EC9465).
CHARACTER NOTE: same man, with a full beard grown for this style.
STYLE: thick full beard, about 4 cm at the chin and 12 mm on the sides; rounded bottom; natural cheek line, cleaned; neat curved neck line; moustache trimmed over the lip; combed and lightly oiled.
CALLOUTS:
1. Full shape: Thick and even.
2. Rounded bottom: Longest at the chin.
3. Natural cheek line: Stray hairs removed.
4. Neck line: Clean and curved.
```

### B06 Goatee

```text
ITEM: B06 Goatee
BACKDROP: Blush (#F7D9CE).
STYLE: hair only on the chin, about as wide as the mouth, 6 mm, with sharp edges; cheeks, upper lip and jaw clean-shaven.
CALLOUTS:
1. Chin only: As wide as the mouth.
2. Sharp edges: Trimmer clean.
3. Shaved cheeks: Smooth.
4. No moustache: Upper lip shaved.
```

### B07 Van Dyke

```text
ITEM: B07 Van Dyke
BACKDROP: Sky blue (#A9C9E8).
STYLE: pointed chin beard, 2-4 cm long; separate moustache trimmed above the lip; clean-shaven gap between them; clean-shaven cheeks.
CALLOUTS:
1. Pointed chin: 1-2 fingers long.
2. Separate moustache: Trimmed above the lip.
3. Clean gap: Shaved between them.
4. Shaved cheeks: Smooth.
```

### B08 Circle Beard

```text
ITEM: B08 Circle Beard
BACKDROP: Sage (#CADBD8).
STYLE: moustache joined to a chin beard in a neat round shape around the mouth, 5 mm; cheeks and sides of the jaw shaved; sharp outline.
CALLOUTS:
1. Round shape: Circles the mouth.
2. Joined corners: Moustache meets chin.
3. Even 5 mm: Short and neat.
4. Shaved cheeks: Clean outline.
```

### B09 Chin Strap

```text
ITEM: B09 Chin Strap
BACKDROP: Sand (#D8CDBF).
MAIN VIEW: left side profile (instead of three-quarter front). Second view: three-quarter front.
STYLE: a thin line of beard about 2 cm wide running along the jaw from ear to ear, 3 mm; cheeks above and neck below shaved; no moustache.
CALLOUTS:
1. Jaw line strip: Ear to ear.
2. One finger wide: Even width.
3. Shaved cheeks: Above the line.
4. Shaved neck: Below the line.
```

### B10 Faded Beard

```text
ITEM: B10 Faded Beard
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: left side profile (instead of three-quarter front). Second view: three-quarter front.
HAIR FOR THIS ITEM: low fade (skin one finger above the ear, blending to #2, 4 cm textured top) instead of the taper cut, so the beard fade matches.
STYLE: beard 1 mm at the sideburns, blending smoothly down to 6 mm along the jaw and chin and flowing into the hair fade; clean cheek and neck lines.
CALLOUTS:
1. Faded sideburn: 1 mm at the top.
2. Smooth blend: 1 mm to 6 mm.
3. Fuller jaw: 6 mm on chin and jaw.
4. Matches the haircut: Flows into the fade.
```

### B11 Balbo

```text
ITEM: B11 Balbo
BACKDROP: Sage (#CADBD8).
STYLE: 6 mm beard on the chin and lower jaw only; sideburns and upper cheeks shaved; separate moustache trimmed above the lip, with small shaved gaps at the mouth corners; neat neck line.
CALLOUTS:
1. Chin and jaw: 6 mm, neat.
2. No sideburns: Shaved clean.
3. Floating moustache: Separate from the beard.
4. Clean gaps: At the mouth corners.
```

### B12 Anchor Beard

```text
ITEM: B12 Anchor Beard
BACKDROP: Sand (#D8CDBF).
STYLE: pointed chin beard about 2 cm, extending a little along the jawline in an anchor shape; thin 3 mm moustache, separate from the chin; cheeks and sideburns shaved.
CALLOUTS:
1. Anchor shape: Pointed chin, short jaw line.
2. Thin moustache: 3 mm, separate.
3. Shaved cheeks: Sideburns removed.
4. Sharp edges: Trimmer clean.
```

### B13 Ducktail

```text
ITEM: B13 Ducktail
BACKDROP: Plum (#B06A8F).
CHARACTER NOTE: same man, with a full beard grown for this style.
STYLE: full beard with short 9 mm sides and a longer chin of 4-6 cm, shaped to a point like a duck's tail; clean cheek line; neck line 2 fingers above the Adam's apple.
CALLOUTS:
1. Pointed chin: Like a duck's tail.
2. Short sides: 9 mm.
3. Clean cheek line: Natural and tidy.
4. Neck line: 2 fingers above the Adam's apple.
```

### B14 Long Beard

```text
ITEM: B14 Long Beard
BACKDROP: Orange (#EC9465).
CHARACTER NOTE: same man, with a long beard grown for this style.
STYLE: long, natural full beard reaching 10 cm or more below the chin; shorter sides; rounded bottom; clean cheek and neck lines; combed and conditioned; moustache trimmed off the lip.
CALLOUTS:
1. Long length: Well past the chin.
2. Shorter sides: Shaped with scissors.
3. Rounded bottom: Even outline.
4. Clear lip: Moustache trimmed off the lip.
```

### B15 Soul Patch

```text
ITEM: B15 Soul Patch
BACKDROP: Blush (#F7D9CE).
STYLE: a small, neat patch of hair just below the lower lip, about 2 cm wide, 3 mm long; the rest of the face clean-shaven; no moustache.
CALLOUTS:
1. Small patch: Under the lower lip.
2. One finger wide: Neat edges.
3. Clean face: Everything else shaved.
4. Short length: 3 mm.
```

### B16 Mutton Chops

```text
ITEM: B16 Mutton Chops
BACKDROP: Sky blue (#A9C9E8).
MAIN VIEW: left side profile (instead of three-quarter front). Second view: three-quarter front.
STYLE: thick, wide sideburns at 6 mm growing down the cheeks to the jaw, 4-6 cm wide at the jaw; chin and front of the jaw clean-shaven; no moustache; sharp edges.
CALLOUTS:
1. Wide sideburns: Down to the jaw.
2. Shaved chin: Clean front.
3. Sharp edges: Razor finish.
4. Even length: 6 mm.
```

### B17 Garibaldi

```text
ITEM: B17 Garibaldi
BACKDROP: Sage (#CADBD8).
CHARACTER NOTE: same man, with a full beard grown for this style.
STYLE: full, wide beard about 5–8 cm long all over with a rounded bottom and a soft natural shape; moustache blended into the beard; clean natural cheek line; neck line 2 fingers above the Adam's apple; combed and lightly oiled.
CALLOUTS:
1. Wide and full: Even length all over.
2. Rounded bottom: A soft curve.
3. Blended moustache: Joins the beard.
4. Neck line: 2 fingers above the Adam's apple.
```

### B18 French Fork

```text
ITEM: B18 French Fork
BACKDROP: Sand (#D8CDBF).
CHARACTER NOTE: same man, with a full beard grown for this style.
STYLE: full beard with 12 mm sides and a long chin of 6-8 cm parted down the middle into two soft points like a fork; clean natural cheek line; neck line 2 fingers above the Adam's apple; combed and oiled.
CALLOUTS:
1. Two points: Split at the chin.
2. Long chin: 6–8 cm.
3. Short sides: 12 mm.
4. Neck line: 2 fingers above the Adam's apple.
```

### B19 Extended Goatee

```text
ITEM: B19 Extended Goatee
BACKDROP: Plum (#B06A8F).
STYLE: goatee extended along the jawline and joined to the moustache, 6-9 mm all over, cheeks shaved clean above a sharp curved line; neck line 2 fingers above the Adam's apple.
CALLOUTS:
1. Joined moustache: Part of the style.
2. Jaw line: Beard along the jaw.
3. Clean cheeks: Shaved smooth.
4. Neck line: 2 fingers above the Adam's apple.
```

### B20 Chin Curtain

```text
ITEM: B20 Chin Curtain
BACKDROP: Sage (#CADBD8).
CHARACTER NOTE: same man, with a full beard grown for this style.
STYLE: beard running along the jawline and under the chin, 2-3 cm long, with a shaved clean upper lip and clean cheeks above a sharp line; neck line 2 fingers above the Adam's apple.
CALLOUTS:
1. Jaw beard: Along the jaw and chin.
2. Clean lip: No moustache.
3. Clean cheeks: Sharp line.
4. Neck line: 2 fingers above the Adam's apple.
```

### B21 Designer Stubble

```text
ITEM: B21 Designer Stubble
BACKDROP: Sand (#D8CDBF).
STYLE: even 3 mm stubble across the cheeks, chin, upper lip and jaw; sharp, shaped cheek line and a crisp curved neck line 2 fingers above the Adam's apple.
CALLOUTS:
1. 3 mm: Even all over.
2. Sharp cheek line: Shaped with a razor.
3. Crisp neck line: 2 fingers above the Adam's apple.
4. Same moustache: Matches the beard.
```

## Moustache prompts

Paste the fixed block, the moustache category block, the item block below, then the avoid list. The face is clean-shaven apart from the moustache.

### M01 Short Trimmed

```text
ITEM: M01 Short Trimmed
BACKDROP: Blush (#F7D9CE).
STYLE: neat moustache trimmed to 3 mm, bottom edge just above the lip, ends stopping at the mouth corners.
CALLOUTS:
1. Short length: 3 mm.
2. Above the lip: Clean bottom edge.
3. Mouth corners: Ends stop here.
4. Tidy shape: Stray hairs removed.
```

### M02 Chevron

```text
ITEM: M02 Chevron
BACKDROP: Sky blue (#A9C9E8).
STYLE: thick, wide moustache shaped like a roof, covering the top edge of the upper lip, ends reaching the mouth corners; full, not thinned.
CALLOUTS:
1. Thick and wide: Full, not thinned.
2. Covers lip edge: Top of the lip hidden.
3. Roof shape: Wide chevron outline.
4. Even sides: Balanced left and right.
```

### M03 Pencil

```text
ITEM: M03 Pencil
BACKDROP: Sage (#CADBD8).
STYLE: a very thin line of moustache, about 3 mm tall, just above the upper lip; small gap under the nose; skin above the line shaved clean with a razor.
CALLOUTS:
1. Thin line: About 3 mm tall.
2. Just above the lip: Follows the lip.
3. Small gap: Under the nose.
4. Shaved above: Razor clean.
```

### M04 Handlebar

```text
ITEM: M04 Handlebar
BACKDROP: Sand (#D8CDBF).
STYLE: full moustache with the middle trimmed above the lip and long ends reaching well past the mouth, waxed and curled upward into neat loops.
CALLOUTS:
1. Curled ends: Waxed and twisted up.
2. Long ends: Past the mouth corners.
3. Trimmed middle: Above the lip.
4. Shaved around: Clean cheeks.
```

### M05 Horseshoe

```text
ITEM: M05 Horseshoe
BACKDROP: Plum (#B06A8F).
STYLE: full moustache on top with two bars, about 2 cm wide, running down both sides of the mouth to the jawline, like an upside-down U, 5 mm; chin and cheeks shaved.
CALLOUTS:
1. Down lines: To the jaw on both sides.
2. One finger wide: Even bars.
3. Full top: Thick over the lip.
4. Shaved chin: Clean between the lines.
```

### M06 English

```text
ITEM: M06 English
BACKDROP: Orange (#EC9465).
STYLE: thin moustache, short in the middle above the lip, with long, narrow ends brushed straight out to the sides and waxed to fine points.
CALLOUTS:
1. Pointed ends: Straight out to the sides.
2. Thin shape: Narrow and neat.
3. Short middle: Above the lip.
4. Wax finish: Holds the points.
```

### M07 Walrus

```text
ITEM: M07 Walrus
BACKDROP: Blush (#F7D9CE).
CHARACTER NOTE: same man, with a thick moustache grown for this style.
STYLE: big, thick, bushy moustache hanging down over the upper lip, bottom edge trimmed straight, covering most of the top lip.
CALLOUTS:
1. Thick and full: Bushy volume.
2. Over the lip: Hangs down.
3. Straight edge: Bottom trimmed level.
4. Natural ends: Past the mouth corners.
```

### M08 Lampshade

```text
ITEM: M08 Lampshade
BACKDROP: Sky blue (#A9C9E8).
STYLE: short moustache, 3 mm, narrow at the top and wider at the bottom like a lamp shade, with a straight bottom edge above the lip and straight, angled sides.
CALLOUTS:
1. Lamp shade shape: Narrow top, wide bottom.
2. Straight bottom: Above the lip.
3. Angled sides: Clean and straight.
4. Short length: 3 mm.
```

### M09 Natural Full

```text
ITEM: M09 Natural Full
BACKDROP: Sage (#CADBD8).
STYLE: medium-thick moustache in its natural shape, about 6 mm, bottom edge on the lip line, neat and tidy.
CALLOUTS:
1. Natural shape: Medium thickness.
2. On the lip line: Not touching the lip.
3. Even length: 6 mm.
4. Tidy edges: Stray hairs removed.
```

### M10 Petite Handlebar

```text
ITEM: M10 Petite Handlebar
BACKDROP: Blush (#F7D9CE).
STYLE: small handlebar; middle trimmed above the lip; ends reaching about 2 cm past the mouth corners, turned up slightly with a little wax.
CALLOUTS:
1. Small curl: Ends turned up a little.
2. Short ends: Just past the mouth.
3. Trimmed middle: Above the lip.
4. Light wax: Natural hold.
```

### M11 Hungarian

```text
ITEM: M11 Hungarian
BACKDROP: Sky blue (#A9C9E8).
CHARACTER NOTE: same man, with a thick moustache grown for this style.
STYLE: very big, bushy moustache with the hair combed out from the middle to both sides, long ends pointing outward, lightly waxed; bottom edge trimmed off the lip.
CALLOUTS:
1. Big and bushy: Full volume.
2. Combed outward: From the middle.
3. Long ends: Pointing to the sides.
4. Off the lip: Bottom edge trimmed.
```

### M12 Dali

```text
ITEM: M12 Dali
BACKDROP: Sage (#CADBD8).
STYLE: thin moustache, short in the middle above the lip, with long, stiff waxed ends twisted into thin points and pointing straight up toward the cheekbones.
CALLOUTS:
1. Upward points: Ends point straight up.
2. Strong wax: Twisted thin.
3. Thin middle: Short above the lip.
4. Shaved around: Clean face.
```

### M13 Fu Manchu

```text
ITEM: M13 Fu Manchu
BACKDROP: Sand (#D8CDBF).
STYLE: long thin moustache growing from the corners of the mouth, hanging straight down below the chin about 3-4 cm past it; middle trimmed above the lip; clean-shaven cheeks and chin.
CALLOUTS:
1. Long ends: Below the chin.
2. Thin shape: Narrow and straight.
3. Trimmed middle: Above the lip.
4. Clean cheeks: Shaved smooth.
```

### M14 Toothbrush

```text
ITEM: M14 Toothbrush
BACKDROP: Plum (#B06A8F).
STYLE: short thick moustache about the width of the nose with squared ends, trimmed to about 6 mm and sitting squarely above the lip line; clean-shaven chin and cheeks.
CALLOUTS:
1. Square shape: Width of the nose.
2. Short length: About 6 mm.
3. Trimmed lip line: Neat and clean.
4. Clean chin: Shaved smooth.
```

### M15 Imperial

```text
ITEM: M15 Imperial
BACKDROP: Orange (#EC9465).
STYLE: large full moustache growing outwards from the nose, ends sweeping up and past the cheeks about 5 cm each side; lip line trimmed; waxed into a smooth shape; clean-shaven cheeks and chin.
CALLOUTS:
1. Sweeping ends: Up and past the cheeks.
2. Full width: Wide and thick.
3. Trimmed lip line: Neat and clean.
4. Waxed shape: Smooth hold.
```

### M16 Pyramid

```text
ITEM: M16 Pyramid
BACKDROP: Blush (#F7D9CE).
STYLE: thick moustache shaped like a triangle, wide at the lip line and narrowing to the nose; trimmed just above the lip; clean-shaven chin and cheeks.
CALLOUTS:
1. Triangle shape: Wide at the lip.
2. Thick body: Full and even.
3. Trimmed edge: Just above the lip.
4. Clean chin: Shaved smooth.
```

### M17 Mandarin

```text
ITEM: M17 Mandarin
BACKDROP: Sky blue (#A9C9E8).
STYLE: thin moustache with soft ends drooping about 2 cm past the corners of the mouth and tapering to a gentle point; middle trimmed above the lip; clean-shaven cheeks and chin.
CALLOUTS:
1. Drooping ends: Past the mouth.
2. Thin shape: Soft and even.
3. Gentle point: At the ends.
4. Clean chin: Shaved smooth.
```

## Hair colour prompts

Paste the fixed block, the colour category block, the item block below, then the avoid list. Every colour image shows the same classic side part, so customers can compare shades side by side.

### C01 Jet Black

```text
ITEM: C01 Jet Black
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 1 - Jet Black
STYLE: deep, solid, even jet black with a glossy finish; no brown or blue tones; full grey coverage; clean hairline with no dye on the skin.
CALLOUTS:
1. Deep black: Level 1, even all over.
2. Full grey cover: No grey showing.
3. Glossy finish: Healthy shine.
4. Clean hairline: No dye on the skin.
```

### C02 Natural Black

```text
ITEM: C02 Natural Black
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 2 - Natural Black
STYLE: soft natural black, a very dark brown that looks like natural dark hair and is slightly softer than jet black; full grey coverage; natural shine.
CALLOUTS:
1. Soft black: Level 2, natural look.
2. Full grey cover: Even from roots to ends.
3. Natural shine: Not flat.
4. Clean hairline: No dye on the skin.
```

### C03 Dark Brown

```text
ITEM: C03 Dark Brown
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 3 - Dark Brown
STYLE: rich dark brown that looks natural, with warm brown showing in daylight; full grey coverage.
CALLOUTS:
1. Rich brown: Level 3.
2. Warm in daylight: Brown shows in the sun.
3. Full grey cover: Even colour.
4. Clean hairline: No dye on the skin.
```

### C04 Medium Brown

```text
ITEM: C04 Medium Brown
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 4 - Medium Brown
STYLE: medium brown that is clearly brown in daylight, with a natural tone; even colour from roots to ends.
CALLOUTS:
1. Medium brown: Level 4.
2. Shows in sunlight: Clear brown tone.
3. Even colour: Roots to ends.
4. Clean hairline: No dye on the skin.
```

### C05 Burgundy

```text
ITEM: C05 Burgundy
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 4 - Burgundy
STYLE: deep wine burgundy with red-violet tones; dark in the main view, glowing red-purple where light hits the top in the close-up; even colour.
CALLOUTS:
1. Wine tone: Red-violet.
2. Glows in light: Red shine on top.
3. Dark indoors: Deep base colour.
4. Even colour: Roots to ends.
```

### C06 Golden Brown Highlights

```text
ITEM: C06 Golden Brown Highlights
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 6-7 - Golden Brown
STYLE: natural black base with thin, fine golden-brown streaks woven through the top, soft and blended, not chunky; sides stay dark.
CALLOUTS:
1. Fine streaks: Thin, golden brown.
2. On top only: Sides stay dark.
3. Soft blend: Not chunky.
4. Natural base: Black underneath.
```

### C07 Ash Grey / Silver

```text
ITEM: C07 Ash Grey / Silver
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 10 - Silver
STYLE: even, cool silver-grey all over, with no yellow or orange tones and a healthy shine; eyebrows stay natural black.
CALLOUTS:
1. Cool silver: No yellow tones.
2. Even colour: Roots to ends.
3. Healthy shine: Well conditioned.
4. Natural brows: Dark contrast.
```

### C08 Grey Blending

```text
ITEM: C08 Grey Blending
BACKDROP: Sand (#D8CDBF).
CHARACTER: OLDER VERSION (Arjun at about 50).
SWATCH: Level 3-4 - Grey Blending
STYLE: natural salt-and-pepper look; grey softened into a natural mix, with about half the grey toned to dark brown-black; soft, gradual, no hard root line.
CALLOUTS:
1. Softened grey: Natural mix, not hidden.
2. Salt and pepper: Some grey still shows.
3. No hard line: Soft and gradual.
4. Natural shine: Fresh, not dyed.
```

### C09 Blue-Black

```text
ITEM: C09 Blue-Black
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 1 - Blue-Black
STYLE: deep black with a cool blue sheen where the light hits the top; full grey coverage; glossy.
CALLOUTS:
1. Blue sheen: Shows in the light.
2. Deep black: Level 1 base.
3. Full grey cover: Even colour.
4. Glossy finish: Rich shine.
```

### C10 Ash Brown

```text
ITEM: C10 Ash Brown
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 5 - Ash Brown
STYLE: cool, soft ash brown with no red or orange tones; natural, modern Korean-style finish; even colour.
CALLOUTS:
1. Cool brown: Level 5, ash.
2. No orange: Neutral, cool tone.
3. Soft finish: Natural and modern.
4. Even colour: Roots to ends.
```

### C11 Copper

```text
ITEM: C11 Copper
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 6-7 - Copper
STYLE: bright, warm copper orange-brown, vivid where the light hits; even colour from roots to ends.
CALLOUTS:
1. Bright copper: Warm orange-brown.
2. Vivid in light: Glows on top.
3. Even colour: Roots to ends.
4. Clean hairline: No dye on the skin.
```

### C12 Henna (Mehndi)

```text
ITEM: C12 Henna (Mehndi)
BACKDROP: Sand (#D8CDBF).
CHARACTER: OLDER VERSION (Arjun at about 50).
SWATCH: Henna - Plant colour
STYLE: henna on greying hair: grey strands turned warm red-orange, dark strands with a red shine; natural plant-colour look with slightly varied tone; clean scalp and hairline.
CALLOUTS:
1. Red-orange grey: Henna on grey hair.
2. Red shine: On the dark strands.
3. Natural variation: Plant colour look.
4. Clean hairline: No stains on the skin.
```

### C13 Light Brown

```text
ITEM: C13 Light Brown
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 5 - Light Brown
STYLE: soft, light brown that looks natural, clearly brown in daylight and a little lighter than medium brown; even colour from roots to ends.
CALLOUTS:
1. Light brown: Soft and natural.
2. Clear in daylight: Brown, not black.
3. Even colour: Roots to ends.
4. Clean hairline: No dye on the skin.
```

### C14 Chestnut Brown

```text
ITEM: C14 Chestnut Brown
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 5 - Chestnut Brown
STYLE: warm chestnut brown with a soft red-gold glow in daylight; rich and natural, even colour from roots to ends.
CALLOUTS:
1. Chestnut brown: Warm and rich.
2. Red-gold glow: Shows in daylight.
3. Even colour: Roots to ends.
4. Clean hairline: No dye on the skin.
```

### C15 Mahogany

```text
ITEM: C15 Mahogany
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 4-5 - Mahogany
STYLE: dark brown with a deep red shine like polished mahogany wood, subtle in shade and richer where the light hits; even colour from roots to ends.
CALLOUTS:
1. Mahogany: Dark red-brown.
2. Red shine: Glows in light.
3. Even colour: Roots to ends.
4. Clean hairline: No dye on the skin.
```

### C16 Dark Blonde

```text
ITEM: C16 Dark Blonde
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 7 - Dark Blonde
STYLE: golden, neutral dark blonde, a clear step lighter than brown and softer than full blonde; even colour from roots to ends with a healthy shine.
CALLOUTS:
1. Dark blonde: Golden, not yellow.
2. Even lift: No orange patches.
3. Healthy shine: Soft and smooth.
4. Clean hairline: No dye on the skin.
```

### C17 Violet

```text
ITEM: C17 Violet
BACKDROP: Sand (#D8CDBF).
SWATCH: Fashion - Violet
STYLE: bold, vivid violet purple, even and saturated, glowing where the light hits; healthy, smooth hair.
CALLOUTS:
1. Vivid violet: Bold and even.
2. Glows in light: Rich purple.
3. Healthy hair: Smooth, not dry.
4. Clean hairline: No dye on the skin.
```

### C18 Blue

```text
ITEM: C18 Blue
BACKDROP: Sand (#D8CDBF).
SWATCH: Fashion - Blue
STYLE: bold, vivid blue, even and saturated, glowing where the light hits; healthy, smooth hair.
CALLOUTS:
1. Vivid blue: Bold and even.
2. Glows in light: Rich colour.
3. Healthy hair: Smooth, not dry.
4. Clean hairline: No dye on the skin.
```

### C19 Light Blonde

```text
ITEM: C19 Light Blonde
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 8 - Light Blonde
STYLE: clean, bright light blonde with a soft gold glow, even from roots to ends; healthy, smooth hair with shine.
CALLOUTS:
1. Light blonde: Clean and bright.
2. Soft gold glow: Not brassy.
3. Even lift: No orange patches.
4. Clean hairline: No dye on the skin.
```

### C20 Platinum Blonde

```text
ITEM: C20 Platinum Blonde
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 10 - Platinum Blonde
STYLE: pale platinum blonde, almost white with a soft cream tone, even from roots to ends; healthy shine with no yellow or orange patches.
CALLOUTS:
1. Platinum blonde: Pale and even.
2. No brassy tones: No yellow or orange.
3. Healthy shine: Smooth, not dry.
4. Clean hairline: No dye on the skin.
```

### C21 Gold Blonde

```text
ITEM: C21 Gold Blonde
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 7-8 - Gold Blonde
STYLE: warm, golden blonde like honey in sunlight, rich and even from roots to ends; healthy shine, no orange patches.
CALLOUTS:
1. Gold blonde: Warm and sunny.
2. Rich glow: Like honey in light.
3. Even colour: Roots to ends.
4. Clean hairline: No dye on the skin.
```

### C22 Gold Brown

```text
ITEM: C22 Gold Brown
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 6 - Gold Brown
STYLE: warm light brown with a golden glow across the whole head, bright in sunlight, even from roots to ends.
CALLOUTS:
1. Gold brown: Warm and bright.
2. Golden glow: Shows in light.
3. Even colour: Roots to ends.
4. Clean hairline: No dye on the skin.
```

### C23 Dark Chestnut

```text
ITEM: C23 Dark Chestnut
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 4 - Dark Chestnut
STYLE: deep, natural dark brown with a warm red-gold glow in daylight; full grey coverage, even colour from roots to ends.
CALLOUTS:
1. Dark chestnut: Deep and warm.
2. Red-gold glow: Shows in daylight.
3. Grey covered: Even colour.
4. Clean hairline: No dye on the skin.
```

### C24 Wine Red

```text
ITEM: C24 Wine Red
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 5 - Wine Red
STYLE: rich, deep wine red, brighter and redder than burgundy, glowing where the light hits; even colour from roots to ends.
CALLOUTS:
1. Wine red: Rich and deep.
2. Glows in light: Clear red shine.
3. Even colour: Roots to ends.
4. Clean hairline: No dye on the skin.
```

### C25 Red

```text
ITEM: C25 Red
BACKDROP: Sand (#D8CDBF).
SWATCH: Fashion - Red
STYLE: bold, vivid red, even and saturated, glowing where the light hits; healthy, smooth hair.
CALLOUTS:
1. Vivid red: Bold and even.
2. Glows in light: Rich colour.
3. Healthy hair: Smooth, not dry.
4. Clean hairline: No dye on the skin.
```

### C26 Orange

```text
ITEM: C26 Orange
BACKDROP: Sand (#D8CDBF).
SWATCH: Fashion - Orange
STYLE: bold, vivid orange, even and saturated, glowing where the light hits; healthy, smooth hair.
CALLOUTS:
1. Vivid orange: Bold and even.
2. Glows in light: Rich colour.
3. Healthy hair: Smooth, not dry.
4. Clean hairline: No dye on the skin.
```

### C27 Dark Grape

```text
ITEM: C27 Dark Grape
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 3 - Dark Grape
STYLE: deep, dark violet that looks almost black, with a clear violet shine where the light hits; full grey coverage, even colour from roots to ends.
CALLOUTS:
1. Dark grape: Almost black.
2. Violet shine: Shows in sunlight.
3. Grey covered: Even colour.
4. Clean hairline: No dye on the skin.
```

### C28 Charcoal Grey

```text
ITEM: C28 Charcoal Grey
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 6-7 - Charcoal Grey
STYLE: dark, smoky charcoal grey with a cool blue undertone, deeper than silver, even from roots to ends; healthy shine.
CALLOUTS:
1. Charcoal grey: Dark and smoky.
2. Cool undertone: No yellow.
3. Even colour: Roots to ends.
4. Clean hairline: No dye on the skin.
```

### C29 Green

```text
ITEM: C29 Green
BACKDROP: Sand (#D8CDBF).
SWATCH: Fashion - Green
STYLE: bold, vivid green, even and saturated, glowing where the light hits; healthy, smooth hair.
CALLOUTS:
1. Vivid green: Bold and even.
2. Glows in light: Rich colour.
3. Healthy hair: Smooth, not dry.
4. Clean hairline: No dye on the skin.
```

### C30 Yellow

```text
ITEM: C30 Yellow
BACKDROP: Sand (#D8CDBF).
SWATCH: Fashion - Yellow
STYLE: bold, vivid yellow, even and saturated, glowing where the light hits; healthy, smooth hair.
CALLOUTS:
1. Vivid yellow: Bold and even.
2. Glows in light: Rich colour.
3. Healthy hair: Smooth, not dry.
4. Clean hairline: No dye on the skin.
```

### C31 Caramel Highlights

```text
ITEM: C31 Caramel Highlights
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 7-8 - Caramel Highlights
STYLE: natural black base with fine, warm caramel streaks woven through the top, soft and blended, not chunky; sides stay dark.
CALLOUTS:
1. Caramel streaks: Fine and warm.
2. On top only: Sides stay dark.
3. Soft blend: Not chunky.
4. Natural base: Dark underneath.
```

### C32 Ash Highlights

```text
ITEM: C32 Ash Highlights
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 8-9 - Ash Highlights
STYLE: natural black base with fine, cool ash-grey streaks woven through the top, soft and blended, not chunky; sides stay dark; modern Korean-style finish.
CALLOUTS:
1. Ash streaks: Fine and cool.
2. On top only: Sides stay dark.
3. Cool tone: No orange.
4. Natural base: Dark underneath.
```

### C33 Burgundy Highlights

```text
ITEM: C33 Burgundy Highlights
BACKDROP: Sand (#D8CDBF).
SWATCH: Level 5-6 - Burgundy Highlights
STYLE: natural black base with fine, deep burgundy wine-red streaks woven through the top, soft and blended, not chunky; sides stay dark; glossy finish.
CALLOUTS:
1. Burgundy streaks: Fine and deep.
2. On top only: Sides stay dark.
3. Red shine: Glows in light.
4. Natural base: Dark underneath.
```

## Ready Look prompts

Paste the fixed block, the Ready Look category block, the item block below, then the avoid list. Each part should match its own item prompt above, so a look's image and its parts' images agree.

### L01 Office Ready

```text
ITEM: L01 Office Ready
BACKDROP: Orange (#EC9465).
PARTS:
- Hair: Classic Side Part: tapered sides, about 6 cm on top combed neatly to the side, light pomade shine.
- Beard and moustache: clean-shaven.
- Colour: natural black.
CALLOUTS:
1. Side part: Neat and polished.
2. Clean shave: Smooth face.
3. Tapered sides: Office-ready.
4. Soft shine: Light pomade.
```

### L02 Easy Everyday

```text
ITEM: L02 Easy Everyday
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: Crew Cut: machine #2 sides, 2 cm top pushed forward.
- Beard: Light Stubble, 1-2 mm, with a clean neck line.
CALLOUTS:
1. Crew cut: Short and tidy.
2. Light stubble: 1-2 mm.
3. Neck line: Clean and curved.
4. Low effort: Natural finish.
```

### L03 Sharp Fade

```text
ITEM: L03 Sharp Fade
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: Low Fade: skin one finger above the ear blending to #2, 4 cm textured top.
- Beard: Short Boxed Beard: 6 mm sides, 9 mm chin, sharp cheek lines, square corners.
CALLOUTS:
1. Low fade: Skin above the ear.
2. Boxed beard: Sharp cheek lines.
3. Square corners: At the jaw.
4. Textured top: About 4 cm.
```

### L04 Korean Style

```text
ITEM: L04 Korean Style
BACKDROP: Sage (#CADBD8).
PARTS:
- Hair: Two-Block: soft 8-10 cm top falling over #3 sides, fringe to the eyebrows.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Two-block: Soft top over short sides.
2. Soft fringe: To the eyebrows.
3. Clean face: No beard or moustache.
4. Airy texture: Light and soft.
```

### L05 Gentleman

```text
ITEM: L05 Gentleman
BACKDROP: Sand (#D8CDBF).
CHARACTER NOTE: same man, with a full beard grown for this look.
PARTS:
- Hair: Slick Back: 8-10 cm top combed straight back with shine; sides #2 tapering to #1.
- Beard: Full Beard: thick, about 4 cm at the chin, rounded, combed.
CALLOUTS:
1. Slick back: Combed straight back.
2. Full beard: Thick and shaped.
3. Smooth blend: Tapered sides.
4. Polished finish: Pomade shine.
```

### L06 Rugged

```text
ITEM: L06 Rugged
BACKDROP: Plum (#B06A8F).
PARTS:
- Hair: Buzz Cut: machine #2 all over.
- Beard: Heavy Stubble, 5 mm.
CALLOUTS:
1. Buzz cut: Even #2.
2. Heavy stubble: 5 mm.
3. Clean neck line: Curved and tidy.
4. No styling: Natural finish.
```

### L07 Classic Moustache

```text
ITEM: L07 Classic Moustache
BACKDROP: Orange (#EC9465).
CHARACTER: OLDER VERSION (Arjun at about 50).
PARTS:
- Hair: Taper Cut, about 4 cm on top combed to the side.
- Beard: clean-shaven chin and cheeks.
- Moustache: Chevron: thick and wide, covering the top edge of the lip.
- Colour: Natural Black (Level 2), grey fully covered on hair and moustache.
CALLOUTS:
1. Taper cut: Neat and classic.
2. Chevron moustache: Thick and wide.
3. Natural black: Grey covered.
4. Clean shave: Cheeks and chin.
```

### L08 Clean Edge

```text
ITEM: L08 Clean Edge
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: Skin Fade: high fade to bare skin, 4 cm matte top.
- Beard: Faded Beard: 1 mm at the sideburns to 6 mm at the jaw, flowing into the hair fade.
CALLOUTS:
1. Skin fade: High and sharp.
2. Faded beard: Blends with the hair.
3. One shape: Hair and beard flow together.
4. Crisp lines: Razor clean.
```

### L09 Fresh Taper

```text
ITEM: L09 Fresh Taper
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: Taper Fade: #3 sides with skin only at the sideburns and nape, 5 cm top.
- Beard: Light Stubble, 1-2 mm.
CALLOUTS:
1. Taper fade: Small fade at the edges.
2. Light stubble: 1-2 mm.
3. Neat top: About 5 cm.
4. Clean neck line: Curved and tidy.
```

### L10 Curly Fade

```text
ITEM: L10 Curly Fade
BACKDROP: Orange (#EC9465).
CHARACTER NOTE: same man, with natural tight curls for this look.
PARTS:
- Hair: Curly Top Fade: defined 5-6 cm curls on top, #0 to #2 fade.
- Beard: Heavy Stubble, 5 mm.
CALLOUTS:
1. Curly top: Defined curls.
2. Faded sides: #0 to #2.
3. Heavy stubble: 5 mm.
4. Curl cream: Soft, no frizz.
```

### L11 Trendy Wolf

```text
ITEM: L11 Trendy Wolf
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: Wolf Cut: shaggy layers, messy fringe, longer back to the collar.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Wolf cut: Shaggy layers.
2. Messy fringe: To the eyebrows.
3. Clean face: No beard or moustache.
4. Longer back: Reaches the collar.
```

### L12 Bold Balbo

```text
ITEM: L12 Bold Balbo
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: Undercut: 8 cm top swept back, #1 sides with a hard line.
- Beard: Balbo: 6 mm on the chin and lower jaw, no sideburns, separate moustache.
CALLOUTS:
1. Undercut: Long top, short sides.
2. Balbo beard: Chin and jaw.
3. Floating moustache: Separate from the beard.
4. No sideburns: Shaved clean.
```

### L13 Grey Gentleman

```text
ITEM: L13 Grey Gentleman
BACKDROP: Sage (#CADBD8).
CHARACTER: OLDER VERSION (Arjun at about 50).
PARTS:
- Hair: Classic Side Part, about 6 cm on top.
- Beard: Short Boxed Beard, 6 mm sides and 9 mm chin, natural salt-and-pepper.
- Colour: Grey Blending on the hair: grey softened, not hidden.
CALLOUTS:
1. Side part: Neat and polished.
2. Boxed beard: Short and sharp.
3. Softened grey: Natural salt and pepper.
4. Fresh look: Mature, not dyed.
```

### L14 Wedding Ready

```text
ITEM: L14 Wedding Ready
BACKDROP: Sand (#D8CDBF).
PARTS:
- Hair: Quiff: front about 8 cm lifted up and back, faded sides.
- Beard: Faded Beard with sharp cheek and neck lines.
CALLOUTS:
1. Quiff: Height at the front.
2. Faded beard: Clean lines.
3. Sharp edges: Razor finish.
4. Photo-ready: Polished finish.
```

### L15 Bald and Bearded

```text
ITEM: L15 Bald and Bearded
BACKDROP: Plum (#B06A8F).
CHARACTER NOTE: same man, with his head shaved and a full beard grown for this look.
PARTS:
- Hair: Head Shave, smooth razor finish.
- Beard: Full Beard, thick, rounded, about 4 cm at the chin.
CALLOUTS:
1. Shaved head: Smooth razor finish.
2. Full beard: Thick and shaped.
3. Clean outline: Neck and cheeks.
4. Strong contrast: Bare head, full beard.
```

### L16 Soft Waves

```text
ITEM: L16 Soft Waves
BACKDROP: Orange (#EC9465).
PARTS:
- Hair: Korean Perm: soft, loose waves on a two-block, wavy fringe.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Soft waves: Loose perm.
2. Wavy fringe: To the eyebrows.
3. Clean face: No beard or moustache.
4. Airy volume: Light, not frizzy.
```

### L17 Modern Moustache

```text
ITEM: L17 Modern Moustache
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: Pushed Back: 8 cm top with a soft matte finish, tapered sides.
- Beard: clean-shaven chin and cheeks.
- Moustache: Natural Full, about 6 mm, on the lip line.
CALLOUTS:
1. Pushed back: Matte and natural.
2. Natural moustache: Medium and tidy.
3. Clean shave: Cheeks and chin.
4. Tapered sides: #3 to #2.
```

### L18 Rider Ready

```text
ITEM: L18 Rider Ready
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: Crop Fade: rough 4 cm top pushed forward, mid skin fade.
- Beard: Heavy Stubble, 5 mm.
CALLOUTS:
1. Crop fade: Rough top, pushed forward.
2. Heavy stubble: 5 mm.
3. Mid fade: Skin to #2.
4. Helmet-friendly: Bounces back with fingers.
```

### L19 Curl Natural

```text
ITEM: L19 Curl Natural
BACKDROP: Sage (#CADBD8).
CHARACTER NOTE: same man, with natural curls for this look.
PARTS:
- Hair: Natural Curls: medium, defined, round outline.
- Beard: Light Stubble, 1-2 mm.
CALLOUTS:
1. Natural curls: Medium and defined.
2. Light stubble: 1-2 mm.
3. Even outline: Round and balanced.
4. Curl cream: Soft finish.
```

### L20 Bun and Beard

```text
ITEM: L20 Bun and Beard
BACKDROP: Blush (#F7D9CE).
CHARACTER NOTE: same man, with long hair and a full beard grown for this look.
PARTS:
- Hair: Man Bun: long hair pulled back into a neat bun.
- Beard: Full Beard, thick and rounded.
CALLOUTS:
1. Man bun: Neat at the back.
2. Full beard: Thick and shaped.
3. Smooth pull-back: No bumps.
4. Clean cheek line: Tidy edges.
```

### L21 Silver Crop

```text
ITEM: L21 Silver Crop
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: French Crop: rough 4 cm top pushed forward, #1 to #3 sides.
- Colour: Ash Grey / Silver: cool and even, eyebrows natural black.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Silver colour: Cool and even.
2. French crop: Rough top, pushed forward.
3. Clean face: No beard or moustache.
4. Natural brows: Dark contrast.
```

### L22 Grey-Free Classic

```text
ITEM: L22 Grey-Free Classic
BACKDROP: Sage (#CADBD8).
CHARACTER: OLDER VERSION (Arjun at about 50).
PARTS:
- Hair: Ivy League: 4 cm top with a soft side part.
- Beard: clean-shaven.
- Moustache: Short Trimmed, 3 mm.
- Colour: Natural Black, grey fully covered on hair and moustache.
CALLOUTS:
1. Ivy League: Short, with a side part.
2. Short moustache: 3 mm, tidy.
3. Natural black: Grey covered.
4. Clean shave: Cheeks and chin.
```

### L23 Festival Moustache

```text
ITEM: L23 Festival Moustache
BACKDROP: Sand (#D8CDBF).
CHARACTER NOTE: same man, with a thick moustache grown for this look.
PARTS:
- Hair: Classic Side Part, polished.
- Beard: clean-shaven.
- Moustache: Handlebar, with waxed ends curled up.
CALLOUTS:
1. Handlebar: Curled, waxed ends.
2. Side part: Polished.
3. Clean shave: Cheeks and chin.
4. Festival-ready: Sharp and bold.
```

### L24 Office Beard

```text
ITEM: L24 Office Beard
BACKDROP: Plum (#B06A8F).
PARTS:
- Hair: Taper Fade: small fade at the sideburns and nape.
- Beard: Short Boxed Beard, 6 mm sides and 9 mm chin.
CALLOUTS:
1. Taper fade: Quiet and clean.
2. Boxed beard: Sharp lines.
3. Square corners: At the jaw.
4. Office-ready: Neat finish.
```

### L25 Sharp Van Dyke

```text
ITEM: L25 Sharp Van Dyke
BACKDROP: Orange (#EC9465).
PARTS:
- Hair: Low Fade, 4 cm textured top.
- Beard: Van Dyke: pointed chin, separate moustache, shaved cheeks.
CALLOUTS:
1. Low fade: Skin above the ear.
2. Pointed chin: 1-2 fingers long.
3. Separate moustache: Clean gap.
4. Shaved cheeks: Smooth.
```

### L26 Soft Dandy

```text
ITEM: L26 Soft Dandy
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: Dandy Cut: soft 7 cm top swept to one side with natural volume, light fringe to the eyebrows, #3 sides tapering to #2.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Dandy cut: Soft sweep to one side.
2. Light fringe: To the eyebrows.
3. Clean face: No beard or moustache.
4. Tapered sides: #3 to #2.
```

### L27 Wispy Bangs

```text
ITEM: L27 Wispy Bangs
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: See-Through Bangs: thin wispy fringe to the eyebrows with the forehead showing through, 7 cm top, tidy #3 sides.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. See-through bangs: Forehead shows through.
2. Clean face: No beard or moustache.
3. Airy texture: Thinned and light.
4. Short sides: Neat and tidy.
```

### L28 Korean Gentleman

```text
ITEM: L28 Korean Gentleman
BACKDROP: Sage (#CADBD8).
PARTS:
- Hair: Regent Cut: about 9 cm top swept back from a soft part, a little lift at the front, light natural shine, #3 sides tapering to #2.
- Beard: Light Stubble, 1-2 mm.
CALLOUTS:
1. Regent cut: Swept back, soft finish.
2. Light stubble: 1-2 mm.
3. Tapered sides: #3 to #2.
4. Soft shine: Light pomade.
```

### L29 Soft Layers

```text
ITEM: L29 Soft Layers
BACKDROP: Sand (#D8CDBF).
PARTS:
- Hair: Hush Cut: soft feathery layers falling to the cheeks, about 10 cm top, back reaching the collar, ends lightly thinned.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Hush cut: Feathery layers.
2. Face-framing: Falls to the cheeks.
3. Clean face: No beard or moustache.
4. Light ends: Thinned and airy.
```

### L30 Sharp Edgar

```text
ITEM: L30 Sharp Edgar
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: Edgar Cut: blunt 6 cm fringe cut straight across the forehead over a mid skin fade, #0 to #3.
- Beard: Heavy Stubble, 5 mm.
CALLOUTS:
1. Edgar cut: Blunt fringe.
2. Mid skin fade: #0 to #3.
3. Heavy stubble: 5 mm.
4. Sharp edges: Cleaned with a razor.
```

### L31 Ash Brown Perm

```text
ITEM: L31 Ash Brown Perm
BACKDROP: Sage (#CADBD8).
PARTS:
- Hair: Korean Perm: soft, loose waves on a 9 cm top, wavy fringe to the eyebrows, #3 sides.
- Colour: Ash Brown: cool, even brown with no orange or red.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Ash brown: Cool and even.
2. Soft waves: Loose perm.
3. Clean face: No beard or moustache.
4. Airy volume: Light, not frizzy.
```

### L32 Campus Fringe

```text
ITEM: L32 Campus Fringe
BACKDROP: Sand (#D8CDBF).
PARTS:
- Hair: Textured Fringe: choppy 6 cm top pushed forward over a low taper, #1 to #3.
- Beard: Light Stubble, 1-2 mm.
CALLOUTS:
1. Textured fringe: Choppy, pushed forward.
2. Light stubble: 1-2 mm.
3. Low taper: #1 to #3.
4. Matte finish: Dry wax.
```

### L33 Sharp Part

```text
ITEM: L33 Sharp Part
BACKDROP: Plum (#B06A8F).
PARTS:
- Hair: Hard Part: 6 cm top combed to the side along a thin shaved part line, #2 sides tapering to #1.
- Beard: Short Boxed Beard: 6 mm sides, 9 mm chin, sharp cheek lines, square corners.
CALLOUTS:
1. Shaved part: Thin, sharp line.
2. Boxed beard: Sharp cheek lines.
3. Tapered sides: #2 to #1.
4. Light shine: Pomade.
```

### L34 Clean Line-Up

```text
ITEM: L34 Clean Line-Up
BACKDROP: Orange (#EC9465).
PARTS:
- Hair: Temple Fade: small fade from skin to #2 at the temples and nape, sharp lined-up hairline, 4 cm top.
- Beard: Goatee: hair only on the chin, about as wide as the mouth, 6 mm, sharp edges.
- Moustache: clean-shaven upper lip.
CALLOUTS:
1. Temple fade: Skin to #2.
2. Line-up: Sharp hairline.
3. Goatee: Chin only.
4. Clean cheeks: Shaved.
```

### L35 Sharp V

```text
ITEM: L35 Sharp V
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: V-Cut: #2 sides, 5 cm top combed back, the back hairline cut into a sharp V.
- Beard: Heavy Stubble, 5 mm.
CALLOUTS:
1. V neckline: Sharp point at the back.
2. Heavy stubble: 5 mm.
3. Tapered sides: Short and neat.
4. Easy top: Combed back.
```

### L36 Half-Up Casual

```text
ITEM: L36 Half-Up Casual
BACKDROP: Sky blue (#A9C9E8).
CHARACTER NOTE: same man, with hair grown past the chin for this look.
PARTS:
- Hair: Half Bun: top half tied in a small bun at the back, lower half hanging loose.
- Beard: Heavy Stubble, 5 mm.
CALLOUTS:
1. Half bun: Top half tied up.
2. Heavy stubble: 5 mm.
3. Hair down: Lower half loose.
4. Relaxed finish: Soft texture.
```

### L37 Knot and Fade

```text
ITEM: L37 Knot and Fade
BACKDROP: Sage (#CADBD8).
CHARACTER NOTE: same man, with long hair on top for this look.
PARTS:
- Hair: Top Knot: long top tied in a knot at the crown, #1 sides and back.
- Beard: Faded Beard: 1 mm at the sideburns to 6 mm at the jaw, flowing into the short sides.
CALLOUTS:
1. Crown knot: Tied high.
2. Faded beard: Blends into the sides.
3. Short sides: Machine #1.
4. Clean cheek line: Tidy edges.
```

### L38 Korean Idol

```text
ITEM: L38 Korean Idol
BACKDROP: Sand (#D8CDBF).
PARTS:
- Hair: K-Pop Cut: soft layered top of about 8 cm with a light see-through fringe to the eyebrows, #3 sides tapering to #2.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. K-Pop Cut: Soft layers.
2. See-through fringe: To the eyebrows.
3. Clean face: No beard or moustache.
4. Glossy finish: Light wax.
```

### L39 Soft Perm Day

```text
ITEM: L39 Soft Perm Day
BACKDROP: Plum (#B06A8F).
PARTS:
- Hair: Shadow Perm: soft, subtle waves and root volume on an 8 cm top, light see-through fringe, #3 sides.
- Beard: Light Stubble, 1-2 mm.
CALLOUTS:
1. Shadow perm: Soft, subtle waves.
2. Light stubble: 1-2 mm.
3. Root volume: Natural body.
4. Tapered sides: Short and tidy.
```

### L40 Retro Greaser

```text
ITEM: L40 Retro Greaser
BACKDROP: Sage (#CADBD8).
PARTS:
- Hair: Greaser: shiny combed-back top of about 9 cm with a small front lift, #1 tight tapered sides.
- Beard: clean-shaven chin and cheeks.
- Moustache: Natural Full, about 6 mm, on the lip line.
CALLOUTS:
1. Greaser top: High and shiny.
2. Natural moustache: On the lip line.
3. Tight sides: Machine #1.
4. Clean chin: Shaved smooth.
```

### L41 Skater Mullet

```text
ITEM: L41 Skater Mullet
BACKDROP: Sand (#D8CDBF).
PARTS:
- Hair: High Mullet: sides faded high from #0 to #3, textured top of about 8 cm, long back of 12-15 cm to the collar.
- Beard: Heavy Stubble, 5 mm.
CALLOUTS:
1. High mullet: Long back, short sides.
2. High fade: Sides #0 to #3.
3. Heavy stubble: 5 mm.
4. Textured top: Messy and matte.
```

### L42 Soft Mullet

```text
ITEM: L42 Soft Mullet
BACKDROP: Plum (#B06A8F).
PARTS:
- Hair: Korean Mullet: soft layers, a thin wispy fringe to the eyebrows, back to the collar, #3 sides tapering to #2.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Korean mullet: Soft, layered.
2. Wispy fringe: Thin and light.
3. Clean face: No beard or moustache.
4. Tapered sides: #3 to #2.
```

### L43 Beach Casual

```text
ITEM: L43 Beach Casual
BACKDROP: Orange (#EC9465).
PARTS:
- Hair: Surfer Hair: loose natural waves about 12 cm on top, windswept, long sides over the ears.
- Beard: Light Stubble, 1-2 mm.
CALLOUTS:
1. Loose waves: Natural and beachy.
2. Light stubble: 1-2 mm.
3. Windswept top: Relaxed finish.
4. Long sides: Over the ears.
```

### L44 Fluffy Fresh

```text
ITEM: L44 Fluffy Fresh
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: Fluffy Hair: soft, airy top of about 7 cm with natural volume, gentle fringe, #3 tapered sides.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Fluffy top: Soft and airy.
2. Gentle fringe: To the eyebrows.
3. Clean face: No beard or moustache.
4. Tidy sides: Short and tapered.
```

### L45 Curly Clean

```text
ITEM: L45 Curly Clean
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: Curly Crop: short, tight curls of 3-4 cm on top, sides tapered from #2 to #1.
- Beard: Short Boxed Beard: 6 mm sides, 9 mm chin, sharp cheek lines, square corners.
CALLOUTS:
1. Curly crop: Short and defined.
2. Boxed beard: Sharp cheek lines.
3. Neat taper: #2 down to #1.
4. Clean edges: Hairline lined up.
```

### L46 Mahogany Part

```text
ITEM: L46 Mahogany Part
BACKDROP: Sage (#CADBD8).
PARTS:
- Hair: Off-Centre Part: 7 cm top with a part just off the middle, #3 sides tapering to #2.
- Colour: Mahogany: dark red-brown with a deep red shine.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Mahogany: Dark red-brown.
2. Off-centre part: Just off the middle.
3. Clean face: No beard or moustache.
4. Red shine: Glows in light.
```

### L47 Golden Fade

```text
ITEM: L47 Golden Fade
BACKDROP: Sand (#D8CDBF).
PARTS:
- Hair: Korean Fade: clean fade on the sides from #0 to #3, soft textured top of about 7 cm.
- Colour: Gold Blonde: warm, golden blonde like honey in sunlight.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Gold blonde: Warm and sunny.
2. Clean fade: #0 to #3.
3. Soft top: Textured, falls forward.
4. Clean face: No beard or moustache.
```

### L48 Charcoal Crop

```text
ITEM: L48 Charcoal Crop
BACKDROP: Plum (#B06A8F).
PARTS:
- Hair: Angular Fringe: short fringe cut at a sharp diagonal over #2 tapered sides.
- Colour: Charcoal Grey: dark, smoky grey with a cool blue undertone.
- Beard: Light Stubble, 1-2 mm.
CALLOUTS:
1. Charcoal grey: Dark and smoky.
2. Angled fringe: Sharp diagonal cut.
3. Light stubble: 1-2 mm.
4. Short sides: Machine #2.
```

### L49 Long and Layered

```text
ITEM: L49 Long and Layered
BACKDROP: Orange (#EC9465).
PARTS:
- Hair: Layered Long Cut: long hair below the shoulders with soft, even layers and face-framing layers to the chin.
- Beard: Full Beard: thick, about 4 cm at the chin, rounded, combed.
CALLOUTS:
1. Long layers: Soft movement.
2. Full beard: Thick and rounded.
3. Face-framing: Falls to the chin.
4. Healthy ends: Trimmed, no split ends.
```

### L51 Dark Brown Gentleman

```text
ITEM: L51 Dark Brown Gentleman
BACKDROP: Plum (#B06A8F).
PARTS:
- Hair: Classic Side Part: tapered sides, about 6 cm on top combed neatly to the side, light pomade shine.
- Beard: Full Beard: thick, about 4 cm at the chin, rounded, combed.
- Colour: Dark Brown on hair and beard, rich and natural.
CALLOUTS:
1. Dark brown: Hair and beard.
2. Full beard: Thick and rounded.
3. Side part: Neat and classic.
4. Warm and natural: Grey covered.
```

### L53 Mahogany Quiff

```text
ITEM: L53 Mahogany Quiff
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: Quiff: front about 8 cm lifted up and back, faded sides.
- Beard: Faded Beard: 1 mm at the sideburns to 6 mm at the jaw, flowing into the hair fade.
- Colour: Mahogany on hair and beard, dark red-brown with a deep red shine.
CALLOUTS:
1. Mahogany: Hair and beard.
2. Lifted quiff: Up and back.
3. Faded beard: Flows into the fade.
4. Red shine: Glows in light.
```

### L55 Silver Fox

```text
ITEM: L55 Silver Fox
BACKDROP: Sage (#CADBD8).
PARTS:
- Hair: Slick Back: 8-10 cm top combed straight back with shine; sides #2 tapering to #1.
- Beard: Full Beard: thick, about 4 cm at the chin, rounded, combed.
- Colour: Ash Grey / Silver on hair and beard, cool and even, eyebrows natural black.
CALLOUTS:
1. Silver grey: Hair and beard.
2. Slick back: Combed with shine.
3. Full beard: Thick and rounded.
4. Cool tone: No yellow.
```

### L57 Copper Ducktail

```text
ITEM: L57 Copper Ducktail
BACKDROP: Plum (#B06A8F).
PARTS:
- Hair: Undercut: 8 cm top swept back, #1 sides with a hard line.
- Beard: Ducktail: full beard with 9 mm sides and a longer chin of 4-6 cm shaped to a point.
- Colour: Copper on hair and beard, bright warm orange-brown.
CALLOUTS:
1. Copper: Hair and beard.
2. Ducktail beard: Pointed chin.
3. Undercut: Hard line, #1 sides.
4. Vivid in light: Warm orange-brown.
```

### L58 Burgundy Van Dyke

```text
ITEM: L58 Burgundy Van Dyke
BACKDROP: Orange (#EC9465).
PARTS:
- Hair: Pushed Back: 8 cm top with a soft matte finish, tapered sides.
- Beard: Van Dyke: pointed chin, separate moustache, shaved cheeks.
- Colour: Burgundy on hair, chin beard and moustache, deep wine red-violet.
CALLOUTS:
1. Burgundy: Hair and beard.
2. Van Dyke: Pointed chin, moustache.
3. Pushed back: Matte, 8 cm.
4. Clean cheeks: Shaved smooth.
```

### L60 Grey Blend Ivy

```text
ITEM: L60 Grey Blend Ivy
BACKDROP: Plum (#B06A8F).
PARTS:
- Hair: Ivy League: 4 cm top with a soft side part.
- Beard: Short Boxed Beard: 6 mm sides, 9 mm chin, natural salt-and-pepper.
- Colour: Grey Blending on hair and beard: grey softened into a natural mix, not hidden.
CALLOUTS:
1. Grey blending: Hair and beard.
2. Ivy League: Neat, with a part.
3. Boxed beard: Salt-and-pepper.
4. Natural mix: Soft, no hard roots.
```

### L61 Midnight Waves

```text
ITEM: L61 Midnight Waves
BACKDROP: Orange (#EC9465).
PARTS:
- Hair: Tousled Waves: loose natural waves about 9 cm on top, messy and textured, sides over the ears.
- Beard: Light Stubble, 1-2 mm.
- Colour: Dark Grape on hair and stubble, near-black with a deep violet shine.
CALLOUTS:
1. Dark grape: Hair and stubble.
2. Loose waves: Natural movement.
3. Violet shine: Shows in sunlight.
4. Light stubble: 1-2 mm.
```

### L62 Golden Touch

```text
ITEM: L62 Golden Touch
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: Middle Part: 8 cm top parted in the centre, falling softly to each side, tapered sides.
- Beard and moustache: fully clean-shaven.
- Colour: Golden Brown Highlights: fine golden-brown streaks through the top only, sides stay dark.
CALLOUTS:
1. Golden streaks: Fine, on top only.
2. Centre part: Even on both sides.
3. Natural sides: Left dark.
4. Clean face: No beard or moustache.
```

### L63 Caramel Waves

```text
ITEM: L63 Caramel Waves
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: Tousled Waves: loose natural waves about 9 cm on top, messy and textured, sides over the ears.
- Beard: Light Stubble, 1-2 mm.
- Colour: Caramel Highlights: fine warm caramel streaks through the top only.
CALLOUTS:
1. Caramel streaks: Warm, on top.
2. Loose waves: Natural movement.
3. Light stubble: 1-2 mm.
4. Soft blend: Not chunky.
```

### L64 Ash Streak Idol

```text
ITEM: L64 Ash Streak Idol
BACKDROP: Sage (#CADBD8).
PARTS:
- Hair: K-Pop Cut: soft layered top of about 8 cm with a light see-through fringe to the eyebrows, #3 sides tapering to #2.
- Beard and moustache: fully clean-shaven.
- Colour: Ash Highlights: fine cool ash-grey streaks through the top only.
CALLOUTS:
1. Ash streaks: Cool and fine.
2. K-Pop Cut: Soft layers.
3. See-through fringe: To the eyebrows.
4. Clean face: No beard or moustache.
```

### L65 Wine Streaks

```text
ITEM: L65 Wine Streaks
BACKDROP: Sand (#D8CDBF).
PARTS:
- Hair: Wolf Cut: shaggy layers, messy fringe, longer back to the collar.
- Beard and moustache: fully clean-shaven.
- Colour: Burgundy Highlights: fine deep wine-red streaks through the top only.
CALLOUTS:
1. Burgundy streaks: Deep and fine.
2. Wolf cut: Shaggy layers.
3. Messy fringe: Soft and loose.
4. Clean face: No beard or moustache.
```

### L66 Salt and Pepper Taper

```text
ITEM: L66 Salt and Pepper Taper
BACKDROP: Plum (#B06A8F).
PARTS:
- Hair: Taper Fade: #3 sides with skin only at the sideburns and nape, 5 cm top.
- Beard: Heavy Stubble, 5 mm.
- Colour: Grey Blending on hair and stubble: grey softened into a natural salt-and-pepper mix, not hidden.
CALLOUTS:
1. Grey blending: Hair and stubble.
2. Taper fade: Small and clean.
3. Heavy stubble: 5 mm.
4. Natural mix: Soft, no hard roots.
```

### L67 Sun-Kissed Surfer

```text
ITEM: L67 Sun-Kissed Surfer
BACKDROP: Orange (#EC9465).
PARTS:
- Hair: Surfer Hair: loose natural waves about 12 cm on top, windswept, long sides over the ears.
- Beard: Heavy Stubble, 5 mm.
- Colour: Caramel Highlights: fine warm caramel streaks through the top only.
CALLOUTS:
1. Caramel streaks: Sun-kissed, on top.
2. Beach waves: Loose and windswept.
3. Heavy stubble: 5 mm.
4. Long sides: Over the ears.
```

### L68 Crop and Box

```text
ITEM: L68 Crop and Box
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: French Crop: 4 cm choppy top pushed forward, short fringe, sides #1 to #3.
- Beard: Short Boxed Beard: 6 mm sides, 9 mm chin, sharp razor cheek lines.
CALLOUTS:
1. Choppy crop: Pushed forward.
2. Short fringe: Above the brows.
3. Boxed beard: 6 mm and 9 mm.
4. Sharp lines: Razor cheek line.
```

### L69 Barbershop Comb Over

```text
ITEM: L69 Barbershop Comb Over
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: Comb Over Fade: mid fade #0 to #2, 6 cm top combed to one side, thin shaved part, polished shine.
- Beard: Short Boxed Beard: 6 mm sides, 9 mm chin, sharp cheek lines.
CALLOUTS:
1. Shaved part: Thin line above the brow.
2. Comb over: 6 cm swept to the side.
3. Mid fade: #0 to #2.
4. Boxed beard: 6 mm and 9 mm.
```

### L70 Fade Pomp

```text
ITEM: L70 Fade Pomp
BACKDROP: Orange (#EC9465).
PARTS:
- Hair: Pompadour: rounded height, about 10 cm at the front and 6 cm at the back, swept up and back with pomade shine; sides faded #1 to #3.
- Beard: Faded Beard: 1 mm at the sideburns blending to 6 mm along the jaw and chin.
CALLOUTS:
1. Big height: Rounded volume.
2. Pomade shine: Smooth finish.
3. Faded sides: Tight and clean.
4. Faded beard: Flows from the fade.
```

### L71 Curtain Casual

```text
ITEM: L71 Curtain Casual
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: Curtain Fringe: 8 cm straight hair, centre parted, fringe falling past the brows; sides tapered tidy.
- Beard: Light Stubble, 1–2 mm.
CALLOUTS:
1. Centre part: Even on both sides.
2. Soft curtains: Fall past the brows.
3. Tapered sides: Tidy and short.
4. Light stubble: 1–2 mm.
```

### L72 Easy Broccoli

```text
ITEM: L72 Easy Broccoli
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: Broccoli Cut: full rounded top about 8 cm with light layers, soft fringe to the eyebrows, tapered sides at #2.
- Beard: Light Stubble, 1–2 mm.
CALLOUTS:
1. Rounded top: Full and soft.
2. Soft fringe: To the brows.
3. Tapered sides: #2.
4. Light stubble: 1–2 mm.
```

### L73 Mid Fade Daily

```text
ITEM: L73 Mid Fade Daily
BACKDROP: Sage (#CADBD8).
PARTS:
- Hair: Mid Fade: fade from the temple, bare skin blending through #1 to #3, top about 5 cm pushed up and to the side.
- Beard: Heavy Stubble, 5 mm.
CALLOUTS:
1. Mid fade: Starts at the temple.
2. Textured top: 5 cm, pushed up.
3. Heavy stubble: 5 mm.
4. Clean edges: Ears and neck.
```

### L74 Drop Fade Beard

```text
ITEM: L74 Drop Fade Beard
BACKDROP: Sand (#D8CDBF).
PARTS:
- Hair: Drop Fade: fade curving behind the ear and dropping low at the back, skin blending through #1 to #3, textured top about 6 cm.
- Beard: Full Beard: about 4 cm at the chin, 12 mm on the sides, rounded bottom, combed and lightly oiled.
CALLOUTS:
1. Drop fade: Curves behind the ear.
2. Textured top: About 6 cm.
3. Full beard: About 4 cm.
4. Neat neckline: Two fingers up.
```

### L75 Slick and Faded

```text
ITEM: L75 Slick and Faded
BACKDROP: Plum (#B06A8F).
PARTS:
- Hair: Slick Back: sides #2 tapering to #1 at the neck, 8–10 cm top combed straight back with a smooth shine.
- Beard: Faded Beard: 1 mm at the sideburns blending to 6 mm along the jaw and chin.
CALLOUTS:
1. Slick back: Combed straight back.
2. Smooth shine: Pomade finish.
3. Tapered sides: Tight and neat.
4. Faded beard: Blends into the hair.
```

### L76 Flow and Stubble

```text
ITEM: L76 Flow and Stubble
BACKDROP: Orange (#EC9465).
PARTS:
- Hair: Bro Flow: 14 cm hair swept back off the forehead and flowing over the ears, light layers, natural shine.
- Beard: Heavy Stubble, 5 mm.
CALLOUTS:
1. Swept back: Off the forehead.
2. Flowing length: Over the ears.
3. Light layers: Soft shape.
4. Heavy stubble: 5 mm.
```

### L77 Burst Fade Beard

```text
ITEM: L77 Burst Fade Beard
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: Burst Fade: fade curving in a half circle around the ear, bare skin at the ear blending to #3, back left longer at #4, top about 6 cm.
- Beard: Short Boxed Beard: 6 mm sides, 9 mm chin, sharp cheek lines.
CALLOUTS:
1. Burst fade: Half circle at the ear.
2. Longer back: #4.
3. Textured top: About 6 cm.
4. Boxed beard: 6 mm and 9 mm.
```

### L78 Afro Taper

```text
ITEM: L78 Afro Taper
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: Tapered Afro: tight curls about 5 cm on top picked into a short full shape, sides and nape tapered #3 to #1, neat edge-up.
- Beard: Short Boxed Beard: 6 mm sides, 9 mm chin, sharp cheek lines.
CALLOUTS:
1. Defined curls: Even and full.
2. Taper: #3 down to #1.
3. Edge-up: Sharp hairline.
4. Boxed beard: 6 mm and 9 mm.
```

### L79 Modern Mullet Casual

```text
ITEM: L79 Modern Mullet Casual
BACKDROP: Sage (#CADBD8).
PARTS:
- Hair: Modern Mullet: low fade on the sides, textured top about 6 cm with a short messy fringe, 9–10 cm at the back blended into the top.
- Beard: Light Stubble, 1–2 mm.
CALLOUTS:
1. Low fade: Short sides.
2. Messy fringe: Short and loose.
3. Longer back: 9–10 cm.
4. Light stubble: 1–2 mm.
```

### L80 Wolf and Stubble

```text
ITEM: L80 Wolf and Stubble
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: Wolf Cut: shaggy layers, messy fringe, longer back to the collar.
- Beard: Light Stubble, 1–2 mm.
CALLOUTS:
1. Shaggy layers: Messy and light.
2. Soft fringe: Loose over the brows.
3. Longer back: To the collar.
4. Light stubble: 1–2 mm.
```

### L81 Bleached Curtains

```text
ITEM: L81 Bleached Curtains
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: Curtain Fringe: 8 cm straight hair, centre parted, fringe falling past the brows; sides tapered tidy.
- Beard and moustache: fully clean-shaven.
- Colour: Platinum Blonde: bleached and toned, an even bright blonde from root to tip.
CALLOUTS:
1. Platinum blonde: Bleached and toned.
2. Centre part: Even on both sides.
3. Soft curtains: Fall past the brows.
4. Clean face: No beard or moustache.
```

### L82 Platinum Buzz

```text
ITEM: L82 Platinum Buzz
BACKDROP: Sage (#CADBD8).
PARTS:
- Hair: Buzz Cut: same length all over, #2, with a clean neck line.
- Beard: Light Stubble, 1–2 mm.
- Colour: Platinum Blonde: bleached and toned, an even bright blonde all over.
CALLOUTS:
1. Platinum buzz: Bleached and toned.
2. Even length: One guard all over.
3. Light stubble: 1–2 mm.
4. Clean edges: Neck and ears.
```

### L83 Modern Slick

```text
ITEM: L83 Modern Slick
BACKDROP: Sand (#D8CDBF).
PARTS:
- Hair: Slick Back: sides #2 tapering to #1 at the neck, 8–10 cm top combed straight back with a smooth shine.
- Beard: Heavy Stubble, 5 mm.
CALLOUTS:
1. Slick back: Combed straight back.
2. Smooth shine: Pomade finish.
3. Tapered sides: Tight and neat.
4. Heavy stubble: 5 mm.
```

### L84 Anchor Fade

```text
ITEM: L84 Anchor Fade
BACKDROP: Plum (#B06A8F).
PARTS:
- Hair: Skin Fade: skin to #3 on the sides, textured top about 6 cm.
- Beard: Anchor Beard: a pointed chin beard joined to the moustache, cheeks clean.
CALLOUTS:
1. Skin fade: Clean and smooth.
2. Anchor beard: Chin beard and moustache.
3. Defined jaw: Sharp lines.
4. Textured top: Natural finish.
```

### L85 Blowout and Beard

```text
ITEM: L85 Blowout and Beard
BACKDROP: Orange (#EC9465).
PARTS:
- Hair: Blowout Taper: full, lifted top of about 8 cm blow-dried up and back; sides tapered #2 to #1.
- Beard: Short Boxed Beard: 6 mm sides, 9 mm chin, sharp cheek lines.
CALLOUTS:
1. Full volume: Blow-dried up and back.
2. Taper: #2 down to #1.
3. Boxed beard: 6 mm and 9 mm.
4. Clean neck: Sharp line.
```

### L86 Korean Ivy

```text
ITEM: L86 Korean Ivy
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: Korean Ivy League: short top with a soft side part and light texture, tidy tapered sides.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Soft part: Side swept.
2. Light texture: Not stiff.
3. Tidy sides: Short and neat.
4. Clean face: No beard or moustache.
```

### L87 Garma Classic

```text
ITEM: L87 Garma Classic
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: Garma Perm: 9 cm top parted in the centre, soft waves falling to each side, sides #3 to #2.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Centre part: Slightly off-centre.
2. Soft waves: Fall to both sides.
3. Tidy sides: #3 to #2.
4. Clean face: No beard or moustache.
```

### L88 Iron Perm Stubble

```text
ITEM: L88 Iron Perm Stubble
BACKDROP: Sage (#CADBD8).
PARTS:
- Hair: Iron Perm: 9 cm soft layers with loose gentle bends and root lift, light fringe, sides #3 to #2.
- Beard: Light Stubble, 1–2 mm.
CALLOUTS:
1. Root lift: Soft volume.
2. Gentle bends: Loose, not curly.
3. Light fringe: To the brows.
4. Light stubble: 1–2 mm.
```

### L89 Shaggy Casual

```text
ITEM: L89 Shaggy Casual
BACKDROP: Sand (#D8CDBF).
PARTS:
- Hair: Shaggy Cut: choppy layers through the top and sides, loose fringe, natural movement.
- Beard: Light Stubble, 1–2 mm.
CALLOUTS:
1. Choppy layers: Loose and messy.
2. Easy flow: Falls naturally.
3. Light stubble: 1–2 mm.
4. Natural finish: Matte.
```

### L90 Low Fade Quiff Daily

```text
ITEM: L90 Low Fade Quiff Daily
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: Low Fade Quiff: low fade just above the ear, top about 8 cm lifted up and back.
- Beard: Heavy Stubble, 5 mm.
CALLOUTS:
1. Lifted front: Blown up and back.
2. Low fade: Starts above the ear.
3. Heavy stubble: 5 mm.
4. Clean blend: Fade into the top.
```

### L91 Messy Quiff Fade

```text
ITEM: L91 Messy Quiff Fade
BACKDROP: Sage (#CADBD8).
PARTS:
- Hair: Textured Quiff: top about 8 cm lifted up and back with loose matte texture, sides #2 to #1.
- Beard: Faded Beard: 1 mm at the sideburns blending to 6 mm along the jaw and chin.
CALLOUTS:
1. Loose lift: Up and back.
2. Matte texture: No shine.
3. Faded beard: Blends into the hair.
4. Tapered sides: #2 to #1.
```

### L92 Blonde Fringe

```text
ITEM: L92 Blonde Fringe
BACKDROP: Sand (#D8CDBF).
PARTS:
- Hair: Textured Fringe: choppy fringe to the eyebrows, tapered sides.
- Beard and moustache: fully clean-shaven.
- Colour: Light Blonde: lightened and toned to a soft, even light blonde.
CALLOUTS:
1. Light blonde: Soft and even.
2. Textured fringe: Choppy, to the brows.
3. Tapered sides: Short and neat.
4. Clean face: No beard or moustache.
```

### L93 Buzz Fade Beard

```text
ITEM: L93 Buzz Fade Beard
BACKDROP: Plum (#B06A8F).
PARTS:
- Hair: Buzz Fade: #2 on top, fading from skin at the sides.
- Beard: Full Beard: about 4 cm at the chin and 12 mm on the sides, combed and lightly oiled.
CALLOUTS:
1. Buzz fade: Short and clean.
2. Full beard: About 4 cm.
3. Neat neckline: Two fingers up.
4. Strong contrast: Short top, full beard.
```

### L94 Comma Casual

```text
ITEM: L94 Comma Casual
BACKDROP: Orange (#EC9465).
PARTS:
- Hair: Comma Hair: soft fringe about 8 cm, curled into a comma shape over the forehead; tidy tapered sides.
- Beard: Light Stubble, 1–2 mm.
CALLOUTS:
1. Comma fringe: Curls in at the brow.
2. Soft volume: Lifted at the front.
3. Tidy sides: Short and neat.
4. Light stubble: 1–2 mm.
```

### L95 Down Perm Clean

```text
ITEM: L95 Down Perm Clean
BACKDROP: Blush (#F7D9CE).
PARTS:
- Hair: Down Perm: sides permed to lie flat against the head, top about 6 cm with natural lift; tidy neck line.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Flat sides: Perm keeps them down.
2. Top volume: Natural lift.
3. Tidy neck: Clean line.
4. Clean face: No beard or moustache.
```

### L96 Dandy Stubble

```text
ITEM: L96 Dandy Stubble
BACKDROP: Sky blue (#A9C9E8).
PARTS:
- Hair: Dandy Cut: soft volume on top, swept to the side with a gentle curve; tidy tapered sides.
- Beard: Light Stubble, 1–2 mm.
CALLOUTS:
1. Soft volume: Lifted and airy.
2. Side sweep: A gentle curve.
3. Tidy sides: Short and neat.
4. Light stubble: 1–2 mm.
```

### L97 Ash Two-Block

```text
ITEM: L97 Ash Two-Block
BACKDROP: Sage (#CADBD8).
PARTS:
- Hair: Two-Block: short sides at #2, longer top about 8 cm with a soft fringe.
- Beard and moustache: fully clean-shaven.
- Colour: Ash Highlights: fine cool grey-ash streaks through the top only.
CALLOUTS:
1. Ash highlights: Fine, on top only.
2. Two-block: Short sides, long top.
3. Soft fringe: Falls to the brows.
4. Clean face: No beard or moustache.
```

### L98 C-Curl Sweet

```text
ITEM: L98 C-Curl Sweet
BACKDROP: Sand (#D8CDBF).
PARTS:
- Hair: C-Curl Perm: top about 8–9 cm with the ends and fringe curling gently inward in a C shape; sides #3 to #2.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. C-curve ends: Curl inward.
2. Soft fringe: To the brows.
3. Tidy sides: #3 to #2.
4. Clean face: No beard or moustache.
```

### L99 Baby Perm Fresh

```text
ITEM: L99 Baby Perm Fresh
BACKDROP: Plum (#B06A8F).
PARTS:
- Hair: Baby Perm: top about 6 cm of small, soft, loose curls with airy volume and a short fringe; sides #3 to #2.
- Beard and moustache: fully clean-shaven.
CALLOUTS:
1. Small curls: Soft and loose.
2. Airy volume: Fluffy top.
3. Short fringe: Above the brows.
4. Clean face: No beard or moustache.
```
