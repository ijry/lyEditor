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
