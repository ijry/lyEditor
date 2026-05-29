# Docs Productization + Pages + Home Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将文档站升级为完整双语知识库（中英镜像）、首页内置可交互编辑器示例，并通过 GitHub Actions 自动发布到 GitHub Pages。

**Architecture:** 在 `docs-site` 内完成信息架构与内容扩展；通过 VitePress 自定义主题挂载 `HomeEditorDemo` 组件；新增独立 `deploy-docs.yml` 工作流执行 Pages 发布，保持与现有 CI 解耦。

**Tech Stack:** VitePress, Vue 3, GitHub Actions, pnpm workspace.

---

## File Structure Map

- `docs-site/.vitepress/config.ts`
  - 中英文导航、侧边栏、信息架构入口。
- `docs-site/.vitepress/theme/index.ts`
  - 自定义主题注入首页 Demo 组件。
- `docs-site/.vitepress/theme/components/HomeEditorDemo.vue`
  - 首页编辑器实例演示组件（纯演示）。
- `docs-site/index.md`
- `docs-site/guide/*.md`
- `docs-site/backend-samples/*.md`
  - 中文文档正文与首页入口。
- `docs-site/en/index.md`
- `docs-site/en/guide/*.md`
- `docs-site/en/backend-samples/*.md`
  - 英文镜像正文。
- `.github/workflows/deploy-docs.yml`
  - Docs 独立发布流程。
- `README.md`
  - 文档开发与发布说明补充。

### Task 1: Rebuild VitePress Information Architecture

**Files:**
- Modify: `docs-site/.vitepress/config.ts`
- Test: `docs-site/.vitepress/config.ts` (docs build validation)

- [ ] **Step 1: 先写会失败的导航结构变更（指向新章节）**

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
          { text: 'API', link: '/guide/editor-api' },
          { text: '示例', link: '/guide/custom-plugin' },
          { text: '后端', link: '/backend-samples/node-express' },
          { text: 'FAQ', link: '/guide/faq' }
        ],
        sidebar: [
          {
            text: '入门',
            items: [
              { text: '快速开始', link: '/guide/getting-started' },
              { text: '核心概念', link: '/guide/core-concepts' }
            ]
          },
          {
            text: '开发与扩展',
            items: [
              { text: '编辑器 API', link: '/guide/editor-api' },
              { text: '插件体系', link: '/guide/plugins' },
              { text: '自定义插件实战', link: '/guide/custom-plugin' },
              { text: '表格扩展', link: '/guide/table' },
              { text: '上传集成', link: '/guide/upload' },
              { text: '多语言', link: '/guide/i18n' }
            ]
          },
          {
            text: '工程实践',
            items: [
              { text: '最佳实践', link: '/guide/best-practices' },
              { text: '常见问题', link: '/guide/faq' },
              { text: '迁移指南', link: '/guide/migration' }
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
          { text: 'API', link: '/en/guide/editor-api' },
          { text: 'Examples', link: '/en/guide/custom-plugin' },
          { text: 'Backend', link: '/en/backend-samples/node-express' },
          { text: 'FAQ', link: '/en/guide/faq' }
        ],
        sidebar: [
          {
            text: 'Start',
            items: [
              { text: 'Getting Started', link: '/en/guide/getting-started' },
              { text: 'Core Concepts', link: '/en/guide/core-concepts' }
            ]
          },
          {
            text: 'Build & Extend',
            items: [
              { text: 'Editor API', link: '/en/guide/editor-api' },
              { text: 'Plugins', link: '/en/guide/plugins' },
              { text: 'Custom Plugin Tutorial', link: '/en/guide/custom-plugin' },
              { text: 'Table Extension', link: '/en/guide/table' },
              { text: 'Upload Integration', link: '/en/guide/upload' },
              { text: 'I18n', link: '/en/guide/i18n' }
            ]
          },
          {
            text: 'Engineering',
            items: [
              { text: 'Best Practices', link: '/en/guide/best-practices' },
              { text: 'FAQ', link: '/en/guide/faq' },
              { text: 'Migration', link: '/en/guide/migration' }
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

- [ ] **Step 2: 运行构建验证会失败（因为新页面还未创建）**

Run: `pnpm --filter docs-site docs:build`
Expected: FAIL with missing markdown pages referenced by new nav/sidebar links.

- [ ] **Step 3: 提交 IA 配置变更**

```bash
git add docs-site/.vitepress/config.ts
git commit -m "docs: restructure vitepress IA for full bilingual sections"
```

### Task 2: Add Full Chinese Documentation Content

**Files:**
- Modify: `docs-site/index.md`
- Modify: `docs-site/guide/getting-started.md`
- Create: `docs-site/guide/core-concepts.md`
- Create: `docs-site/guide/editor-api.md`
- Create: `docs-site/guide/plugins.md`
- Create: `docs-site/guide/custom-plugin.md`
- Create: `docs-site/guide/table.md`
- Modify: `docs-site/guide/upload.md`
- Modify: `docs-site/guide/i18n.md`
- Create: `docs-site/guide/best-practices.md`
- Create: `docs-site/guide/faq.md`
- Create: `docs-site/guide/migration.md`
- Modify: `docs-site/backend-samples/node-express.md`
- Modify: `docs-site/backend-samples/java-spring-boot.md`
- Modify: `docs-site/backend-samples/go-gin.md`

- [ ] **Step 1: 写入首页与章节正文（中文）**

```md
<!-- docs-site/index.md -->
# lyEditor 文档

新一代富文本编辑器，支持插件化扩展、表格体验、多框架封装与上传体系。

<HomeEditorDemo />

## 学习路径

- [快速开始](/guide/getting-started)
- [核心概念](/guide/core-concepts)
- [编辑器 API](/guide/editor-api)
- [插件体系](/guide/plugins)
- [自定义插件实战](/guide/custom-plugin)
- [表格扩展](/guide/table)
- [上传集成](/guide/upload)
- [多语言](/guide/i18n)
- [最佳实践](/guide/best-practices)
- [常见问题](/guide/faq)
- [迁移指南](/guide/migration)
```

```md
<!-- docs-site/guide/core-concepts.md -->
# 核心概念

## 分层架构

- `core`: 文档模型与命令执行
- `view-snabbdom`: 视图更新与事件桥接
- `plugin-kit`: 插件协议与工具栏元数据

## 数据流

1. 交互事件进入视图层
2. 转换为命令并发送给内核
3. 内核产出新快照
4. 视图层增量更新
```

```md
<!-- docs-site/guide/editor-api.md -->
# 编辑器 API

## 组件 Props

- `locale`
- `messages`
- `plugins`
- `readonly`

## 常用实例方法

- `exec(command, payload)`
- `getValue()`
- `setValue(value)`
```

```md
<!-- docs-site/guide/plugins.md -->
# 插件体系

每个功能都是插件，工具栏由插件声明驱动。

## 插件结构

- `id`
- `toolbar`
- `i18n`
- `hooks`
```

```md
<!-- docs-site/guide/custom-plugin.md -->
# 自定义插件实战

## 目标

实现一个 `highlight` 插件，增加工具栏按钮并注册文案。

## 步骤

1. 定义插件对象
2. 配置 `toolbar.titleKey`
3. 提供 `zh-CN/en-US` 文案
4. 注册到编辑器实例
```

```md
<!-- docs-site/guide/table.md -->
# 表格扩展

## 内置能力

- 插入/删除行列
- 合并/拆分单元格
- 键盘导航

## 扩展建议

通过命令层封装复杂批量操作，避免直接操作节点树。
```

```md
<!-- docs-site/guide/best-practices.md -->
# 最佳实践

## 性能

- 避免频繁全量重渲染
- 大文档操作使用批量命令

## 稳定性

- 插件异常隔离
- 对外 API 版本化
```

```md
<!-- docs-site/guide/faq.md -->
# 常见问题

## Q: 工具栏文案为什么显示 key？
A: 当前语言与回退语言都缺失对应文案，请检查 `messages` 与插件 `i18n`。

## Q: 上传签名失败怎么办？
A: 优先检查服务端时间、token 过期与 CORS 配置。
```

```md
<!-- docs-site/guide/migration.md -->
# 迁移指南

## 0.1 -> 0.2

- 工具栏文案从 `title` 迁移到 `titleKey`
- 建议补充插件 `i18n` 字典
```

- [ ] **Step 2: 本地构建验证（中文章节完整）**

Run: `pnpm --filter docs-site docs:build`
Expected: PASS with all new Chinese routes rendered.

- [ ] **Step 3: 提交中文文档扩充**

```bash
git add docs-site/index.md docs-site/guide docs-site/backend-samples
git commit -m "docs: expand chinese documentation to full edition"
```

### Task 3: Add English Mirror Documentation

**Files:**
- Modify: `docs-site/en/index.md`
- Modify: `docs-site/en/guide/getting-started.md`
- Create: `docs-site/en/guide/core-concepts.md`
- Create: `docs-site/en/guide/editor-api.md`
- Create: `docs-site/en/guide/plugins.md`
- Create: `docs-site/en/guide/custom-plugin.md`
- Create: `docs-site/en/guide/table.md`
- Modify: `docs-site/en/guide/upload.md`
- Create: `docs-site/en/guide/i18n.md`
- Create: `docs-site/en/guide/best-practices.md`
- Create: `docs-site/en/guide/faq.md`
- Create: `docs-site/en/guide/migration.md`
- Modify: `docs-site/en/backend-samples/node-express.md`
- Modify: `docs-site/en/backend-samples/java-spring-boot.md`
- Modify: `docs-site/en/backend-samples/go-gin.md`

- [ ] **Step 1: 写入英文镜像页面**

```md
<!-- docs-site/en/index.md -->
# lyEditor Docs

A next-generation rich text editor with plugin architecture, table support, multi-framework wrappers, and upload integrations.

<HomeEditorDemo />

## Learning Path

- [Getting Started](/en/guide/getting-started)
- [Core Concepts](/en/guide/core-concepts)
- [Editor API](/en/guide/editor-api)
- [Plugins](/en/guide/plugins)
- [Custom Plugin Tutorial](/en/guide/custom-plugin)
- [Table Extension](/en/guide/table)
- [Upload Integration](/en/guide/upload)
- [I18n](/en/guide/i18n)
- [Best Practices](/en/guide/best-practices)
- [FAQ](/en/guide/faq)
- [Migration](/en/guide/migration)
```

```md
<!-- docs-site/en/guide/core-concepts.md -->
# Core Concepts

## Layered Architecture

- `core`: model and command execution
- `view-snabbdom`: rendering and event bridge
- `plugin-kit`: plugin contract and toolbar metadata
```

```md
<!-- docs-site/en/guide/editor-api.md -->
# Editor API

## Component Props

- `locale`
- `messages`
- `plugins`
- `readonly`

## Instance Methods

- `exec(command, payload)`
- `getValue()`
- `setValue(value)`
```

```md
<!-- docs-site/en/guide/plugins.md -->
# Plugins

Each feature is implemented as a plugin. The toolbar is driven by plugin metadata.
```

```md
<!-- docs-site/en/guide/custom-plugin.md -->
# Custom Plugin Tutorial

Build a `highlight` plugin with toolbar integration and bilingual labels.
```

```md
<!-- docs-site/en/guide/table.md -->
# Table Extension

Built-in capabilities:
- insert/remove rows and columns
- merge/split cells
- keyboard navigation
```

```md
<!-- docs-site/en/guide/i18n.md -->
# I18n

The wrappers accept:
- `locale`
- `messages`

Built-in locales:
- `zh-CN`
- `en-US`
```

```md
<!-- docs-site/en/guide/best-practices.md -->
# Best Practices

- Keep plugins isolated
- Use command-layer extensions for complex operations
- Keep locale keys stable across versions
```

```md
<!-- docs-site/en/guide/faq.md -->
# FAQ

## Why do I see raw title keys?
It means translation dictionaries are missing for both active and fallback locales.
```

```md
<!-- docs-site/en/guide/migration.md -->
# Migration

## 0.1 -> 0.2

- migrate toolbar labels from `title` to `titleKey`
- add plugin `i18n` dictionaries
```

- [ ] **Step 2: 构建并检查英文路由产物**

Run: `pnpm --filter docs-site docs:build`
Expected: PASS.

Run: `rg --files docs-site/.vitepress/dist | ForEach-Object { $_ -replace '\\','/' } | rg "en/index.html|en/guide/core-concepts.html|en/guide/editor-api.html|en/guide/plugins.html|en/guide/custom-plugin.html|en/guide/table.html|en/guide/i18n.html|en/guide/best-practices.html|en/guide/faq.html|en/guide/migration.html"`
Expected: all listed english routes exist.

- [ ] **Step 3: 提交英文镜像文档**

```bash
git add docs-site/en
git commit -m "docs: add full english mirror content"
```

### Task 4: Integrate Home Editor Demo in VitePress Theme

**Files:**
- Create: `docs-site/.vitepress/theme/index.ts`
- Create: `docs-site/.vitepress/theme/components/HomeEditorDemo.vue`
- Modify: `docs-site/index.md`
- Modify: `docs-site/en/index.md`

- [ ] **Step 1: 先写 Demo 引用触发失败（组件未创建前）**

```md
<!-- docs-site/index.md and docs-site/en/index.md include -->
<HomeEditorDemo />
```

- [ ] **Step 2: 构建验证会失败（组件尚未注册）**

Run: `pnpm --filter docs-site docs:build`
Expected: FAIL with unknown component `HomeEditorDemo`.

- [ ] **Step 3: 实现主题扩展与 Demo 组件**

```ts
// docs-site/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HomeEditorDemo from './components/HomeEditorDemo.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeEditorDemo', HomeEditorDemo)
  }
} satisfies Theme
```

```vue
<!-- docs-site/.vitepress/theme/components/HomeEditorDemo.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const locale = ref<'zh-CN' | 'en-US'>('zh-CN')
const content = ref('Hello lyEditor')

const labels = {
  'zh-CN': {
    title: '编辑器演示',
    bold: '加粗',
    italic: '斜体',
    underline: '下划线'
  },
  'en-US': {
    title: 'Editor Demo',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline'
  }
} as const
</script>

<template>
  <section class="home-editor-demo">
    <header class="demo-header">
      <strong>{{ labels[locale].title }}</strong>
      <div class="locale-switch">
        <button type="button" @click="locale = 'zh-CN'">中文</button>
        <button type="button" @click="locale = 'en-US'">EN</button>
      </div>
    </header>

    <div class="toolbar">
      <button type="button">{{ labels[locale].bold }}</button>
      <button type="button">{{ labels[locale].italic }}</button>
      <button type="button">{{ labels[locale].underline }}</button>
    </div>

    <div class="editor" contenteditable="true">{{ content }}</div>
  </section>
</template>

<style scoped>
.home-editor-demo { border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 16px; margin: 16px 0; }
.demo-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.locale-switch { display: flex; gap: 8px; }
.toolbar { display: flex; gap: 8px; margin-bottom: 12px; }
.editor { min-height: 120px; border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 12px; background: var(--vp-c-bg-soft); }
</style>
```

- [ ] **Step 4: 构建并验证首页可渲染**

Run: `pnpm --filter docs-site docs:build`
Expected: PASS.

Run: `rg -n "home-editor-demo|Editor Demo|编辑器演示" docs-site/.vitepress/dist/index.html docs-site/.vitepress/dist/en/index.html`
Expected: component text markers appear in both home pages.

- [ ] **Step 5: 提交首页 Demo 集成**

```bash
git add docs-site/.vitepress/theme docs-site/index.md docs-site/en/index.md
git commit -m "docs: embed home editor demo component"
```

### Task 5: Add GitHub Pages Auto-Deploy Workflow

**Files:**
- Create: `.github/workflows/deploy-docs.yml`

- [ ] **Step 1: 写入发布工作流**

```yaml
name: deploy-docs

on:
  push:
    branches: [main]
    paths:
      - 'docs-site/**'
      - '.github/workflows/deploy-docs.yml'
      - 'pnpm-lock.yaml'
      - 'package.json'
      - 'pnpm-workspace.yaml'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
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
      - run: pnpm --filter docs-site docs:build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs-site/.vitepress/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 静态校验 workflow 文件**

Run: `rg -n "actions/deploy-pages@v4|actions/upload-pages-artifact@v3|actions/configure-pages@v5|permissions:" .github/workflows/deploy-docs.yml`
Expected: all required workflow keys and actions exist.

- [ ] **Step 3: 提交发布工作流**

```bash
git add .github/workflows/deploy-docs.yml
git commit -m "ci: add github pages docs deployment workflow"
```

### Task 6: Update README and Final Verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 补充文档开发与发布说明**

```md
<!-- append to README.md -->
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
```

- [ ] **Step 2: 运行全量验证**

Run: `pnpm test`
Expected: PASS.

Run: `pnpm --filter docs-site docs:build`
Expected: PASS.

Run: `git status --short --branch`
Expected: clean working tree (except explicitly untracked planning files if intentionally excluded).

- [ ] **Step 3: 提交收尾文档变更**

```bash
git add README.md
git commit -m "docs: add docs development and publishing guidance"
```

## Self-Review

- Spec coverage:
  - 文档结构升级（中英镜像）：Task 1-3
  - 首页编辑器实例：Task 4
  - GitHub Pages 自动发布：Task 5
  - 文档开发与发布说明：Task 6
- Placeholder scan:
  - 无 TBD/TODO 或模糊占位步骤。
- Type/contract consistency:
  - 中英文页面路径一一对应，导航链路与目录一致。
