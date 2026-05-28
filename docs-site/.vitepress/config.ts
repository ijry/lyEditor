import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'lyEditor',
  description: 'Next-generation rich text editor docs',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Upload', link: '/guide/upload' },
      { text: 'Backend Samples', link: '/backend-samples/node-express' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Upload', link: '/guide/upload' }
        ]
      },
      {
        text: 'Backend Samples',
        items: [
          { text: 'Node.js (Express)', link: '/backend-samples/node-express' },
          { text: 'Java (Spring Boot)', link: '/backend-samples/java-spring-boot' },
          { text: 'Go (Gin)', link: '/backend-samples/go-gin' }
        ]
      }
    ]
  }
})
