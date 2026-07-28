// ---------------------------------------------------------------------------
// WAANDA Neural Cortex — the brain, alive.
//
// A cinematic 3D galaxy of the operator's notes rendered with 3d-force-graph:
// starfield space, neurons glowing by brain region, slow idle drift. Ask it a
// question and the camera dives to the note that answered; say "remember
// that…" and a new star is born, live. Voice in (MediaRecorder + Whisper STT)
// and voice out (speechSynthesis, Samantha preferred, backend WAV fallback).
//
// Node contract: every node's numeric id === its index in the nodes array.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from 'react'
import ForceGraph3D, { type ForceGraph3DInstance } from '3d-force-graph'
import * as THREE from 'three'
import { HouseIcon, MagnifyingGlassIcon, MicrophoneIcon, PaperPlaneRightIcon, TrashIcon, XIcon } from '@phosphor-icons/react'
import { api } from '@lib/api'

interface BrainNode {
  id: number
  slug: string
  title: string
  group: string
  description: string
  excerpt: string
  val: number
  file: string
  x?: number; y?: number; z?: number
  __sphere?: THREE.Mesh
  __sprite?: THREE.Sprite
  __r?: number
}

interface BrainLink { source: number; target: number }

type Status = 'idle' | 'listening' | 'thinking' | 'speaking'

const GROUP_COLORS: Record<string, string> = {
  identity:     '#a78bfa', // WAANDA / KIMMP / AEGIS — violet
  architecture: '#38bdf8', // platform architecture — sky
  chronicle:    '#f59e0b', // sprint history — amber
  commercial:   '#10b981', // revenue / BIDS / strategy — emerald
  ops:          '#f43f5e', // environment / tooling / operator — rose
  core:         '#22d3ee', // everything foundational — cyan
  capture:      '#fde047', // newborn memories — star yellow
}

const GROUP_LABELS: Record<string, string> = {
  identity: 'Identity', architecture: 'Architecture', chronicle: 'Chronicle',
  commercial: 'Commercial', ops: 'Operations', core: 'Core', capture: 'Captures',
}

const groupColor = (g: string) => GROUP_COLORS[g] ?? '#94a3b8'

function computeGroupCounts(nodes: BrainNode[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const n of nodes) counts[n.group] = (counts[n.group] ?? 0) + 1
  return counts
}

// cached radial-gradient glow textures, one per color
const glowCache = new Map<string, THREE.Texture>()
function glowTexture(color: string): THREE.Texture {
  let tex = glowCache.get(color)
  if (tex) return tex
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,0.95)')
  grad.addColorStop(0.25, color)
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)
  tex = new THREE.CanvasTexture(c)
  glowCache.set(color, tex)
  return tex
}

function makeStarfield(): THREE.Group {
  const group = new THREE.Group()
  const layer = (count: number, size: number, color: number, opacity: number) => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(1600 + Math.random() * 2400)
      positions[i * 3] = v.x; positions[i * 3 + 1] = v.y; positions[i * 3 + 2] = v.z
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({
      color, size, sizeAttenuation: false, transparent: true, opacity, depthWrite: false,
    })
    group.add(new THREE.Points(geo, mat))
  }
  layer(3200, 0.9, 0x9db4d8, 0.55)   // faint dust
  layer(500, 1.7, 0xdde9ff, 0.9)     // bright stars
  layer(90, 2.6, 0xfff3c4, 0.85)     // a few warm giants
  return group
}

// Anatomical Brain Lobe Positioning for Neurons
function assignAnatomicalBrainCoordinates(nodes: BrainNode[]) {
  nodes.forEach((n, idx) => {
    // Hemispheric split (even = left hemisphere, odd = right hemisphere)
    const isLeft = idx % 2 === 0
    const side = isLeft ? -1 : 1
    const offset = Math.sin(idx * 1.5) * 12

    // Anatomical brain regions mapped to group identity
    switch (n.group) {
      case 'identity': // Prefrontal Cortex (Frontal Lobe) - Thought & Self
        n.fx = side * (35 + Math.sin(idx) * 25)
        n.fy = 35 + Math.cos(idx * 0.7) * 25
        n.fz = 85 + (idx % 5) * 12
        break
      case 'architecture': // Parietal & Motor Cortex (Top Crown) - Structure & Systems
        n.fx = side * (40 + Math.cos(idx) * 30)
        n.fy = 85 + Math.sin(idx * 0.8) * 20
        n.fz = 10 + offset
        break
      case 'chronicle': // Temporal Lobe (Sides & Memory Axis)
        n.fx = side * (90 + Math.sin(idx * 0.5) * 20)
        n.fy = 5 + Math.cos(idx * 0.6) * 35
        n.fz = 25 + offset
        break
      case 'commercial': // Occipital Lobe (Back Cortex) - Vision & Value
        n.fx = side * (35 + Math.cos(idx) * 25)
        n.fy = 25 + Math.sin(idx * 0.7) * 30
        n.fz = -95 - (idx % 6) * 10
        break
      case 'ops': // Cerebellum (Lower Back Base) - Execution & Balance
        n.fx = side * (45 + Math.sin(idx) * 25)
        n.fy = -65 + Math.cos(idx * 0.8) * 20
        n.fz = -65 + offset
        break
      case 'core': // Brainstem & Limbic Core (Central Axis)
        n.fx = side * (10 + Math.sin(idx) * 10)
        n.fy = -45 + (idx % 8) * -8
        n.fz = -10 + offset
        break
      case 'capture': default: // Hippocampus & Active Synapse Hubs
        n.fx = side * (55 + Math.cos(idx) * 25)
        n.fy = 15 + Math.sin(idx * 0.9) * 25
        n.fz = 45 + offset
        break
    }
  })
}

function makeBrainHologramShell(): THREE.Group {
  const group = new THREE.Group()

  const leftPoints: THREE.Vector3[] = []
  const rightPoints: THREE.Vector3[] = []
  const fissurePoints: THREE.Vector3[] = []

  // Create cerebral hemispheres & cortex surface contours
  for (let u = 0; u <= Math.PI; u += 0.12) {
    for (let v = 0; v <= Math.PI * 2; v += 0.15) {
      const radiusX = 68 + Math.sin(v * 3) * 6
      const radiusY = 75 + Math.cos(u * 2) * 8
      const radiusZ = 95 + Math.sin(u * 2.5) * 10

      const cosU = Math.cos(u)
      const sinU = Math.sin(u)
      const cosV = Math.cos(v)
      const sinV = Math.sin(v)

      // Surface Gyri & Sulci folds
      const fold = Math.sin(sinU * sinV * 14) * Math.cos(cosU * 10) * 5.5

      const y = cosU * radiusY + fold
      const z = cosV * radiusZ + fold

      // Left Hemisphere (x < 0)
      const lx = -(12 + sinU * Math.abs(sinV) * radiusX + fold)
      leftPoints.push(new THREE.Vector3(lx, y, z))

      // Right Hemisphere (x > 0)
      const rx = (12 + sinU * Math.abs(sinV) * radiusX + fold)
      rightPoints.push(new THREE.Vector3(rx, y, z))
    }
  }

  // Central Longitudinal Fissure (Divider between Left & Right Hemisphere)
  for (let z = -100; z <= 100; z += 4) {
    const y = Math.cos(z * 0.03) * 60 + 10
    fissurePoints.push(new THREE.Vector3(0, y, z))
    fissurePoints.push(new THREE.Vector3(0, y - 40, z))
  }

  // Left Hemisphere Particles
  const leftGeo = new THREE.BufferGeometry().setFromPoints(leftPoints)
  const leftMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 1.4,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  group.add(new THREE.Points(leftGeo, leftMat))

  // Right Hemisphere Particles
  const rightGeo = new THREE.BufferGeometry().setFromPoints(rightPoints)
  const rightMat = new THREE.PointsMaterial({
    color: 0xa78bfa,
    size: 1.4,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  group.add(new THREE.Points(rightGeo, rightMat))

  // Central Fissure Glow
  const fisGeo = new THREE.BufferGeometry().setFromPoints(fissurePoints)
  const fisMat = new THREE.PointsMaterial({
    color: 0x22d3ee,
    size: 2.0,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  group.add(new THREE.Points(fisGeo, fisMat))

  return group
}

const timeGreeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'
}

// PCM Float32 → 16-bit WAV, for the backend Whisper STT endpoint
function encodeWAV(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const buf  = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buf)
  const str  = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)) }
  str(0, 'RIFF');  view.setUint32(4,  36 + samples.length * 2, true)
  str(8, 'WAVE');  str(12, 'fmt ')
  view.setUint32(16, 16, true);  view.setUint16(20, 1, true)  // PCM
  view.setUint16(22, 1, true);   view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true)
  str(36, 'data'); view.setUint32(40, samples.length * 2, true)
  let off = 44
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7FFF, true); off += 2
  }
  return buf
}

// sticky fallback: once speechSynthesis fails to start, skip it and go straight
// to backend WAV on every later utterance (this machine's Chrome is known-broken)
const TTS_BROKEN_KEY = 'waanda-tts-broken'

// per-bar sensitivity so the mic level meter looks like a live equalizer
// rather than 5 bars moving in perfect unison
const MIC_BAR_MULTS = [0.7, 1, 0.55, 1.15, 0.85]

export function NeuralNetworkModule() {
  const containerRef = useRef<HTMLDivElement>(null)
  // ForceGraph3D's exported constructor type is fixed at its default node/link
  // generics (it can't be re-parameterized at the `new` call site) — actual
  // BrainNode field access on node objects goes through explicit `as BrainNode`
  // casts at each call site instead.
  const graphRef = useRef<ForceGraph3DInstance | null>(null)
  const neighborsRef = useRef<Map<number, Set<number>>>(new Map())
  const nodeByIdRef = useRef<Map<number, BrainNode>>(new Map())
  const highlightRef = useRef<Set<number> | null>(null)
  const hiddenGroupsRef = useRef<Set<string>>(new Set())
  const lastInteractRef = useRef(0)
  const focusedRef = useRef(false)
  const unlockedRef = useRef(false)
  const pendingSpeechRef = useRef<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const initRef = useRef(false)

  // Voice input — MediaRecorder + AnalyserNode VAD → backend Whisper STT.
  // webkitSpeechRecognition was tried first (matches other WAANDA voice UIs) but
  // proved unreliable on this machine (aborted mid-session, unclear why). This
  // is the same mechanism the WAANDA HUD already uses successfully, so it's a
  // known-good fallback rather than a second guess at the browser API.
  const micActiveRef    = useRef(false)
  const micStreamRef    = useRef<MediaStream | null>(null)
  const micCtxRef       = useRef<AudioContext | null>(null)
  const micRecorderRef  = useRef<MediaRecorder | null>(null)
  const micChunksRef    = useRef<Blob[]>([])
  const micVadRef       = useRef<ReturnType<typeof setInterval> | null>(null)
  const micMaxTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const micHasVoiceRef  = useRef(false)
  const micSilenceRef   = useRef(0)

  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<BrainNode | null>(null)
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [input, setInput] = useState('')
  const [micLevel, setMicLevel] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<BrainNode[]>([])
  const [hiddenGroups, setHiddenGroups] = useState<Set<string>>(new Set())
  const [groupCounts, setGroupCounts] = useState<Record<string, number>>({})
  const [history, setHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([])
  const [showHistory, setShowHistory] = useState(false)

  const sessionIdRef = useRef<string>((() => {
    const KEY = 'waanda-brain-session'
    let sid = sessionStorage.getItem(KEY)
    if (!sid) {
      sid = (crypto as any).randomUUID?.() ?? `s-${Date.now()}-${Math.random().toString(36).slice(2)}`
      sessionStorage.setItem(KEY, sid!)
    }
    return sid!
  })())

  const markInteraction = () => { lastInteractRef.current = Date.now() }
  const pushHistory = (entry: { role: 'user' | 'assistant'; text: string }) =>
    setHistory(prev => [...prev, entry].slice(-40))

  // rebuilds both the neighbor map (for highlighting) and the id→node lookup
  // (for group-hidden checks) — single source of truth after any graph mutation
  const rebuildIndexes = useCallback((nodes: BrainNode[], links: BrainLink[]) => {
    const neighbors = new Map<number, Set<number>>()
    const byId = new Map<number, BrainNode>()
    for (const n of nodes) byId.set(n.id, n)
    for (const l of links) {
      const s = typeof l.source === 'object' ? (l.source as any).id : l.source
      const t = typeof l.target === 'object' ? (l.target as any).id : l.target
      if (!neighbors.has(s)) neighbors.set(s, new Set())
      if (!neighbors.has(t)) neighbors.set(t, new Set())
      neighbors.get(s)!.add(t)
      neighbors.get(t)!.add(s)
    }
    neighborsRef.current = neighbors
    nodeByIdRef.current = byId
  }, [])

  // ── visual highlight state ────────────────────────────────────────────────

  const applyHighlight = useCallback(() => {
    const graph = graphRef.current
    if (!graph) return
    const hl = highlightRef.current
    const hidden = hiddenGroupsRef.current
    for (const n of graph.graphData().nodes as BrainNode[]) {
      if (!n.__sphere || !n.__sprite || n.__r === undefined) continue
      const sphereMat = n.__sphere.material as THREE.MeshBasicMaterial
      const spriteMat = n.__sprite.material as THREE.SpriteMaterial
      if (hidden.has(n.group)) {
        sphereMat.opacity = 0.03
        spriteMat.opacity = 0.02
        n.__sprite.scale.set(n.__r * 3, n.__r * 3, 1)
        continue
      }
      if (!hl) {
        sphereMat.opacity = 0.95
        spriteMat.opacity = 0.85
        n.__sprite.scale.set(n.__r * 6, n.__r * 6, 1)
      } else if (hl.has(n.id)) {
        sphereMat.opacity = 1
        spriteMat.opacity = 1
        n.__sprite.scale.set(n.__r * 8.5, n.__r * 8.5, 1)
      } else {
        sphereMat.opacity = 0.12
        spriteMat.opacity = 0.05
        n.__sprite.scale.set(n.__r * 3, n.__r * 3, 1)
      }
    }
    // re-evaluate link accessors (width / color / particles)
    graph.linkColor(graph.linkColor())
    graph.linkWidth(graph.linkWidth())
    graph.linkDirectionalParticles(graph.linkDirectionalParticles())
  }, [])

  const clearFocus = useCallback(() => {
    highlightRef.current = null
    focusedRef.current = false
    setSelected(null)
    applyHighlight()
  }, [applyHighlight])

  // reveal a group synchronously (ref + state together) so applyHighlight
  // reflects it immediately, without waiting for the next render's effect
  const revealGroup = (g: string) => {
    if (!hiddenGroupsRef.current.has(g)) return
    const next = new Set(hiddenGroupsRef.current)
    next.delete(g)
    hiddenGroupsRef.current = next
    setHiddenGroups(next)
  }

  const focusNode = useCallback((node: BrainNode, flyMs = 2400) => {
    const graph = graphRef.current
    if (!graph || node.x === undefined) return
    markInteraction()
    focusedRef.current = true
    revealGroup(node.group)
    const set = new Set<number>([node.id])
    neighborsRef.current.get(node.id)?.forEach(id => set.add(id))
    highlightRef.current = set
    setSelected(node)
    applyHighlight()
    const len = Math.hypot(node.x!, node.y!, node.z!) || 1
    const ratio = 1 + 150 / len
    graph.cameraPosition(
      { x: node.x! * ratio, y: node.y! * ratio, z: node.z! * ratio },
      { x: node.x!, y: node.y!, z: node.z! },
      flyMs,
    )
  }, [applyHighlight])

  const highlightCluster = useCallback((ids: number[]) => {
    const graph = graphRef.current
    if (!graph) return
    markInteraction()
    focusedRef.current = true
    setSelected(null)
    ids.forEach(id => { const g = nodeByIdRef.current.get(id)?.group; if (g) revealGroup(g) })
    const set = new Set<number>(ids)
    ids.forEach(id => neighborsRef.current.get(id)?.forEach(nid => set.add(nid)))
    highlightRef.current = set
    applyHighlight()
    graph.zoomToFit(2400, 90, (n: any) => set.has(n.id))
  }, [applyHighlight])

  const resetView = useCallback(() => {
    const graph = graphRef.current
    if (!graph) return
    markInteraction()
    clearFocus()
    graph.cameraPosition({ x: 0, y: 90, z: 780 }, { x: 0, y: 0, z: 0 }, 1800)
  }, [clearFocus])

  const pulseNode = useCallback((node: BrainNode) => {
    const start = Date.now()
    const base = node.__r ?? 3
    const tick = () => {
      if (!node.__sprite) return
      const t = (Date.now() - start) / 1000
      if (t > 2.8) {
        node.__sprite.scale.set(base * 8.5, base * 8.5, 1)
        return
      }
      const s = base * (8.5 + Math.sin(t * 9) * 3.2 * Math.max(0, 1 - t / 2.8))
      node.__sprite.scale.set(s, s, 1)
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [])

  // ── group filter (legend) ────────────────────────────────────────────────

  const toggleGroup = useCallback((g: string) => {
    setHiddenGroups(prev => {
      const next = new Set(prev)
      if (next.has(g)) next.delete(g); else next.add(g)
      hiddenGroupsRef.current = next
      return next
    })
  }, [])

  useEffect(() => { applyHighlight() }, [hiddenGroups, applyHighlight])

  // ── search-to-fly ─────────────────────────────────────────────────────────

  const runSearch = useCallback((q: string) => {
    setSearchQuery(q)
    const query = q.trim().toLowerCase()
    if (!query) { setSearchResults([]); return }
    const nodes = (graphRef.current?.graphData().nodes as BrainNode[] | undefined) ?? []
    const matches = nodes.filter(n =>
      n.title.toLowerCase().includes(query) ||
      (n.description && n.description.toLowerCase().includes(query)),
    )
    setSearchResults(matches.slice(0, 6))
  }, [])

  const searchSelect = useCallback((node: BrainNode) => {
    focusNode(node)
    setSearchQuery('')
    setSearchResults([])
  }, [focusNode])

  // ── voice out ─────────────────────────────────────────────────────────────

  const backendTTS = useCallback(async (text: string, done: () => void) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/admin/kangqore-immp/tts?text=${encodeURIComponent(text)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) throw new Error(String(res.status))
      const url = URL.createObjectURL(await res.blob())
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => { URL.revokeObjectURL(url); done() }
      audio.onerror = () => { URL.revokeObjectURL(url); done() }
      await audio.play()
    } catch { done() }
  }, [])

  const speak = useCallback((text: string) => {
    const clean = text.replace(/\s+/g, ' ').trim().slice(0, 420)
    if (!clean) return
    if (!unlockedRef.current) { pendingSpeechRef.current = clean; return } // browsers gate audio on first gesture
    setStatus('speaking')
    const done = () => setStatus(s => (s === 'speaking' ? 'idle' : s))

    const synth = window.speechSynthesis
    if (!synth || localStorage.getItem(TTS_BROKEN_KEY)) { void backendTTS(clean, done); return }

    const voices = synth.getVoices()
    const voice =
      voices.find(v => /samantha/i.test(v.name)) ||
      voices.find(v => /female|victoria|karen|serena|moira|kate/i.test(v.name)) ||
      voices.find(v => v.lang?.startsWith('en'))

    const u = new SpeechSynthesisUtterance(clean)
    if (voice) u.voice = voice
    u.rate = 1.02
    let started = false
    u.onstart = () => { started = true }
    u.onend = done
    u.onerror = () => { if (started) done() }
    synth.cancel()
    synth.speak(u)
    // this machine's Chrome speechSynthesis silently never starts — fall back to
    // backend WAV and remember the failure so later utterances skip the wait
    setTimeout(() => {
      if (!started) {
        synth.cancel()
        localStorage.setItem(TTS_BROKEN_KEY, '1')
        void backendTTS(clean, done)
      }
    }, 1600)
  }, [backendTTS])

  // ── chat + remember ───────────────────────────────────────────────────────

  const remember = useCallback(async (text: string) => {
    setStatus('thinking')
    try {
      const { data } = await api.post('/admin/kangqore-immp/brain/remember', {
        text, sessionId: sessionIdRef.current,
      })
      const graph = graphRef.current!
      const { nodes, links } = graph.graphData()
      const rel = data.relatedId != null
        ? (nodes as BrainNode[]).find(n => n.id === data.relatedId)
        : undefined
      const newNode: BrainNode = { ...data.node }
      if (rel?.x !== undefined) {
        // born at its most related node's position, then drifts free
        newNode.x = rel.x! + 6; newNode.y = rel.y! + 6; newNode.z = rel.z! + 6
      }
      const newNodes = [...(nodes as BrainNode[]), newNode]
      const newLinks = rel ? [...(links as BrainLink[]), { source: data.relatedId, target: newNode.id }] : (links as BrainLink[])
      graph.graphData({ nodes: newNodes, links: newLinks })
      rebuildIndexes(newNodes, newLinks)
      setCount(data.count)
      setGroupCounts(computeGroupCounts(newNodes))
      setAnswer(data.answer)
      setStatus('idle')
      speak(data.answer)
      pushHistory({ role: 'assistant', text: data.answer })
      setTimeout(() => {
        const born = (graphRef.current!.graphData().nodes as BrainNode[]).find(n => n.id === newNode.id)
        if (born) { focusNode(born); pulseNode(born) }
      }, 700)
    } catch {
      setStatus('idle')
      const msg = 'The archive drawer appears to be jammed, sir. The thought was not saved.'
      setAnswer(msg)
      pushHistory({ role: 'assistant', text: msg })
    }
  }, [focusNode, pulseNode, speak, rebuildIndexes])

  const send = useCallback(async (raw: string) => {
    const text = raw.trim()
    if (!text || status === 'thinking') return
    markInteraction()
    setInput('')
    pushHistory({ role: 'user', text })
    if (/^remember\b/i.test(text)) return remember(text)
    setStatus('thinking')
    try {
      const { data } = await api.post('/admin/kangqore-immp/brain/chat', {
        message: text, sessionId: sessionIdRef.current,
      })
      setAnswer(data.answer)
      setStatus('idle')
      speak(data.answer)
      pushHistory({ role: 'assistant', text: data.answer })
      const ids: number[] = Array.isArray(data.nodes) ? data.nodes : []
      const all = graphRef.current?.graphData().nodes as BrainNode[] | undefined
      if (!all || !ids.length) return
      if (ids.length >= 4) {
        highlightCluster(ids)                     // answer drew on a whole cluster — light it up
      } else {
        const top = all.find(n => n.id === ids[0])
        if (top) focusNode(top)                   // dive to the source and open its panel
      }
    } catch {
      setStatus('idle')
      const msg = 'I regret to report the wires are crossed, sir. Do try again.'
      setAnswer(msg)
      pushHistory({ role: 'assistant', text: msg })
    }
  }, [status, remember, speak, focusNode, highlightCluster])

  // ── manage captures ───────────────────────────────────────────────────────

  const handleDeleteCapture = useCallback(async (node: BrainNode) => {
    if (!window.confirm(`Delete "${node.title}"? This cannot be undone.`)) return
    try {
      const { data } = await api.delete(`/admin/kangqore-immp/brain/captures/${node.slug}`)
      const graph = graphRef.current!
      graph.graphData({ nodes: data.nodes, links: data.links })
      rebuildIndexes(data.nodes, data.links)
      setCount(data.count)
      setGroupCounts(computeGroupCounts(data.nodes))
      clearFocus()
      const msg = `"${node.title}" has been struck from the record, sir.`
      setAnswer(msg)
      speak(msg)
      pushHistory({ role: 'assistant', text: msg })
    } catch {
      const msg = 'Could not delete that note, sir. Do try again.'
      setAnswer(msg); speak(msg)
    }
  }, [clearFocus, speak, rebuildIndexes])

  // ── voice in — MediaRecorder + AnalyserNode VAD → backend Whisper STT ──────
  // (webkitSpeechRecognition was tried first but proved unreliable on this
  // machine; this is the same proven mechanism the WAANDA HUD already uses.)

  const micCleanup = useCallback(() => {
    if (micVadRef.current) clearInterval(micVadRef.current)
    if (micMaxTimerRef.current) clearTimeout(micMaxTimerRef.current)
    micStreamRef.current?.getTracks().forEach(t => t.stop())
    micCtxRef.current?.close().catch(() => {})
    micVadRef.current = null
    micMaxTimerRef.current = null
    micStreamRef.current = null
    micCtxRef.current = null
    setMicLevel(0)
  }, [])

  const micStopAndSend = useCallback(() => {
    if (!micActiveRef.current) return
    micActiveRef.current = false
    const rec = micRecorderRef.current
    if (rec && rec.state !== 'inactive') rec.stop()   // triggers onstop below → transcribe + send
    else micCleanup()
  }, [micCleanup])

  const micClick = useCallback(async () => {
    markInteraction()
    if (micActiveRef.current) { micStopAndSend(); return }   // click again to stop early

    try { window.speechSynthesis?.cancel() } catch { /* noop */ }
    audioRef.current?.pause()

    micChunksRef.current = []
    micHasVoiceRef.current = false
    micSilenceRef.current = 0
    micActiveRef.current = true

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (err: any) {
      micActiveRef.current = false
      const msg = err?.name === 'NotAllowedError'
        ? 'Microphone access is blocked for this page, sir — check the site permissions in the address bar.'
        : `I cannot reach a microphone, sir (${err?.message ?? err?.name ?? 'unknown error'}).`
      setAnswer(msg); speak(msg)
      return
    }
    micStreamRef.current = stream

    // AudioContext for VAD only — routed through a zero-gain node so nothing
    // is actually audible; MediaRecorder captures the real audio separately.
    const ctx = new AudioContext()
    micCtxRef.current = ctx
    if (ctx.state === 'suspended') { try { await ctx.resume() } catch { /* noop */ } }
    const source   = ctx.createMediaStreamSource(stream)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 1024
    const silencer = ctx.createGain()
    silencer.gain.value = 0
    source.connect(analyser)
    analyser.connect(silencer)
    silencer.connect(ctx.destination)
    const tdata = new Uint8Array(analyser.fftSize / 2)

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus' : 'audio/webm'
    const recorder = new MediaRecorder(stream, { mimeType })
    micRecorderRef.current = recorder
    recorder.ondataavailable = (e) => { if (e.data.size > 0) micChunksRef.current.push(e.data) }

    recorder.onstop = async () => {
      micCleanup()
      if (!micHasVoiceRef.current || micChunksRef.current.length === 0) {
        setStatus(s => (s === 'listening' ? 'idle' : s))
        return
      }
      setStatus('thinking')
      const blob = new Blob(micChunksRef.current, { type: mimeType })
      micChunksRef.current = []
      try {
        const ab      = await blob.arrayBuffer()
        const dec     = new AudioContext({ sampleRate: 16000 })
        const decoded = await dec.decodeAudioData(ab)
        await dec.close()
        const wav = encodeWAV(decoded.getChannelData(0), decoded.sampleRate)
        const fd  = new FormData()
        fd.append('audio', new Blob([wav], { type: 'audio/wav' }), 'voice.wav')
        const { data } = await api.post('/admin/kangqore-immp/stt', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        const transcript = (data.transcript ?? '').trim()
        if (transcript) { setInput(transcript); void send(transcript) }
        else { setStatus('idle'); setAnswer("Didn't catch anything that time, sir. Do try again.") }
      } catch {
        setStatus('idle')
        setAnswer('The microphone pipeline had a hiccup, sir. Do try again.')
      }
    }

    recorder.start(250)
    setStatus('listening')

    // VAD: poll amplitude every 100ms; require ~400ms of sustained loudness to
    // count as real speech (filters ambient noise), then auto-stop ~1.5s after
    // speech ends. A 20s safety cap guards against a session that never ends.
    let speechFrames = 0
    micVadRef.current = setInterval(() => {
      if (!micActiveRef.current) return
      analyser.getByteTimeDomainData(tdata)
      let amp = 0
      for (let i = 0; i < tdata.length; i++) amp += Math.abs(tdata[i] - 128)
      amp /= tdata.length
      setMicLevel(amp)
      if (amp > 10) {
        speechFrames = Math.min(speechFrames + 1, 10)
        if (speechFrames >= 4) micHasVoiceRef.current = true
        micSilenceRef.current = 0
      } else {
        speechFrames = Math.max(speechFrames - 1, 0)
        if (micHasVoiceRef.current && ++micSilenceRef.current > 15) micStopAndSend()
      }
    }, 100)
    micMaxTimerRef.current = setTimeout(() => micStopAndSend(), 20_000)
  }, [send, speak, micCleanup, micStopAndSend])

  // ── boot: fetch brain, build galaxy ───────────────────────────────────────

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true
    const el = containerRef.current
    if (!el) return
    let disposed = false
    let driftTimer: ReturnType<typeof setInterval> | undefined
    let resizeObs: ResizeObserver | undefined

    const unlock = () => {
      unlockedRef.current = true
      try { window.speechSynthesis?.getVoices(); window.speechSynthesis?.resume() } catch { /* noop */ }
      // once per session: silently re-probe a flagged-broken speechSynthesis,
      // so the sticky fallback self-clears if Chrome ever starts working again
      try {
        if (localStorage.getItem(TTS_BROKEN_KEY) && window.speechSynthesis) {
          const probe = new SpeechSynthesisUtterance('ready')
          probe.volume = 0
          probe.onstart = () => { localStorage.removeItem(TTS_BROKEN_KEY); window.speechSynthesis.cancel() }
          window.speechSynthesis.speak(probe)
        }
      } catch { /* noop */ }
      const pending = pendingSpeechRef.current
      pendingSpeechRef.current = null
      if (pending) speak(pending)
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)

    api.get('/admin/kangqore-immp/brain/graph').then(({ data }) => {
      if (disposed || !containerRef.current) return
      const nodes: BrainNode[] = data.nodes
      const links: BrainLink[] = data.links

      assignAnatomicalBrainCoordinates(nodes)
      rebuildIndexes(nodes, links)

      const nid = (e: any) => (typeof e === 'object' ? e.id : e)
      const linkLit = (l: any) => {
        const hl = highlightRef.current
        return !!hl && hl.has(nid(l.source)) && hl.has(nid(l.target))
      }
      const linkHidden = (l: any) => {
        const hidden = hiddenGroupsRef.current
        if (!hidden.size) return false
        const sGroup = nodeByIdRef.current.get(nid(l.source))?.group
        const tGroup = nodeByIdRef.current.get(nid(l.target))?.group
        return (sGroup !== undefined && hidden.has(sGroup)) || (tGroup !== undefined && hidden.has(tGroup))
      }

      const graph = new ForceGraph3D(el, { controlType: 'orbit' })
        .backgroundColor('#00000a')
        .showNavInfo(false)
        .width(el.clientWidth)
        .height(el.clientHeight)
        .nodeLabel((n: any) => `<div style="padding:4px 10px;background:rgba(2,6,23,.9);border:1px solid ${groupColor(n.group)}55;border-radius:8px;color:#e2e8f0;font-family:ui-monospace,monospace;font-size:11px">${n.title}</div>`)
        .nodeThreeObject((n: any) => {
          const color = groupColor(n.group)
          const r = 2.2 + n.val * 0.55
          const obj = new THREE.Group()
          const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(r, 16, 16),
            new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.95 }),
          )
          const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: glowTexture(color), transparent: true, opacity: 0.85,
            blending: THREE.AdditiveBlending, depthWrite: false,
          }))
          sprite.scale.set(r * 6, r * 6, 1)
          obj.add(sphere); obj.add(sprite)
          n.__sphere = sphere; n.__sprite = sprite; n.__r = r
          return obj
        })
        .linkColor((l: any) => (linkHidden(l) ? 'rgba(0,0,0,0)' : (linkLit(l) ? '#e0f2fe' : '#334155')))
        .linkOpacity(0.35)
        .linkWidth((l: any) => (linkHidden(l) ? 0 : (linkLit(l) ? 1.6 : 0.45)))
        .linkDirectionalParticles((l: any) => (linkHidden(l) ? 0 : (linkLit(l) ? 4 : 2)))
        .linkDirectionalParticleWidth(2.2)
        .linkDirectionalParticleSpeed(0.008)
        .onNodeClick((n: any) => focusNode(n))
        .onBackgroundClick(() => clearFocus())
        .enableNodeDrag(false)
        .graphData({ nodes, links })

      ;(graph.d3Force('charge') as any)?.strength(-30)
      ;(graph.d3Force('link') as any)?.distance(35)
      graph.scene().add(makeStarfield())
      graph.scene().add(makeBrainHologramShell())
      graph.cameraPosition({ x: 0, y: 90, z: 650 })
      graphRef.current = graph

      // slow idle drift — a gentle orbit that resumes 8s after the last touch
      driftTimer = setInterval(() => {
        if (focusedRef.current) return
        if (Date.now() - lastInteractRef.current < 8000) return
        const cam = graph.cameraPosition()
        const r = Math.hypot(cam.x, cam.z)
        if (r < 50) return
        const a = Math.atan2(cam.x, cam.z) + 0.00075
        graph.cameraPosition({ x: r * Math.sin(a), y: cam.y, z: r * Math.cos(a) })
      }, 40)

      el.addEventListener('pointerdown', markInteraction)
      el.addEventListener('wheel', markInteraction, { passive: true })
      resizeObs = new ResizeObserver(() => {
        graph.width(el.clientWidth); graph.height(el.clientHeight)
      })
      resizeObs.observe(el)

      setCount(data.count)
      setGroupCounts(computeGroupCounts(nodes))
      setLoading(false)
      const greeting = `Good ${timeGreeting()}, sir. ${data.count} notes indexed, all present and accounted for.`
      setAnswer(greeting)
      setHistory([{ role: 'assistant', text: greeting }])
      speak(greeting)
    }).catch(() => {
      setLoading(false)
      setAnswer('The cortex failed to load, sir. Is the backend awake?')
    })

    return () => {
      disposed = true
      if (driftTimer) clearInterval(driftTimer)
      resizeObs?.disconnect()
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      try { window.speechSynthesis?.cancel() } catch { /* noop */ }
      micActiveRef.current = false
      try { micRecorderRef.current?.state !== 'inactive' && micRecorderRef.current?.stop() } catch { /* noop */ }
      if (micVadRef.current) clearInterval(micVadRef.current)
      if (micMaxTimerRef.current) clearTimeout(micMaxTimerRef.current)
      micStreamRef.current?.getTracks().forEach(t => t.stop())
      micCtxRef.current?.close().catch(() => {})
      audioRef.current?.pause()
      try { graphRef.current?._destructor() } catch { /* noop */ }
      graphRef.current = null
      initRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusLine =
    status === 'listening' ? '● listening…' :
    status === 'thinking'  ? '● thinking…'  :
    status === 'speaking'  ? '● speaking…'  : ''

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#00000a]">
      <div ref={containerRef} className="absolute inset-0" />

      {/* header + search + legend */}
      <div className="absolute top-4 left-5 z-20 select-none">
        <div className="pointer-events-none">
          <h1 className="font-mono text-[13px] font-bold tracking-[0.35em] text-cyan-300 uppercase drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
            WAANDAx · Neural Cortex
          </h1>
          <p className="font-mono text-[9px] tracking-[0.25em] text-slate-500 uppercase mt-1">
            {loading ? 'igniting…' : `${count} neurons · live`}
          </p>
        </div>

        <div className="mt-3 relative w-48 pointer-events-auto">
          <div className="relative">
            <MagnifyingGlassIcon className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={searchQuery}
              onChange={e => runSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchResults[0]) searchSelect(searchResults[0])
                if (e.key === 'Escape') { setSearchQuery(''); setSearchResults([]) }
              }}
              onBlur={() => setTimeout(() => setSearchResults([]), 150)}
              placeholder="Search notes…"
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-6 pr-2 py-1.5 text-[10px] font-mono text-slate-200 placeholder:text-slate-600 outline-none focus:border-cyan-500/40 transition-colors"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-white/10 bg-[#020617]/95 backdrop-blur-xl shadow-lg z-30">
              {searchResults.map(n => (
                <button key={n.id} onMouseDown={() => searchSelect(n)}
                        className="w-full text-left px-2.5 py-1.5 text-[10px] font-mono text-slate-300 hover:bg-white/5 hover:text-cyan-300 flex items-center gap-2 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: groupColor(n.group) }} />
                  <span className="truncate">{n.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-col gap-1.5 pointer-events-auto">
          {Object.keys(GROUP_LABELS).map(g => {
            const isHidden = hiddenGroups.has(g)
            return (
              <button key={g} onClick={() => toggleGroup(g)}
                      className="flex items-center gap-2 text-left group"
                      style={{ opacity: isHidden ? 0.35 : 1 }}
                      title={isHidden ? `Show ${GROUP_LABELS[g]}` : `Hide ${GROUP_LABELS[g]}`}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: GROUP_COLORS[g], boxShadow: isHidden ? 'none' : `0 0 8px ${GROUP_COLORS[g]}` }} />
                <span className="font-mono text-[8px] tracking-[0.2em] text-slate-400 uppercase group-hover:text-white transition-colors">{GROUP_LABELS[g]}</span>
                <span className="font-mono text-[7px] text-slate-600">{groupCounts[g] ?? 0}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* return to overview */}
      <button
        onClick={resetView}
        className="absolute bottom-28 right-6 z-30 p-3 rounded-full bg-[#020617]/80 border border-white/10 backdrop-blur-xl text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
        title="Return to overview"
        aria-label="Return to overview"
      >
        <HouseIcon className="w-4 h-4" />
      </button>

      {/* side panel — the note the answer came from */}
      {selected && (
        <div className="absolute top-4 right-4 bottom-28 z-30 w-[360px] max-w-[85vw] flex flex-col rounded-2xl border bg-[#020617]/85 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden"
             style={{ borderColor: `${groupColor(selected.group)}40` }}>
          <div className="flex items-start justify-between gap-3 p-5 pb-3 border-b border-white/10">
            <div>
              <span className="inline-block px-2 py-0.5 rounded-full font-mono text-[8px] font-bold tracking-[0.25em] uppercase"
                    style={{ color: groupColor(selected.group), backgroundColor: `${groupColor(selected.group)}18`, border: `1px solid ${groupColor(selected.group)}50` }}>
                {GROUP_LABELS[selected.group] ?? selected.group}
              </span>
              <h2 className="mt-2 text-[15px] font-bold text-white leading-snug">{selected.title}</h2>
            </div>
            <button onClick={clearFocus} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close panel">
              <XIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 pt-3">
            {selected.description && (
              <p className="text-[12px] italic mb-3 leading-relaxed" style={{ color: groupColor(selected.group) }}>
                {selected.description}
              </p>
            )}
            <p className="text-[12px] text-slate-300 leading-relaxed whitespace-pre-wrap">
              {selected.excerpt}{selected.excerpt.length >= 480 ? '…' : ''}
            </p>
          </div>
          <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between gap-3">
            <span className="font-mono text-[9px] text-slate-500 tracking-widest truncate">{selected.file}</span>
            {selected.group === 'capture' && (
              <button onClick={() => handleDeleteCapture(selected)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[8px] font-mono uppercase tracking-widest transition-colors flex-shrink-0">
                <TrashIcon className="w-3 h-3" /> Delete
              </button>
            )}
          </div>
        </div>
      )}

      {/* transcript + answer + status + input bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center gap-2 px-4 pb-5 pointer-events-none">
        {history.length > 0 && (
          <button onClick={() => setShowHistory(s => !s)}
                  className="pointer-events-auto font-mono text-[8px] tracking-[0.25em] text-slate-500 hover:text-cyan-300 uppercase transition-colors">
            {showHistory ? '▼ hide transcript' : `▲ ${history.length} exchange${history.length !== 1 ? 's' : ''}`}
          </button>
        )}
        {showHistory && (
          <div className="pointer-events-auto max-w-2xl w-full max-h-56 overflow-y-auto rounded-2xl border border-white/10 bg-[#020617]/90 backdrop-blur-xl p-4 flex flex-col gap-3">
            {history.map((h, i) => (
              <div key={i} className={h.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={`inline-block max-w-[85%] px-3 py-1.5 rounded-xl text-[11px] leading-relaxed ${h.role === 'user' ? 'bg-cyan-500/15 text-cyan-100' : 'bg-white/5 text-slate-300 italic'}`}>
                  {h.text}
                </span>
              </div>
            ))}
          </div>
        )}
        {answer && !showHistory && (
          <div className="pointer-events-auto max-w-2xl w-full text-center px-6 py-3 rounded-2xl bg-[#020617]/75 border border-cyan-500/20 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.7)]">
            <p className="text-[13px] text-slate-100 leading-relaxed italic">{answer}</p>
          </div>
        )}
        <div className="h-4 flex items-center gap-2">
          {statusLine && (
            <>
              <span className={`font-mono text-[10px] tracking-[0.3em] uppercase ${status === 'listening' ? 'text-rose-400' : 'text-cyan-400'} animate-pulse`}>
                {statusLine}
              </span>
              {status === 'listening' && (
                <div className="flex items-end gap-0.5 h-3.5" title="Live microphone level">
                  {MIC_BAR_MULTS.map((m, i) => (
                    <div key={i} className="w-0.5 bg-rose-400 rounded-full transition-[height] duration-75"
                         style={{ height: `${Math.max(2, Math.min(14, 2 + micLevel * m * 0.35))}px` }} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <form
          className="pointer-events-auto flex items-center gap-2 w-full max-w-2xl px-3 py-2 rounded-2xl bg-[#020617]/80 border border-white/10 backdrop-blur-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] focus-within:border-cyan-500/40 transition-colors"
          onSubmit={e => { e.preventDefault(); void send(input) }}
        >
          <button
            type="button"
            onClick={micClick}
            className={`p-2.5 rounded-xl transition-all ${status === 'listening'
              ? 'bg-rose-500/20 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse'
              : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'}`}
            title="Speak to your notes"
            aria-label="Voice input"
          >
            <MicrophoneIcon className="w-5 h-5" weight={status === 'listening' ? 'fill' : 'regular'} />
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Ask your notes… or say "remember that…"'
            className="flex-1 bg-transparent outline-none text-[13px] text-slate-100 placeholder:text-slate-600 font-light"
          />
          <button
            type="submit"
            disabled={!input.trim() || status === 'thinking'}
            className="p-2.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-white/5 disabled:opacity-30 transition-all"
            aria-label="Send"
          >
            <PaperPlaneRightIcon className="w-5 h-5" />
          </button>
        </form>
      </div>

      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#00000a]">
          <p className="font-mono text-[11px] tracking-[0.4em] text-cyan-400 uppercase animate-pulse">
            igniting neural cortex…
          </p>
        </div>
      )}
    </div>
  )
}

export default NeuralNetworkModule
