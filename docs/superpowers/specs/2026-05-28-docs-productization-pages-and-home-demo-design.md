# Docs Productization + GitHub Pages + Home Editor Demo Design Spec

## 1. Goal

Upgrade documentation from a thin reference into a complete product-grade docs experience, while adding:

- Rich bilingual docs structure (Chinese root `/`, English `/en/`)
- Built-in editor demo instance on docs home page
- Automatic documentation publishing to GitHub Pages via GitHub Actions

This iteration follows confirmed decisions:
- Docs depth: Full edition (comprehensive + practical tutorials)
- Publish target: GitHub Pages
- Home demo shape: pure interactive demo (no config panel/code linkage)

## 2. Scope

### In Scope

- Rework docs information architecture and navigation.
- Fill and expand content for all major topics, including advanced/practical sections.
- Keep bilingual docs in mirrored structure (CN/EN parity).
- Integrate a Vue-based editor demo component in docs home.
- Add independent GitHub Actions workflow for docs deployment.

### Out Of Scope

- Interactive playground with dynamic configuration panel.
- Side-by-side source code live generation on home page.
- Package publish automation changes.

## 3. Information Architecture

Chinese root docs (`/`):

1. `guide/getting-started`
2. `guide/core-concepts`
3. `guide/editor-api`
4. `guide/plugins`
5. `guide/custom-plugin`
6. `guide/table`
7. `guide/upload`
8. `guide/i18n`
9. `guide/best-practices`
10. `guide/faq`
11. `guide/migration`

English docs (`/en/`):
- Mirror all root pages with equivalent path hierarchy and translated content.

Navigation:
- Top nav: `Guide`, `API`, `Examples`, `Backend`, `FAQ`
- Sidebar: learning-path ordered, not file-name ordered

## 4. Home Page Editor Demo

### 4.1 UX Definition

Pure demo mode includes:
- Editable rich text region
- Basic toolbar actions (bold/italic/underline/heading/list/link/image entry)
- Locale switch buttons (`zh-CN`, `en-US`) affecting editor UI labels

### 4.2 Technical Integration

- Extend VitePress theme via `docs-site/.vitepress/theme`.
- Add `docs-site/.vitepress/theme/components/HomeEditorDemo.vue`.
- Use `packages/vue3` wrapper to render the editor in docs runtime.
- Mount `<HomeEditorDemo />` inside `docs-site/index.md`.

### 4.3 Reliability

- Client-side-only mount for editor runtime (SSR-safe handling).
- Graceful fallback block if editor component fails to initialize.

## 5. GitHub Pages Deployment

### 5.1 Workflow

Create separate workflow `.github/workflows/deploy-docs.yml`:

- Trigger: push to `main` (docs-related path filter)
- Steps:
  1. checkout
  2. setup pnpm/node
  3. install dependencies
  4. run `pnpm --filter docs-site docs:build`
  5. upload `docs-site/.vitepress/dist` as pages artifact
  6. deploy to GitHub Pages

### 5.2 Repo Precondition

Repository setting required:
- `Settings -> Pages -> Build and deployment -> Source: GitHub Actions`

### 5.3 Isolation Principle

Docs deployment workflow remains independent from CI verification workflow.
Docs deploy failure should not change package test semantics in main CI job.

## 6. Content Depth Requirements (Full Edition)

The docs set must go beyond API listing and include practical, teachable content:

- End-to-end plugin authoring walkthrough
- Table extension walkthrough
- Upload integration patterns and pitfalls
- Best practices for performance, error handling, extension boundaries
- FAQ entries reflecting real integration issues
- Migration notes with concrete upgrade steps and compatibility caveats

## 7. Implementation Checklist

1. Rebuild docs nav/sidebar structure in VitePress config for CN/EN parity.
2. Create/refine all CN pages and matching EN pages.
3. Integrate HomeEditorDemo component on docs home page.
4. Add and validate GitHub Pages deployment workflow.
5. Update README docs section and contribution/deploy notes.

## 8. Acceptance Criteria

- Bilingual docs map is complete and path-mirrored.
- Home page includes functional editor demo with locale switch.
- `pnpm --filter docs-site docs:build` passes.
- Push to `main` triggers docs deploy workflow and publishes successfully on GitHub Pages.
- Content quality reaches full-edition depth (tutorial + best-practice + migration + FAQ).
