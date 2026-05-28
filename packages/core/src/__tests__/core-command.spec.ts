import { describe, expect, it } from 'vitest'
import { createEditorCore } from '../create-editor-core'

describe('core command bus', () => {
  it('updates snapshot after command execution', () => {
    const editor = createEditorCore({ initialText: 'hello' })
    editor.exec('insertText', { text: ' world' })
    expect(editor.getSnapshot().plainText).toBe('hello world')
  })
})
