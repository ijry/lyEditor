import type { EditorPlugin, ToolbarItem } from './types'

export function createPluginRegistry() {
  const plugins = new Map<string, EditorPlugin>()

  return {
    register(plugin: EditorPlugin) {
      plugins.set(plugin.id, plugin)
    },
    getToolbar(): ToolbarItem[] {
      return [...plugins.values()].flatMap((plugin) => plugin.toolbar ?? [])
    }
  }
}
