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
