# Editor And Docs Bilingual I18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让编辑器运行时和文档站都支持中英文：编辑器内置 `zh-CN/en-US` 并支持 `locale + messages` 扩展，文档站实现 `/` 中文和 `/en/` 英文。

**Architecture:** 在 `plugin-kit` 建立统一 i18n store 与回退链路，插件改为 `titleKey + i18n` 机制并保留 `title` 兼容；Vue2/Vue3/React 封装统一透传 `locale/messages`；VitePress 用 `locales` 构建双语路由与双语导航。

**Tech Stack:** TypeScript, Vitest, React, Vue2, Vue3, VitePress.

---

## File Structure Map

- `packages/plugin-kit/src/i18n-store.ts`
  - i18n store、回退规则、消息合并。
- `packages/plugin-kit/src/types.ts`
  - 插件协议扩展（`titleKey`、`i18n`）。
- `packages/plugin-kit/src/create-plugin-registry.ts`
  - 注册插件时合并 i18n，工具栏 title 解析。
- `packages/plugin-kit/src/__tests__/i18n-store.spec.ts`
  - i18n fallback 与 merge 覆盖测试。
- `packages/plugin-kit/src/__tests__/registry.spec.ts`
  - titleKey 与旧 title 兼容测试。
- `packages/plugins/basic-format/src/index.ts`
- `packages/plugins/block-tools/src/index.ts`
- `packages/plugins/link-image/src/index.ts`
- `packages/plugins/table/src/index.ts`
  - 插件文案改为 `titleKey` 并补充 `zh-CN/en-US` 字典。
- `packages/plugins/basic-format/src/__tests__/plugin.spec.ts`
  - 校验插件 key 与 i18n 字典。
- `packages/react/src/LyEditor.tsx`
- `packages/react/src/__tests__/api.spec.tsx`
- `packages/vue3/src/LyEditor.ts`
- `packages/vue2/src/LyEditor.vue`
  - 统一 `locale/messages` 输入契约。
- `docs-site/.vitepress/config.ts`
  - 双语 locales/nav/sidebar 配置。
- `docs-site/en/index.md`
- `docs-site/en/guide/getting-started.md`
- `docs-site/en/guide/upload.md`
- `docs-site/en/backend-samples/node-express.md`
- `docs-site/en/backend-samples/java-spring-boot.md`
- `docs-site/en/backend-samples/go-gin.md`
  - 英文文档页面镜像。

### Task 1: Build Plugin-Kit I18n Store

**Files:**
- Create: `packages/plugin-kit/src/i18n-store.ts`
- Create: `packages/plugin-kit/src/__tests__/i18n-store.spec.ts`
- Modify: `packages/plugin-kit/src/index.ts`

- [ ] **Step 1: Write the failing test**

```ts
// packages/plugin-kit/src/__tests__/i18n-store.spec.ts
import { describe, expect, it } from 'vitest'
import { createI18nStore } from '../i18n-store'

describe('i18n store', () => {
  it('falls back from locale to en-US to key', () => {
    const store = createI18nStore({
      locale: 'zh-CN',
      messages: {
        'en-US': { 'toolbar.bold': 'Bold' },
        'zh-CN': { 'toolbar.bold': '加粗' }
      }
    })

    expect(store.t('toolbar.bold')).toBe('加粗')
    store.setLocale('fr-FR')
    expect(store.t('toolbar.bold')).toBe('Bold')
    expect(store.t('toolbar.missing')).toBe('toolbar.missing')
  })

  it('allows merge messages to override existing keys', () => {
    const store = createI18nStore({ locale: 'zh-CN' })
    store.mergeMessages('zh-CN', { 'toolbar.bold': '加粗' })
    store.mergeMessages('zh-CN', { 'toolbar.bold': '粗体' })
    expect(store.t('toolbar.bold')).toBe('粗体')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run packages/plugin-kit/src/__tests__/i18n-store.spec.ts`
Expected: FAIL with module-not-found for `../i18n-store`.

- [ ] **Step 3: Write minimal implementation**

```ts
// packages/plugin-kit/src/i18n-store.ts
export type LocaleMessages = Record<string, string>
export type I18nMessageMap = Record<string, LocaleMessages>

export interface I18nStore {
  getLocale: () => string
  setLocale: (locale: string) => void
  mergeMessages: (locale: string, messages: LocaleMessages) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

export function createI18nStore(input?: {
  locale?: string
  messages?: I18nMessageMap
}): I18nStore {
  let locale = input?.locale ?? 'zh-CN'
  const messages: I18nMessageMap = {
    ...(input?.messages ?? {})
  }

  return {
    getLocale() {
      return locale
    },
    setLocale(nextLocale: string) {
      locale = nextLocale
    },
    mergeMessages(targetLocale: string, nextMessages: LocaleMessages) {
      messages[targetLocale] = {
        ...(messages[targetLocale] ?? {}),
        ...nextMessages
      }
    },
    t(key: string, params?: Record<string, string | number>) {
      const text = messages[locale]?.[key] ?? messages['en-US']?.[key] ?? key
      if (!params) {
        return text
      }
      return Object.entries(params).reduce(
        (acc, [name, value]) => acc.replace(new RegExp(`\\{${name}\\}`, 'g'), String(value)),
        text
      )
    }
  }
}
```

```ts
// packages/plugin-kit/src/index.ts
export * from './types'
export * from './create-plugin-registry'
export * from './i18n-store'
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run packages/plugin-kit/src/__tests__/i18n-store.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/plugin-kit/src/i18n-store.ts packages/plugin-kit/src/index.ts packages/plugin-kit/src/__tests__/i18n-store.spec.ts
git commit -m "feat(plugin-kit): add i18n store with locale fallback"
```

### Task 2: Extend Plugin Contract And Registry Translation Resolution

**Files:**
- Modify: `packages/plugin-kit/src/types.ts`
- Modify: `packages/plugin-kit/src/create-plugin-registry.ts`
- Modify: `packages/plugin-kit/src/__tests__/registry.spec.ts`

- [ ] **Step 1: Write the failing test updates**

```ts
// packages/plugin-kit/src/__tests__/registry.spec.ts
import { describe, expect, it } from 'vitest'
import { createPluginRegistry } from '../create-plugin-registry'

describe('plugin registry', () => {
  it('resolves toolbar title from titleKey and plugin i18n messages', () => {
    const registry = createPluginRegistry({ locale: 'zh-CN' })
    registry.register({
      id: 'bold',
      i18n: {
        'zh-CN': { 'toolbar.bold': '加粗' },
        'en-US': { 'toolbar.bold': 'Bold' }
      },
      toolbar: [{ key: 'bold', group: 'inline', titleKey: 'toolbar.bold' }]
    })

    expect(registry.getToolbar()[0].title).toBe('加粗')
    registry.setLocale('en-US')
    expect(registry.getToolbar()[0].title).toBe('Bold')
  })

  it('keeps backward compatibility for legacy title', () => {
    const registry = createPluginRegistry({ locale: 'zh-CN' })
    registry.register({
      id: 'legacy',
      toolbar: [{ key: 'legacy', group: 'insert', title: 'Legacy Label' }]
    })

    expect(registry.getToolbar()[0].title).toBe('Legacy Label')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run packages/plugin-kit/src/__tests__/registry.spec.ts`
Expected: FAIL due to missing `titleKey`, `i18n`, and `setLocale` support.

- [ ] **Step 3: Write minimal implementation**

```ts
// packages/plugin-kit/src/types.ts
export interface ToolbarItem {
  key: string
  group: 'inline' | 'block' | 'insert' | 'table' | 'upload'
  title?: string
  titleKey?: string
}

export type PluginI18nMap = Record<string, Record<string, string>>

export interface EditorPlugin {
  id: string
  toolbar?: ToolbarItem[]
  i18n?: PluginI18nMap
}

export interface ResolvedToolbarItem extends ToolbarItem {
  title: string
}
```

```ts
// packages/plugin-kit/src/create-plugin-registry.ts
import { createI18nStore } from './i18n-store'
import type { EditorPlugin, ResolvedToolbarItem } from './types'

export function createPluginRegistry(input?: { locale?: string }) {
  const plugins = new Map<string, EditorPlugin>()
  const i18n = createI18nStore({ locale: input?.locale })

  return {
    register(plugin: EditorPlugin) {
      plugins.set(plugin.id, plugin)
      if (plugin.i18n) {
        for (const [locale, messages] of Object.entries(plugin.i18n)) {
          i18n.mergeMessages(locale, messages)
        }
      }
    },
    setLocale(locale: string) {
      i18n.setLocale(locale)
    },
    getToolbar(): ResolvedToolbarItem[] {
      return [...plugins.values()]
        .flatMap((plugin) => plugin.toolbar ?? [])
        .map((item) => ({
          ...item,
          title: item.titleKey ? i18n.t(item.titleKey) : item.title ?? item.key
        }))
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run packages/plugin-kit/src/__tests__/registry.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/plugin-kit/src/types.ts packages/plugin-kit/src/create-plugin-registry.ts packages/plugin-kit/src/__tests__/registry.spec.ts
git commit -m "feat(plugin-kit): add titleKey and plugin i18n registry resolution"
```

### Task 3: Migrate Built-In Plugins To `titleKey + i18n`

**Files:**
- Modify: `packages/plugins/basic-format/src/index.ts`
- Modify: `packages/plugins/block-tools/src/index.ts`
- Modify: `packages/plugins/link-image/src/index.ts`
- Modify: `packages/plugins/table/src/index.ts`
- Modify: `packages/plugins/basic-format/src/__tests__/plugin.spec.ts`

- [ ] **Step 1: Write the failing plugin test update**

```ts
// packages/plugins/basic-format/src/__tests__/plugin.spec.ts
import { describe, expect, it } from 'vitest'
import { basicFormatPlugin } from '../index'

describe('basic format plugin', () => {
  it('uses titleKey and bilingual dictionaries', () => {
    expect(basicFormatPlugin.toolbar?.some((i) => i.titleKey === 'toolbar.bold')).toBe(true)
    expect(basicFormatPlugin.i18n?.['zh-CN']?.['toolbar.bold']).toBe('加粗')
    expect(basicFormatPlugin.i18n?.['en-US']?.['toolbar.bold']).toBe('Bold')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run packages/plugins/basic-format/src/__tests__/plugin.spec.ts`
Expected: FAIL because plugin currently only has `title` fields.

- [ ] **Step 3: Write minimal implementation**

```ts
// packages/plugins/basic-format/src/index.ts
export const basicFormatPlugin = {
  id: 'basic-format',
  i18n: {
    'zh-CN': {
      'toolbar.bold': '加粗',
      'toolbar.italic': '斜体',
      'toolbar.underline': '下划线'
    },
    'en-US': {
      'toolbar.bold': 'Bold',
      'toolbar.italic': 'Italic',
      'toolbar.underline': 'Underline'
    }
  },
  toolbar: [
    { key: 'bold', group: 'inline', titleKey: 'toolbar.bold' },
    { key: 'italic', group: 'inline', titleKey: 'toolbar.italic' },
    { key: 'underline', group: 'inline', titleKey: 'toolbar.underline' }
  ]
}
```

```ts
// packages/plugins/block-tools/src/index.ts
export const blockToolsPlugin = {
  id: 'block-tools',
  i18n: {
    'zh-CN': {
      'toolbar.heading': '标题',
      'toolbar.list': '列表',
      'toolbar.quote': '引用',
      'toolbar.taskList': '任务列表',
      'toolbar.codeBlock': '代码块',
      'toolbar.divider': '分割线'
    },
    'en-US': {
      'toolbar.heading': 'Heading',
      'toolbar.list': 'List',
      'toolbar.quote': 'Quote',
      'toolbar.taskList': 'Task List',
      'toolbar.codeBlock': 'Code Block',
      'toolbar.divider': 'Divider'
    }
  },
  toolbar: [
    { key: 'heading', group: 'block', titleKey: 'toolbar.heading' },
    { key: 'list', group: 'block', titleKey: 'toolbar.list' },
    { key: 'quote', group: 'block', titleKey: 'toolbar.quote' },
    { key: 'task-list', group: 'block', titleKey: 'toolbar.taskList' },
    { key: 'code-block', group: 'block', titleKey: 'toolbar.codeBlock' },
    { key: 'divider', group: 'insert', titleKey: 'toolbar.divider' }
  ]
}
```

```ts
// packages/plugins/link-image/src/index.ts
export const linkImagePlugin = {
  id: 'link-image',
  i18n: {
    'zh-CN': {
      'toolbar.link': '链接',
      'toolbar.image': '图片'
    },
    'en-US': {
      'toolbar.link': 'Link',
      'toolbar.image': 'Image'
    }
  },
  toolbar: [
    { key: 'link', group: 'insert', titleKey: 'toolbar.link' },
    { key: 'image', group: 'insert', titleKey: 'toolbar.image' }
  ]
}
```

```ts
// packages/plugins/table/src/index.ts
export const tableI18n = {
  'zh-CN': {
    'toolbar.table': '表格',
    'table.mergeCells': '合并单元格',
    'table.splitCell': '拆分单元格',
    'table.insertRow': '插入行',
    'table.insertCol': '插入列',
    'table.deleteRow': '删除行',
    'table.deleteCol': '删除列'
  },
  'en-US': {
    'toolbar.table': 'Table',
    'table.mergeCells': 'Merge Cells',
    'table.splitCell': 'Split Cell',
    'table.insertRow': 'Insert Row',
    'table.insertCol': 'Insert Column',
    'table.deleteRow': 'Delete Row',
    'table.deleteCol': 'Delete Column'
  }
}

export const tablePlugin = {
  id: 'table',
  i18n: tableI18n,
  toolbar: [{ key: 'table', group: 'table', titleKey: 'toolbar.table' }]
}

export * from './table-model'
export * from './commands'
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run packages/plugins/basic-format/src/__tests__/plugin.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/plugins/basic-format/src/index.ts packages/plugins/block-tools/src/index.ts packages/plugins/link-image/src/index.ts packages/plugins/table/src/index.ts packages/plugins/basic-format/src/__tests__/plugin.spec.ts
git commit -m "feat(plugins): migrate toolbar labels to i18n title keys"
```

### Task 4: Add Wrapper `locale/messages` API (React/Vue2/Vue3)

**Files:**
- Modify: `packages/react/src/LyEditor.tsx`
- Modify: `packages/react/src/__tests__/api.spec.tsx`
- Modify: `packages/vue3/src/LyEditor.ts`
- Modify: `packages/vue2/src/LyEditor.vue`

- [ ] **Step 1: Write failing wrapper test update**

```ts
// packages/react/src/__tests__/api.spec.tsx
// @vitest-environment jsdom
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LyEditor } from '../LyEditor'

describe('react wrapper api', () => {
  it('accepts locale prop and exposes locale marker', () => {
    render(
      React.createElement(LyEditor, {
        locale: 'en-US',
        messages: { 'en-US': { 'toolbar.bold': 'Bold' } }
      })
    )

    expect(screen.getByTestId('ly-editor-root').getAttribute('data-locale')).toBe('en-US')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run packages/react/src/__tests__/api.spec.tsx`
Expected: FAIL due to missing props contract and test id.

- [ ] **Step 3: Write minimal implementation**

```ts
// packages/react/src/LyEditor.tsx
import React from 'react'

export interface LyEditorProps {
  locale?: string
  messages?: Record<string, Record<string, string>>
}

export interface LyEditorRef {
  getEditor: () => unknown
  exec: (command?: string, payload?: unknown) => void
  getValue: () => unknown[]
  setValue: (next?: unknown[]) => void
  destroy: () => void
}

export function LyEditor(props: LyEditorProps) {
  return React.createElement('div', {
    'data-testid': 'ly-editor-root',
    'data-ly-editor': true,
    'data-locale': props.locale ?? 'zh-CN',
    'data-has-messages': props.messages ? '1' : '0'
  })
}
```

```ts
// packages/vue3/src/LyEditor.ts
import { defineComponent, h, PropType } from 'vue'

export const LyEditor = defineComponent({
  name: 'LyEditor',
  props: {
    locale: {
      type: String,
      default: 'zh-CN'
    },
    messages: {
      type: Object as PropType<Record<string, Record<string, string>>>,
      default: () => ({})
    }
  },
  setup(props) {
    return () =>
      h('div', {
        'data-ly-editor': true,
        'data-locale': props.locale,
        'data-has-messages': Object.keys(props.messages).length > 0 ? '1' : '0'
      })
  }
})
```

```vue
<!-- packages/vue2/src/LyEditor.vue -->
<template>
  <div
    data-ly-editor="true"
    :data-locale="locale"
    :data-has-messages="Object.keys(messages || {}).length > 0 ? '1' : '0'"
  ></div>
</template>

<script>
export default {
  name: 'LyEditor',
  props: {
    locale: {
      type: String,
      default: 'zh-CN'
    },
    messages: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm add -Dw @testing-library/react @testing-library/dom`
Expected: dependencies installed.

Run: `pnpm vitest run packages/react/src/__tests__/api.spec.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/react/src/LyEditor.tsx packages/react/src/__tests__/api.spec.tsx packages/vue3/src/LyEditor.ts packages/vue2/src/LyEditor.vue package.json pnpm-lock.yaml
git commit -m "feat(wrappers): add locale and messages props contract"
```

### Task 5: Configure VitePress Bilingual Locales And Add English Docs

**Files:**
- Modify: `docs-site/.vitepress/config.ts`
- Create: `docs-site/en/index.md`
- Create: `docs-site/en/guide/getting-started.md`
- Create: `docs-site/en/guide/upload.md`
- Create: `docs-site/en/backend-samples/node-express.md`
- Create: `docs-site/en/backend-samples/java-spring-boot.md`
- Create: `docs-site/en/backend-samples/go-gin.md`

- [ ] **Step 1: Run docs build to capture baseline behavior**

Run: `pnpm --filter docs-site docs:build`
Expected: PASS without `/en/` locale routes yet.

- [ ] **Step 2: Implement bilingual docs structure**

```ts
// docs-site/.vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      title: 'lyEditor',
      description: '新一代富文本编辑器文档',
      themeConfig: {
        nav: [
          { text: '指南', link: '/guide/getting-started' },
          { text: '上传', link: '/guide/upload' },
          { text: '后端样例', link: '/backend-samples/node-express' }
        ],
        sidebar: [
          {
            text: '指南',
            items: [
              { text: '快速开始', link: '/guide/getting-started' },
              { text: '上传指南', link: '/guide/upload' }
            ]
          },
          {
            text: '后端样例',
            items: [
              { text: 'Node.js (Express)', link: '/backend-samples/node-express' },
              { text: 'Java (Spring Boot)', link: '/backend-samples/java-spring-boot' },
              { text: 'Go (Gin)', link: '/backend-samples/go-gin' }
            ]
          }
        ]
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'lyEditor',
      description: 'Next-generation rich text editor docs',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'Upload', link: '/en/guide/upload' },
          { text: 'Backend Samples', link: '/en/backend-samples/node-express' }
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Getting Started', link: '/en/guide/getting-started' },
              { text: 'Upload Guide', link: '/en/guide/upload' }
            ]
          },
          {
            text: 'Backend Samples',
            items: [
              { text: 'Node.js (Express)', link: '/en/backend-samples/node-express' },
              { text: 'Java (Spring Boot)', link: '/en/backend-samples/java-spring-boot' },
              { text: 'Go (Gin)', link: '/en/backend-samples/go-gin' }
            ]
          }
        ]
      }
    }
  }
})
```

```md
<!-- docs-site/en/index.md -->
# lyEditor Docs

Welcome to lyEditor documentation.

- [Getting Started](/en/guide/getting-started)
- [Upload Guide](/en/guide/upload)
```

````md
<!-- docs-site/en/guide/getting-started.md -->
# Getting Started

## Install

```bash
pnpm install
```

## Build

```bash
pnpm build
```
````

```md
<!-- docs-site/en/guide/upload.md -->
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

````md
<!-- docs-site/en/backend-samples/node-express.md -->
# Node.js (Express)

```js
app.post('/api/editor/upload/sign', async (req, res) => {
  const { provider, filename, contentType, size } = req.body
  res.json({ provider, filename, contentType, size })
})
```
````

````md
<!-- docs-site/en/backend-samples/java-spring-boot.md -->
# Java (Spring Boot)

```java
@PostMapping("/api/editor/upload/sign")
public Map<String, Object> sign(@RequestBody SignRequest request) {
  return Map.of("provider", request.getProvider());
}
```
````

````md
<!-- docs-site/en/backend-samples/go-gin.md -->
# Go (Gin)

```go
router.POST("/api/editor/upload/sign", func(c *gin.Context) {
  c.JSON(200, gin.H{"provider": "oss"})
})
```
````

- [ ] **Step 3: Run docs build to verify bilingual output**

Run: `pnpm --filter docs-site docs:build`
Expected: PASS and output contains both root and `/en/` pages.

- [ ] **Step 4: Verify generated english page exists**

Run: `rg --files docs-site/.vitepress/dist | rg "en/index.html|en/guide/getting-started.html|en/guide/upload.html"`
Expected: three english routes are present.

- [ ] **Step 5: Commit**

```bash
git add docs-site/.vitepress/config.ts docs-site/en
git commit -m "docs: add bilingual vitepress locales with english pages"
```

### Task 6: End-To-End Validation And Contract Notes

**Files:**
- Modify: `README.md`
- Create: `docs-site/guide/i18n.md`

- [ ] **Step 1: Add i18n usage docs for developers**

````md
<!-- docs-site/guide/i18n.md -->
# 多语言（i18n）

编辑器组件统一支持：

- `locale`: 当前语言（例如 `zh-CN`, `en-US`）
- `messages`: 自定义语言包覆盖

示例（React）：

```tsx
<LyEditor
  locale="en-US"
  messages={{
    'en-US': {
      'toolbar.bold': 'Strong'
    }
  }}
/>
```
````

```md
<!-- README.md append section -->
## I18n

- Editor wrappers accept `locale` and `messages` props.
- Built-in locales: `zh-CN`, `en-US`.
- Docs site routes: Chinese `/`, English `/en/`.
```

- [ ] **Step 2: Run full verification**

Run: `pnpm test`
Expected: PASS.

Run: `pnpm --filter docs-site docs:build`
Expected: PASS.

- [ ] **Step 3: Commit documentation updates**

```bash
git add README.md docs-site/guide/i18n.md
git commit -m "docs: add editor i18n usage guide"
```

- [ ] **Step 4: Final status check**

Run: `git status --short --branch`
Expected: clean working tree on current branch.

- [ ] **Step 5: Prepare release note draft in commit message body (no file change)**

```bash
git log --oneline -n 6
```

Expected: latest commits clearly show i18n/runtime/docs changes for release notes.

## Self-Review

- Spec coverage:
  - Editor i18n store + fallback: Task 1.
  - Plugin `titleKey + i18n` and old `title` compatibility: Task 2-3.
  - Vue2/Vue3/React `locale/messages` props: Task 4.
  - Docs `/` 中文 and `/en/` 英文: Task 5.
  - Usage documentation and final validation: Task 6.
- Placeholder scan:
  - All tasks include explicit file paths, commands, and expected outcomes.
- Type consistency:
  - `messages` uses `Record<string, Record<string, string>>` across store, plugin protocol, and wrapper props.
