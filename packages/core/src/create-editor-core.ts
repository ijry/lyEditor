import { createCommandBus } from './command-bus'
import { runTransaction } from './transaction'
import type { EditorCore, EditorSnapshot } from './types'

export function createEditorCore(input: { initialText?: string }): EditorCore {
  let snapshot: EditorSnapshot = { plainText: input.initialText ?? '' }

  const bus = createCommandBus(
    () => snapshot,
    (next) => {
      snapshot = next
    }
  )

  return {
    exec(command, payload) {
      const result = runTransaction(snapshot, () => {
        bus.dispatch(command, payload)
      })

      if (!result.ok) {
        snapshot = result.snapshot
      }
    },
    getSnapshot() {
      return snapshot
    }
  }
}
