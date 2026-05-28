import { createI18nStore } from './i18n-store'
import type { EditorPlugin, ResolvedToolbarItem, ToolbarItem } from './types'

export function createPluginRegistry(input?: { locale?: string }) {
  const plugins = new Map<string, EditorPlugin>()
  let locale = input?.locale ?? 'zh-CN'
  let i18n = createI18nStore({ locale })

  function rebuildI18nStore() {
    i18n = createI18nStore({ locale })
    for (const plugin of plugins.values()) {
      if (!plugin.i18n) {
        continue
      }
      for (const [messageLocale, messages] of Object.entries(plugin.i18n)) {
        i18n.mergeMessages(messageLocale, messages)
      }
    }
  }

  function resolveToolbarTitle(plugin: EditorPlugin, item: ToolbarItem): string {
    if (!item.titleKey) {
      return item.title ?? item.key
    }

    const translated =
      plugin.i18n?.[locale]?.[item.titleKey] ??
      plugin.i18n?.['en-US']?.[item.titleKey]

    if (translated !== undefined) {
      return translated
    }

    return item.title ?? item.titleKey
  }

  return {
    register(plugin: EditorPlugin) {
      plugins.set(plugin.id, plugin)
      rebuildI18nStore()
    },
    setLocale(nextLocale: string) {
      i18n.setLocale(nextLocale)
      locale = i18n.getLocale()
    },
    getToolbar(): ResolvedToolbarItem[] {
      return [...plugins.values()]
        .flatMap((plugin) =>
          (plugin.toolbar ?? []).map((item) => ({
            ...item,
            title: resolveToolbarTitle(plugin, item)
          }))
        )
    }
  }
}
