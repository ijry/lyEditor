// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { LyEditor } from '../LyEditor'

describe('react wrapper api', () => {
  it('exports component', () => {
    expect(typeof LyEditor).toBe('function')
  })
})
