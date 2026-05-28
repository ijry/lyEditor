import { createI18nStore } from './i18n-store'
import type { EditorPlugin, PluginI18nMap, ResolvedToolbarItem, ToolbarItem } from './types'

function cloneMessages(messages?: PluginI18nMap | null): PluginI18nMap {
  const output: PluginI18nMap = {}
  for (const [locale, localeMessages] of Object.entries(messages ?? {})) {
    output[locale] = { ...localeMessages }
  }
  return output
}

export function createPluginRegistry(input?: {
  locale?: string
  messages?: PluginI18nMap | null
}) {
  const plugins = new Map<string, EditorPlugin>()
  let locale = input?.locale ?? 'zh-CN'
  let externalMessages = cloneMessages(input?.messages)
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
    for (const [messageLocale, messages] of Object.entries(externalMessages)) {
      i18n.mergeMessages(messageLocale, messages)
    }
  }

  function resolveExternalTitle(
    pluginId: string,
    titleKey: string,
    targetLocale: string
  ): string | undefined {
    const localeMessages = externalMessages[targetLocale]
    if (!localeMessages) {
      return undefined
    }
    return localeMessages[`${pluginId}.${titleKey}`] ?? localeMessages[titleKey]
  }

  function resolveToolbarTitle(plugin: EditorPlugin, item: ToolbarItem): string {
    if (!item.titleKey) {
      return item.title ?? item.key
    }

    const externalCurrentLocale = resolveExternalTitle(plugin.id, item.titleKey, locale)
    if (externalCurrentLocale !== undefined) {
      return externalCurrentLocale
    }

    const pluginCurrentLocale = plugin.i18n?.[locale]?.[item.titleKey]
    if (pluginCurrentLocale !== undefined) {
      return pluginCurrentLocale
    }

    const externalEnUs = resolveExternalTitle(plugin.id, item.titleKey, 'en-US')
    if (externalEnUs !== undefined) {
      return externalEnUs
    }

    const pluginEnUs = plugin.i18n?.['en-US']?.[item.titleKey]

    if (pluginEnUs !== undefined) {
      return pluginEnUs
    }

    return item.title ?? item.titleKey
  }

  rebuildI18nStore()

  return {
    register(plugin: EditorPlugin) {
      plugins.set(plugin.id, plugin)
      rebuildI18nStore()
    },
    setMessages(nextMessages?: PluginI18nMap | null) {
      externalMessages = cloneMessages(nextMessages)
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
