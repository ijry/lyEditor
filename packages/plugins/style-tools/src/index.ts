export const styleToolsPlugin = {
  id: 'style-tools',
  i18n: {
    'zh-CN': {
      'toolbar.fontFamily': '字体',
      'toolbar.fontSize': '字号',
      'toolbar.textColor': '文字颜色',
      'toolbar.highlightColor': '高亮颜色',
      'toolbar.strike': '删除线',
      'toolbar.inlineCode': '行内代码'
    },
    'en-US': {
      'toolbar.fontFamily': 'Font Family',
      'toolbar.fontSize': 'Font Size',
      'toolbar.textColor': 'Text Color',
      'toolbar.highlightColor': 'Highlight Color',
      'toolbar.strike': 'Strike Through',
      'toolbar.inlineCode': 'Inline Code'
    }
  },
  toolbar: [
    { key: 'font-family', group: 'inline', titleKey: 'toolbar.fontFamily' },
    { key: 'font-size', group: 'inline', titleKey: 'toolbar.fontSize' },
    { key: 'text-color', group: 'inline', titleKey: 'toolbar.textColor' },
    { key: 'highlight-color', group: 'inline', titleKey: 'toolbar.highlightColor' },
    { key: 'strike', group: 'inline', titleKey: 'toolbar.strike' },
    { key: 'inline-code', group: 'inline', titleKey: 'toolbar.inlineCode' }
  ]
}
