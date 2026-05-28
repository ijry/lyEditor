# 快速开始

## 安装

```bash
pnpm install
```

## 本地开发文档

```bash
pnpm --filter docs-site docs:dev
```

## 最小初始化

```ts
import { createEditorCore } from '@ly-editor/core'
import { createPluginRegistry } from '@ly-editor/plugin-kit'

const editor = createEditorCore({ initialText: 'Hello lyEditor' })
const plugins = createPluginRegistry({ locale: 'zh-CN' })
```

## 下一步

- 阅读 [核心概念](/guide/core-concepts)
- 查看 [编辑器 API](/guide/editor-api)
