# Homepage Professional Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 docs 首页重构为专业化营销型门面，突出“企业可扩展 + 插件生态”，并保持中英双语一致与现有文档路由稳定。

**Architecture:** 采用 VitePress 主题内全自定义首页组件方案：`HomeLanding.vue` 负责首页结构与渲染，`home-content.ts` 负责中英文内容模型，`home.css` 负责视觉系统；中文 `/` 与英文 `/en/` 首页仅挂载同一组件并传入不同 locale。

**Tech Stack:** VitePress, Vue 3 (SFC + `<script setup lang="ts">`), TypeScript, pnpm.

---

## File Structure Map

- `docs-site/.vitepress/theme/components/home-content.ts`
  - 首页文案与结构化数据（中英双语），包含 CTA、生态背书、对比优势、能力入口。
- `docs-site/.vitepress/theme/components/HomeLanding.vue`
  - 首页主组件，渲染 Hero、Demo、生态背书、对比区、能力入口。
- `docs-site/.vitepress/theme/home.css`
  - 首页视觉样式，使用 `landing-*` 前缀隔离样式影响。
- `docs-site/.vitepress/theme/index.ts`
  - 注册 `HomeLanding` 全局组件并加载 `home.css`。
- `docs-site/index.md`
  - 中文首页挂载组件入口。
- `docs-site/en/index.md`
  - 英文首页挂载组件入口。

### Task 1: Add Locale-Driven Home Content Model

**Files:**
- Create: `docs-site/.vitepress/theme/components/home-content.ts`
- Test: `docs-site/.vitepress/theme/components/home-content.ts` (type check via docs build)

- [ ] **Step 1: 创建 `home-content.ts` 并写入完整结构化内容**

```ts
// docs-site/.vitepress/theme/components/home-content.ts
export type HomeLocale = 'zh-CN' | 'en-US'

type Cta = {
  label: string
  href: string
}

type IntegrationItem = {
  title: string
  description: string
}

type ComparisonRow = {
  topic: string
  traditional: string
  lyEditor: string
}

type CapabilityCard = {
  title: string
  description: string
  href: string
}

type HomeContent = {
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    primaryCta: Cta
    secondaryCta: Cta
  }
  demo: {
    title: string
    note: string
  }
  integrations: {
    title: string
    subtitle: string
    items: IntegrationItem[]
  }
  comparison: {
    title: string
    subtitle: string
    headers: {
      topic: string
      traditional: string
      lyEditor: string
    }
    rows: ComparisonRow[]
  }
  capabilities: {
    title: string
    subtitle: string
    cards: CapabilityCard[]
  }
}

export const homeContent: Record<HomeLocale, HomeContent> = {
  'zh-CN': {
    hero: {
      eyebrow: '企业级富文本基础设施',
      title: '面向二次开发的插件化编辑器平台',
      subtitle:
        'lyEditor 以 Slate.js 为内核、Snabbdom 为视图更新层，聚焦可扩展插件体系、稳定渲染链路与企业长期演进能力。',
      primaryCta: {
        label: '快速开始',
        href: '/guide/getting-started'
      },
      secondaryCta: {
        label: '在线访问',
        href: 'https://ijry.github.io/lyEditor/'
      }
    },
    demo: {
      title: '内置编辑器演示',
      note: '该演示用于说明交互形态，生产环境请基于插件清单与后端策略完成完整配置。'
    },
    integrations: {
      title: '生态集成背书',
      subtitle: '覆盖前端框架、云存储链路与工程化扩展能力，降低企业接入成本。',
      items: [
        {
          title: '框架生态',
          description: '提供 Vue2、Vue3、React 官方封装组件，统一编辑器 API 与配置方式。'
        },
        {
          title: '存储生态',
          description: '支持服务器上传与 OSS/COS/七牛前端直传，适配主流文件链路。'
        },
        {
          title: '工程生态',
          description: '工具栏即插件，功能按插件声明组装，支持独立扩展与版本演进。'
        }
      ]
    },
    comparison: {
      title: '对比优势',
      subtitle: '针对传统富文本集成的常见痛点，提供可维护的工程化方案。',
      headers: {
        topic: '能力维度',
        traditional: '传统接入方式',
        lyEditor: 'lyEditor'
      },
      rows: [
        {
          topic: '扩展机制',
          traditional: '核心逻辑耦合，新增功能改动范围大',
          lyEditor: '插件协议驱动，功能扩展边界清晰'
        },
        {
          topic: '渲染稳定性',
          traditional: '视图与模型混杂，复杂场景易回归',
          lyEditor: 'Model/View 分离，状态流可追踪'
        },
        {
          topic: '多端封装',
          traditional: '框架实现割裂，维护成本高',
          lyEditor: 'Vue2/Vue3/React 统一 API 语义'
        },
        {
          topic: '上传链路',
          traditional: '单一上传模式，迁移云厂商成本高',
          lyEditor: '服务器上传 + 多云直传并存'
        }
      ]
    },
    capabilities: {
      title: '能力矩阵与入口',
      subtitle: '从核心机制到业务场景，按模块快速定位文档。',
      cards: [
        {
          title: '插件体系',
          description: '理解插件声明、生命周期与工具栏组装方式。',
          href: '/guide/plugins'
        },
        {
          title: '编辑器 API',
          description: '掌握实例方法、命令执行与状态读写接口。',
          href: '/guide/editor-api'
        },
        {
          title: '表格扩展',
          description: '查看可视化表格能力与扩展建议。',
          href: '/guide/table'
        },
        {
          title: '上传集成',
          description: '配置服务端接口与 OSS/COS/七牛直传方案。',
          href: '/guide/upload'
        },
        {
          title: '多语言',
          description: '配置 locale/messages 与插件文案多语言策略。',
          href: '/guide/i18n'
        },
        {
          title: '后端样例',
          description: '获取 Node、Java、Go 的上传接口示例。',
          href: '/backend-samples/node-express'
        }
      ]
    }
  },
  'en-US': {
    hero: {
      eyebrow: 'Enterprise Rich Text Infrastructure',
      title: 'A Plugin-First Editor Platform for Extensible Products',
      subtitle:
        'lyEditor combines Slate.js core with a Snabbdom view layer to deliver extensibility, predictable rendering, and long-term enterprise maintainability.',
      primaryCta: {
        label: 'Getting Started',
        href: '/en/guide/getting-started'
      },
      secondaryCta: {
        label: 'Live Site',
        href: 'https://ijry.github.io/lyEditor/'
      }
    },
    demo: {
      title: 'Built-in Editor Demo',
      note: 'This demo illustrates interaction only. Production rollout should include plugin manifests and backend upload policies.'
    },
    integrations: {
      title: 'Ecosystem Integrations',
      subtitle: 'Cover framework wrappers, cloud upload paths, and extension-ready engineering contracts.',
      items: [
        {
          title: 'Framework Layer',
          description: 'Official wrappers for Vue2, Vue3, and React with consistent editor APIs.'
        },
        {
          title: 'Storage Layer',
          description: 'Supports server upload plus direct upload to OSS, COS, and Qiniu.'
        },
        {
          title: 'Engineering Layer',
          description: 'Toolbar-by-plugin architecture with clear extension boundaries.'
        }
      ]
    },
    comparison: {
      title: 'Why lyEditor',
      subtitle: 'Compared to traditional rich text integrations, lyEditor keeps extensibility and stability explicit.',
      headers: {
        topic: 'Dimension',
        traditional: 'Traditional Approach',
        lyEditor: 'lyEditor'
      },
      rows: [
        {
          topic: 'Extensibility',
          traditional: 'Core logic is tightly coupled and hard to evolve',
          lyEditor: 'Plugin contracts keep features modular and isolated'
        },
        {
          topic: 'Rendering Stability',
          traditional: 'Model and view concerns are mixed',
          lyEditor: 'Model/view separation with predictable state flow'
        },
        {
          topic: 'Framework Wrappers',
          traditional: 'Different wrappers drift in behavior',
          lyEditor: 'Unified API semantics across Vue2/Vue3/React'
        },
        {
          topic: 'Upload Strategy',
          traditional: 'Single upload path with high migration cost',
          lyEditor: 'Server upload plus multi-cloud direct upload'
        }
      ]
    },
    capabilities: {
      title: 'Capability Matrix',
      subtitle: 'Jump directly to the module you need for implementation.',
      cards: [
        {
          title: 'Plugin System',
          description: 'Understand plugin contracts, lifecycle hooks, and toolbar metadata.',
          href: '/en/guide/plugins'
        },
        {
          title: 'Editor API',
          description: 'Use instance methods, commands, and state access patterns.',
          href: '/en/guide/editor-api'
        },
        {
          title: 'Table Extension',
          description: 'Review built-in table behavior and extension guidance.',
          href: '/en/guide/table'
        },
        {
          title: 'Upload Integration',
          description: 'Integrate backend signatures and cloud direct upload.',
          href: '/en/guide/upload'
        },
        {
          title: 'I18n',
          description: 'Configure locale/messages and plugin-level translations.',
          href: '/en/guide/i18n'
        },
        {
          title: 'Backend Samples',
          description: 'Use Node, Java, and Go reference API implementations.',
          href: '/en/backend-samples/node-express'
        }
      ]
    }
  }
}
```

- [ ] **Step 2: 构建验证内容文件可被 TS 正常消费**

Run: `pnpm --filter docs-site docs:build`  
Expected: PASS

- [ ] **Step 3: 提交内容模型文件**

```bash
git add docs-site/.vitepress/theme/components/home-content.ts
git commit -m "docs: add structured bilingual content model for home landing"
```

### Task 2: Build Full Home Landing Component

**Files:**
- Create: `docs-site/.vitepress/theme/components/HomeLanding.vue`
- Modify: `docs-site/.vitepress/theme/components/HomeLanding.vue` (iterative verification)
- Test: `docs-site/.vitepress/theme/components/HomeLanding.vue` (render in docs build)

- [ ] **Step 1: 创建 `HomeLanding.vue` 并写入完整组件实现**

```vue
<!-- docs-site/.vitepress/theme/components/HomeLanding.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import HomeEditorDemo from './HomeEditorDemo.vue'
import { homeContent, type HomeLocale } from './home-content'

const props = withDefaults(
  defineProps<{
    locale?: HomeLocale
  }>(),
  {
    locale: 'zh-CN'
  }
)

const normalizedLocale = computed<HomeLocale>(() => {
  return props.locale === 'en-US' ? 'en-US' : 'zh-CN'
})

const content = computed(() => homeContent[normalizedLocale.value])

const isExternalLink = (href: string) => /^https?:\/\//.test(href)
</script>

<template>
  <main class="landing-page">
    <section class="landing-hero">
      <p class="landing-eyebrow">{{ content.hero.eyebrow }}</p>
      <h1 class="landing-title">{{ content.hero.title }}</h1>
      <p class="landing-subtitle">{{ content.hero.subtitle }}</p>
      <div class="landing-cta">
        <a class="landing-btn landing-btn-primary" :href="content.hero.primaryCta.href">
          {{ content.hero.primaryCta.label }}
        </a>
        <a
          class="landing-btn landing-btn-secondary"
          :href="content.hero.secondaryCta.href"
          :target="isExternalLink(content.hero.secondaryCta.href) ? '_blank' : undefined"
          :rel="
            isExternalLink(content.hero.secondaryCta.href)
              ? 'noopener noreferrer'
              : undefined
          "
        >
          {{ content.hero.secondaryCta.label }}
        </a>
      </div>
    </section>

    <section class="landing-demo">
      <div class="landing-section-head">
        <h2>{{ content.demo.title }}</h2>
        <p>{{ content.demo.note }}</p>
      </div>
      <HomeEditorDemo />
    </section>

    <section class="landing-integrations">
      <div class="landing-section-head">
        <h2>{{ content.integrations.title }}</h2>
        <p>{{ content.integrations.subtitle }}</p>
      </div>
      <div class="landing-grid landing-grid-3">
        <article
          v-for="item in content.integrations.items"
          :key="item.title"
          class="landing-card"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section class="landing-comparison">
      <div class="landing-section-head">
        <h2>{{ content.comparison.title }}</h2>
        <p>{{ content.comparison.subtitle }}</p>
      </div>
      <div class="landing-comparison-table">
        <div class="landing-comparison-row landing-comparison-header">
          <strong>{{ content.comparison.headers.topic }}</strong>
          <strong>{{ content.comparison.headers.traditional }}</strong>
          <strong>{{ content.comparison.headers.lyEditor }}</strong>
        </div>
        <div
          v-for="row in content.comparison.rows"
          :key="row.topic"
          class="landing-comparison-row"
        >
          <span>{{ row.topic }}</span>
          <span class="landing-negative">{{ row.traditional }}</span>
          <span class="landing-positive">{{ row.lyEditor }}</span>
        </div>
      </div>
    </section>

    <section class="landing-capabilities">
      <div class="landing-section-head">
        <h2>{{ content.capabilities.title }}</h2>
        <p>{{ content.capabilities.subtitle }}</p>
      </div>
      <div class="landing-grid landing-grid-3">
        <a
          v-for="card in content.capabilities.cards"
          :key="card.title"
          :href="card.href"
          class="landing-card landing-card-link"
        >
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </a>
      </div>
    </section>
  </main>
</template>
```

- [ ] **Step 2: 构建验证组件渲染可通过**

Run: `pnpm --filter docs-site docs:build`  
Expected: PASS

- [ ] **Step 3: 提交首页组件文件**

```bash
git add docs-site/.vitepress/theme/components/HomeLanding.vue
git commit -m "docs: add full custom home landing component"
```

### Task 3: Add Landing Visual System Styles

**Files:**
- Create: `docs-site/.vitepress/theme/home.css`
- Test: `docs-site/.vitepress/theme/home.css` (style injection in build output)

- [ ] **Step 1: 创建 `home.css` 并写入专业化首页样式**

```css
/* docs-site/.vitepress/theme/home.css */
:root {
  --landing-primary: #0f2742;
  --landing-accent: #00a3a3;
  --landing-success: #22c55e;
  --landing-bg: #f4f7fb;
  --landing-card-bg: #ffffff;
  --landing-text: #111827;
  --landing-text-secondary: #4b5563;
  --landing-border: #d7e0ea;
  --landing-shadow: 0 10px 30px rgba(15, 39, 66, 0.08);
  --landing-radius: 16px;
}

.landing-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
  color: var(--landing-text);
  font-family: 'Noto Sans SC', 'Manrope', 'Inter', sans-serif;
}

.landing-hero {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--landing-border);
  border-radius: 24px;
  padding: 32px 28px;
  background:
    radial-gradient(circle at right top, rgba(0, 163, 163, 0.18), transparent 45%),
    linear-gradient(135deg, rgba(15, 39, 66, 0.96), rgba(18, 57, 94, 0.95));
  color: #f8fbff;
  box-shadow: var(--landing-shadow);
}

.landing-eyebrow {
  margin: 0 0 12px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
}

.landing-title {
  margin: 0 0 12px;
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.14;
  font-weight: 800;
}

.landing-subtitle {
  margin: 0;
  max-width: 820px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  line-height: 1.75;
}

.landing-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.landing-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.landing-btn:hover {
  transform: translateY(-1px);
}

.landing-btn-primary {
  background: #ffffff;
  color: var(--landing-primary);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.landing-btn-secondary {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.75);
  color: #ffffff;
}

.landing-section-head h2 {
  margin: 0;
  font-size: clamp(24px, 3vw, 32px);
  line-height: 1.2;
}

.landing-section-head p {
  margin: 10px 0 0;
  color: var(--landing-text-secondary);
  line-height: 1.8;
}

.landing-demo,
.landing-integrations,
.landing-comparison,
.landing-capabilities {
  border: 1px solid var(--landing-border);
  border-radius: var(--landing-radius);
  padding: 22px;
  background: var(--landing-card-bg);
  box-shadow: var(--landing-shadow);
}

.landing-grid {
  display: grid;
  gap: 16px;
  margin-top: 18px;
}

.landing-grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.landing-card {
  border: 1px solid var(--landing-border);
  border-radius: 14px;
  padding: 16px;
  background: linear-gradient(180deg, #ffffff, #f7fbff);
}

.landing-card h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.landing-card p {
  margin: 0;
  color: var(--landing-text-secondary);
  line-height: 1.7;
}

.landing-card-link {
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.landing-card-link:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 163, 163, 0.45);
  box-shadow: 0 8px 20px rgba(0, 163, 163, 0.16);
}

.landing-comparison-table {
  margin-top: 18px;
  border: 1px solid var(--landing-border);
  border-radius: 14px;
  overflow: hidden;
}

.landing-comparison-row {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr 1.1fr;
  gap: 14px;
  align-items: start;
  padding: 14px 16px;
  border-top: 1px solid var(--landing-border);
  background: #ffffff;
}

.landing-comparison-row:first-child {
  border-top: 0;
}

.landing-comparison-header {
  background: #edf3fa;
}

.landing-negative {
  color: #9ca3af;
}

.landing-positive {
  color: #0c6a57;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .landing-grid-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .landing-comparison-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .landing-page {
    gap: 20px;
  }

  .landing-hero {
    padding: 24px 18px;
  }

  .landing-cta {
    flex-direction: column;
  }

  .landing-btn {
    width: 100%;
  }

  .landing-grid-3 {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: 构建并检查首页样式标记出现在产物中**

Run: `pnpm --filter docs-site docs:build`  
Expected: PASS

Run: `rg -n "landing-hero|landing-comparison|landing-capabilities" docs-site/.vitepress/dist/index.html docs-site/.vitepress/dist/en/index.html`  
Expected: all class markers are found in both locale home pages

- [ ] **Step 3: 提交首页样式文件**

```bash
git add docs-site/.vitepress/theme/home.css
git commit -m "docs: add professional landing style system"
```

### Task 4: Wire Theme Registration and Home Entrypoints

**Files:**
- Modify: `docs-site/.vitepress/theme/index.ts`
- Modify: `docs-site/index.md`
- Modify: `docs-site/en/index.md`
- Test: docs homepage render + locale routes

- [ ] **Step 1: 更新主题入口，注册 `HomeLanding` 并引入 `home.css`**

```ts
// docs-site/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HomeEditorDemo from './components/HomeEditorDemo.vue'
import HomeLanding from './components/HomeLanding.vue'
import './home.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeEditorDemo', HomeEditorDemo)
    app.component('HomeLanding', HomeLanding)
  }
} satisfies Theme
```

- [ ] **Step 2: 更新中文首页为组件挂载入口**

```md
<!-- docs-site/index.md -->
<HomeLanding locale="zh-CN" />
```

- [ ] **Step 3: 更新英文首页为组件挂载入口**

```md
<!-- docs-site/en/index.md -->
<HomeLanding locale="en-US" />
```

- [ ] **Step 4: 构建验证首页中英路由和按钮文本**

Run: `pnpm --filter docs-site docs:build`  
Expected: PASS

Run: `rg -n "快速开始|在线访问|Getting Started|Live Site" docs-site/.vitepress/dist/index.html docs-site/.vitepress/dist/en/index.html`  
Expected: Chinese and English CTA texts are present in corresponding pages

- [ ] **Step 5: 提交主题接线和首页入口变更**

```bash
git add docs-site/.vitepress/theme/index.ts docs-site/index.md docs-site/en/index.md
git commit -m "docs: wire custom bilingual home landing into vitepress theme"
```

### Task 5: Final Verification and Deployment Readiness

**Files:**
- Verify: `docs-site/.vitepress/config.ts` (`base: '/lyEditor/'` remains)
- Verify: `docs-site/.vitepress/dist/*` build output

- [ ] **Step 1: 检查 base 配置仍为 GitHub Pages 项目路径**

Run: `rg -n "base:\\s*'/lyEditor/'" docs-site/.vitepress/config.ts`  
Expected: one matched line

- [ ] **Step 2: 运行文档构建与主测试**

Run: `pnpm --filter docs-site docs:build`  
Expected: PASS

Run: `pnpm test`  
Expected: PASS

- [ ] **Step 3: 检查构建产物链接前缀与首页结构标记**

Run: `rg -n "/lyEditor/assets|/lyEditor/en/|landing-hero|landing-comparison" docs-site/.vitepress/dist/index.html docs-site/.vitepress/dist/en/index.html`  
Expected: all markers are found

- [ ] **Step 4: 检查 git 工作区并准备推送**

Run: `git status --short --branch`  
Expected: clean working tree except intentionally untracked planning files

- [ ] **Step 5: 汇总提交并推送**

```bash
git log --oneline -n 8
git push origin main
```

Expected: push succeeds and triggers `deploy-docs` workflow

## Self-Review

- Spec coverage:
  - 专业营销型首页结构（Hero、Demo、背书、对比、能力入口）：Task 2-4
  - 主/次 CTA 跳转策略：Task 1 + Task 2 + Task 4
  - 中英双语统一组件：Task 1 + Task 4
  - 保持 GitHub Pages 子路径稳定：Task 5
- Placeholder scan:
  - 无占位词与未定义步骤。
- Type consistency:
  - `HomeLocale` 在 `home-content.ts` 与 `HomeLanding.vue` 一致使用 `zh-CN | en-US`。
