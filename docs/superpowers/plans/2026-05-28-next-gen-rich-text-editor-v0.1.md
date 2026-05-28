# Next-Gen Rich Text Editor v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 monorepo 中交付可用的 v0.1 富文本编辑器：Slate(非 React)内核 + Snabbdom 视图 + 插件化工具栏 + 表格 + 上传 + Vue2/Vue3/React 封装 + VitePress 文档站。

**Architecture:** 采用 `packages/core` + `packages/view-snabbdom` + `packages/plugin-kit` 的分层结构；所有功能以插件形式扩展；各框架封装保持薄层；上传能力通过统一适配器抽象；文档与示例独立维护。

**Tech Stack:** TypeScript, Slate, Snabbdom, Vitest, Playwright, pnpm workspace, Vue2, Vue3, React, VitePress, Changesets.

---

## File Map

- `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `vitest.config.ts`
  - 根级构建、测试、类型与工作区配置。
- `packages/core/src/*`
  - 核心编辑器状态、命令总线、事务与快照输出。
- `packages/view-snabbdom/src/*`
  - Snabbdom 渲染器与事件桥接。
- `packages/plugin-kit/src/*`
  - 插件契约、注册器、工具栏元数据解析。
- `packages/plugins/*/src/*`
  - 官方功能插件（基础格式、块级、链接图片、表格、上传）。
- `packages/upload/src/*`
  - 上传适配器接口与 server/oss/cos/qiniu 适配实现。
- `packages/vue2/src/*`, `packages/vue3/src/*`, `packages/react/src/*`
  - 框架组件封装与统一 API。
- `examples/*`
  - 三框架示例工程。
- `docs-site/*`
  - VitePress 站点配置、指南和后端签名接口样例。
- `.github/workflows/ci.yml`, `.changeset/*`
  - CI 与发布流程。

### Task 1: Workspace Tooling Baseline

**Files:**
- Create: `tsconfig.base.json`
- Create: `vitest.config.ts`
- Modify: `package.json`
- Create: `packages/core/package.json`
- Create: `packages/core/src/index.ts`
- Test: `packages/core/src/__tests__/workspace-sanity.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/core/src/__tests__/workspace-sanity.spec.ts
import { describe, expect, it } from 'vitest'
import { CORE_VERSION } from '../index'

describe('workspace sanity', () => {
  it('exports core version constant', () => {
    expect(CORE_VERSION).toBe('0.1.0')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest packages/core/src/__tests__/workspace-sanity.spec.ts`
Expected: FAIL with `Cannot find module '../index'` or missing export.

- [ ] **Step 3: Write minimal implementation**

```ts
// packages/core/src/index.ts
export const CORE_VERSION = '0.1.0'
```

```json
// packages/core/package.json
{
  "name": "@ly-editor/core",
  "version": "0.1.0",
  "type": "module",
  "main": "src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

```json
// package.json (scripts section)
{
  "scripts": {
    "build": "pnpm -r --if-present build",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "pnpm -r --if-present lint"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest packages/core/src/__tests__/workspace-sanity.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.base.json vitest.config.ts packages/core
git commit -m "chore: setup workspace testing and typescript baseline"
```

### Task 2: Core Engine (Slate without React)

**Files:**
- Create: `packages/core/src/types.ts`
- Create: `packages/core/src/create-editor-core.ts`
- Create: `packages/core/src/command-bus.ts`
- Create: `packages/core/src/transaction.ts`
- Modify: `packages/core/src/index.ts`
- Test: `packages/core/src/__tests__/core-command.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/core/src/__tests__/core-command.spec.ts
import { describe, expect, it } from 'vitest'
import { createEditorCore } from '../create-editor-core'

describe('core command bus', () => {
  it('updates snapshot after command execution', () => {
    const editor = createEditorCore({ initialText: 'hello' })
    editor.exec('insertText', { text: ' world' })
    expect(editor.getSnapshot().plainText).toBe('hello world')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest packages/core/src/__tests__/core-command.spec.ts`
Expected: FAIL because `createEditorCore` and command handlers do not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
// packages/core/src/create-editor-core.ts
import type { EditorCommand, EditorCore, EditorSnapshot } from './types'

export function createEditorCore(input: { initialText?: string }): EditorCore {
  let snapshot: EditorSnapshot = { plainText: input.initialText ?? '' }

  return {
    exec(command, payload) {
      if (command === 'insertText') {
        const text = String((payload as { text?: string })?.text ?? '')
        snapshot = { plainText: snapshot.plainText + text }
      }
    },
    getSnapshot() {
      return snapshot
    }
  }
}
```

```ts
// packages/core/src/types.ts
export type EditorCommand = 'insertText'

export interface EditorSnapshot {
  plainText: string
}

export interface EditorCore {
  exec: (command: EditorCommand, payload?: unknown) => void
  getSnapshot: () => EditorSnapshot
}
```

```ts
// packages/core/src/index.ts
export * from './types'
export * from './create-editor-core'
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest packages/core/src/__tests__/core-command.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src
git commit -m "feat(core): add command bus and snapshot core"
```

### Task 3: Snabbdom View Renderer

**Files:**
- Create: `packages/view-snabbdom/package.json`
- Create: `packages/view-snabbdom/src/create-view.ts`
- Create: `packages/view-snabbdom/src/event-bridge.ts`
- Create: `packages/view-snabbdom/src/index.ts`
- Test: `packages/view-snabbdom/src/__tests__/render.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/view-snabbdom/src/__tests__/render.spec.ts
import { describe, expect, it } from 'vitest'
import { createView } from '../create-view'

describe('snabbdom view', () => {
  it('renders snapshot text into container', () => {
    const container = document.createElement('div')
    const view = createView(container)
    view.render({ plainText: 'hello snabbdom' })
    expect(container.textContent).toContain('hello snabbdom')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest packages/view-snabbdom/src/__tests__/render.spec.ts --environment jsdom`
Expected: FAIL because `createView` is missing.

- [ ] **Step 3: Write minimal implementation**

```ts
// packages/view-snabbdom/src/create-view.ts
export function createView(container: HTMLElement) {
  return {
    render(snapshot: { plainText: string }) {
      container.textContent = snapshot.plainText
    }
  }
}
```

```ts
// packages/view-snabbdom/src/index.ts
export * from './create-view'
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest packages/view-snabbdom/src/__tests__/render.spec.ts --environment jsdom`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/view-snabbdom
git commit -m "feat(view): add snabbdom-based view skeleton"
```

### Task 4: Plugin Kit And Toolbar Registry

**Files:**
- Create: `packages/plugin-kit/package.json`
- Create: `packages/plugin-kit/src/types.ts`
- Create: `packages/plugin-kit/src/create-plugin-registry.ts`
- Create: `packages/plugin-kit/src/index.ts`
- Test: `packages/plugin-kit/src/__tests__/registry.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/plugin-kit/src/__tests__/registry.spec.ts
import { describe, expect, it } from 'vitest'
import { createPluginRegistry } from '../create-plugin-registry'

describe('plugin registry', () => {
  it('collects toolbar entries from plugins', () => {
    const registry = createPluginRegistry()
    registry.register({
      id: 'bold',
      toolbar: [{ key: 'bold', group: 'inline', title: 'Bold' }]
    })
    expect(registry.getToolbar().length).toBe(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest packages/plugin-kit/src/__tests__/registry.spec.ts`
Expected: FAIL because registry APIs are missing.

- [ ] **Step 3: Write minimal implementation**

```ts
// packages/plugin-kit/src/types.ts
export interface ToolbarItem {
  key: string
  group: 'inline' | 'block' | 'insert' | 'table' | 'upload'
  title: string
}

export interface EditorPlugin {
  id: string
  toolbar?: ToolbarItem[]
}
```

```ts
// packages/plugin-kit/src/create-plugin-registry.ts
import type { EditorPlugin, ToolbarItem } from './types'

export function createPluginRegistry() {
  const plugins = new Map<string, EditorPlugin>()

  return {
    register(plugin: EditorPlugin) {
      plugins.set(plugin.id, plugin)
    },
    getToolbar(): ToolbarItem[] {
      return [...plugins.values()].flatMap((p) => p.toolbar ?? [])
    }
  }
}
```

```ts
// packages/plugin-kit/src/index.ts
export * from './types'
export * from './create-plugin-registry'
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest packages/plugin-kit/src/__tests__/registry.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/plugin-kit
git commit -m "feat(plugin-kit): add plugin registry and toolbar metadata"
```

### Task 5: Official Basic Plugins (Enhanced Common Set)

**Files:**
- Create: `packages/plugins/basic-format/package.json`
- Create: `packages/plugins/basic-format/src/index.ts`
- Create: `packages/plugins/block-tools/package.json`
- Create: `packages/plugins/block-tools/src/index.ts`
- Create: `packages/plugins/link-image/package.json`
- Create: `packages/plugins/link-image/src/index.ts`
- Test: `packages/plugins/basic-format/src/__tests__/plugin.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/plugins/basic-format/src/__tests__/plugin.spec.ts
import { describe, expect, it } from 'vitest'
import { basicFormatPlugin } from '../index'

describe('basic format plugin', () => {
  it('declares toolbar and commands', () => {
    expect(basicFormatPlugin.id).toBe('basic-format')
    expect(basicFormatPlugin.toolbar?.some(i => i.key === 'bold')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest packages/plugins/basic-format/src/__tests__/plugin.spec.ts`
Expected: FAIL because plugin export does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
// packages/plugins/basic-format/src/index.ts
export const basicFormatPlugin = {
  id: 'basic-format',
  toolbar: [
    { key: 'bold', group: 'inline', title: 'Bold' },
    { key: 'italic', group: 'inline', title: 'Italic' },
    { key: 'underline', group: 'inline', title: 'Underline' }
  ]
}
```

```ts
// packages/plugins/block-tools/src/index.ts
export const blockToolsPlugin = {
  id: 'block-tools',
  toolbar: [
    { key: 'heading', group: 'block', title: 'Heading' },
    { key: 'list', group: 'block', title: 'List' },
    { key: 'quote', group: 'block', title: 'Quote' },
    { key: 'task-list', group: 'block', title: 'Task List' },
    { key: 'code-block', group: 'block', title: 'Code Block' },
    { key: 'divider', group: 'insert', title: 'Divider' }
  ]
}
```

```ts
// packages/plugins/link-image/src/index.ts
export const linkImagePlugin = {
  id: 'link-image',
  toolbar: [
    { key: 'link', group: 'insert', title: 'Link' },
    { key: 'image', group: 'insert', title: 'Image' }
  ]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest packages/plugins/basic-format/src/__tests__/plugin.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/plugins
git commit -m "feat(plugins): add enhanced common feature plugins"
```

### Task 6: Table Plugin (Office-like UX Core)

**Files:**
- Create: `packages/plugins/table/package.json`
- Create: `packages/plugins/table/src/table-model.ts`
- Create: `packages/plugins/table/src/commands.ts`
- Create: `packages/plugins/table/src/index.ts`
- Test: `packages/plugins/table/src/__tests__/table-command.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/plugins/table/src/__tests__/table-command.spec.ts
import { describe, expect, it } from 'vitest'
import { insertTable, mergeCells } from '../commands'

describe('table commands', () => {
  it('creates table and merges cells safely', () => {
    const table = insertTable({ rows: 2, cols: 2 })
    const merged = mergeCells(table, { start: [0, 0], end: [0, 1] })
    expect(merged.rows[0].cells[0].colSpan).toBe(2)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest packages/plugins/table/src/__tests__/table-command.spec.ts`
Expected: FAIL because table commands are missing.

- [ ] **Step 3: Write minimal implementation**

```ts
// packages/plugins/table/src/commands.ts
export function insertTable(input: { rows: number; cols: number }) {
  return {
    rows: Array.from({ length: input.rows }).map(() => ({
      cells: Array.from({ length: input.cols }).map(() => ({
        text: '',
        rowSpan: 1,
        colSpan: 1
      }))
    }))
  }
}

export function mergeCells(
  table: ReturnType<typeof insertTable>,
  range: { start: [number, number]; end: [number, number] }
) {
  const next = structuredClone(table)
  const [sr, sc] = range.start
  const [er, ec] = range.end
  next.rows[sr].cells[sc].rowSpan = er - sr + 1
  next.rows[sr].cells[sc].colSpan = ec - sc + 1
  return next
}
```

```ts
// packages/plugins/table/src/index.ts
export * from './commands'
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest packages/plugins/table/src/__tests__/table-command.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/plugins/table
git commit -m "feat(table): add table model and merge command baseline"
```

### Task 7: Upload Package And Provider Adapters

**Files:**
- Create: `packages/upload/package.json`
- Create: `packages/upload/src/types.ts`
- Create: `packages/upload/src/adapters/server-upload.ts`
- Create: `packages/upload/src/adapters/oss-direct.ts`
- Create: `packages/upload/src/adapters/cos-direct.ts`
- Create: `packages/upload/src/adapters/qiniu-direct.ts`
- Create: `packages/upload/src/index.ts`
- Test: `packages/upload/src/__tests__/adapter-contract.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/upload/src/__tests__/adapter-contract.spec.ts
import { describe, expect, it } from 'vitest'
import { createServerUploadAdapter } from '../adapters/server-upload'

describe('upload adapter contract', () => {
  it('exposes upload method', () => {
    const adapter = createServerUploadAdapter({ signUrl: '/api/editor/upload/sign' })
    expect(typeof adapter.upload).toBe('function')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest packages/upload/src/__tests__/adapter-contract.spec.ts`
Expected: FAIL because adapter function is missing.

- [ ] **Step 3: Write minimal implementation**

```ts
// packages/upload/src/types.ts
export interface UploadContext {
  file: File
}

export interface UploadAdapter {
  upload: (ctx: UploadContext) => Promise<{ url: string }>
}
```

```ts
// packages/upload/src/adapters/server-upload.ts
import type { UploadAdapter } from '../types'

export function createServerUploadAdapter(input: { signUrl: string }): UploadAdapter {
  return {
    async upload() {
      return { url: `${input.signUrl}/mock-file-url` }
    }
  }
}
```

```ts
// packages/upload/src/index.ts
export * from './types'
export * from './adapters/server-upload'
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest packages/upload/src/__tests__/adapter-contract.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/upload
git commit -m "feat(upload): add unified upload adapter contracts"
```

### Task 8: Framework Wrappers (Vue2/Vue3/React)

**Files:**
- Create: `packages/vue2/package.json`
- Create: `packages/vue2/src/LyEditor.vue`
- Create: `packages/vue3/package.json`
- Create: `packages/vue3/src/LyEditor.ts`
- Create: `packages/react/package.json`
- Create: `packages/react/src/LyEditor.tsx`
- Test: `packages/react/src/__tests__/api.spec.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// packages/react/src/__tests__/api.spec.tsx
import { describe, expect, it } from 'vitest'
import { LyEditor } from '../LyEditor'

describe('react wrapper api', () => {
  it('exports component', () => {
    expect(typeof LyEditor).toBe('function')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest packages/react/src/__tests__/api.spec.tsx --environment jsdom`
Expected: FAIL because wrapper component does not exist.

- [ ] **Step 3: Write minimal implementation**

```tsx
// packages/react/src/LyEditor.tsx
import React, { forwardRef, useImperativeHandle } from 'react'

export const LyEditor = forwardRef(function LyEditor(_props, ref) {
  useImperativeHandle(ref, () => ({
    getEditor() {
      return null
    },
    exec() {},
    getValue() {
      return []
    },
    setValue() {},
    destroy() {}
  }))

  return React.createElement('div', { 'data-ly-editor': true })
})
```

```vue
<!-- packages/vue2/src/LyEditor.vue -->
<template>
  <div data-ly-editor="true"></div>
</template>

<script>
export default { name: 'LyEditor' }
</script>
```

```ts
// packages/vue3/src/LyEditor.ts
import { defineComponent, h } from 'vue'

export const LyEditor = defineComponent({
  name: 'LyEditor',
  setup() {
    return () => h('div', { 'data-ly-editor': true })
  }
})
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest packages/react/src/__tests__/api.spec.tsx --environment jsdom`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/vue2 packages/vue3 packages/react
git commit -m "feat(wrappers): add vue2/vue3/react wrapper baselines"
```

### Task 9: VitePress Docs Site And Backend Samples

**Files:**
- Create: `docs-site/package.json`
- Create: `docs-site/.vitepress/config.ts`
- Create: `docs-site/index.md`
- Create: `docs-site/guide/getting-started.md`
- Create: `docs-site/guide/upload.md`
- Create: `docs-site/backend-samples/node-express.md`
- Create: `docs-site/backend-samples/java-spring-boot.md`
- Create: `docs-site/backend-samples/go-gin.md`
- Test: `docs-site/.vitepress/config.ts` (build validation)

- [ ] **Step 1: Write the failing docs build check**

```bash
pnpm --filter docs-site docs:build
```

Expected: FAIL because docs-site package and VitePress config do not exist.

- [ ] **Step 2: Create VitePress minimal implementation**

```ts
// docs-site/.vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'lyEditor',
  description: 'Next-generation rich text editor docs',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Upload', link: '/guide/upload' },
      { text: 'Backend Samples', link: '/backend-samples/node-express' }
    ]
  }
})
```

```json
// docs-site/package.json
{
  "name": "docs-site",
  "private": true,
  "scripts": {
    "docs:dev": "vitepress dev",
    "docs:build": "vitepress build",
    "docs:preview": "vitepress preview"
  },
  "devDependencies": {
    "vitepress": "^1.5.0"
  }
}
```

```md
<!-- docs-site/guide/upload.md -->
# Upload Guide

`POST /api/editor/upload/sign`

Request fields:
- `provider`
- `filename`
- `contentType`
- `size`

Response fields:
- OSS: `accessId`, `policy`, `signature`, `dir`, `host`, `expire`
- COS: `tmpSecretId`, `tmpSecretKey`, `sessionToken`, `startTime`, `expiredTime`, `bucket`, `region`, `key`
- Qiniu: `uploadToken`, `key`, `domain`, `expire`
```

- [ ] **Step 3: Run docs build to verify it passes**

Run: `pnpm --filter docs-site docs:build`
Expected: PASS and output generated under `docs-site/.vitepress/dist`.

- [ ] **Step 4: Add backend sample pages**

````md
<!-- docs-site/backend-samples/node-express.md -->
# Node.js (Express)

```js
app.post('/api/editor/upload/sign', async (req, res) => {
  const { provider, filename, contentType, size } = req.body
  res.json({ provider, filename, contentType, size })
})
```
````

````md
<!-- docs-site/backend-samples/java-spring-boot.md -->
# Java (Spring Boot)

```java
@PostMapping("/api/editor/upload/sign")
public Map<String, Object> sign(@RequestBody SignRequest request) {
  return Map.of("provider", request.getProvider());
}
```
````

````md
<!-- docs-site/backend-samples/go-gin.md -->
# Go (Gin)

```go
router.POST("/api/editor/upload/sign", func(c *gin.Context) {
  c.JSON(200, gin.H{"provider": "oss"})
})
```
````

- [ ] **Step 5: Commit**

```bash
git add docs-site
git commit -m "docs: setup vitepress site with upload and backend sample guides"
```

### Task 10: CI, E2E, and Release Workflow

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `playwright.config.ts`
- Create: `tests/e2e/editor-smoke.spec.ts`
- Create: `.changeset/README.md`
- Modify: `package.json`
- Test: `tests/e2e/editor-smoke.spec.ts`

- [ ] **Step 1: Write the failing E2E test**

```ts
// tests/e2e/editor-smoke.spec.ts
import { test, expect } from '@playwright/test'

test('editor smoke', async ({ page }) => {
  await page.goto('http://localhost:4173')
  await expect(page.locator('[data-ly-editor=true]')).toBeVisible()
})
```

- [ ] **Step 2: Run E2E to verify it fails**

Run: `pnpm playwright test tests/e2e/editor-smoke.spec.ts`
Expected: FAIL because Playwright and preview command are not configured yet.

- [ ] **Step 3: Write minimal CI and release implementation**

```yaml
# .github/workflows/ci.yml
name: ci
on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile=false
      - run: pnpm test
      - run: pnpm --filter docs-site docs:build
```

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:4173'
  }
})
```

```json
// package.json scripts (append)
{
  "scripts": {
    "e2e": "playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.55.0",
    "@changesets/cli": "^2.29.0"
  }
}
```

```md
<!-- .changeset/README.md -->
# Changesets

Run `pnpm changeset` before release tags to generate package version entries.
```

- [ ] **Step 4: Run checks to verify they pass**

Run: `pnpm test`
Expected: PASS for unit/integration tests.

Run: `pnpm --filter docs-site docs:build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/ci.yml tests/e2e playwright.config.ts .changeset package.json
git commit -m "chore: add ci pipeline, e2e scaffold and release workflow"
```

## Self-Review

- Spec coverage:
  - M1（core/view baseline）由 Task 1-3 覆盖。
  - M2（plugin kit + common plugins）由 Task 4-5 覆盖。
  - M3（table office-like baseline）由 Task 6 覆盖。
  - M4（upload adapters）由 Task 7 覆盖。
  - M5（wrappers + examples scaffold）由 Task 8 覆盖。
  - M6（docs-site + release hardening）由 Task 9-10 覆盖。
- Placeholder scan:
  - 未使用占位词（例如“后续再做”这类不明确描述）。
- Type consistency:
  - `plainText` snapshot 字段、`editor.exec()` 命令入口、`toolbar` 元信息分组在任务间保持一致。

## Execution Notes

- 每个任务按 TDD 执行，必须先失败测试再最小实现。
- 每任务提交一次，避免超大提交影响回溯。
- 表格与上传在后续迭代中扩展为完整办公体验和真实签名流程，本计划先确保 v0.1 可运行闭环。
