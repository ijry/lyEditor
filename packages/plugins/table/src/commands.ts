import type { TableModel } from './table-model'

export function insertTable(input: { rows: number; cols: number }): TableModel {
  return {
    rows: Array.from({ length: input.rows }).map(() => ({
      cells: Array.from({ length: input.cols }).map(() => ({
        text: '',
        rowSpan: 1,
        colSpan: 1
      }))
    }))
  }
}

export function mergeCells(
  table: TableModel,
  range: { start: [number, number]; end: [number, number] }
): TableModel {
  const next: TableModel = {
    rows: table.rows.map((row) => ({
      cells: row.cells.map((cell) => ({ ...cell }))
    }))
  }

  const [sr, sc] = range.start
  const [er, ec] = range.end

  next.rows[sr].cells[sc].rowSpan = er - sr + 1
  next.rows[sr].cells[sc].colSpan = ec - sc + 1

  return next
}
