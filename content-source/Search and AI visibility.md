# Search and AI visibility (SEO, AEO, GEO)

Every style, Ready Look and Learn post gets its own public web page. That way the content that helps customers in the shop can also be found on Google and quoted by AI assistants. Google's own guidance says optimising for AI search is still SEO: original, helpful pages that Google can crawl and index ([Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)).

## SEO, AEO and GEO in one table

|  | What it aims for | What we do on every page |
| --- | --- | --- |
| SEO | Rank in Google search | One topic per page, a clear title, a clean URL, links between related pages, a fast mobile page |
| AEO | Be the direct answer in snippets, voice search and AI Overviews | Title as the question, a 40–60 word answer first, question headings, short lists and tables |
| GEO | Be quoted by AI assistants such as ChatGPT, Gemini, Perplexity and Google AI Mode | Specific numbers, cited sources, our barbers' own experience, the same names everywhere, Nepal context |

Why GEO adds numbers and sources: a study led by Princeton researchers found that adding citations, quotations and statistics raised a page's visibility in AI answers by up to 40% ([Aggarwal et al.](https://arxiv.org/html/2311.09735v3)).

## Rules for every page

1. **One page, one question.** Write the title in the words people search, about 60 characters: "Fade vs taper: what is the difference?"
2. **Answer first.** A 40–60 word Short answer under the title that makes sense on its own.
3. **Question headings.** Section headings are questions customers ask, with 2–4 sentences, a short list or a table under each.
4. **Numbers, not adjectives.** Weeks, minutes, mm, machine numbers, shade levels.
5. **Cite health and safety facts.** Link the source in the sentence, such as the NHS or a dermatologist.
6. **Add our own experience.** Each post has a "From the chair" tip. Replace it with a real line from one of your barbers, with their name and permission. Google says first-hand, original content matters more than any other tactic.
7. **Show who checked it.** "Checked by \[barber name\], \[X\] years barbering" and "Updated \[date\]" on every post.
8. **Same names everywhere.** Use catalogue names exactly (Low Fade, Short Boxed Beard). Other names go in Also called.
9. **Link 2–4 related pages.** Posts link to styles; style pages link back to 1–2 posts.
10. **One clear photo with real alt text,** for example "Low fade haircut, side view, short top".
11. **Local context.** Nepal, Kathmandu, Dashain, Tihar, wedding season, and prices in NPR once added.
12. **No near-copies.** Don't make pages like "low fade Kathmandu" and "low fade Lalitpur" with the same text. Google treats pages mass-produced to catch search variations as scaled content abuse.

## Page setup (for the developer)

- **Public URLs, one per page:** /styles/low-fade, /beards/short-boxed-beard, /moustaches/chevron, /colours/natural-black, /looks/office-ready, /learn/fade-vs-taper. Nepali and Hindi versions sit under /ne/ and /hi/, linked with hreflang tags.
- **Text in the HTML.** Pre-render pages (server-side or static). The in-shop app can stay a fast web app, but content must not sit behind a login or load only through scripts.
- **Indexable with a snippet.** No noindex or nosnippet on content pages. Google only uses pages in its AI features if they are indexed and eligible for a snippet, and the site is included for generative AI features in Search Console.
- **Structured data (JSON-LD) that matches the visible text.** Article and BreadcrumbList on posts, style pages and Look pages. HairSalon (a local business type) on each shop page, with address, hours, phone and map location.
- **FAQ and HowTo markup are optional.** Google stopped showing FAQ rich results on 7 May 2026, and HowTo rich results in 2023. FAQ markup does no harm, so keep the question-and-answer text on the page and write steps as plain numbered lists.
- **No llms.txt needed for Google.** Google says Search ignores it. Add one only if another service you care about uses it.
- **Crawler access.** Allow Googlebot in robots.txt. Decide whether to allow other AI crawlers, such as OpenAI's GPTBot and PerplexityBot. Blocking them means those assistants can't read or cite your pages.
- **Sitemap** with every page and language version, submitted in Search Console.
- **Fast on low-cost phones.** WebP photos, lazy loading below the first screen, mobile-first layout.
- **Google Business Profile** for each partner shop, linked to its shop page, with current hours and photos. Google names this as a source for AI answers about local businesses.
- **Measure** with the Generative AI performance report in Search Console.

## FAQs on style pages

Every style and colour now has 3–5 written FAQs in its tab, and its page shows them in full, as real questions with short answers. For items added later, build a starter FAQ from these fields until written ones are ready.

| Question on the page | Answer taken from |
| --- | --- |
| Who does a \[Style\] suit? | Pick this if, plus Suits |
| Who should skip a \[Style\]? | Skip if |
| How long does a \[Style\] take each day? | Daily |
| How often do I need a barber for a \[Style\]? | Next barber visit |
| How do I ask my barber for a \[Style\]? | First 3 barber steps, plus "show this page to your barber" |
| What else is a \[Style\] called? | Also called |

- **Title:** \[Style\]: who it suits and how to ask your barber
- **Meta description (up to 155 characters):** \[Short line\] Suits \[face shapes\]. \[Daily\]. Next cut in \[weeks\].
- **Image alt text:** \[Style\], \[main photo angle\] view

## Starter keyword map

| What people search | Page |
| --- | --- |
| what is my face shape men | /learn/face-shape-guide |
| fade vs taper | /learn/fade-vs-taper |
| low vs mid vs high fade | /learn/which-fade |
| haircut for round face men | /learn/haircuts-for-round-face |
| haircut for thin hair men | /learn/haircuts-for-thin-hair |
| clipper guard numbers | /learn/clipper-numbers |
| how often should men get a haircut | /learn/how-often-haircut |
| how to trim beard neck line | /learn/beard-neck-line |
| beard styles for patchy beard | /learn/patchy-beard-styles |
| how to cover grey hair men | /learn/cover-grey-hair |
| henna vs hair dye | /learn/henna-vs-hair-dye |
| wax vs gel vs clay vs pomade | /learn/hair-products-guide |
| hairstyles for helmet | /learn/helmet-hair |
| barber near \[area\] | Each shop page |

Check real search demand in Nepal before adding more pages: use Search Console data after launch. Have a native speaker write the Nepali and Hindi versions rather than translating word for word.

## Sources

- [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), Google Search Central, updated 10 July 2026
- [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), Google Search Central
- [Google drops FAQ rich results from Search](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/), Search Engine Journal, 10 May 2026
- [GEO: Generative Engine Optimization](https://arxiv.org/html/2311.09735v3), Aggarwal et al., KDD 2024
