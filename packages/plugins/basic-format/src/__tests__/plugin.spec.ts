import { describe, expect, it } from 'vitest'
import { basicFormatPlugin } from '../index'
import { blockToolsPlugin } from '../../../block-tools/src'
import { linkImagePlugin } from '../../../link-image/src'
import { tablePlugin } from '../../../table/src'

function expectToolbarI18nCoverage(
  plugin: {
    toolbar?: Array<{ key: string; titleKey?: string }>
    i18n?: Record<string, Record<string, string>>
  },
  expected: Array<{ key: string; titleKey: string; zhCN: string; enUS: string }>
) {
  expect(plugin.toolbar).toBeDefined()
  expect(plugin.i18n?.['zh-CN']).toBeDefined()
  expect(plugin.i18n?.['en-US']).toBeDefined()

  for (const item of expected) {
    const toolbarItem = plugin.toolbar?.find((i) => i.key === item.key)
    expect(toolbarItem?.titleKey).toBe(item.titleKey)
    expect(plugin.i18n?.['zh-CN']?.[item.titleKey]).toBe(item.zhCN)
    expect(plugin.i18n?.['en-US']?.[item.titleKey]).toBe(item.enUS)
  }
}

describe('plugins i18n migration coverage', () => {
  it('covers basic-format titleKey and bilingual dictionaries for all toolbar entries', () => {
    expectToolbarI18nCoverage(basicFormatPlugin, [
      { key: 'bold', titleKey: 'toolbar.bold', zhCN: '加粗', enUS: 'Bold' },
      { key: 'italic', titleKey: 'toolbar.italic', zhCN: '斜体', enUS: 'Italic' },
      { key: 'underline', titleKey: 'toolbar.underline', zhCN: '下划线', enUS: 'Underline' }
    ])
  })

  it('covers block-tools titleKey and bilingual dictionaries for all toolbar entries', () => {
    expectToolbarI18nCoverage(blockToolsPlugin, [
      { key: 'heading', titleKey: 'toolbar.heading', zhCN: '标题', enUS: 'Heading' },
      { key: 'list', titleKey: 'toolbar.list', zhCN: '列表', enUS: 'List' },
      { key: 'quote', titleKey: 'toolbar.quote', zhCN: '引用', enUS: 'Quote' },
      { key: 'task-list', titleKey: 'toolbar.taskList', zhCN: '任务列表', enUS: 'Task List' },
      { key: 'code-block', titleKey: 'toolbar.codeBlock', zhCN: '代码块', enUS: 'Code Block' },
      { key: 'divider', titleKey: 'toolbar.divider', zhCN: '分割线', enUS: 'Divider' }
    ])
  })

  it('covers link-image titleKey and bilingual dictionaries for all toolbar entries', () => {
    expectToolbarI18nCoverage(linkImagePlugin, [
      { key: 'link', titleKey: 'toolbar.link', zhCN: '链接', enUS: 'Link' },
      { key: 'image', titleKey: 'toolbar.image', zhCN: '图片', enUS: 'Image' }
    ])
  })

  it('covers table titleKey and bilingual dictionaries for toolbar entries', () => {
    expectToolbarI18nCoverage(tablePlugin, [
      { key: 'table', titleKey: 'toolbar.table', zhCN: '表格', enUS: 'Table' }
    ])
  })
})
