import type { EditorCommand, EditorSnapshot, InsertTextPayload } from './types'

export function createCommandBus(state: () => EditorSnapshot, update: (next: EditorSnapshot) => void) {
  return {
    dispatch(command: EditorCommand, payload?: unknown) {
      if (command === 'insertText') {
        const text = String((payload as InsertTextPayload | undefined)?.text ?? '')
        const current = state()
        update({ plainText: current.plainText + text })
      }
    }
  }
}
