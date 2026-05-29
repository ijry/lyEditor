<script setup lang="ts">
import { computed } from 'vue'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Columns2,
  Columns3,
  Eraser,
  Heading1,
  Heading2,
  Highlighter,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Palette,
  Pilcrow,
  Redo2,
  RefreshCw,
  Rows2,
  Rows3,
  SeparatorHorizontal,
  SquareCode,
  Strikethrough,
  Table,
  TableCellsMerge,
  TableCellsSplit,
  TableColumnsSplit,
  TableRowsSplit,
  TextCursorInput,
  TextQuote,
  Trash2,
  Type,
  Underline,
  Undo2,
  Unlink
} from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
  }>(),
  {
    size: 16
  }
)

const iconMap = {
  bold: Bold,
  italic: Italic,
  underline: Underline,
  strike: Strikethrough,
  listBullet: List,
  listOrdered: ListOrdered,
  heading1: Heading1,
  heading2: Heading2,
  paragraph: Pilcrow,
  quote: TextQuote,
  codeBlock: SquareCode,
  inlineCode: Code,
  alignLeft: AlignLeft,
  alignCenter: AlignCenter,
  alignRight: AlignRight,
  alignJustify: AlignJustify,
  link: Link,
  unlink: Unlink,
  image: Image,
  table: Table,
  divider: SeparatorHorizontal,
  undo: Undo2,
  redo: Redo2,
  clear: Eraser,
  reset: RefreshCw,
  fontFamily: Type,
  fontSize: TextCursorInput,
  textColor: Palette,
  highlight: Highlighter,
  chevronDown: ChevronDown,
  rowAddTop: TableRowsSplit,
  rowAddBottom: Rows3,
  rowDelete: Rows2,
  colAddLeft: TableColumnsSplit,
  colAddRight: Columns3,
  colDelete: Columns2,
  mergeRight: TableCellsMerge,
  splitCell: TableCellsSplit,
  deleteTable: Trash2
} as const

const iconComponent = computed(() => {
  return iconMap[props.name as keyof typeof iconMap] ?? Table
})
</script>

<template>
  <component :is="iconComponent" :size="size" :stroke-width="1.95" />
</template>
