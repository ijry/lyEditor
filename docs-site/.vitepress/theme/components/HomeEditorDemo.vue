<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import EditorIcon from './EditorIcon.vue'

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
const styleMenuWrapRef = ref<HTMLDivElement | null>(null)
const fontSizeMenuWrapRef = ref<HTMLDivElement | null>(null)
const colorMenuWrapRef = ref<HTMLDivElement | null>(null)
const paragraphMenuWrapRef = ref<HTMLDivElement | null>(null)
const insertMenuWrapRef = ref<HTMLDivElement | null>(null)
const tableOpsMenuWrapRef = ref<HTMLDivElement | null>(null)

const labels = {
  'zh-CN': {
    title: '编辑器演示',
    reset: '重置内容',
    fontFamily: '字体',
    fontSize: '字号',
    textColor: '文字色',
    highlightColor: '高亮色',
    presetColors: '常用色',
    styleMenu: '文本样式',
    sizeMenu: '字号',
    colorMenu: '颜色',
    paragraphMenu: '段落与对齐',
    insertMenu: '插入项',
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
    presetColors: 'Presets',
    styleMenu: 'Text Style',
    sizeMenu: 'Font Size',
    colorMenu: 'Colors',
    paragraphMenu: 'Paragraph & Align',
    insertMenu: 'Insert',
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

const commonTextColors = ['#111827', '#334155', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#2563eb', '#7c3aed'] as const
const commonHighlightColors = ['#fff59d', '#ffecb3', '#fde68a', '#fecdd3', '#bfdbfe', '#bbf7d0', '#c7d2fe', '#fbcfe8'] as const

const selectedFontFamily = ref<string>('Arial')
const selectedFontSize = ref<string>('3')
const selectedTextColor = ref<string>('#111827')
const selectedHighlightColor = ref<string>('#fff59d')
const tablePickerOpen = ref(false)
const styleMenuOpen = ref(false)
const fontSizeMenuOpen = ref(false)
const colorMenuOpen = ref(false)
const paragraphMenuOpen = ref(false)
const insertMenuOpen = ref(false)
const tableOpsMenuOpen = ref(false)
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
  { key: 'bold', command: 'bold', icon: 'bold' },
  { key: 'italic', command: 'italic', icon: 'italic' },
  { key: 'underline', command: 'underline', icon: 'underline' },
  { key: 'strike', command: 'strikeThrough', icon: 'strike' }
] as const

type LocalizedLabelKey = keyof (typeof labels)['zh-CN']

const paragraphMenuItems = [
  { key: 'heading1', labelKey: 'heading1', icon: 'heading1', kind: 'block', value: 'h1' },
  { key: 'heading2', labelKey: 'heading2', icon: 'heading2', kind: 'block', value: 'h2' },
  { key: 'paragraph', labelKey: 'paragraph', icon: 'paragraph', kind: 'block', value: 'p' },
  { key: 'quote', labelKey: 'quote', icon: 'quote', kind: 'block', value: 'blockquote' },
  { key: 'codeBlock', labelKey: 'codeBlock', icon: 'codeBlock', kind: 'block', value: 'pre' },
  { key: 'bulletList', labelKey: 'bulletList', icon: 'listBullet', kind: 'command', value: 'insertUnorderedList' },
  { key: 'orderedList', labelKey: 'orderedList', icon: 'listOrdered', kind: 'command', value: 'insertOrderedList' },
  { key: 'alignLeft', labelKey: 'alignLeft', icon: 'alignLeft', kind: 'command', value: 'justifyLeft' },
  { key: 'alignCenter', labelKey: 'alignCenter', icon: 'alignCenter', kind: 'command', value: 'justifyCenter' },
  { key: 'alignRight', labelKey: 'alignRight', icon: 'alignRight', kind: 'command', value: 'justifyRight' },
  { key: 'alignJustify', labelKey: 'alignJustify', icon: 'alignJustify', kind: 'command', value: 'justifyFull' }
] as const satisfies Array<{
  key: string
  labelKey: LocalizedLabelKey
  icon: string
  kind: 'block' | 'command'
  value: string
}>

const insertMenuItems = [
  { key: 'inlineCode', labelKey: 'inlineCode', icon: 'inlineCode' },
  { key: 'link', labelKey: 'link', icon: 'link' },
  { key: 'unlink', labelKey: 'unlink', icon: 'unlink' },
  { key: 'image', labelKey: 'image', icon: 'image' },
  { key: 'divider', labelKey: 'divider', icon: 'divider' }
] as const satisfies Array<{
  key: 'inlineCode' | 'link' | 'unlink' | 'image' | 'divider'
  labelKey: LocalizedLabelKey
  icon: string
}>

const tableOpsMenuItems = [
  { key: 'insertRowAbove', labelKey: 'insertRowAbove', icon: 'rowAddTop' },
  { key: 'insertRowBelow', labelKey: 'insertRowBelow', icon: 'rowAddBottom' },
  { key: 'deleteRow', labelKey: 'deleteRow', icon: 'rowDelete' },
  { key: 'insertColLeft', labelKey: 'insertColLeft', icon: 'colAddLeft' },
  { key: 'insertColRight', labelKey: 'insertColRight', icon: 'colAddRight' },
  { key: 'deleteCol', labelKey: 'deleteCol', icon: 'colDelete' },
  { key: 'mergeRight', labelKey: 'mergeRight', icon: 'mergeRight' },
  { key: 'splitCell', labelKey: 'splitCell', icon: 'splitCell' },
  { key: 'deleteTable', labelKey: 'deleteTable', icon: 'deleteTable' }
] as const satisfies Array<{
  key:
    | 'insertRowAbove'
    | 'insertRowBelow'
    | 'deleteRow'
    | 'insertColLeft'
    | 'insertColRight'
    | 'deleteCol'
    | 'mergeRight'
    | 'splitCell'
    | 'deleteTable'
  labelKey: LocalizedLabelKey
  icon: string
}>

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

function applyFontFamilyValue(value: string) {
  selectedFontFamily.value = value
  applyFontFamily()
}

function applyFontSizeValue(value: string) {
  selectedFontSize.value = value
  applyFontSize()
}

function applyTextColor() {
  runColorCommand('foreColor', selectedTextColor.value)
}

function applyHighlightColor() {
  runColorCommand('hiliteColor', selectedHighlightColor.value)
}

function applyTextColorValue(value: string) {
  selectedTextColor.value = value
  applyTextColor()
}

function applyHighlightColorValue(value: string) {
  selectedHighlightColor.value = value
  applyHighlightColor()
}

function runColorCommand(command: 'foreColor' | 'hiliteColor', value: string) {
  if (typeof document === 'undefined') return
  if (!focusEditorWithSelection()) return
  document.execCommand('styleWithCSS', false, 'true')
  document.execCommand(command, false, value)
  onInput()
  cacheSelection()
}

function applyBlock(block: string) {
  runCommand('formatBlock', `<${block}>`)
}

function closeMenus() {
  styleMenuOpen.value = false
  fontSizeMenuOpen.value = false
  colorMenuOpen.value = false
  paragraphMenuOpen.value = false
  insertMenuOpen.value = false
  tableOpsMenuOpen.value = false
  tablePickerOpen.value = false
}

function toggleStyleMenu() {
  const next = !styleMenuOpen.value
  closeMenus()
  styleMenuOpen.value = next
  cacheSelection()
}

function toggleParagraphMenu() {
  const next = !paragraphMenuOpen.value
  closeMenus()
  paragraphMenuOpen.value = next
  cacheSelection()
}

function toggleFontSizeMenu() {
  const next = !fontSizeMenuOpen.value
  closeMenus()
  fontSizeMenuOpen.value = next
  cacheSelection()
}

function toggleColorMenu() {
  const next = !colorMenuOpen.value
  closeMenus()
  colorMenuOpen.value = next
  cacheSelection()
}

function toggleInsertMenu() {
  const next = !insertMenuOpen.value
  closeMenus()
  insertMenuOpen.value = next
  cacheSelection()
}

function toggleTableOpsMenu() {
  const next = !tableOpsMenuOpen.value
  closeMenus()
  tableOpsMenuOpen.value = next
  cacheSelection()
}

function onParagraphSelect(item: (typeof paragraphMenuItems)[number]) {
  if (item.kind === 'block') {
    applyBlock(item.value)
  } else {
    runCommand(item.value)
  }
  paragraphMenuOpen.value = false
}

function onInsertSelect(item: (typeof insertMenuItems)[number]) {
  if (item.key === 'inlineCode') {
    insertInlineCode()
  } else if (item.key === 'link') {
    insertLink()
  } else if (item.key === 'unlink') {
    runCommand('unlink')
  } else if (item.key === 'image') {
    insertImage()
  } else if (item.key === 'divider') {
    runCommand('insertHorizontalRule')
  }
  insertMenuOpen.value = false
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
  const next = !tablePickerOpen.value
  closeMenus()
  tablePickerOpen.value = next
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

function onTableOpsSelect(key: (typeof tableOpsMenuItems)[number]['key']) {
  if (key === 'insertRowAbove') insertRow(true)
  else if (key === 'insertRowBelow') insertRow(false)
  else if (key === 'deleteRow') deleteRow()
  else if (key === 'insertColLeft') insertColumn(true)
  else if (key === 'insertColRight') insertColumn(false)
  else if (key === 'deleteCol') deleteColumn()
  else if (key === 'mergeRight') mergeRightCell()
  else if (key === 'splitCell') splitCell()
  else if (key === 'deleteTable') deleteTable()
  tableOpsMenuOpen.value = false
}

function handleDocumentMouseDown(event: MouseEvent) {
  const target = event.target as Node | null
  if (!target) return

  if (tablePickerWrapRef.value && !tablePickerWrapRef.value.contains(target)) {
    closeTablePicker()
  }
  if (styleMenuWrapRef.value && !styleMenuWrapRef.value.contains(target)) {
    styleMenuOpen.value = false
  }
  if (fontSizeMenuWrapRef.value && !fontSizeMenuWrapRef.value.contains(target)) {
    fontSizeMenuOpen.value = false
  }
  if (colorMenuWrapRef.value && !colorMenuWrapRef.value.contains(target)) {
    colorMenuOpen.value = false
  }
  if (paragraphMenuWrapRef.value && !paragraphMenuWrapRef.value.contains(target)) {
    paragraphMenuOpen.value = false
  }
  if (insertMenuWrapRef.value && !insertMenuWrapRef.value.contains(target)) {
    insertMenuOpen.value = false
  }
  if (tableOpsMenuWrapRef.value && !tableOpsMenuWrapRef.value.contains(target)) {
    tableOpsMenuOpen.value = false
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
          <EditorIcon name="reset" />
        </button>
      </div>
    </header>

    <div class="toolbar">
      <button
        type="button"
        class="toolbar-btn"
        :title="labels[locale].undo"
        :aria-label="labels[locale].undo"
        @mousedown.prevent
        @click="runCommand('undo')"
      >
        <EditorIcon name="undo" />
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :title="labels[locale].redo"
        :aria-label="labels[locale].redo"
        @mousedown.prevent
        @click="runCommand('redo')"
      >
        <EditorIcon name="redo" />
      </button>

      <span class="toolbar-separator"></span>

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
        <EditorIcon :name="tool.icon" />
      </button>

      <span class="toolbar-separator"></span>

      <div ref="styleMenuWrapRef" class="toolbar-menu-wrap">
        <button
          type="button"
          class="toolbar-btn toolbar-menu-trigger"
          :title="labels[locale].styleMenu"
          :aria-label="labels[locale].styleMenu"
          @mousedown.prevent
          @click="toggleStyleMenu"
        >
          <EditorIcon name="fontFamily" />
          <EditorIcon class="menu-caret" name="chevronDown" :size="13" />
        </button>
        <div v-if="styleMenuOpen" class="toolbar-menu-panel style-menu-panel" @mousedown.prevent>
          <section class="toolbar-menu-group">
            <header>{{ labels[locale].fontFamily }}</header>
            <div class="style-chip-list">
              <button
                v-for="item in fontFamilyOptions"
                :key="`font-family-${item.value}`"
                type="button"
                class="style-chip"
                :class="{ active: selectedFontFamily === item.value }"
                @click="applyFontFamilyValue(item.value)"
              >
                {{ item.label }}
              </button>
            </div>
          </section>

          <button
            type="button"
            class="toolbar-menu-item"
            :title="labels[locale].removeFormat"
            :aria-label="labels[locale].removeFormat"
            @click="runCommand('removeFormat'); styleMenuOpen = false"
          >
            <span class="toolbar-menu-item-icon"><EditorIcon name="clear" /></span>
            <span>{{ labels[locale].removeFormat }}</span>
          </button>
        </div>
      </div>

      <div ref="fontSizeMenuWrapRef" class="toolbar-menu-wrap">
        <button
          type="button"
          class="toolbar-btn toolbar-menu-trigger"
          :title="labels[locale].sizeMenu"
          :aria-label="labels[locale].sizeMenu"
          @mousedown.prevent
          @click="toggleFontSizeMenu"
        >
          <EditorIcon name="fontSize" />
          <EditorIcon class="menu-caret" name="chevronDown" :size="13" />
        </button>
        <div v-if="fontSizeMenuOpen" class="toolbar-menu-panel compact-menu-panel" @mousedown.prevent>
          <button
            v-for="item in fontSizeOptions"
            :key="`font-size-${item.value}`"
            type="button"
            class="toolbar-menu-item"
            :class="{ active: selectedFontSize === item.value }"
            @click="applyFontSizeValue(item.value); fontSizeMenuOpen = false"
          >
            <span class="toolbar-menu-item-icon"><EditorIcon name="fontSize" /></span>
            <span>{{ item.label }}px</span>
          </button>
        </div>
      </div>

      <div ref="colorMenuWrapRef" class="toolbar-menu-wrap">
        <button
          type="button"
          class="toolbar-btn toolbar-menu-trigger"
          :title="labels[locale].colorMenu"
          :aria-label="labels[locale].colorMenu"
          @mousedown.prevent
          @click="toggleColorMenu"
        >
          <EditorIcon name="textColor" />
          <EditorIcon class="menu-caret" name="chevronDown" :size="13" />
        </button>
        <div v-if="colorMenuOpen" class="toolbar-menu-panel color-menu-panel" @mousedown.prevent>
          <section class="toolbar-menu-group style-color-grid">
            <label class="style-color-item">
              <span class="style-color-label">
                <EditorIcon name="textColor" :size="14" />
                <span>{{ labels[locale].textColor }}</span>
              </span>
              <input v-model="selectedTextColor" type="color" @input="applyTextColor" />
            </label>
            <label class="style-color-item">
              <span class="style-color-label">
                <EditorIcon name="highlight" :size="14" />
                <span>{{ labels[locale].highlightColor }}</span>
              </span>
              <input v-model="selectedHighlightColor" type="color" @input="applyHighlightColor" />
            </label>
          </section>

          <section class="toolbar-menu-group color-preset-section">
            <header>{{ labels[locale].presetColors }}</header>
            <div class="color-preset-row">
              <span class="color-preset-label">{{ labels[locale].textColor }}</span>
              <div class="color-presets">
                <button
                  v-for="color in commonTextColors"
                  :key="`text-${color}`"
                  type="button"
                  class="color-swatch"
                  :class="{ active: selectedTextColor === color }"
                  :title="color"
                  :aria-label="color"
                  @mousedown.prevent
                  @click="applyTextColorValue(color)"
                >
                  <span class="color-swatch-dot" :style="{ background: color }"></span>
                </button>
              </div>
            </div>
            <div class="color-preset-row">
              <span class="color-preset-label">{{ labels[locale].highlightColor }}</span>
              <div class="color-presets">
                <button
                  v-for="color in commonHighlightColors"
                  :key="`highlight-${color}`"
                  type="button"
                  class="color-swatch"
                  :class="{ active: selectedHighlightColor === color }"
                  :title="color"
                  :aria-label="color"
                  @mousedown.prevent
                  @click="applyHighlightColorValue(color)"
                >
                  <span class="color-swatch-dot" :style="{ background: color }"></span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div ref="paragraphMenuWrapRef" class="toolbar-menu-wrap">
        <button
          type="button"
          class="toolbar-btn toolbar-menu-trigger"
          :title="labels[locale].paragraphMenu"
          :aria-label="labels[locale].paragraphMenu"
          @mousedown.prevent
          @click="toggleParagraphMenu"
        >
          <EditorIcon name="paragraph" />
          <EditorIcon class="menu-caret" name="chevronDown" :size="13" />
        </button>
        <div v-if="paragraphMenuOpen" class="toolbar-menu-panel" @mousedown.prevent>
          <button
            v-for="item in paragraphMenuItems"
            :key="item.key"
            type="button"
            class="toolbar-menu-item"
            :class="{ active: item.kind === 'command' && activeState[item.value] }"
            @click="onParagraphSelect(item)"
          >
            <span class="toolbar-menu-item-icon"><EditorIcon :name="item.icon" /></span>
            <span>{{ labels[locale][item.labelKey] }}</span>
          </button>
        </div>
      </div>

      <div ref="insertMenuWrapRef" class="toolbar-menu-wrap">
        <button
          type="button"
          class="toolbar-btn toolbar-menu-trigger"
          :title="labels[locale].insertMenu"
          :aria-label="labels[locale].insertMenu"
          @mousedown.prevent
          @click="toggleInsertMenu"
        >
          <EditorIcon name="image" />
          <EditorIcon class="menu-caret" name="chevronDown" :size="13" />
        </button>
        <div v-if="insertMenuOpen" class="toolbar-menu-panel" @mousedown.prevent>
          <button
            v-for="item in insertMenuItems"
            :key="item.key"
            type="button"
            class="toolbar-menu-item"
            @click="onInsertSelect(item)"
          >
            <span class="toolbar-menu-item-icon"><EditorIcon :name="item.icon" /></span>
            <span>{{ labels[locale][item.labelKey] }}</span>
          </button>
        </div>
      </div>

      <div ref="tablePickerWrapRef" class="table-picker-wrap">
        <button
          type="button"
          class="toolbar-btn"
          :title="labels[locale].table"
          :aria-label="labels[locale].table"
          @mousedown.prevent
          @click="toggleTablePicker"
        >
          <EditorIcon name="table" />
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

      <div v-if="activeTableCell" ref="tableOpsMenuWrapRef" class="toolbar-menu-wrap">
        <button
          type="button"
          class="toolbar-btn toolbar-menu-trigger"
          :title="labels[locale].tableOps"
          :aria-label="labels[locale].tableOps"
          @mousedown.prevent
          @click="toggleTableOpsMenu"
        >
          <EditorIcon name="rowAddTop" />
          <EditorIcon class="menu-caret" name="chevronDown" :size="13" />
        </button>
        <div v-if="tableOpsMenuOpen" class="toolbar-menu-panel" @mousedown.prevent>
          <button
            v-for="item in tableOpsMenuItems"
            :key="item.key"
            type="button"
            class="toolbar-menu-item"
            @click="onTableOpsSelect(item.key)"
          >
            <span class="toolbar-menu-item-icon"><EditorIcon :name="item.icon" /></span>
            <span>{{ labels[locale][item.labelKey] }}</span>
          </button>
        </div>
      </div>
    </div>

    <div
      ref="editorRef"
      class="editor"
      contenteditable="true"
      @input="onInput"
      @keyup="cacheSelection"
      @mouseup="cacheSelection"
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
  padding: 14px;
  margin: 16px 0;
  background: var(--vp-c-bg-soft);
}

.demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.locale-switch {
  display: flex;
  gap: 6px;
}

.locale-switch button {
  height: 28px;
  padding: 0 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 12px;
  cursor: pointer;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: color-mix(in srgb, var(--vp-c-bg) 90%, transparent);
}

.toolbar-separator {
  width: 1px;
  height: 18px;
  background: var(--vp-c-divider);
  margin: 0 2px;
}

.toolbar-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 12px;
  cursor: pointer;
}

.toolbar-btn :deep(svg) {
  width: 16px;
  height: 16px;
}

.toolbar-btn:hover,
.toolbar-btn.active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.toolbar-menu-wrap {
  position: relative;
}

.toolbar-menu-trigger {
  width: auto;
  min-width: 46px;
  padding: 0 6px;
  gap: 3px;
}

.menu-caret {
  opacity: 0.72;
}

.toolbar-menu-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 35;
  min-width: 190px;
  max-height: 320px;
  overflow: auto;
  padding: 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.16);
}

.style-menu-panel {
  width: 248px;
  min-width: 248px;
  display: grid;
  gap: 8px;
}

.compact-menu-panel {
  min-width: 136px;
}

.color-menu-panel {
  width: 244px;
  min-width: 244px;
}

.toolbar-menu-group {
  display: grid;
  gap: 6px;
}

.toolbar-menu-group > header {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-text-2);
}

.style-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.style-chip {
  min-width: 54px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 12px;
  cursor: pointer;
}

.style-chip.active,
.style-chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.style-color-grid {
  gap: 6px;
}

.color-presets {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 5px;
}

.color-preset-section {
  padding-top: 2px;
  border-top: 1px dashed var(--vp-c-divider);
}

.color-preset-row {
  display: grid;
  gap: 6px;
}

.color-preset-label {
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.color-swatch {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  cursor: pointer;
}

.color-swatch.active,
.color-swatch:hover {
  border-color: var(--vp-c-brand-1);
}

.color-swatch-dot {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  border: 1px solid rgba(15, 23, 42, 0.16);
}

.style-color-item {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg-soft);
}

.style-color-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--vp-c-text-1);
}

.style-color-item input[type='color'] {
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
}

.toolbar-menu-item {
  width: 100%;
  min-height: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 9px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 12px;
  text-align: left;
  cursor: pointer;
}

.toolbar-menu-item:hover,
.toolbar-menu-item.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.toolbar-menu-item-icon {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.editor {
  height: var(--home-demo-editor-height, 320px);
  min-height: var(--home-demo-editor-height, 320px);
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

  .toolbar {
    gap: 5px;
    padding: 7px;
  }

  .toolbar-menu-panel {
    max-width: min(280px, calc(100vw - 52px));
  }

  .style-menu-panel {
    min-width: 260px;
    width: min(280px, calc(100vw - 52px));
  }

  .color-menu-panel {
    min-width: 236px;
    width: min(252px, calc(100vw - 52px));
  }

  .editor {
    --home-demo-editor-height: 240px;
  }
}
</style>
