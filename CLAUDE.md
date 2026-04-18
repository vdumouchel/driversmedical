@AGENTS.md

# Thematic template — Claude Code guide

This repo is a **duplicable telemedicine template**. The container (routing, layout, intake engine, components, stores) is shared across all thematics. Each thematic (driver's medical, UTI, accessible parking permit, …) lives in its own cloned repo and only edits a small, well-defined surface.

## Architecture at a glance

```
EDIT PER THEMATIC                              NEVER TOUCH (container shell)
─────────────────                              ─────────────────────────────
src/config/brand.ts     site identity          src/components/**
src/config/theme.ts     color tokens           src/app/**
src/config/provinces.ts province registry      src/stores/**
src/content/*.ts        marketing copy         src/lib/i18n-utils.ts
src/schemas/*.ts        intake form fields     src/lib/province-from-geo.ts
src/locales/en.po       UI string i18n         next.config.ts, tsconfig.json
src/locales/fr.po       UI string i18n (fr)    tailwind.config.ts
public/images/**        brand images
```

## When the user asks to "start a new thematic" or "duplicate this repo"

Work through these steps in order. Verify `pnpm dev` stays green after each one.

### 1. Brand identity — `src/config/brand.ts`

Replace `siteName`, `siteDomain`, `contact.email`, `contact.hoursLabel`, `footer.tagline`, `footer.bottomNote`, and `metadata.title`/`metadata.description` (en + fr). Swap `logoIcon` for a different Lucide icon (`import { IconName } from "lucide-react"`). This one file propagates to header, footer, intake layout, and `<meta>` tags automatically.

### 2. Theme colors — `src/config/theme.ts`

Edit the `light` and `dark` objects. All values are OKLCh strings (e.g. `"oklch(0.55 0.18 250)"`). The `themeStyleSheet()` function injects them as CSS variables at runtime — no build step, HMR works immediately. Key tokens to change per thematic: `primary`, `primaryForeground`, `secondary`, `accent`, `background`, `foreground`.

### 3. Images — `public/images/`

Replace `hero-driver.jpg`, `doctor.webp`, `testimonial-*.jpg` with thematic images. Keep filenames or update the paths in `src/content/hero.ts`, `src/content/doctor.ts`, `src/content/testimonials.ts`.

### 4. Marketing copy — `src/content/*.ts`

Each file exports an `{ en, fr }` object consumed by the matching homepage component via `pickLocale(value, lang)`. Rewrite in this order:

| File | Component it feeds |
|---|---|
| `src/content/hero.ts` | `HeroSection` |
| `src/content/benefits.ts` | `BenefitsSection` |
| `src/content/how-it-works.ts` | `HowItWorksSection` |
| `src/content/doctor.ts` | `DoctorSection` |
| `src/content/testimonials.ts` | `TestimonialsSection` |
| `src/content/faq.ts` | `FaqSection` |
| `src/content/pricing.ts` | `PricingSection` |
| `src/content/intake.ts` | Province selector, summary page |
| `src/content/site.ts` | Header nav, footer links |

Keep the existing TypeScript shape of each export — the components read specific keys. Only change the string values.

### 5. Province registry — `src/config/provinces.ts`

Set `available: true` for each province this thematic serves. For each active province provide:

- `priceCad` — price in CAD
- `formCode` — provincial form code shown in the selector (or omit if none)
- `turnaround: { en, fr }` — shown in the hero badge and benefits
- `pricingFeatures: { en, fr }` — bullet list in the pricing card
- `schema` — import from `src/schemas/<slug>.ts`

Provinces with `available: false` appear in the "coming soon" grid automatically.

### 6. Intake form schemas — `src/schemas/`

For each active province, rewrite `src/schemas/<slug>.ts` with the new thematic's intake questions. The intake engine is generic — it renders any `ProvinceSchema` shape from `src/schemas/types.ts`. Do not change the schema type definition, only the field arrays inside each province file.

### 7. UI strings — `src/locales/en.po` / `fr.po`

Only needed if you change any `t\`...\`` or `msg\`...\`` strings inside `src/components/**`. After editing `.po` files run:

```
pnpm lingui:extract && pnpm lingui:compile
```

## Adding a province to an existing thematic

1. Create `src/schemas/<slug>.ts` following the existing province files as a model.
2. In `src/config/provinces.ts`, add the province entry with `available: true` and import the schema.
3. No other code change required — the selector, geo-detection, and intake flow all read from the registry dynamically.

## Changing colors

Edit `src/config/theme.ts`. With the dev server running, saving the file triggers HMR and the page updates immediately — the tokens are injected via `<style id="theme-tokens">` in the root layout.

## Key utilities to know

- `pickLocale(value, lang)` — selects `value.en` or `value.fr` based on current language. Used everywhere in components.
- `provinceList` — array of all provinces from the registry; filter `p.available` for active ones.
- `getProvince(slug)` — returns a single province entry or `null`.
- `getProvinceSchema(slug)` — returns the province's `ProvinceSchema` or `null`.
- `isValidProvince(slug)` — returns `true` only if the province exists and is available.

## What NOT to do

- Do not edit files under `src/components/**`, `src/app/**`, or `src/stores/**` as part of a thematic duplication — those are the shared container.
- Do not add thematic-specific logic inside components. If a content value needs to vary, add it to the appropriate `src/content/*.ts` file.
- Do not hardcode strings inside components — put them in content files (marketing copy) or `.po` files (UI strings).

## Full duplication reference

See `TEMPLATE.md` for the complete step-by-step bootstrap guide including the Vercel deployment step.
