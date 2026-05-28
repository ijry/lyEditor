<script setup lang="ts">
import { ref } from 'vue'

const locale = ref<'zh-CN' | 'en-US'>('zh-CN')
const content = ref('Hello lyEditor')

const labels = {
  'zh-CN': {
    title: '编辑器演示',
    bold: '加粗',
    italic: '斜体',
    underline: '下划线'
  },
  'en-US': {
    title: 'Editor Demo',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline'
  }
} as const
</script>

<template>
  <section class="home-editor-demo" data-home-editor-demo="true">
    <header class="demo-header">
      <strong>{{ labels[locale].title }}</strong>
      <div class="locale-switch">
        <button type="button" @click="locale = 'zh-CN'">中文</button>
        <button type="button" @click="locale = 'en-US'">EN</button>
      </div>
    </header>

    <div class="toolbar">
      <button type="button">{{ labels[locale].bold }}</button>
      <button type="button">{{ labels[locale].italic }}</button>
      <button type="button">{{ labels[locale].underline }}</button>
    </div>

    <div
      class="editor"
      contenteditable="true"
      @input="content = ($event.target as HTMLDivElement).innerText"
    >{{ content }}</div>
  </section>
</template>

<style scoped>
.home-editor-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  background: var(--vp-c-bg-soft);
}

.demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.locale-switch {
  display: flex;
  gap: 8px;
}

.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.editor {
  min-height: 120px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
  background: var(--vp-c-bg);
}
</style>
