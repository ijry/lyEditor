export type EditorCommand = 'insertText'

export interface InsertTextPayload {
  text?: string
}

export interface EditorSnapshot {
  plainText: string
}

export interface EditorCore {
  exec: (command: EditorCommand, payload?: unknown) => void
  getSnapshot: () => EditorSnapshot
}
