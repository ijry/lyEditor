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
