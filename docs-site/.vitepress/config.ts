import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/lyEditor/',
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
