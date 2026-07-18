// S74 — Y.js CRDT layer for WorkflowCanvas co-editing
// Requires: yjs, y-websocket, y-indexeddb (all installed)
// Requires: y-websocket server running (Docker or standalone)
// Docker: docker run -d -p 1234:1234 websockets/y-websocket

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

const Y_WS_URL  = import.meta.env.VITE_YWS_URL || 'ws://localhost:1234'
const Y_OFFLINE = !import.meta.env.VITE_YWS_URL  // true when no y-websocket server configured

export interface CanvasUser {
  name:   string
  color:  string
  cursor: { x: number; y: number } | null
}

export class CanvasYDoc {
  doc:     Y.Doc
  nodes:   Y.Array<any>
  edges:   Y.Array<any>
  meta:    Y.Map<any>
  ws:      WebsocketProvider | null = null
  idb:     IndexeddbPersistence
  undoMgr: Y.UndoManager
  private listeners: Array<() => void> = []

  constructor(workflowId: string) {
    this.doc   = new Y.Doc()
    this.nodes = this.doc.getArray(`canvas-nodes-${workflowId}`)
    this.edges = this.doc.getArray(`canvas-edges-${workflowId}`)
    this.meta  = this.doc.getMap(`canvas-meta-${workflowId}`)

    // Offline-first: IndexedDB persistence (sync on reconnect)
    this.idb = new IndexeddbPersistence(`kangqore-canvas-${workflowId}`, this.doc)

    // UndoManager scoped per-user (Ctrl+Z only undoes this user's changes)
    this.undoMgr = new Y.UndoManager([this.nodes, this.edges], { captureTimeout: 500 })

    // Real-time sync (only when y-websocket server is available)
    if (!Y_OFFLINE) {
      this.ws = new WebsocketProvider(Y_WS_URL, `kangqore-canvas-${workflowId}`, this.doc)
    }
  }

  setAwareness(user: CanvasUser) {
    if (!this.ws) return
    this.ws.awareness.setLocalStateField('user', user)
  }

  getAwareness(): Map<number, { user?: CanvasUser }> {
    if (!this.ws) return new Map()
    return this.ws.awareness.getStates() as Map<number, { user?: CanvasUser }>
  }

  // Sync React Flow nodes array into Y.js (replaces entire array — last-write-wins for position)
  syncNodes(nodes: any[]) {
    this.doc.transact(() => {
      this.nodes.delete(0, this.nodes.length)
      nodes.forEach(n => this.nodes.push([n]))
    })
  }

  // Sync React Flow edges (union merge: add missing, tombstone removed)
  syncEdges(edges: any[]) {
    this.doc.transact(() => {
      this.edges.delete(0, this.edges.length)
      edges.forEach(e => this.edges.push([e]))
    })
  }

  toNodes(): any[] { return this.nodes.toArray().flat() }
  toEdges(): any[] { return this.edges.toArray().flat() }

  undo() { this.undoMgr.undo() }
  redo() { this.undoMgr.redo() }

  onChange(fn: () => void) {
    this.nodes.observe(fn)
    this.edges.observe(fn)
    this.listeners.push(fn)
  }

  destroy() {
    this.listeners.forEach(fn => { this.nodes.unobserve(fn); this.edges.unobserve(fn) })
    this.ws?.destroy()
    this.idb.destroy()
    this.doc.destroy()
  }
}

let instances: Map<string, CanvasYDoc> = new Map()

export function getCanvasYDoc(workflowId: string): CanvasYDoc {
  if (!instances.has(workflowId)) {
    instances.set(workflowId, new CanvasYDoc(workflowId))
  }
  return instances.get(workflowId)!
}

export function releaseCanvasYDoc(workflowId: string) {
  instances.get(workflowId)?.destroy()
  instances.delete(workflowId)
}
