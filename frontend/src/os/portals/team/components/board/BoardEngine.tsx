import { useState, type ReactNode } from 'react'
import { Rows3, LayoutGrid } from 'lucide-react'
import { TableView, type ColumnDef }       from './TableView'
import { KanbanView, type KanbanGroup }    from './KanbanView'
import { ItemDetailPanel, type PanelField, type RelatedItem } from './ItemDetailPanel'

export type { ColumnDef, KanbanGroup, PanelField, RelatedItem }

type ViewMode = 'table' | 'kanban'

interface BoardEngineProps {
  items:              any[]
  columns:            ColumnDef[]
  statusField:        string
  kanbanGroups:       KanbanGroup[]
  accentColor?:       string
  detailFields?:      PanelField[]
  getRelatedItems?:   (item: any) => RelatedItem[]
  renderKanbanCard?:  (item: any, isDragging?: boolean) => ReactNode
  onUpdate:           (id: string, field: string, value: string) => void
  defaultView?:       ViewMode
}

export function BoardEngine({
  items, columns, statusField, kanbanGroups,
  accentColor = '#2564ea', detailFields, getRelatedItems,
  renderKanbanCard, onUpdate, defaultView = 'table',
}: BoardEngineProps) {
  const [view, setView]               = useState<ViewMode>(defaultView)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  function handleUpdate(id: string, field: string, value: string) {
    onUpdate(id, field, value)
    if (selectedItem?.id === id) {
      setSelectedItem((prev: any) => ({ ...prev, [field]: value }))
    }
  }

  const autoDetailFields: PanelField[] = detailFields
    ?? columns.filter(c => !c.render).map(c => ({ label: c.header, field: c.field }))

  return (
    <div className="space-y-4">
      {/* View switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-xl w-fit border border-white/10">
        {([
          { id: 'table',  label: 'Table',  Icon: Rows3 },
          { id: 'kanban', label: 'Kanban', Icon: LayoutGrid },
        ] as const).map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              view === v.id
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-[var(--os-text-2)] hover:text-[var(--os-text-1)]'
            }`}
          >
            <v.Icon className="w-3.5 h-3.5" />
            {v.label}
          </button>
        ))}
      </div>

      {/* Table view */}
      {view === 'table' && (
        <TableView
          items={items}
          columns={columns}
          onUpdate={handleUpdate}
          onRowClick={setSelectedItem}
          accentColor={accentColor}
        />
      )}

      {/* Kanban view */}
      {view === 'kanban' && (
        <KanbanView
          items={items}
          groups={kanbanGroups}
          statusField={statusField}
          renderCard={renderKanbanCard ?? ((item) => (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-white/10 space-y-2 hover:bg-slate-800/80 transition-all">
              <p className="text-xs font-medium text-white leading-tight">{item.title ?? item.name ?? item.id}</p>
              <p className="text-xs text-[var(--os-text-2)]">{item.id}</p>
            </div>
          ))}
          onMove={(id, toGroup) => handleUpdate(id, statusField, toGroup)}
          onCardClick={setSelectedItem}
        />
      )}

      {/* Detail panel */}
      {selectedItem && (
        <ItemDetailPanel
          item={selectedItem}
          fields={autoDetailFields}
          relatedItems={getRelatedItems?.(selectedItem)}
          accentColor={accentColor}
          onClose={() => setSelectedItem(null)}
          onUpdate={(field, value) => handleUpdate(selectedItem.id, field, value)}
        />
      )}
    </div>
  )
}
