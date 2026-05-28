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

  it('falls back to legacy title when titleKey translation is missing', () => {
    const registry = createPluginRegistry({ locale: 'zh-CN' })
    registry.register({
      id: 'missing-key',
      i18n: {
        'zh-CN': {}
      },
      toolbar: [{ key: 'missing', group: 'insert', titleKey: 'toolbar.missing', title: 'Fallback Label' }]
    })

    expect(registry.getToolbar()[0].title).toBe('Fallback Label')
  })

  it('isolates toolbar title resolution per plugin when title keys collide', () => {
    const registry = createPluginRegistry({ locale: 'zh-CN' })
    registry.register({
      id: 'plugin-a',
      i18n: {
        'zh-CN': { 'toolbar.shared': '甲' }
      },
      toolbar: [{ key: 'a', group: 'inline', titleKey: 'toolbar.shared' }]
    })
    registry.register({
      id: 'plugin-b',
      i18n: {
        'zh-CN': { 'toolbar.shared': '乙' }
      },
      toolbar: [{ key: 'b', group: 'inline', titleKey: 'toolbar.shared' }]
    })

    const toolbar = registry.getToolbar()
    expect(toolbar[0].title).toBe('甲')
    expect(toolbar[1].title).toBe('乙')
  })

  it('re-registers plugin without leaking stale i18n values', () => {
    const registry = createPluginRegistry({ locale: 'zh-CN' })
    registry.register({
      id: 'replace-me',
      i18n: {
        'zh-CN': { 'toolbar.replace': '旧值' }
      },
      toolbar: [{ key: 'replace', group: 'inline', titleKey: 'toolbar.replace' }]
    })
    expect(registry.getToolbar()[0].title).toBe('旧值')

    registry.register({
      id: 'replace-me',
      i18n: {
        'zh-CN': {}
      },
      toolbar: [{ key: 'replace', group: 'inline', titleKey: 'toolbar.replace', title: 'New Fallback' }]
    })

    expect(registry.getToolbar()[0].title).toBe('New Fallback')
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
