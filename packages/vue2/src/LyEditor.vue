<template>
  <div
    data-testid="ly-editor-root"
    data-ly-editor="true"
    :data-locale="locale"
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
  }
}
</script>
