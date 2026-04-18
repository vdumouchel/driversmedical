# Thematic Template Playbook

This repo is a template for telemedicine websites. The container (routing, layout, intake engine, components) stays the same across thematics. Spinning up a new thematic (e.g., UTI, accessible parking permits) means cloning this repo and editing a small, well-defined surface.

## What to edit when duplicating

| Concern | File(s) |
|---|---|
| Site name, domain, contact, metadata, logo icon | [src/config/brand.ts](src/config/brand.ts) |
| Color tokens (light + dark) | [src/config/theme.ts](src/config/theme.ts) |
| Province registry (which provinces, pricing, turnaround, features, form schema mapping) | [src/config/provinces.ts](src/config/provinces.ts) |
| Marketing copy (hero, benefits, how it works, doctor, testimonials, faq, pricing) | [src/content/](src/content/) |
| Intake form fields per province | [src/schemas/](src/schemas/) (one file per province) |
| UI strings (button labels, nav, intake flow) | [src/locales/en.po](src/locales/en.po), [src/locales/fr.po](src/locales/fr.po) |
| Logo + hero + doctor + testimonial images | [public/images/](public/images/) |

## What NOT to edit

The container should stay the same across thematics. Leave these alone unless you're improving the container itself (in which case propagate the change to every thematic):

- `src/app/**` — routes, root layout, globals.css structural rules
- `src/components/**` — all presentational components, intake engine (field-renderer, question-flow, summary-view)
- `src/stores/**` — Zustand intake store
- `src/lib/i18n*`, `src/lib/utils.ts`, `src/lib/province-from-geo.ts`
- `next.config.ts`, `tsconfig.json`, `package.json`, Tailwind config

## Step-by-step: bootstrap a new thematic

1. **Clone.** `git clone <this-repo> <new-thematic>` and `cd` into it. Remove the old `.git` and `git init` fresh if you want a clean history.
2. **Brand.** Edit [src/config/brand.ts](src/config/brand.ts). Change `siteName`, `siteDomain`, `metadata.title`, `metadata.description`, `contact.email`, `contact.hoursLabel`, `footer.tagline`, `footer.bottomNote`. Swap `logoIcon` for a different Lucide icon (or replace with a bespoke `<svg>` component).
3. **Theme colors.** Edit [src/config/theme.ts](src/config/theme.ts). The `light` and `dark` objects contain OKLCh color values that are injected as CSS variables at runtime by the root layout. Change `primary`, `background`, `secondary`, etc. to match the new thematic's palette.
4. **Images.** Replace files in [public/images/](public/images/) — `hero-driver.jpg`, `doctor.webp`, `testimonial-*.jpg` — with thematic-appropriate images. Keep filenames OR update the paths in `src/content/hero.ts`, `src/content/doctor.ts`, `src/content/testimonials.ts`.
5. **Marketing copy.** Rewrite the files in [src/content/](src/content/) — each exports an `{ en, fr }` object consumed directly by the matching homepage component. Start with `hero.ts`, `benefits.ts`, `faq.ts`, `how-it-works.ts`, `doctor.ts`, `testimonials.ts`, `pricing.ts`.
6. **Provinces.** Edit [src/config/provinces.ts](src/config/provinces.ts). Set `available: true` for each province this thematic will serve, and provide `priceCad`, `formCode`, `turnaround` ({ en, fr }), `pricingFeatures` ({ en, fr }), and a `schema` import.
7. **Form schemas.** For each active province, rewrite the matching file in [src/schemas/](src/schemas/) with the new thematic's intake questions (replace `quebec.ts` and `new-brunswick.ts`, or add new province files and import them in `provinces.ts`). Keep the `ProvinceSchema` shape from `src/schemas/types.ts`.
8. **UI strings.** Search and update any thematic-specific strings that still live in [src/locales/en.po](src/locales/en.po) / [src/locales/fr.po](src/locales/fr.po) (intake flow labels, summary page labels). Run `pnpm lingui:extract && pnpm lingui:compile` after changing any `msg`/`t` macros in components.
9. **Verify.**
   - `pnpm dev` — walk the homepage at `/en` and `/fr`, check header, hero, benefits, pricing, FAQ.
   - Walk the intake flow at `/en/intake` → pick a province → complete to `/summary`.
   - `pnpm build` should pass cleanly.
10. **Ship.** Create a new Vercel project, point the thematic's domain at it, set `DEV_GEO_PROVINCE` locally if you need to emulate a specific province on a non-Canadian IP.

## Tips

- **Adding a new province to an existing thematic:** create `src/schemas/<slug>.ts`, import it in `provinces.ts`, set `available: true` and fill in pricing/turnaround/features. No other code change required.
- **Changing colors while running the dev server:** the tokens are injected via a `<style>` tag that re-renders on HMR — save `src/config/theme.ts` and the page updates immediately.
- **Dark mode tokens:** the `.dark` variant is still wired up in `src/config/theme.ts`. If you're not using dark mode in a given thematic, leave it as-is — it's harmless.
- **Images path convention:** the component content files reference absolute `/images/...` paths. Swapping image files in place keeps the refs working.
