import { describe, expect, it } from 'vitest'
import { createI18nStore } from '../i18n-store'

describe('i18n store', () => {
  it('falls back from locale to en-US to key', () => {
    const store = createI18nStore({
      locale: 'zh-CN',
      messages: {
        'en-US': { 'toolbar.bold': 'Bold' },
        'zh-CN': { 'toolbar.bold': '加粗' }
      }
    })

    expect(store.t('toolbar.bold')).toBe('加粗')
    store.setLocale('fr-FR')
    expect(store.t('toolbar.bold')).toBe('Bold')
    expect(store.t('toolbar.missing')).toBe('toolbar.missing')
  })

  it('allows merge messages to override existing keys', () => {
    const store = createI18nStore({ locale: 'zh-CN' })
    store.mergeMessages('zh-CN', { 'toolbar.bold': '加粗' })
    store.mergeMessages('zh-CN', { 'toolbar.bold': '粗体' })
    expect(store.t('toolbar.bold')).toBe('粗体')
  })

  it('interpolates params safely with literal replacement', () => {
    const store = createI18nStore({
      locale: 'en-US',
      messages: {
        'en-US': {
          'toolbar.label': 'Hello {na.me} {name} {name} {price}'
        }
      }
    })

    expect(
      store.t('toolbar.label', {
        'na.me': 'A',
        name: '$1',
        price: '$&'
      })
    ).toBe('Hello A $1 $1 $&')
  })

  it('isolates initial messages from external mutations', () => {
    const inputMessages = {
      'en-US': { 'toolbar.bold': 'Bold' }
    }

    const store = createI18nStore({
      locale: 'en-US',
      messages: inputMessages
    })

    inputMessages['en-US']['toolbar.bold'] = 'Changed'
    expect(store.t('toolbar.bold')).toBe('Bold')
  })
})
