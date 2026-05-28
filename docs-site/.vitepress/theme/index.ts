import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import HomeEditorDemo from './components/HomeEditorDemo.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeEditorDemo', HomeEditorDemo)
  }
} satisfies Theme
