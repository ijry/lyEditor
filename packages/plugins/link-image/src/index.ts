export const linkImagePlugin = {
  id: 'link-image',
  i18n: {
    'zh-CN': {
      'toolbar.link': '链接',
      'toolbar.image': '图片'
    },
    'en-US': {
      'toolbar.link': 'Link',
      'toolbar.image': 'Image'
    }
  },
  toolbar: [
    { key: 'link', group: 'insert', titleKey: 'toolbar.link' },
    { key: 'image', group: 'insert', titleKey: 'toolbar.image' }
  ]
}
