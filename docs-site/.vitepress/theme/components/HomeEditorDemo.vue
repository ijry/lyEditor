<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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
const tablePickerWrapRef = ref<HTMLDivElement | null>(null)

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
    blockFormat: '块级格式',
    quote: '引用',
    codeBlock: '代码块',
    inlineCode: '行内代码',
    bulletList: '无序列表',
    orderedList: '有序列表',
    align: '对齐',
    alignLeft: '左对齐',
    alignCenter: '居中',
    alignRight: '右对齐',
    alignJustify: '两端对齐',
    link: '插入链接',
    unlink: '取消链接',
    image: '插入图片',
    table: '插入表格',
    tableSizeHint: '拖动选择表格大小',
    tableOps: '表格操作',
    insertRowAbove: '向上插入行',
    insertRowBelow: '向下插入行',
    deleteRow: '删除当前行',
    insertColLeft: '向左插入列',
    insertColRight: '向右插入列',
    deleteCol: '删除当前列',
    mergeRight: '向右合并单元格',
    splitCell: '拆分单元格',
    deleteTable: '删除表格',
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
    blockFormat: 'Block Format',
    quote: 'Quote',
    codeBlock: 'Code Block',
    inlineCode: 'Inline Code',
    bulletList: 'Bulleted List',
    orderedList: 'Numbered List',
    align: 'Alignment',
    alignLeft: 'Align Left',
    alignCenter: 'Align Center',
    alignRight: 'Align Right',
    alignJustify: 'Justify',
    link: 'Insert Link',
    unlink: 'Unlink',
    image: 'Insert Image',
    table: 'Insert Table',
    tableSizeHint: 'Hover to choose table size',
    tableOps: 'Table Actions',
    insertRowAbove: 'Insert Row Above',
    insertRowBelow: 'Insert Row Below',
    deleteRow: 'Delete Row',
    insertColLeft: 'Insert Column Left',
    insertColRight: 'Insert Column Right',
    deleteCol: 'Delete Column',
    mergeRight: 'Merge Right Cell',
    splitCell: 'Split Cell',
    deleteTable: 'Delete Table',
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
const selectedBlock = ref<string>('p')
const selectedAlign = ref<string>('justifyLeft')
const tablePickerOpen = ref(false)
const tableHoverRows = ref(0)
const tableHoverCols = ref(0)
const activeTableCell = ref<HTMLTableCellElement | null>(null)
const activeState = ref<Record<string, boolean>>({})
const tableGridSize = 8
const tableGridRows = Array.from({ length: tableGridSize }, (_, index) => index + 1)
const tableGridCols = Array.from({ length: tableGridSize }, (_, index) => index + 1)

const tablePickerText = computed(() => {
  if (!tableHoverRows.value || !tableHoverCols.value) {
    return labels[locale.value].tableSizeHint
  }
  if (locale.value === 'zh-CN') {
    return `插入 ${tableHoverRows.value} x ${tableHoverCols.value} 表格`
  }
  return `Insert ${tableHoverRows.value} x ${tableHoverCols.value} table`
})

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

function findSelectionElement(): Element | null {
  if (typeof window === 'undefined') return null
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null
  const node = selection.anchorNode
  if (!node) return null
  return node instanceof Element ? node : node.parentElement
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
  updateTableContext()
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

function getActiveCell(): HTMLTableCellElement | null {
  if (!editorRef.value) return null
  const element = findSelectionElement()
  if (!element) return null
  const cell = element.closest('td,th') as HTMLTableCellElement | null
  if (!cell || !editorRef.value.contains(cell)) return null
  return cell
}

function updateTableContext() {
  const cell = getActiveCell()
  if (!cell) {
    activeTableCell.value = null
    return
  }
  activeTableCell.value = cell
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

function applySelectedBlock() {
  applyBlock(selectedBlock.value)
}

function applySelectedAlign() {
  runCommand(selectedAlign.value)
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

function buildTableHtml(rows: number, cols: number) {
  const rowHtml = Array.from({ length: rows })
    .map((_, rowIndex) => {
      const cellHtml = Array.from({ length: cols })
        .map((__, colIndex) => {
          const text = `${rowIndex + 1}-${colIndex + 1}`
          if (rowIndex === 0) {
            return `<th style="border:1px solid #cbd5e1;padding:8px;background:#f8fafc;">${text}</th>`
          }
          return `<td style="border:1px solid #cbd5e1;padding:8px;">${text}</td>`
        })
        .join('')
      return `<tr>${cellHtml}</tr>`
    })
    .join('')

  return `<table style="border-collapse:collapse;width:100%;margin:12px 0;"><tbody>${rowHtml}</tbody></table><p></p>`
}

function insertTableBySize(rows: number, cols: number) {
  if (rows < 1 || cols < 1) return
  runCommand(
    'insertHTML',
    buildTableHtml(rows, cols)
  )
}

function toggleTablePicker() {
  tablePickerOpen.value = !tablePickerOpen.value
  cacheSelection()
}

function closeTablePicker() {
  tablePickerOpen.value = false
}

function onTableCellHover(rows: number, cols: number) {
  tableHoverRows.value = rows
  tableHoverCols.value = cols
}

function onTableCellSelect(rows: number, cols: number) {
  insertTableBySize(rows, cols)
  tablePickerOpen.value = false
}

function createEmptyCell(tagName: 'td' | 'th') {
  const cell = document.createElement(tagName)
  cell.style.border = '1px solid #cbd5e1'
  cell.style.padding = '8px'
  if (tagName === 'th') {
    cell.style.background = '#f8fafc'
  }
  cell.innerHTML = '&nbsp;'
  return cell
}

function placeCaretInsideCell(cell: HTMLTableCellElement) {
  if (typeof window === 'undefined') return
  if (!cell.innerHTML.trim()) {
    cell.innerHTML = '&nbsp;'
  }
  const range = document.createRange()
  range.selectNodeContents(cell)
  range.collapse(true)
  const selection = window.getSelection()
  if (!selection) return
  selection.removeAllRanges()
  selection.addRange(range)
  cacheSelection()
}

function withActiveTableCell(
  action: (table: HTMLTableElement, cell: HTMLTableCellElement) => void
) {
  focusEditorWithSelection()
  const cell = getActiveCell() ?? activeTableCell.value
  const table = cell?.closest('table') as HTMLTableElement | null
  if (!cell || !table || !editorRef.value || !editorRef.value.contains(table)) return
  action(table, cell)
  onInput()
}

function insertRow(above: boolean) {
  withActiveTableCell((_table, cell) => {
    const row = cell.parentElement as HTMLTableRowElement
    const section = row.parentElement as HTMLTableSectionElement
    const rowIndex = Array.from(section.rows).indexOf(row)
    const newRow = document.createElement('tr')
    Array.from(row.cells).forEach((sourceCell) => {
      const tagName = sourceCell.tagName.toLowerCase() === 'th' ? 'th' : 'td'
      newRow.appendChild(createEmptyCell(tagName as 'td' | 'th'))
    })
    const targetIndex = above ? rowIndex : rowIndex + 1
    const referenceRow = section.rows[targetIndex] ?? null
    section.insertBefore(newRow, referenceRow)
    const nextCell = newRow.cells[Math.min(cell.cellIndex, newRow.cells.length - 1)] as HTMLTableCellElement
    placeCaretInsideCell(nextCell)
  })
}

function deleteRow() {
  withActiveTableCell((table, cell) => {
    const row = cell.parentElement as HTMLTableRowElement
    const section = row.parentElement as HTMLTableSectionElement
    if (section.rows.length <= 1) {
      table.remove()
      return
    }
    const rowIndex = Array.from(section.rows).indexOf(row)
    row.remove()
    const fallbackRow = section.rows[Math.max(0, rowIndex - 1)] ?? section.rows[0]
    const nextCell = fallbackRow.cells[Math.min(cell.cellIndex, fallbackRow.cells.length - 1)] as HTMLTableCellElement
    placeCaretInsideCell(nextCell)
  })
}

function insertColumn(left: boolean) {
  withActiveTableCell((table, cell) => {
    const insertIndex = left ? cell.cellIndex : cell.cellIndex + 1
    Array.from(table.rows).forEach((row) => {
      const baseCell =
        (row.cells[Math.max(0, Math.min(row.cells.length - 1, insertIndex - 1))] as HTMLTableCellElement | undefined) ??
        (row.cells[0] as HTMLTableCellElement | undefined)
      const tagName = baseCell?.tagName.toLowerCase() === 'th' ? 'th' : 'td'
      const newCell = createEmptyCell(tagName as 'td' | 'th')
      const referenceCell = row.cells[insertIndex] ?? null
      row.insertBefore(newCell, referenceCell)
    })
    const currentRow = cell.parentElement as HTMLTableRowElement
    const nextIndex = left ? cell.cellIndex : cell.cellIndex + 1
    const nextCell = currentRow.cells[nextIndex] as HTMLTableCellElement
    placeCaretInsideCell(nextCell)
  })
}

function deleteColumn() {
  withActiveTableCell((table, cell) => {
    const colIndex = cell.cellIndex
    Array.from(table.rows).forEach((row) => {
      if (row.cells[colIndex]) {
        row.deleteCell(colIndex)
      }
    })
    if (!table.rows.length || !table.rows[0].cells.length) {
      table.remove()
      return
    }
    const currentRow = table.rows[Math.min((cell.parentElement as HTMLTableRowElement).rowIndex, table.rows.length - 1)]
    const nextCell = currentRow.cells[Math.min(colIndex, currentRow.cells.length - 1)] as HTMLTableCellElement
    placeCaretInsideCell(nextCell)
  })
}

function mergeRightCell() {
  withActiveTableCell((_table, cell) => {
    const nextCell = cell.nextElementSibling as HTMLTableCellElement | null
    if (!nextCell) return
    cell.colSpan = (cell.colSpan || 1) + (nextCell.colSpan || 1)
    if (nextCell.innerHTML.trim()) {
      cell.innerHTML = cell.innerHTML.trim()
        ? `${cell.innerHTML} ${nextCell.innerHTML}`
        : nextCell.innerHTML
    }
    nextCell.remove()
    placeCaretInsideCell(cell)
  })
}

function splitCell() {
  withActiveTableCell((_table, cell) => {
    const currentColSpan = cell.colSpan || 1
    const currentRowSpan = cell.rowSpan || 1
    if (currentColSpan === 1 && currentRowSpan === 1) return

    const row = cell.parentElement as HTMLTableRowElement
    const section = row.parentElement as HTMLTableSectionElement
    const sectionRowIndex = Array.from(section.rows).indexOf(row)
    const baseCellIndex = cell.cellIndex

    if (currentColSpan > 1) {
      cell.colSpan = 1
      for (let index = 1; index < currentColSpan; index += 1) {
        row.insertBefore(createEmptyCell('td'), row.cells[baseCellIndex + index] ?? null)
      }
    }

    if (currentRowSpan > 1) {
      cell.rowSpan = 1
      for (let index = 1; index < currentRowSpan; index += 1) {
        const targetRow = section.rows[sectionRowIndex + index]
        if (!targetRow) continue
        targetRow.insertBefore(createEmptyCell('td'), targetRow.cells[baseCellIndex] ?? null)
      }
    }

    placeCaretInsideCell(cell)
  })
}

function deleteTable() {
  withActiveTableCell((table) => {
    table.remove()
  })
}

function handleDocumentMouseDown(event: MouseEvent) {
  if (!tablePickerWrapRef.value) return
  const target = event.target as Node | null
  if (!target) return
  if (!tablePickerWrapRef.value.contains(target)) {
    closeTablePicker()
  }
}

function resetContent() {
  const defaultHtml = defaultHtmlByLocale[locale.value]
  contentHtml.value = defaultHtml
  if (editorRef.value) {
    editorRef.value.innerHTML = defaultHtml
    editorRef.value.focus()
    cacheSelection()
    syncToolbarState()
    updateTableContext()
  }
}

function handleSelectionChange() {
  if (!isSelectionInsideEditor()) return
  cacheSelection()
  syncToolbarState()
  updateTableContext()
}

onMounted(() => {
  resetContent()
  if (typeof document !== 'undefined') {
    document.addEventListener('selectionchange', handleSelectionChange)
    document.addEventListener('mousedown', handleDocumentMouseDown)
  }
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('selectionchange', handleSelectionChange)
    document.removeEventListener('mousedown', handleDocumentMouseDown)
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

      <label
        class="toolbar-btn compact-dropdown"
        :title="labels[locale].blockFormat"
        :aria-label="labels[locale].blockFormat"
      >
        <select v-model="selectedBlock" @change="applySelectedBlock">
          <option v-for="tool in blockTools" :key="tool.key" :value="tool.block" :title="labels[locale][tool.key]">
            {{ tool.symbol }}
          </option>
        </select>
      </label>

      <label
        class="toolbar-btn compact-dropdown"
        :title="labels[locale].align"
        :aria-label="labels[locale].align"
      >
        <select v-model="selectedAlign" @change="applySelectedAlign">
          <option v-for="tool in alignTools" :key="tool.key" :value="tool.command" :title="labels[locale][tool.key]">
            {{ tool.symbol }}
          </option>
        </select>
      </label>

      <button type="button" class="toolbar-btn" :title="labels[locale].inlineCode" :aria-label="labels[locale].inlineCode" @mousedown.prevent @click="insertInlineCode">&lt;/&gt;</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].link" :aria-label="labels[locale].link" @mousedown.prevent @click="insertLink">🔗</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].unlink" :aria-label="labels[locale].unlink" @mousedown.prevent @click="runCommand('unlink')">⛓</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].image" :aria-label="labels[locale].image" @mousedown.prevent @click="insertImage">🖼</button>
      <div ref="tablePickerWrapRef" class="table-picker-wrap">
        <button
          type="button"
          class="toolbar-btn"
          :title="labels[locale].table"
          :aria-label="labels[locale].table"
          @mousedown.prevent
          @click="toggleTablePicker"
        >
          ▦
        </button>
        <div v-if="tablePickerOpen" class="table-picker-panel" @mousedown.prevent>
          <div class="table-picker-grid">
            <div v-for="row in tableGridRows" :key="`row-${row}`" class="table-picker-row">
              <button
                v-for="col in tableGridCols"
                :key="`cell-${row}-${col}`"
                type="button"
                class="table-picker-cell"
                :class="{ active: row <= tableHoverRows && col <= tableHoverCols }"
                @mouseenter="onTableCellHover(row, col)"
                @click="onTableCellSelect(row, col)"
              ></button>
            </div>
          </div>
          <p class="table-picker-text">{{ tablePickerText }}</p>
        </div>
      </div>
      <button type="button" class="toolbar-btn" :title="labels[locale].divider" :aria-label="labels[locale].divider" @mousedown.prevent @click="runCommand('insertHorizontalRule')">─</button>
    </div>

    <div v-if="activeTableCell" class="toolbar table-toolbar">
      <button type="button" class="toolbar-btn" :title="labels[locale].insertRowAbove" :aria-label="labels[locale].insertRowAbove" @mousedown.prevent @click="insertRow(true)">⇡+</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].insertRowBelow" :aria-label="labels[locale].insertRowBelow" @mousedown.prevent @click="insertRow(false)">⇣+</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].deleteRow" :aria-label="labels[locale].deleteRow" @mousedown.prevent @click="deleteRow">⇣−</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].insertColLeft" :aria-label="labels[locale].insertColLeft" @mousedown.prevent @click="insertColumn(true)">⇠+</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].insertColRight" :aria-label="labels[locale].insertColRight" @mousedown.prevent @click="insertColumn(false)">⇢+</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].deleteCol" :aria-label="labels[locale].deleteCol" @mousedown.prevent @click="deleteColumn">⇢−</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].mergeRight" :aria-label="labels[locale].mergeRight" @mousedown.prevent @click="mergeRightCell">⇢⇢</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].splitCell" :aria-label="labels[locale].splitCell" @mousedown.prevent @click="splitCell">⫶</button>
      <button type="button" class="toolbar-btn" :title="labels[locale].deleteTable" :aria-label="labels[locale].deleteTable" @mousedown.prevent @click="deleteTable">⌫</button>
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
  display: flex;
  flex-direction: column;
  min-height: 0;
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

.compact-dropdown {
  position: relative;
  width: 52px;
  padding: 0;
}

.compact-dropdown select {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  text-align-last: center;
  cursor: pointer;
  appearance: none;
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

.table-picker-wrap {
  position: relative;
}

.table-picker-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 30;
  width: 188px;
  padding: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.16);
}

.table-picker-grid {
  display: grid;
  gap: 2px;
}

.table-picker-row {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
}

.table-picker-cell {
  width: 18px;
  height: 18px;
  border: 1px solid #d4d4d8;
  border-radius: 3px;
  background: #fff;
  cursor: pointer;
}

.table-picker-cell.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.table-picker-text {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.table-toolbar {
  padding-top: 2px;
  border-top: 1px dashed var(--vp-c-divider);
}

.editor {
  height: var(--home-demo-editor-height, 280px);
  min-height: var(--home-demo-editor-height, 280px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
  background: var(--vp-c-bg);
  line-height: 1.7;
  overflow-y: auto;
  overflow-x: auto;
}

.editor :deep(code) {
  padding: 2px 6px;
  border-radius: 6px;
  background: #e2e8f0;
  font-size: 12px;
}

.editor :deep(table td),
.editor :deep(table th) {
  min-width: 48px;
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

  .editor {
    --home-demo-editor-height: 220px;
  }
}
</style>
