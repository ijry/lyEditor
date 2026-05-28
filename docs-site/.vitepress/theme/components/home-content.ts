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
