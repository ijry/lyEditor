# Homepage Professional Redesign Design

## Context

Current docs home pages (`/` and `/en/`) are text-heavy and lack a product-grade presentation layer.  
Goal is to redesign the docs homepage to a professional, marketing-oriented landing style (reference: lyshop docs style direction), while preserving existing VitePress information architecture and bilingual routes.

User-confirmed direction:

- Homepage style: marketing presentation
- Primary value proposition: enterprise extensibility + plugin ecosystem
- Trust section: ecosystem integrations + comparative advantages
- CTA strategy:
  - Primary CTA: Getting Started
  - Secondary CTA: https://ijry.github.io/lyEditor/
- Demo position: immediately below Hero
- Implementation approach: full custom home page component (Option 2)

## Goals

1. Deliver a professional, productized homepage experience for both Chinese and English docs.
2. Keep bilingual consistency through one shared component architecture.
3. Preserve current doc route structure and sidebar/nav behavior.
4. Keep GitHub Pages project-path deployment compatibility (`/lyEditor/`).

## Non-Goals

1. No changes to guide/backend content pages.
2. No changes to editor runtime architecture or plugin runtime behavior.
3. No redesign of all VitePress inner documentation pages.

## Architecture

Use a dedicated homepage component layer inside VitePress theme:

- `HomeLanding.vue` as full landing shell
- `home-content.ts` as locale-driven structured content source
- `home.css` as isolated homepage visual system
- Existing `HomeEditorDemo.vue` embedded in landing flow

Markdown homepage files become thin wrappers that mount `HomeLanding`.

## Component & File Plan

### New Files

1. `docs-site/.vitepress/theme/components/HomeLanding.vue`
2. `docs-site/.vitepress/theme/components/home-content.ts`
3. `docs-site/.vitepress/theme/home.css`

### Updated Files

1. `docs-site/.vitepress/theme/index.ts`
2. `docs-site/index.md`
3. `docs-site/en/index.md`

## Homepage Information Architecture

For both locales (`zh-CN`, `en-US`), section order is fixed:

1. Hero
2. Built-in editor demo (directly below Hero)
3. Ecosystem credibility section (framework + storage + engineering ecosystem)
4. Comparative advantages section
5. Capability cards with deep links

## Visual Design System

### Style Direction

Enterprise SaaS product landing style: clean, structured, and credible.

### Color Tokens

- Primary: `#0F2742`
- Accent: `#00A3A3`
- Success/availability: `#22C55E`
- Background: `#F4F7FB` and white cards
- Text-primary: `#111827`
- Text-secondary: `#4B5563`

### Typography

- Heading: `Manrope`, `Noto Sans SC`
- Body: `Noto Sans SC`, `Inter`
- Mono: `JetBrains Mono`

### Motion

- Section reveal: subtle stagger (about 80ms interval)
- Hover transitions: 160-220ms unified easing

### Responsive Rules

- Mobile hero becomes single-column
- CTA buttons stack vertically
- Demo toolbar wraps
- Comparison grid collapses to stacked cards

## Data & Locale Strategy

`home-content.ts` exports locale dictionaries and arrays:

- Hero title/subtitle/buttons
- Ecosystem items
- Comparison rows
- Capability cards

`HomeLanding.vue` accepts `locale: 'zh-CN' | 'en-US'` and reads corresponding content.

Route mapping:

- Chinese links: `/guide/...`
- English links: `/en/guide/...`
- Shared external link: `https://ijry.github.io/lyEditor/`

## Interaction Design

1. Hero primary CTA -> locale Getting Started
2. Hero secondary CTA -> deployed site URL
3. Capability cards -> deep links to related sections
4. Demo stays interactive and language-toggle capable

## Error Handling & Fallbacks

1. Unknown locale falls back to `zh-CN`.
2. Missing content field uses safe empty fallback and logs warning in dev mode.
3. External links open with safe `rel` attributes.

## Testing & Validation

## Build Validation

1. `pnpm --filter docs-site docs:build` must pass.

## Static Output Checks

1. Verify homepage contains `HomeLanding` markers in both locale outputs.
2. Verify links include `/lyEditor/` base prefix in generated HTML.

## Visual Checks

1. Desktop: section order and spacing are correct.
2. Mobile: no overflow, no broken CTA layout, comparison section readable.

## Rollout Plan

1. Implement new landing component + content + styles.
2. Replace homepage markdown bodies with component mount.
3. Update theme registration.
4. Build + static verification.
5. Commit and push to `main` to trigger docs deployment.

## Risks

1. Over-styling may conflict with VitePress default variables.
2. Locale copy drift between Chinese and English if content source not centralized.
3. Large hero/demo blocks may reduce perceived performance without controlled spacing/motion.

## Mitigations

1. Use `landing-*` scoped class naming and isolated CSS file.
2. Keep all bilingual copy in one structured source.
3. Keep animations subtle and avoid heavy effects.

## Acceptance Criteria

1. Homepage appears as professional product landing in both locales.
2. Primary CTA goes to locale-specific Getting Started page.
3. Secondary CTA links to `https://ijry.github.io/lyEditor/`.
4. Demo is placed directly below Hero.
5. Ecosystem and comparison sections are present and readable.
6. Build passes and assets remain valid under `/lyEditor/` base path.
