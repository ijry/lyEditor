<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    initialLocale?: 'zh-CN' | 'en-US'
  }>(),
  {
    initialLocale: 'zh-CN'
  }
)

const locale = ref<'zh-CN' | 'en-US'>(props.initialLocale)
const contentHtml = ref('<p>Hello lyEditor</p>')
const editorRef = ref<HTMLDivElement | null>(null)

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

const toolbarKeys = ['bold', 'italic', 'underline'] as const
const commandMap = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline'
} as const

function onInput() {
  if (!editorRef.value) return
  contentHtml.value = editorRef.value.innerHTML
}

function onToolbarClick(key: (typeof toolbarKeys)[number]) {
  if (!editorRef.value) return
  editorRef.value.focus()
  document.execCommand(commandMap[key], false)
  contentHtml.value = editorRef.value.innerHTML
}

watch(
  () => props.initialLocale,
  (nextLocale) => {
    locale.value = nextLocale
  }
)
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
      <button
        v-for="key in toolbarKeys"
        :key="key"
        type="button"
        class="toolbar-btn"
        :title="labels[locale][key]"
        :aria-label="labels[locale][key]"
        @click="onToolbarClick(key)"
      >
        <svg v-if="key === 'bold'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 5h7a4 4 0 0 1 0 8H7z" />
          <path d="M7 13h8a4 4 0 0 1 0 8H7z" />
        </svg>
        <svg v-else-if="key === 'italic'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="14" y1="4" x2="10" y2="20" />
          <line x1="8" y1="4" x2="16" y2="4" />
          <line x1="8" y1="20" x2="16" y2="20" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 4v7a5 5 0 0 0 10 0V4" />
          <line x1="4" y1="20" x2="20" y2="20" />
        </svg>
      </button>
    </div>

    <div
      ref="editorRef"
      class="editor"
      contenteditable="true"
      @input="onInput"
      v-html="contentHtml"
    ></div>
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

.toolbar-btn {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.toolbar-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.toolbar-btn svg {
  width: 18px;
  height: 18px;
}

.editor {
  min-height: 120px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
  background: var(--vp-c-bg);
}
</style>
