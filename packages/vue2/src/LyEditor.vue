<template>
  <div
    data-testid="ly-editor-root"
    data-ly-editor="true"
    :data-locale="normalizedLocale"
    :data-has-messages="messages ? '1' : '0'"
  ></div>
</template>

<script>
export default {
  name: 'LyEditor',
  props: {
    locale: {
      type: String,
      default: 'zh-CN'
    },
    messages: {
      type: Object,
      default: undefined
    }
  },
  computed: {
    normalizedLocale() {
      return this.locale == null ? 'zh-CN' : this.locale
    }
  }
}
</script>
