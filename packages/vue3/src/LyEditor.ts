import { type PropType, defineComponent, h } from 'vue'

export const LyEditor = defineComponent({
  name: 'LyEditor',
  props: {
    locale: {
      type: String,
      default: 'zh-CN'
    },
    messages: {
      type: Object as PropType<Record<string, Record<string, string>> | null>,
      default: undefined
    }
  },
  setup(props) {
    return () =>
      h('div', {
        'data-testid': 'ly-editor-root',
        'data-ly-editor': true,
        'data-locale': props.locale ?? 'zh-CN',
        'data-has-messages': props.messages ? '1' : '0'
      })
  }
})
