import { describe, expect, it } from 'vitest'
import { createPluginRegistry } from '../create-plugin-registry'

describe('plugin registry', () => {
  it('resolves toolbar title from titleKey and plugin i18n messages', () => {
    const registry = createPluginRegistry({ locale: 'zh-CN' })
    registry.register({
      id: 'bold',
      i18n: {
        'zh-CN': { 'toolbar.bold': '加粗' },
        'en-US': { 'toolbar.bold': 'Bold' }
      },
      toolbar: [{ key: 'bold', group: 'inline', titleKey: 'toolbar.bold' }]
    })

    expect(registry.getToolbar()[0].title).toBe('加粗')
    registry.setLocale('en-US')
    expect(registry.getToolbar()[0].title).toBe('Bold')
  })

  it('keeps backward compatibility for legacy title', () => {
    const registry = createPluginRegistry({ locale: 'zh-CN' })
    registry.register({
      id: 'legacy',
      toolbar: [{ key: 'legacy', group: 'insert', title: 'Legacy Label' }]
    })

    expect(registry.getToolbar()[0].title).toBe('Legacy Label')
  })
})
