import { describe, expect, it } from 'vitest'
import { basicFormatPlugin } from '../index'

describe('basic format plugin', () => {
  it('uses titleKey and bilingual dictionaries', () => {
    expect(basicFormatPlugin.toolbar?.some((i) => i.titleKey === 'toolbar.bold')).toBe(true)
    expect(basicFormatPlugin.i18n?.['zh-CN']?.['toolbar.bold']).toBe('加粗')
    expect(basicFormatPlugin.i18n?.['en-US']?.['toolbar.bold']).toBe('Bold')
  })
})
