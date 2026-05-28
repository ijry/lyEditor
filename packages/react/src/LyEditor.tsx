import React from 'react'

export interface LyEditorRef {
  getEditor: () => unknown
  exec: (command?: string, payload?: unknown) => void
  getValue: () => unknown[]
  setValue: (next?: unknown[]) => void
  destroy: () => void
}

export function LyEditor() {
  return React.createElement('div', { 'data-ly-editor': true })
}
