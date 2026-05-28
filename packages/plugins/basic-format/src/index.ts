export const basicFormatPlugin = {
  id: 'basic-format',
  i18n: {
    'zh-CN': {
      'toolbar.bold': '加粗',
      'toolbar.italic': '斜体',
      'toolbar.underline': '下划线'
    },
    'en-US': {
      'toolbar.bold': 'Bold',
      'toolbar.italic': 'Italic',
      'toolbar.underline': 'Underline'
    }
  },
  toolbar: [
    { key: 'bold', group: 'inline', titleKey: 'toolbar.bold' },
    { key: 'italic', group: 'inline', titleKey: 'toolbar.italic' },
    { key: 'underline', group: 'inline', titleKey: 'toolbar.underline' }
  ]
}
