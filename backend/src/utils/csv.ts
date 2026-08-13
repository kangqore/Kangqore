// Minimal RFC 4180 CSV parser — no dependency pulled in for a single parse
// step. Handles quoted fields, embedded commas/newlines, and escaped quotes
// ("" inside a quoted field). Used by the Migration Accelerator (Overshadow
// Roadmap P7.2) to read a CMDB export without assuming a particular shape.

export interface ParsedCsv {
  headers: string[]
  rows: Array<Record<string, string>>
}

function splitLine(text: string, start: number): { fields: string[]; next: number } {
  const fields: string[] = []
  let field = ''
  let i = start
  let inQuotes = false

  while (i < text.length) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue }
        inQuotes = false; i++; continue
      }
      field += ch; i++; continue
    }
    if (ch === '"') { inQuotes = true; i++; continue }
    if (ch === ',') { fields.push(field); field = ''; i++; continue }
    if (ch === '\r') { i++; continue }
    if (ch === '\n') { fields.push(field); return { fields, next: i + 1 } }
    field += ch; i++
  }
  fields.push(field)
  return { fields, next: i }
}

export function parseCsv(text: string, maxRows = 20000): ParsedCsv {
  const trimmed = text.replace(/^﻿/, '') // strip BOM
  if (!trimmed.trim()) return { headers: [], rows: [] }

  const { fields: headers, next: afterHeader } = splitLine(trimmed, 0)
  const rows: Array<Record<string, string>> = []
  let pos = afterHeader

  while (pos < trimmed.length && rows.length < maxRows) {
    const { fields, next } = splitLine(trimmed, pos)
    pos = next
    if (fields.length === 1 && fields[0] === '') continue // trailing blank line
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => { row[h] = fields[idx] ?? '' })
    rows.push(row)
  }

  return { headers, rows }
}
