<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import HomeEditorDemo from './components/HomeEditorDemo.vue'

const { site, lang, page } = useData()
const base = computed(() => site.value.base || '/')
const isEn = computed(() => lang.value === 'en-US' || page.value.relativePath.startsWith('en/'))

const zhContent = {
  eyebrow: '新一代富文本编辑器内核',
  heroTitle: 'lyEditor',
  heroLead:
    '基于 Slate.js（不依赖 React）与 Snabbdom 视图层构建，提供插件化能力、可视化表格体验、多框架封装与企业级上传集成方案。',
  heroPrimaryText: '快速开始',
  heroPrimaryHref: 'guide/getting-started',
  heroSecondaryText: '在线演示',
  heroSecondaryHref: 'https://ijry.github.io/lyEditor/',
  metricAria: '项目能力指标',
  heroVisualAria: 'lyEditor 界面预览',
  heroVisualTag: 'Editor Workspace',
  heroVisualDesktopAlt: 'lyEditor 工作区预览',
  heroVisualMobileAlt: 'lyEditor 移动视图预览',
  introKicker: '产品界面预览',
  introTitle: '首页直接展示可运行的编辑器能力',
  introLead:
    '围绕核心编辑体验、插件扩展、上传链路和后端对接，帮助团队快速评估并落地富文本基础设施。',
  merchantKicker: '框架封装能力',
  merchantTitle: '多框架封装：同一内核，不同技术栈复用',
  merchantLead: '官方提供 Vue2、Vue3、React 封装组件，统一 API 语义，降低跨端集成与维护成本。',
  merchantPanelTitle: '封装层核心价值',
  merchantDocText: '查看插件与封装文档',
  merchantDocHref: 'guide/plugins',
  marketingKicker: '上传链路能力',
  marketingTitle: '上传体系：服务端签名 + 多云直传',
  marketingLead: '支持服务器上传，以及 OSS / COS / 七牛前端直传，满足不同安全与部署策略。',
  capabilityKicker: '核心能力',
  capabilityTitle: '从编辑体验到扩展生态，一套体系覆盖生产需求',
  capabilityLead:
    'lyEditor 以插件协议组织功能，以 model/view 分离保证稳定性，适合二次开发和长期演进。',
  architectureKicker: '技术架构',
  architectureTitle: '内核稳定、视图可控、插件可扩展',
  architectureLead:
    '核心层负责文档模型和命令执行，视图层通过虚拟 DOM 增量更新；上传层抽象第三方云服务并统一接入方式。',
  architectureAria: 'lyEditor 架构示意',
  architectureCoreTitle: 'Editor Core',
  deliveryKicker: '文档入口',
  deliveryTitle: '面向开发者的完整交付入口',
  finalKicker: '部署与二次开发',
  finalTitle: '用可扩展编辑器底座启动你的业务场景',
  finalLead:
    '提供文档、样例与上传接口参考，支持快速验证、团队协作开发和持续迭代。',
  finalPrimaryText: '上传集成文档',
  finalPrimaryHref: 'guide/upload',
  finalSecondaryText: 'GitHub 仓库',
  metrics: [
    { value: '3', label: '官方框架封装' },
    { value: '10+', label: '可扩展插件能力' },
    { value: '4类', label: '上传接入模式' },
    { value: 'MIT', label: '开源协议' },
  ],
  showcase: [
    { title: '编辑工作区', image: 'h5-home.png', desc: '核心编辑区域、工具栏与扩展入口的整体布局示意。' },
    { title: '插件工具栏', image: 'h5-products.png', desc: '功能由插件声明驱动，支持按业务场景组合按钮与交互。' },
    { title: '文档导航', image: 'h5-orders.png', desc: '从快速开始到 API、上传、后端样例的完整学习路径。' },
  ],
  merchantAppShots: [
    { title: 'Vue 3 封装', image: 'eapp-dashboard.png', desc: '通过组件 Props 与实例 API 快速接入业务页面。' },
    { title: 'React 封装', image: 'eapp-orders.png', desc: '保持同一命令语义，降低多技术栈协作成本。' },
    { title: 'Vue 2 封装', image: 'eapp-products.png', desc: '兼容旧项目升级节奏，减少迁移阻力。' },
  ],
  merchantFunctions: [
    { title: '统一实例方法', desc: 'exec / getValue / setValue 在三套封装中语义保持一致。' },
    { title: '同构插件接入', desc: '插件注册与工具栏配置保持统一，避免框架差异导致重复开发。' },
    { title: '可控渲染链路', desc: '视图层独立演进，减少框架升级对核心行为的影响。' },
    { title: '文案多语言支持', desc: '封装层支持 locale/messages，便于国际化项目交付。' },
  ],
  marketingAppShots: [
    { title: '上传策略总览', image: 'eapp-marketing-index.png', desc: '统一配置服务端上传与前端直传策略。' },
    { title: '直传配置流程', image: 'eapp-marketing-seckill.png', desc: 'OSS / COS / 七牛凭证流程与前端参数规范。' },
  ],
  marketingFunctions: [
    { title: '服务端上传模式', desc: '适用于强管控场景，由后端统一接收并转存。' },
    { title: '多云前端直传', desc: '支持 OSS、COS、七牛，按环境切换驱动配置。' },
    { title: '统一回调协议', desc: '上传完成回调结构一致，便于业务层接入。' },
    { title: '后端样例即开即用', desc: '提供 Node / Java / Go 的接口样例与字段约定。' },
  ],
  capabilities: [
    { title: '核心编辑能力', desc: '文本、格式、命令执行和状态快照在同一内核内稳定运行。' },
    { title: '插件体系', desc: '每个工具栏功能都可插件化，支持团队按模块并行扩展。' },
    { title: '可视化表格', desc: '内置插入、删除、合并、拆分与导航等表格交互能力。' },
    { title: '上传扩展层', desc: '抽象上传适配器，兼容服务端上传与多云直传。' },
    { title: '多语言能力', desc: '编辑器与文档支持中英文，便于国际化文档协作。' },
    { title: '工程稳定性', desc: 'model/view 分离，避免复杂交互下的状态污染和渲染回归。' },
  ],
  architectureTopRow: ['Vue2', 'Vue3', 'React'],
  architectureCoreTags: ['slate-core', 'command', 'plugin-kit', 'table', 'upload'],
  architectureBottomRow: ['Snabbdom VDOM', 'OSS/COS/Qiniu', 'Node/Java/Go', 'VitePress'],
  channels: [
    { name: '快速开始', desc: '安装与初始化编辑器实例', href: 'guide/getting-started' },
    { name: '编辑器 API', desc: '命令执行与状态读写接口', href: 'guide/editor-api' },
    { name: '插件体系', desc: '扩展工具栏与自定义能力', href: 'guide/plugins' },
    { name: '上传集成', desc: 'OSS/COS/七牛与服务端签名', href: 'guide/upload' },
    { name: '后端样例', desc: 'Node / Java / Go 上传接口参考', href: 'backend-samples/node-express' },
    { name: 'English Docs', desc: '查看英文文档镜像', href: 'en/' },
  ],
}

const enContent = {
  eyebrow: 'Next-Gen Rich Text Infrastructure',
  heroTitle: 'lyEditor',
  heroLead:
    'Built on Slate.js core (without React dependency) and Snabbdom view updates, with plugin architecture, visual table UX, multi-framework wrappers, and production-ready upload integrations.',
  heroPrimaryText: 'Getting Started',
  heroPrimaryHref: 'en/guide/getting-started',
  heroSecondaryText: 'Live Demo',
  heroSecondaryHref: 'https://ijry.github.io/lyEditor/',
  metricAria: 'Project metrics',
  heroVisualAria: 'lyEditor preview',
  heroVisualTag: 'Editor Workspace',
  heroVisualDesktopAlt: 'lyEditor desktop preview',
  heroVisualMobileAlt: 'lyEditor mobile preview',
  introKicker: 'Product Preview',
  introTitle: 'Show real editor capabilities on the homepage',
  introLead:
    'From core editing and plugin extension to upload pipelines and backend integration, the homepage helps teams evaluate implementation readiness quickly.',
  merchantKicker: 'Framework Wrappers',
  merchantTitle: 'One core, multiple frameworks',
  merchantLead:
    'Official wrappers for Vue2, Vue3, and React provide consistent API semantics and reduce cross-stack integration cost.',
  merchantPanelTitle: 'Wrapper layer value',
  merchantDocText: 'View Plugin Docs',
  merchantDocHref: 'en/guide/plugins',
  marketingKicker: 'Upload Integrations',
  marketingTitle: 'Server upload + multi-cloud direct upload',
  marketingLead:
    'Support server upload and direct upload for OSS / COS / Qiniu to match different security and deployment strategies.',
  capabilityKicker: 'Core Capabilities',
  capabilityTitle: 'From editing UX to extension ecosystem',
  capabilityLead:
    'lyEditor organizes features through plugin contracts with model/view separation for long-term maintainability.',
  architectureKicker: 'Architecture',
  architectureTitle: 'Stable core, controllable view, extensible plugins',
  architectureLead:
    'Core handles model and commands, view uses incremental VDOM updates, and upload adapters isolate cloud provider differences.',
  architectureAria: 'lyEditor architecture map',
  architectureCoreTitle: 'Editor Core',
  deliveryKicker: 'Documentation Entry',
  deliveryTitle: 'Complete entry points for developers',
  finalKicker: 'Deployment & Extension',
  finalTitle: 'Build your business scenarios on an extensible editor foundation',
  finalLead:
    'Documentation, samples and backend interface references are ready for quick validation and long-term iteration.',
  finalPrimaryText: 'Upload Guide',
  finalPrimaryHref: 'en/guide/upload',
  finalSecondaryText: 'GitHub Repository',
  metrics: [
    { value: '3', label: 'Official Wrappers' },
    { value: '10+', label: 'Pluggable Features' },
    { value: '4', label: 'Upload Modes' },
    { value: 'MIT', label: 'Open Source License' },
  ],
  showcase: [
    { title: 'Editor Workspace', image: 'h5-home.png', desc: 'A complete layout with editor area, toolbar and extension entry points.' },
    { title: 'Plugin Toolbar', image: 'h5-products.png', desc: 'Toolbar actions are plugin-driven and can be composed per scenario.' },
    { title: 'Doc Navigation', image: 'h5-orders.png', desc: 'From quick start to API/upload/backend samples in one learning path.' },
  ],
  merchantAppShots: [
    { title: 'Vue 3 Wrapper', image: 'eapp-dashboard.png', desc: 'Integrate through component props and instance APIs.' },
    { title: 'React Wrapper', image: 'eapp-orders.png', desc: 'Keep identical command semantics across technical stacks.' },
    { title: 'Vue 2 Wrapper', image: 'eapp-products.png', desc: 'Support legacy projects and reduce migration friction.' },
  ],
  merchantFunctions: [
    { title: 'Unified instance APIs', desc: 'exec / getValue / setValue keep consistent semantics in all wrappers.' },
    { title: 'Shared plugin integration', desc: 'Plugin registration and toolbar config stay framework-agnostic.' },
    { title: 'Controlled rendering chain', desc: 'View layer evolves independently with minimal impact on core behavior.' },
    { title: 'I18n-ready wrappers', desc: 'locale/messages support is built in for international projects.' },
  ],
  marketingAppShots: [
    { title: 'Upload Strategy Overview', image: 'eapp-marketing-index.png', desc: 'Configure server upload and direct upload in one model.' },
    { title: 'Direct Upload Flow', image: 'eapp-marketing-seckill.png', desc: 'Credential flow and front-end field contracts for cloud providers.' },
  ],
  marketingFunctions: [
    { title: 'Server upload mode', desc: 'For high-control environments with centralized backend handling.' },
    { title: 'Multi-cloud direct upload', desc: 'OSS, COS, and Qiniu supported with switchable adapters.' },
    { title: 'Unified callback contract', desc: 'Consistent response shape for easier business integration.' },
    { title: 'Backend samples included', desc: 'Reference implementations for Node / Java / Go.' },
  ],
  capabilities: [
    { title: 'Core editing engine', desc: 'Text, formatting, commands, and snapshots run in a stable core.' },
    { title: 'Plugin architecture', desc: 'Each toolbar feature is pluggable for modular team extension.' },
    { title: 'Visual tables', desc: 'Built-in insert/delete/merge/split/navigation table operations.' },
    { title: 'Upload adapter layer', desc: 'Abstract adapters for server upload and direct cloud upload.' },
    { title: 'Bilingual support', desc: 'Editor and docs support Chinese and English out of the box.' },
    { title: 'Engineering stability', desc: 'Model/view separation reduces state pollution and render regressions.' },
  ],
  architectureTopRow: ['Vue2', 'Vue3', 'React'],
  architectureCoreTags: ['slate-core', 'command', 'plugin-kit', 'table', 'upload'],
  architectureBottomRow: ['Snabbdom VDOM', 'OSS/COS/Qiniu', 'Node/Java/Go', 'VitePress'],
  channels: [
    { name: 'Getting Started', desc: 'Install and bootstrap editor instances', href: 'en/guide/getting-started' },
    { name: 'Editor API', desc: 'Command execution and state access APIs', href: 'en/guide/editor-api' },
    { name: 'Plugins', desc: 'Extend toolbar and custom capabilities', href: 'en/guide/plugins' },
    { name: 'Upload', desc: 'Direct upload and server signing flows', href: 'en/guide/upload' },
    { name: 'Backend Samples', desc: 'Node / Java / Go integration samples', href: 'en/backend-samples/node-express' },
    { name: '中文文档', desc: 'Switch to Chinese docs', href: '' },
  ],
}

const content = computed(() => (isEn.value ? enContent : zhContent))
</script>

<template>
  <main class="lyshop-home">
    <section class="hero-shell">
      <div class="hero-inner">
        <div class="hero-copy">
          <div class="eyebrow">{{ content.eyebrow }}</div>
          <h1>{{ content.heroTitle }}</h1>
          <p class="hero-lead">{{ content.heroLead }}</p>
          <div class="hero-actions">
            <a class="btn primary" :href="`${base}${content.heroPrimaryHref}`">{{ content.heroPrimaryText }}</a>
            <a class="btn secondary" :href="content.heroSecondaryHref" target="_blank" rel="noreferrer">{{ content.heroSecondaryText }}</a>
          </div>
          <div class="metric-row" :aria-label="content.metricAria">
            <div v-for="item in content.metrics" :key="item.label" class="metric-item">
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>

        <div class="hero-visual" :aria-label="content.heroVisualAria">
          <div class="hero-demo-shell">
            <HomeEditorDemo :initialLocale="isEn ? 'en-US' : 'zh-CN'" />
          </div>
        </div>
      </div>
    </section>

    <section class="section intro-band">
      <div class="container split">
        <div>
          <span class="section-kicker">{{ content.introKicker }}</span>
          <h2>{{ content.introTitle }}</h2>
        </div>
        <p>{{ content.introLead }}</p>
      </div>
    </section>

    <section class="section preview-section">
      <div class="container preview-layout">
        <div class="preview-media">
          <div class="preview-map">
            <div class="map-row">
              <span v-for="item in content.architectureTopRow" :key="`p-top-${item}`">{{ item }}</span>
            </div>
            <div class="map-core">
              <strong>{{ content.architectureCoreTitle }}</strong>
              <div>
                <span v-for="item in content.architectureCoreTags" :key="`p-core-${item}`">{{ item }}</span>
              </div>
            </div>
            <div class="map-row">
              <span v-for="item in content.architectureBottomRow" :key="`p-bottom-${item}`">{{ item }}</span>
            </div>
          </div>
        </div>
        <aside class="preview-panel">
          <h3>{{ content.capabilityTitle }}</h3>
          <ul class="feature-list">
            <li v-for="item in content.capabilities.slice(0, 4)" :key="`preview-${item.title}`">
              <strong>{{ item.title }}</strong>
              <p>{{ item.desc }}</p>
            </li>
          </ul>
        </aside>
      </div>
    </section>

    <section class="section merchant-app-section">
      <div class="container">
        <div class="section-heading">
          <span class="section-kicker">{{ content.merchantKicker }}</span>
          <h2>{{ content.merchantTitle }}</h2>
          <p>{{ content.merchantLead }}</p>
        </div>
        <div class="marketing-feature-grid compact-grid">
          <article v-for="item in content.merchantFunctions" :key="item.title" class="capability-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </article>
        </div>
        <div class="section-action">
          <a class="btn primary" :href="`${base}${content.merchantDocHref}`">{{ content.merchantDocText }}</a>
        </div>
      </div>
    </section>

    <section class="section marketing-app-section">
      <div class="container">
        <div class="section-heading">
          <span class="section-kicker">{{ content.marketingKicker }}</span>
          <h2>{{ content.marketingTitle }}</h2>
          <p>{{ content.marketingLead }}</p>
        </div>
        <div class="marketing-feature-grid compact-grid">
          <article v-for="item in content.marketingFunctions" :key="item.title" class="capability-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section capability-section">
      <div class="container">
        <div class="section-heading">
          <span class="section-kicker">{{ content.capabilityKicker }}</span>
          <h2>{{ content.capabilityTitle }}</h2>
          <p>{{ content.capabilityLead }}</p>
        </div>
        <div class="capability-grid">
          <article v-for="item in content.capabilities" :key="item.title" class="capability-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section architecture-section">
      <div class="container architecture-layout">
        <div class="architecture-copy">
          <span class="section-kicker">{{ content.architectureKicker }}</span>
          <h2>{{ content.architectureTitle }}</h2>
          <p>{{ content.architectureLead }}</p>
          <div class="stack-list">
            <span v-for="item in content.architectureBottomRow" :key="item">{{ item }}</span>
          </div>
        </div>
        <div class="architecture-map" :aria-label="content.architectureAria">
          <div class="map-row">
            <span v-for="item in content.architectureTopRow" :key="item">{{ item }}</span>
          </div>
          <div class="map-core">
            <strong>{{ content.architectureCoreTitle }}</strong>
            <div>
              <span v-for="item in content.architectureCoreTags" :key="item">{{ item }}</span>
            </div>
          </div>
          <div class="map-row"><span v-for="item in content.architectureBottomRow" :key="`b-${item}`">{{ item }}</span></div>
        </div>
      </div>
    </section>

    <section class="section channel-section">
      <div class="container">
        <div class="section-heading">
          <span class="section-kicker">{{ content.deliveryKicker }}</span>
          <h2>{{ content.deliveryTitle }}</h2>
        </div>
        <div class="channel-grid">
          <a v-for="item in content.channels" :key="item.name" class="channel-card" :href="`${base}${item.href}`">
            <strong>{{ item.name }}</strong>
            <span>{{ item.desc }}</span>
          </a>
        </div>
      </div>
    </section>

    <section class="final-cta">
      <div class="container final-cta-inner">
        <div>
          <span class="section-kicker">{{ content.finalKicker }}</span>
          <h2>{{ content.finalTitle }}</h2>
          <p>{{ content.finalLead }}</p>
        </div>
        <div class="hero-actions">
          <a class="btn primary light" :href="`${base}${content.finalPrimaryHref}`">{{ content.finalPrimaryText }}</a>
          <a class="btn secondary light" href="https://github.com/ijry/lyEditor" target="_blank" rel="noreferrer">{{ content.finalSecondaryText }}</a>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.lyshop-home {
  --ly-bg: #f7fafc;
  --ly-panel: #ffffff;
  --ly-ink: #0f172a;
  --ly-muted: #475569;
  --ly-line: #e2e8f0;
  --ly-brand: #1f7a5c;
  --ly-blue: #2f9e7c;
  font-family: Inter, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  color: var(--ly-ink);
  background: var(--ly-bg);
}

.hero-shell {
  position: relative;
  overflow: hidden;
  padding: 92px 24px 72px;
  background:
    linear-gradient(135deg, rgba(10, 40, 31, 0.96), rgba(19, 62, 48, 0.96)),
    linear-gradient(90deg, #0d3529, #185241);
}

.container {
  max-width: 1180px;
  margin: 0 auto;
}

.hero-inner {
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(620px, 1.35fr);
  gap: 48px;
  align-items: center;
}

.eyebrow,
.section-kicker {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 28px;
  padding: 5px 12px;
  border: 1px solid rgba(31, 122, 92, 0.22);
  border-radius: 999px;
  background: rgba(31, 122, 92, 0.1);
  color: #1f7a5c;
  font-size: 13px;
  font-weight: 700;
}

.hero-shell .eyebrow {
  border-color: rgba(127, 211, 170, 0.38);
  background: rgba(127, 211, 170, 0.17);
  color: #e6fff2;
}

.hero-copy h1 {
  margin: 22px 0 18px;
  color: #fff;
  font-size: 58px;
  line-height: 1.08;
  font-weight: 850;
  letter-spacing: 0;
}

.hero-lead {
  margin: 0;
  max-width: 720px;
  color: rgba(255, 255, 255, 0.76);
  font-size: 18px;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 750;
  text-decoration: none;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
}

.btn.primary {
  border: 1px solid #55c08f;
  background: #1f7a5c;
  color: #fff;
  box-shadow: 0 16px 34px rgba(31, 122, 92, 0.3);
}

.btn.primary:hover {
  background: #16624a;
  color: #fff;
}

.btn.secondary {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.btn.secondary:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.btn.light.secondary {
  border-color: rgba(255, 255, 255, 0.28);
}

.metric-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 42px;
}

.metric-item {
  min-width: 0;
}

.metric-item strong {
  display: block;
  color: #fff;
  font-size: 30px;
  line-height: 1.1;
}

.metric-item span {
  display: block;
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.56);
  font-size: 13px;
}

.hero-visual {
  position: relative;
  min-height: 520px;
}

.hero-demo-shell {
  min-height: 520px;
  height: 100%;
  border: 1px solid rgba(148, 196, 176, 0.3);
  border-radius: 14px;
  background: rgba(7, 35, 26, 0.56);
  box-shadow: 0 20px 50px rgba(2, 18, 12, 0.34);
  backdrop-filter: blur(3px);
}

.hero-demo-shell :deep(.home-editor-demo) {
  --home-demo-editor-height: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
  border: 0;
  border-radius: 14px;
  background: transparent;
  padding: 18px;
}

.hero-demo-shell :deep(.demo-header strong) {
  color: #e2e8f0;
}

.hero-demo-shell :deep(.locale-switch button),
.hero-demo-shell :deep(.toolbar button),
.hero-demo-shell :deep(.action-btn),
.hero-demo-shell :deep(.toolbar-select),
.hero-demo-shell :deep(.toolbar-color) {
  border: 1px solid rgba(148, 196, 176, 0.34);
  border-radius: 8px;
  background: rgba(7, 35, 26, 0.58);
  color: #e6fff2;
}

.hero-demo-shell :deep(.toolbar-select select) {
  color: #e2e8f0;
}

.hero-demo-shell :deep(.toolbar-select span),
.hero-demo-shell :deep(.toolbar-color span) {
  color: #c7e7d9;
}

.hero-demo-shell :deep(.table-picker-panel) {
  border-color: rgba(148, 196, 176, 0.35);
  background: rgba(5, 28, 21, 0.94);
}

.hero-demo-shell :deep(.toolbar-menu-panel) {
  border-color: rgba(148, 196, 176, 0.35);
  background: rgba(5, 28, 21, 0.94);
}

.hero-demo-shell :deep(.toolbar-menu-item) {
  color: #e6fff2;
}

.hero-demo-shell :deep(.toolbar-menu-item:hover),
.hero-demo-shell :deep(.toolbar-menu-item.active) {
  border-color: #86efac;
  background: rgba(34, 197, 94, 0.25);
}

.hero-demo-shell :deep(.style-chip),
.hero-demo-shell :deep(.style-color-item) {
  border-color: rgba(148, 196, 176, 0.34);
  background: rgba(7, 35, 26, 0.58);
  color: #e6fff2;
}

.hero-demo-shell :deep(.style-chip:hover),
.hero-demo-shell :deep(.style-chip.active) {
  border-color: #86efac;
  color: #86efac;
  background: rgba(34, 197, 94, 0.2);
}

.hero-demo-shell :deep(.style-color-label) {
  color: #d8f3e4;
}

.hero-demo-shell :deep(.color-preset-label) {
  color: #c7e7d9;
}

.hero-demo-shell :deep(.color-swatch) {
  border-color: rgba(148, 196, 176, 0.34);
  background: rgba(7, 35, 26, 0.58);
}

.hero-demo-shell :deep(.color-swatch.active),
.hero-demo-shell :deep(.color-swatch:hover) {
  border-color: #86efac;
}

.hero-demo-shell :deep(.table-picker-cell) {
  border-color: rgba(148, 196, 176, 0.36);
  background: rgba(9, 45, 33, 0.62);
}

.hero-demo-shell :deep(.table-picker-cell.active) {
  border-color: #86efac;
  background: rgba(34, 197, 94, 0.32);
}

.hero-demo-shell :deep(.table-picker-text) {
  color: #c7e7d9;
}

.hero-demo-shell :deep(.editor) {
  border-color: rgba(148, 163, 184, 0.3);
  background: rgba(255, 255, 255, 0.96);
  color: #0f172a;
  min-height: 0;
  overflow-y: auto;
}

.browser-frame,
.phone-frame,
.showcase-card,
.capability-card,
.channel-card,
.architecture-map {
  border: 1px solid var(--ly-line);
  background: var(--ly-panel);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
}

.browser-frame {
  overflow: hidden;
  border-radius: 14px;
}

.browser-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 14px;
  border-bottom: 1px solid var(--ly-line);
  background: #f8fafc;
}

.browser-bar span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #cbd5e1;
}

.browser-bar em {
  margin-left: 8px;
  color: #64748b;
  font-size: 12px;
  font-style: normal;
}

.browser-frame img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top center;
}

.phone-frame {
  position: absolute;
  right: 22px;
  bottom: 0;
  width: 168px;
  overflow: hidden;
  border: 8px solid #0f172a;
  border-radius: 28px;
  background: #0f172a;
}

.phone-frame img,
.phone-shot img {
  display: block;
  width: 100%;
  aspect-ratio: 390 / 844;
  object-fit: cover;
  object-position: top center;
  background: #fff;
}

.section {
  padding: 76px 24px;
}

.split {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 48px;
  align-items: end;
}

.split h2,
.section-heading h2,
.architecture-copy h2,
.final-cta h2 {
  margin: 16px 0 0;
  color: var(--ly-ink);
  font-size: 34px;
  line-height: 1.25;
  font-weight: 850;
  letter-spacing: 0;
}

.split p,
.section-heading p,
.architecture-copy p,
.final-cta p {
  margin: 0;
  color: var(--ly-muted);
  font-size: 16px;
  line-height: 1.8;
}

.intro-band {
  background: #fff;
}

.preview-section {
  padding-top: 24px;
  background: #fff;
}

.preview-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
  gap: 22px;
  align-items: start;
}

.preview-map {
  padding: 24px;
  border: 1px solid var(--ly-line);
  border-radius: 14px;
  background: var(--ly-panel);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
}

.preview-panel {
  border: 1px solid var(--ly-line);
  border-radius: 12px;
  background: #f8fafc;
  padding: 22px;
}

.preview-panel h3 {
  margin: 0;
  font-size: 20px;
  line-height: 1.4;
}

.showcase-section {
  padding-top: 24px;
}

.merchant-app-section {
  background: #fff;
}

.marketing-app-section {
  background: #f8fafc;
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.showcase-card {
  display: grid;
  grid-template-columns: 138px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  min-height: 260px;
  padding: 18px;
  border-radius: 12px;
}

.phone-shot {
  overflow: hidden;
  border: 7px solid #111827;
  border-radius: 24px;
  background: #111827;
}

.showcase-copy h3,
.capability-card h3 {
  margin: 0;
  color: var(--ly-ink);
  font-size: 18px;
  line-height: 1.35;
}

.showcase-copy p,
.capability-card p,
.channel-card span {
  margin: 10px 0 0;
  color: var(--ly-muted);
  font-size: 14px;
  line-height: 1.7;
}

.merchant-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  gap: 22px;
  align-items: start;
}

.merchant-shot-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.merchant-shot-card,
.marketing-shot-card {
  border: 1px solid var(--ly-line);
  border-radius: 12px;
  background: #fff;
  padding: 16px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
}

.merchant-feature-panel {
  border: 1px solid var(--ly-line);
  border-radius: 12px;
  background: #f8fafc;
  padding: 22px;
}

.merchant-feature-panel h3 {
  margin: 0;
  font-size: 20px;
}

.feature-list {
  margin: 16px 0 20px;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.feature-list li {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.feature-list li strong {
  display: block;
  font-size: 15px;
  color: var(--ly-ink);
}

.feature-list li p {
  margin: 8px 0 0;
  color: var(--ly-muted);
  font-size: 13px;
  line-height: 1.6;
}

.marketing-shot-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.marketing-feature-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.compact-grid {
  margin-top: 0;
}

.section-action {
  margin-top: 20px;
}

.capability-section,
.channel-section {
  background: #fff;
}

.section-heading {
  max-width: 760px;
  margin-bottom: 34px;
}

.section-heading p {
  margin-top: 14px;
}

.capability-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.capability-card {
  min-height: 164px;
  padding: 24px;
  border-radius: 10px;
}

.architecture-section {
  background: #f1f5f9;
}

.architecture-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(420px, 1.15fr);
  gap: 44px;
  align-items: center;
}

.stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.stack-list span,
.map-row span,
.map-core span {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 7px;
  background: #fff;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
}

.architecture-map {
  padding: 24px;
  border-radius: 14px;
}

.map-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.map-core {
  margin: 20px 0;
  padding: 26px;
  border-radius: 12px;
  background: #0e3126;
  color: #fff;
  text-align: center;
}

.map-core strong {
  display: block;
  margin-bottom: 18px;
  font-size: 22px;
}

.map-core div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.map-core span {
  background: rgba(255, 255, 255, 0.11);
  color: #fff;
}

.channel-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.channel-card {
  display: block;
  min-height: 128px;
  padding: 24px;
  border-radius: 10px;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.channel-card:hover {
  border-color: rgba(31, 122, 92, 0.34);
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.11);
}

.channel-card strong {
  display: block;
  color: var(--ly-ink);
  font-size: 18px;
}

.final-cta {
  padding: 76px 24px;
  background: #0d3529;
}

.final-cta-inner {
  display: flex;
  gap: 32px;
  align-items: center;
  justify-content: space-between;
}

.final-cta h2,
.final-cta p {
  color: #fff;
}

.final-cta p {
  max-width: 680px;
  margin-top: 14px;
  color: rgba(255, 255, 255, 0.72);
}

@media (max-width: 1040px) {
  .hero-inner,
  .architecture-layout,
  .preview-layout {
    grid-template-columns: 1fr;
  }

  .hero-visual {
    min-height: auto;
  }

  .showcase-grid,
  .merchant-shot-grid,
  .marketing-shot-grid,
  .capability-grid,
  .channel-grid,
  .marketing-feature-grid {
    grid-template-columns: 1fr;
  }

  .merchant-layout {
    grid-template-columns: 1fr;
  }

  .showcase-card {
    grid-template-columns: 160px minmax(0, 1fr);
  }
}

@media (max-width: 720px) {
  .hero-shell {
    padding: 72px 18px 56px;
  }

  .hero-copy h1 {
    font-size: 42px;
  }

  .hero-lead {
    font-size: 16px;
  }

  .metric-row,
  .split {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .split {
    gap: 24px;
    align-items: start;
  }

  .section {
    padding: 56px 18px;
  }

  .split h2,
  .section-heading h2,
  .architecture-copy h2,
  .final-cta h2 {
    font-size: 28px;
  }

  .hero-visual {
    min-height: auto;
    padding-bottom: 0;
  }

  .showcase-card {
    grid-template-columns: 128px minmax(0, 1fr);
    min-height: 220px;
  }

  .merchant-shot-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .final-cta-inner {
    display: block;
  }
}

@media (max-width: 460px) {
  .hero-actions,
  .metric-row,
  .split {
    grid-template-columns: 1fr;
  }

  .hero-actions {
    display: grid;
  }

  .btn {
    width: 100%;
  }

  .showcase-card {
    grid-template-columns: 1fr;
  }

  .merchant-shot-grid {
    grid-template-columns: 1fr;
  }

  .phone-shot {
    max-width: 180px;
  }
}
</style>
