<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

type DemoLocale = 'zh-CN' | 'en-US'

const props = withDefaults(
  defineProps<{
    initialLocale?: DemoLocale
  }>(),
  {
    initialLocale: 'zh-CN'
  }
)

const locale = ref<DemoLocale>(props.initialLocale)
const editorRef = ref<HTMLDivElement | null>(null)
const contentHtml = ref('')
const savedRange = ref<Range | null>(null)

const labels = {
  'zh-CN': {
    title: '编辑器演示',
    reset: '重置内容',
    fontFamily: '字体',
    fontSize: '字号',
    textColor: '文字色',
    highlightColor: '高亮色',
    bold: '加粗',
    italic: '斜体',
    underline: '下划线',
    strike: '删除线',
    heading1: '一级标题',
    heading2: '二级标题',
    paragraph: '正文',
    quote: '引用',
    codeBlock: '代码块',
    inlineCode: '行内代码',
    bulletList: '无序列表',
    orderedList: '有序列表',
    alignLeft: '左对齐',
    alignCenter: '居中',
    alignRight: '右对齐',
    alignJustify: '两端对齐',
    link: '插入链接',
    unlink: '取消链接',
    image: '插入图片',
    table: '插入表格',
    divider: '分割线',
    undo: '撤销',
    redo: '重做',
    removeFormat: '清除格式',
    linkPrompt: '请输入链接地址',
    imagePrompt: '请输入图片地址',
    tableRowsPrompt: '表格行数（1-8）',
    tableColsPrompt: '表格列数（1-8）',
    inlineCodeDefault: '代码片段'
  },
  'en-US': {
    title: 'Editor Demo',
    reset: 'Reset',
    fontFamily: 'Font',
    fontSize: 'Size',
    textColor: 'Text',
    highlightColor: 'Highlight',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strike: 'Strike',
    heading1: 'Heading 1',
    heading2: 'Heading 2',
    paragraph: 'Paragraph',
    quote: 'Quote',
    codeBlock: 'Code Block',
    inlineCode: 'Inline Code',
    bulletList: 'Bulleted List',
    orderedList: 'Numbered List',
    alignLeft: 'Align Left',
    alignCenter: 'Align Center',
    alignRight: 'Align Right',
    alignJustify: 'Justify',
    link: 'Insert Link',
    unlink: 'Unlink',
    image: 'Insert Image',
    table: 'Insert Table',
    divider: 'Divider',
    undo: 'Undo',
    redo: 'Redo',
    removeFormat: 'Clear Format',
    linkPrompt: 'Enter link URL',
    imagePrompt: 'Enter image URL',
    tableRowsPrompt: 'Table rows (1-8)',
    tableColsPrompt: 'Table columns (1-8)',
    inlineCodeDefault: 'code'
  }
} as const

const defaultHtmlByLocale: Record<DemoLocale, string> = {
  'zh-CN': `
    <h2>lyEditor 首页示例</h2>
    <p>这是默认填充内容，可直接体验 <strong>加粗</strong>、<em>斜体</em>、<u>下划线</u>、颜色、代码、图片和表格等常规能力。</p>
    <ul>
      <li>工具栏支持字体、字号、颜色、对齐、列表</li>
      <li>支持链接、图片、分割线与表格插入</li>
      <li>支持代码块与行内代码展示</li>
    </ul>
    <pre><code>const editor = createEditorCore({ initialText: 'Hello lyEditor' })</code></pre>
    <table style="border-collapse:collapse;width:100%;margin:12px 0;">
      <tbody>
        <tr><th style="border:1px solid #cbd5e1;padding:8px;background:#f8fafc;">功能</th><th style="border:1px solid #cbd5e1;padding:8px;background:#f8fafc;">状态</th></tr>
        <tr><td style="border:1px solid #cbd5e1;padding:8px;">多语言</td><td style="border:1px solid #cbd5e1;padding:8px;">已支持</td></tr>
        <tr><td style="border:1px solid #cbd5e1;padding:8px;">插件化</td><td style="border:1px solid #cbd5e1;padding:8px;">已支持</td></tr>
      </tbody>
    </table>
  `,
  'en-US': `
    <h2>lyEditor Home Demo</h2>
    <p>This prefilled content helps you try <strong>bold</strong>, <em>italic</em>, <u>underline</u>, colors, code, images, tables, and other common editor features.</p>
    <ul>
      <li>Toolbar supports font, size, color, alignment, and lists</li>
      <li>Insert links, images, dividers, and tables</li>
      <li>Supports both code blocks and inline code</li>
    </ul>
    <pre><code>const editor = createEditorCore({ initialText: 'Hello lyEditor' })</code></pre>
    <table style="border-collapse:collapse;width:100%;margin:12px 0;">
      <tbody>
        <tr><th style="border:1px solid #cbd5e1;padding:8px;background:#f8fafc;">Feature</th><th style="border:1px solid #cbd5e1;padding:8px;background:#f8fafc;">Status</th></tr>
        <tr><td style="border:1px solid #cbd5e1;padding:8px;">Multilingual</td><td style="border:1px solid #cbd5e1;padding:8px;">Ready</td></tr>
        <tr><td style="border:1px solid #cbd5e1;padding:8px;">Plugin-first</td><td style="border:1px solid #cbd5e1;padding:8px;">Ready</td></tr>
      </tbody>
    </table>
  `
}

const fontFamilyOptions = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Verdana', label: 'Verdana' }
] as const

const fontSizeOptions = [
  { value: '2', label: '12' },
  { value: '3', label: '14' },
  { value: '4', label: '16' },
  { value: '5', label: '18' },
  { value: '6', label: '24' }
] as const

const selectedFontFamily = ref<string>('Arial')
const selectedFontSize = ref<string>('3')
const selectedTextColor = ref<string>('#111827')
const selectedHighlightColor = ref<string>('#fff59d')
const activeState = ref<Record<string, boolean>>({})

const inlineTools = [
  { key: 'bold', command: 'bold', symbol: 'B' },
  { key: 'italic', command: 'italic', symbol: 'I' },
  { key: 'underline', command: 'underline', symbol: 'U' },
  { key: 'strike', command: 'strikeThrough', symbol: 'S' }
] as const

const blockTools = [
  { key: 'heading1', block: 'h1', symbol: 'H1' },
  { key: 'heading2', block: 'h2', symbol: 'H2' },
  { key: 'paragraph', block: 'p', symbol: 'P' },
  { key: 'quote', block: 'blockquote', symbol: '"' },
  { key: 'codeBlock', block: 'pre', symbol: '</>' }
] as const

const listTools = [
  { key: 'bulletList', command: 'insertUnorderedList', symbol: 'UL' },
  { key: 'orderedList', command: 'insertOrderedList', symbol: 'OL' }
] as const

const alignTools = [
  { key: 'alignLeft', command: 'justifyLeft', symbol: 'L' },
  { key: 'alignCenter', command: 'justifyCenter', symbol: 'C' },
  { key: 'alignRight', command: 'justifyRight', symbol: 'R' },
  { key: 'alignJustify', command: 'justifyFull', symbol: 'J' }
] as const

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function isSelectionInsideEditor() {
  if (!editorRef.value || typeof window === 'undefined') return false
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return false
  return editorRef.value.contains(selection.anchorNode)
}

function cacheSelection() {
  if (!editorRef.value || typeof window === 'undefined') return
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return
  const range = selection.getRangeAt(0)
  if (!editorRef.value.contains(range.commonAncestorContainer)) return
  savedRange.value = range.cloneRange()
}

function restoreSelection() {
  if (!savedRange.value || typeof window === 'undefined') return false
  const selection = window.getSelection()
  if (!selection) return false
  selection.removeAllRanges()
  selection.addRange(savedRange.value)
  return true
}

function onInput() {
  if (!editorRef.value) return
  contentHtml.value = editorRef.value.innerHTML
  syncToolbarState()
}

function focusEditorWithSelection() {
  if (!editorRef.value) return false
  editorRef.value.focus()
  restoreSelection()
  return true
}

function runCommand(command: string, value?: string) {
  if (typeof document === 'undefined') return
  if (!focusEditorWithSelection()) return
  document.execCommand(command, false, value)
  onInput()
  cacheSelection()
}

function syncToolbarState() {
  if (typeof document === 'undefined') return
  const commands = [
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'insertUnorderedList',
    'insertOrderedList',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    'justifyFull'
  ]

  for (const command of commands) {
    activeState.value[command] = document.queryCommandState(command)
  }
}

function applyFontFamily() {
  runCommand('fontName', selectedFontFamily.value)
}

function applyFontSize() {
  runCommand('fontSize', selectedFontSize.value)
}

function cycleFontFamily() {
  const currentIndex = fontFamilyOptions.findIndex((item) => item.value === selectedFontFamily.value)
  const nextIndex = (currentIndex + 1) % fontFamilyOptions.length
  selectedFontFamily.value = fontFamilyOptions[nextIndex].value
  applyFontFamily()
}

function cycleFontSize() {
  const currentIndex = fontSizeOptions.findIndex((item) => item.value === selectedFontSize.value)
  const nextIndex = (currentIndex + 1) % fontSizeOptions.length
  selectedFontSize.value = fontSizeOptions[nextIndex].value
  applyFontSize()
}

function applyTextColor() {
  runCommand('foreColor', selectedTextColor.value)
}

function applyHighlightColor() {
  runCommand('hiliteColor', selectedHighlightColor.value)
}

function applyBlock(block: string) {
  runCommand('formatBlock', `<${block}>`)
}

function insertInlineCode() {
  if (typeof window === 'undefined') return
  const selection = window.getSelection()
  const selectedText = selection?.toString().trim() ?? ''
  const codeText = selectedText || labels[locale.value].inlineCodeDefault
  runCommand('insertHTML', `<code>${escapeHtml(codeText)}</code>&nbsp;`)
}

function insertLink() {
  if (typeof window === 'undefined') return
  const url = window.prompt(labels[locale.value].linkPrompt, 'https://')
  if (!url) return
  runCommand('createLink', url)
}

function insertImage() {
  if (typeof window === 'undefined') return
  const url = window.prompt(labels[locale.value].imagePrompt, 'https://')
  if (!url) return
  runCommand('insertImage', url)
}

function insertTable() {
  if (typeof window === 'undefined') return
  const inputRows = Number(window.prompt(labels[locale.value].tableRowsPrompt, '3'))
  const inputCols = Number(window.prompt(labels[locale.value].tableColsPrompt, '3'))
  const rows = Number.isFinite(inputRows) ? Math.min(8, Math.max(1, Math.floor(inputRows))) : 3
  const cols = Number.isFinite(inputCols) ? Math.min(8, Math.max(1, Math.floor(inputCols))) : 3
  const rowHtml = Array.from({ length: rows })
    .map((_, rowIndex) => {
      const cellHtml = Array.from({ length: cols })
        .map((__, colIndex) => {
          const text = `${rowIndex + 1}-${colIndex + 1}`
          return `<td style="border:1px solid #cbd5e1;padding:8px;">${text}</td>`
        })
        .join('')
      return `<tr>${cellHtml}</tr>`
    })
    .join('')

  runCommand(
    'insertHTML',
    `<table style="border-collapse:collapse;width:100%;margin:12px 0;"><tbody>${rowHtml}</tbody></table><p></p>`
  )
}

function resetContent() {
  const defaultHtml = defaultHtmlByLocale[locale.value]
  contentHtml.value = defaultHtml
  if (editorRef.value) {
    editorRef.value.innerHTML = defaultHtml
    editorRef.value.focus()
    cacheSelection()
    syncToolbarState()
  }
}

function handleSelectionChange() {
  if (!isSelectionInsideEditor()) return
  cacheSelection()
  syncToolbarState()
}

onMounted(() => {
  resetContent()
  if (typeof document !== 'undefined') {
    document.addEventListener('selectionchange', handleSelectionChange)
  }
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('selectionchange', handleSelectionChange)
  }
})

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
      <div class="header-actions">
        <div class="locale-switch">
          <button type="button" @click="locale = 'zh-CN'">中文</button>
          <button type="button" @click="locale = 'en-US'">EN</button>
        </div>
        <button
          type="button"
          class="toolbar-btn"
          :title="labels[locale].reset"
          :aria-label="labels[locale].reset"
          @click="resetContent"
        >
          ↻
        </button>
      </div>
    </header>

    <div class="toolbar">
      <button
        type="button"
        class="toolbar-btn"
        :title="`${labels[locale].fontFamily}: ${selectedFontFamily}`"
        :aria-label="`${labels[locale].fontFamily}: ${selectedFontFamily}`"
        @mousedown.prevent
        @click="cycleFontFamily"
      >
        𝑭
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :title="`${labels[locale].fontSize}: ${fontSizeOptions.find((item) => item.value === selectedFontSize)?.label ?? '14'}px`"
        :aria-label="`${labels[locale].fontSize}: ${fontSizeOptions.find((item) => item.value === selectedFontSize)?.label ?? '14'}px`"
        @mousedown.prevent
        @click="cycleFontSize"
      >
        A↕
      </button>
      <label class="toolbar-btn color-btn" :title="labels[locale].textColor" :aria-label="labels[locale].textColor">
        A
        <input v-model="selectedTextColor" type="color" @input="applyTextColor" />
      </label>
      <label class="toolbar-btn color-btn" :title="labels[locale].highlightColor" :aria-label="labels[locale].highlightColor">
        🖍
        <input v-model="selectedHighlightColor" type="color" @input="applyHighlightColor" />
      </label>
      <button type="button" class="toolbar-btn" :title="labels[locale].undo" :aria-label="labels[locale].undo" @mousedown.prevent @click="runCommand('undo')">↺</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].redo" :aria-label="labels[locale].redo" @mousedown.prevent @click="runCommand('redo')">↻</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].removeFormat" :aria-label="labels[locale].removeFormat" @mousedown.prevent @click="runCommand('removeFormat')">T×</button>
    </div>

    <div class="toolbar">
      <button
        v-for="tool in inlineTools"
        :key="tool.key"
        type="button"
        class="toolbar-btn"
        :class="{ active: activeState[tool.command] }"
        :title="labels[locale][tool.key]"
        :aria-label="labels[locale][tool.key]"
        @mousedown.prevent
        @click="runCommand(tool.command)"
      >
        {{ tool.symbol }}
      </button>

      <button
        v-for="tool in listTools"
        :key="tool.key"
        type="button"
        class="toolbar-btn"
        :class="{ active: activeState[tool.command] }"
        :title="labels[locale][tool.key]"
        :aria-label="labels[locale][tool.key]"
        @mousedown.prevent
        @click="runCommand(tool.command)"
      >
        {{ tool.symbol }}
      </button>

      <button
        v-for="tool in alignTools"
        :key="tool.key"
        type="button"
        class="toolbar-btn"
        :class="{ active: activeState[tool.command] }"
        :title="labels[locale][tool.key]"
        :aria-label="labels[locale][tool.key]"
        @mousedown.prevent
        @click="runCommand(tool.command)"
      >
        {{ tool.symbol }}
      </button>

      <button
        v-for="tool in blockTools"
        :key="tool.key"
        type="button"
        class="toolbar-btn block-btn"
        :title="labels[locale][tool.key]"
        :aria-label="labels[locale][tool.key]"
        @mousedown.prevent
        @click="applyBlock(tool.block)"
      >
        {{ tool.symbol }}
      </button>

      <button type="button" class="toolbar-btn" :title="labels[locale].inlineCode" :aria-label="labels[locale].inlineCode" @mousedown.prevent @click="insertInlineCode">&lt;/&gt;</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].link" :aria-label="labels[locale].link" @mousedown.prevent @click="insertLink">🔗</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].unlink" :aria-label="labels[locale].unlink" @mousedown.prevent @click="runCommand('unlink')">⛓</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].image" :aria-label="labels[locale].image" @mousedown.prevent @click="insertImage">🖼</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].table" :aria-label="labels[locale].table" @mousedown.prevent @click="insertTable">▦</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].divider" :aria-label="labels[locale].divider" @mousedown.prevent @click="runCommand('insertHorizontalRule')">─</button>
    </div>

    <div
      ref="editorRef"
      class="editor"
      contenteditable="true"
      @input="onInput"
      @keyup="cacheSelection"
      @mouseup="cacheSelection"
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
  gap: 12px;
  margin-bottom: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.locale-switch {
  display: flex;
  gap: 8px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
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
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.toolbar-btn:hover,
.toolbar-btn.active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.block-btn {
  width: auto;
  min-width: 38px;
  padding: 0 8px;
}

.color-btn {
  position: relative;
  overflow: hidden;
}

.color-btn input[type='color'] {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  padding: 0;
  border: 0;
  cursor: pointer;
}

.editor {
  min-height: 220px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
  background: var(--vp-c-bg);
  line-height: 1.7;
  overflow: auto;
}

.editor :deep(code) {
  padding: 2px 6px;
  border-radius: 6px;
  background: #e2e8f0;
  font-size: 12px;
}

@media (max-width: 720px) {
  .demo-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
