export type LocaleMessages = Record<string, string>
export type I18nMessageMap = Record<string, LocaleMessages>

export interface I18nStore {
  getLocale: () => string
  setLocale: (locale: string) => void
  mergeMessages: (locale: string, messages: LocaleMessages) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

export function createI18nStore(input?: {
  locale?: string
  messages?: I18nMessageMap
}): I18nStore {
  let locale = input?.locale ?? 'zh-CN'
  const messages: I18nMessageMap = {
    ...(input?.messages ?? {})
  }

  return {
    getLocale() {
      return locale
    },
    setLocale(nextLocale: string) {
      locale = nextLocale
    },
    mergeMessages(targetLocale: string, nextMessages: LocaleMessages) {
      messages[targetLocale] = {
        ...(messages[targetLocale] ?? {}),
        ...nextMessages
      }
    },
    t(key: string, params?: Record<string, string | number>) {
      const text = messages[locale]?.[key] ?? messages['en-US']?.[key] ?? key
      if (!params) {
        return text
      }
      return Object.entries(params).reduce(
        (acc, [name, value]) => acc.replace(new RegExp(`\\{${name}\\}`, 'g'), String(value)),
        text
      )
    }
  }
}
