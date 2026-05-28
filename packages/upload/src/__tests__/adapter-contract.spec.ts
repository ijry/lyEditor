import { describe, expect, it } from 'vitest'
import { createServerUploadAdapter } from '../adapters/server-upload'

describe('upload adapter contract', () => {
  it('exposes upload method', () => {
    const adapter = createServerUploadAdapter({ signUrl: '/api/editor/upload/sign' })
    expect(typeof adapter.upload).toBe('function')
  })
})
