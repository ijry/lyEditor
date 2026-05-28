import { defineComponent, h } from 'vue'

export const LyEditor = defineComponent({
  name: 'LyEditor',
  setup() {
    return () => h('div', { 'data-ly-editor': true })
  }
})
