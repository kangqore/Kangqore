import { useState, useEffect } from 'react'
import { Network, ZoomIn, ZoomOut, Maximize, Loader2 } from 'lucide-react'
import { api } from '@lib/api'

// Simple mock topology to render until backend integrates fully
const MOCK_NODES = [
  { id: '1', type: 'Person', label: 'Mahesh Kumar', x: 400, y: 150 },
  { id: '2', type: 'Team', label: 'Alpha Squad', x: 250, y: 300 },
  { id: '3', type: 'Project', label: 'BIDS Platform', x: 550, y: 300 },
  { id: '4', type: 'Risk', label: 'Delivery Delay', x: 700, y: 450 },
  { id: '5', type: 'Customer', label: 'Acme Corp', x: 400, y: 450 },
]

const MOCK_EDGES = [
  { source: '1', target: '2', label: 'MANAGES' },
  { source: '1', target: '3', label: 'OWNS' },
  { source: '2', target: '3', label: 'DELIVERS' },
  { source: '3', target: '4', label: 'HAS_RISK' },
  { source: '3', target: '5', label: 'FOR_CLIENT' },
]

export function OntologyGraphExplorer() {
  const [scale, setScale] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading the full enterprise graph
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-black rounded-3xl overflow-hidden border border-[var(--os-border)] shadow-2xl relative">
      
      {/* Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2 pointer-events-auto">
          <Network className="w-5 h-5 text-indigo-400" />
          <span className="text-white font-bold text-sm tracking-tight">Enterprise Graph Explorer</span>
        </div>
        
        <div className="bg-black/60 backdrop-blur-md border border-white/10 flex items-center rounded-2xl pointer-events-auto">
          <button onClick={() => setScale(s => Math.min(s + 0.2, 2))} className="p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded-l-xl"><ZoomIn className="w-4 h-4" /></button>
          <div className="w-px h-4 bg-white/20" />
          <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"><ZoomOut className="w-4 h-4" /></button>
          <div className="w-px h-4 bg-white/20" />
          <button onClick={() => setScale(1)} className="p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded-r-xl"><Maximize className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
            <p className="text-white/60 font-bold tracking-widest uppercase text-xs">Computing Topology...</p>
          </div>
        ) : (
          <div 
            className="absolute inset-0 origin-center transition-transform duration-300 ease-out"
            style={{ transform: `scale(${scale})` }}
          >
            {/* Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.2)" />
                </marker>
              </defs>
              {MOCK_EDGES.map((edge, idx) => {
                const source = MOCK_NODES.find(n => n.id === edge.source)
                const target = MOCK_NODES.find(n => n.id === edge.target)
                if (!source || !target) return null
                
                const midX = (source.x + target.x) / 2
                const midY = (source.y + target.y) / 2

                return (
                  <g key={idx}>
                    <line 
                      x1={source.x} y1={source.y} 
                      x2={target.x} y2={target.y} 
                      stroke="rgba(255,255,255,0.1)" 
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <text x={midX} y={midY - 8} fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {edge.label}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Nodes */}
            {MOCK_NODES.map(node => (
              <div
                key={node.id}
                className="absolute w-40 h-16 -ml-20 -mt-8 bg-black border border-white/20 rounded-2xl flex flex-col items-center justify-center shadow-lg hover:border-indigo-500 hover:shadow-indigo-500/20 transition-all cursor-pointer group"
                style={{ left: node.x, top: node.y }}
              >
                <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">{node.type}</span>
                <span className="text-sm font-bold text-white mt-0.5">{node.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
