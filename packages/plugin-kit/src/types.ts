export interface ToolbarItem {
  key: string
  group: 'inline' | 'block' | 'insert' | 'table' | 'upload'
  title: string
}

export interface EditorPlugin {
  id: string
  toolbar?: ToolbarItem[]
}
