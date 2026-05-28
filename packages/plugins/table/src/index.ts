export const tableI18n = {
  'zh-CN': {
    'toolbar.table': '表格',
    'table.mergeCells': '合并单元格',
    'table.splitCell': '拆分单元格',
    'table.insertRow': '插入行',
    'table.insertCol': '插入列',
    'table.deleteRow': '删除行',
    'table.deleteCol': '删除列'
  },
  'en-US': {
    'toolbar.table': 'Table',
    'table.mergeCells': 'Merge Cells',
    'table.splitCell': 'Split Cell',
    'table.insertRow': 'Insert Row',
    'table.insertCol': 'Insert Column',
    'table.deleteRow': 'Delete Row',
    'table.deleteCol': 'Delete Column'
  }
}

export const tablePlugin = {
  id: 'table',
  i18n: tableI18n,
  toolbar: [{ key: 'table', group: 'table', titleKey: 'toolbar.table' }]
}

export * from './table-model'
export * from './commands'
