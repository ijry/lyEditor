import type { EditorSnapshot } from './types'

export function runTransaction<T>(snapshot: EditorSnapshot, work: (draft: EditorSnapshot) => T) {
  const draft: EditorSnapshot = { plainText: snapshot.plainText }

  try {
    return { ok: true as const, value: work(draft), snapshot: draft }
  } catch (error) {
    return { ok: false as const, error, snapshot }
  }
}
