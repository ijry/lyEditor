export interface ToolbarItem {
  key: string
  group: 'inline' | 'block' | 'insert' | 'table' | 'upload'
  title?: string
  titleKey?: string
}

export type PluginI18nMap = Record<string, Record<string, string>>

export interface EditorPlugin {
  id: string
  toolbar?: ToolbarItem[]
  i18n?: PluginI18nMap
}

export interface ResolvedToolbarItem extends ToolbarItem {
  title: string
}
