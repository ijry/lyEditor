export const blockToolsPlugin = {
  id: 'block-tools',
  i18n: {
    'zh-CN': {
      'toolbar.heading': '标题',
      'toolbar.list': '列表',
      'toolbar.quote': '引用',
      'toolbar.taskList': '任务列表',
      'toolbar.codeBlock': '代码块',
      'toolbar.divider': '分割线'
    },
    'en-US': {
      'toolbar.heading': 'Heading',
      'toolbar.list': 'List',
      'toolbar.quote': 'Quote',
      'toolbar.taskList': 'Task List',
      'toolbar.codeBlock': 'Code Block',
      'toolbar.divider': 'Divider'
    }
  },
  toolbar: [
    { key: 'heading', group: 'block', titleKey: 'toolbar.heading' },
    { key: 'list', group: 'block', titleKey: 'toolbar.list' },
    { key: 'quote', group: 'block', titleKey: 'toolbar.quote' },
    { key: 'task-list', group: 'block', titleKey: 'toolbar.taskList' },
    { key: 'code-block', group: 'block', titleKey: 'toolbar.codeBlock' },
    { key: 'divider', group: 'insert', titleKey: 'toolbar.divider' }
  ]
}
