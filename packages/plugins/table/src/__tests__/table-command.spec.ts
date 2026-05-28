import { describe, expect, it } from 'vitest'
import { insertTable, mergeCells } from '../commands'

describe('table commands', () => {
  it('creates table and merges cells safely', () => {
    const table = insertTable({ rows: 2, cols: 2 })
    const merged = mergeCells(table, { start: [0, 0], end: [0, 1] })
    expect(merged.rows[0].cells[0].colSpan).toBe(2)
  })
})
