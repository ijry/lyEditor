export interface TableCell {
  text: string
  rowSpan: number
  colSpan: number
}

export interface TableRow {
  cells: TableCell[]
}

export interface TableModel {
  rows: TableRow[]
}
