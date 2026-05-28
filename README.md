# lyEditor

Next-generation rich text editor monorepo.

## Repo Layout

- `packages/core` - Slate-based editor core (no React dependency)
- `packages/view-snabbdom` - Snabbdom render engine
- `packages/plugin-kit` - Plugin protocol and lifecycle
- `packages/plugins/*` - Official feature plugins
- `packages/upload` - Upload adapters (server/OSS/COS/Qiniu)
- `packages/vue2` / `packages/vue3` / `packages/react` - Framework wrappers
- `examples/*` - Framework demos
- `docs-site` - VitePress docs

## Quick Start

```bash
pnpm install
pnpm -r build
```

## I18n

- Editor wrappers accept `locale` and `messages` props.
- Built-in locales: `zh-CN`, `en-US`.
- Docs site routes: Chinese `/`, English `/en/`.

## Documentation

### Local Docs Development

```bash
pnpm --filter docs-site docs:dev
```

### Local Docs Build

```bash
pnpm --filter docs-site docs:build
```

### Docs Publishing

- Docs are automatically deployed to GitHub Pages by `.github/workflows/deploy-docs.yml` on push to `main`.
- Repository setting must enable `Settings -> Pages -> Build and deployment -> Source: GitHub Actions`.
