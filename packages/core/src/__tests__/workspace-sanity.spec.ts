import { describe, expect, it } from 'vitest'
import { CORE_VERSION } from '../index'

describe('workspace sanity', () => {
  it('exports core version constant', () => {
    expect(CORE_VERSION).toBe('0.1.0')
  })
})
