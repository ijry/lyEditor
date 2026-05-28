import React from 'react'

export interface LyEditorProps {
  locale?: string | null
  messages?: Record<string, Record<string, string>> | null
}

export interface LyEditorRef {
  getEditor: () => unknown
  exec: (command?: string, payload?: unknown) => void
  getValue: () => unknown[]
  setValue: (next?: unknown[]) => void
  destroy: () => void
}

export function LyEditor(props: LyEditorProps) {
  return React.createElement('div', {
    'data-testid': 'ly-editor-root',
    'data-ly-editor': true,
    'data-locale': props.locale ?? 'zh-CN',
    'data-has-messages': props.messages ? '1' : '0'
  })
}
