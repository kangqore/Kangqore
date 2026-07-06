import type { ReactNode } from 'react'
import { EditableCell } from './EditableCell'

export interface ColumnDef {
  id:       string
  header:   string
  field:    string
  type?:    'text' | 'select' | 'date' | 'badge'
  editable?: boolean
  options?:  string[]
  colorMap?: Record<string, string>
  width?:    string
  render?:   (item: any) => ReactNode
}

interface TableViewProps {
  items:       any[]
  columns:     ColumnDef[]
  onUpdate:    (id: string, field: string, value: string) => void
  onRowClick?: (item: any) => void
  accentColor?: string
}

export function TableView({ items, columns, onUpdate, onRowClick, accentColor = '#2564ea' }: TableViewProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-slate-900/70">
            {columns.map(col => (
              <th
                key={col.id}
                className="text-left px-4 py-3 text-xs font-semibold text-[var(--os-text-2)] uppercase tracking-wider whitespace-nowrap"
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr
              key={item.id}
              className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors group"
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map(col => (
                <td
                  key={col.id}
                  className="px-4 py-2.5 whitespace-nowrap"
                  onClick={e => { if (col.editable) e.stopPropagation() }}
                >
                  {col.render ? (
                    col.render(item)
                  ) : col.editable ? (
                    <EditableCell
                      value={item[col.field] ?? ''}
                      type={col.type === 'select' ? 'select' : col.type === 'date' ? 'date' : 'text'}
                      options={col.options?.map(o => ({ value: o }))}
                      displayColor={col.colorMap?.[item[col.field]]}
                      isBadge={!!col.colorMap}
                      onSave={v => onUpdate(item.id, col.field, v)}
                    />
                  ) : col.colorMap ? (
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: `${col.colorMap[item[col.field]] ?? '#6B7280'}22`,
                        color:      col.colorMap[item[col.field]] ?? '#6B7280',
                      }}
                    >
                      {String(item[col.field] ?? '').replace(/_/g, ' ')}
                    </span>
                  ) : (
                    <span className="text-sm text-[var(--os-text-1)]">{item[col.field] ?? '—'}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-14 text-center text-[var(--os-text-2)] text-sm">
                No items
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
