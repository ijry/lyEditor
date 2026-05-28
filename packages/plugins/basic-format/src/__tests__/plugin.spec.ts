import { describe, expect, it } from 'vitest'
import { basicFormatPlugin } from '../index'

describe('basic format plugin', () => {
  it('declares toolbar and commands', () => {
    expect(basicFormatPlugin.id).toBe('basic-format')
    expect(basicFormatPlugin.toolbar?.some((i) => i.key === 'bold')).toBe(true)
  })
})
