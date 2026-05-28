import { createI18nStore } from './i18n-store'
import type { EditorPlugin, ResolvedToolbarItem } from './types'

export function createPluginRegistry(input?: { locale?: string }) {
  const plugins = new Map<string, EditorPlugin>()
  const i18n = createI18nStore({ locale: input?.locale })

  return {
    register(plugin: EditorPlugin) {
      plugins.set(plugin.id, plugin)
      if (plugin.i18n) {
        for (const [locale, messages] of Object.entries(plugin.i18n)) {
          i18n.mergeMessages(locale, messages)
        }
      }
    },
    setLocale(locale: string) {
      i18n.setLocale(locale)
    },
    getToolbar(): ResolvedToolbarItem[] {
      return [...plugins.values()]
        .flatMap((plugin) => plugin.toolbar ?? [])
        .map((item) => ({
          ...item,
          title: item.titleKey ? i18n.t(item.titleKey) : (item.title ?? item.key)
        }))
    }
  }
}
