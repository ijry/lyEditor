# Getting Started

## Install

```bash
pnpm install
```

## Run Docs Locally

```bash
pnpm --filter docs-site docs:dev
```

## Minimal Setup

```ts
import { createEditorCore } from '@ly-editor/core'
import { createPluginRegistry } from '@ly-editor/plugin-kit'

const editor = createEditorCore({ initialText: 'Hello lyEditor' })
const plugins = createPluginRegistry({ locale: 'en-US' })
```
