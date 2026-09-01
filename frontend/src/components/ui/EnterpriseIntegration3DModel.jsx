import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, FastForward, ArrowRight, Zap, ShieldCheck, Activity, Terminal, ChevronRight, Layers, Globe, Server, Database, Cloud, Users, Lock, Cpu, Network, GitBranch, Radio } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════════
   ENTERPRISE INTEGRATION PROCESS FLOW — ARCHITECTURE VISUALIZATION
   Shows the actual integration platform process: Source Systems → Integration
   Layers (API Gateway, Event Fabric, Governance, Intelligence) → Target Systems
   ═══════════════════════════════════════════════════════════════════════════════ */

// ─── SOURCE SYSTEMS (Left Side) ──────────────────────────────────────────────
const SOURCE_SYSTEMS = [
  { id: 'erp', label: 'ERP', sub: 'SAP · Oracle', color: '#3b82f6', y: 2.4 },
  { id: 'crm', label: 'CRM', sub: 'Salesforce · Dynamics', color: '#8b5cf6', y: 1.2 },
  { id: 'hcm', label: 'HCM', sub: 'Workday · SuccessFactors', color: '#06b6d4', y: 0.0 },
  { id: 'supply', label: 'Supply Chain', sub: 'Kinaxis · Blue Yonder', color: '#f59e0b', y: -1.2 },
  { id: 'saas', label: 'SaaS Estate', sub: 'ServiceNow · Coupa', color: '#10b981', y: -2.4 },
];

// ─── INTEGRATION LAYERS (Center Pipeline) ─────────────────────────────────────
const INTEGRATION_LAYERS = [
  {
    id: 'api_gateway',
    label: 'API Gateway',
    sub: 'REST · GraphQL · EDI · AS2',
    color: '#60a5fa',
    x: -1.2,
    desc: 'Unified ingestion gateway normalizing REST, SOAP, EDI X12, GraphQL and AS2 protocols into a single canonical envelope.',
    metrics: { throughput: '48,200 msg/s', protocols: 6 },
  },
  {
    id: 'event_fabric',
    label: 'Event Fabric',
    sub: 'Kafka · MQ · Pub/Sub',
    color: '#4ab6d4',
    x: 0.0,
    desc: 'Durable event mesh distributing integration messages across partitioned topics with exactly-once delivery guarantees.',
    metrics: { throughput: '124,500 msg/s', latency: '3.2 ms' },
  },
  {
    id: 'governance',
    label: 'AEGIS Governance',
    sub: 'Zero-Trust · Policy · Audit',
    color: '#00c875',
    x: 1.2,
    desc: 'Every integration flow passes through AEGIS governance — identity verification, policy enforcement, cryptographic audit trail.',
    metrics: { policies: 340, sla: '99.999%' },
  },
  {
    id: 'intelligence',
    label: 'Krisnam Intelligence',
    sub: 'Reasoning · Routing · Anomaly',
    color: '#a78bfa',
    x: 2.4,
    desc: 'Krisnam LLM reasons over the integration graph — autonomous routing decisions, anomaly detection, and outcome-optimized orchestration.',
    metrics: { decisions: '1,400 ops/s', accuracy: '99.8%' },
  },
];

// ─── TARGET SYSTEMS (Right Side) ──────────────────────────────────────────────
const TARGET_SYSTEMS = [
  { id: 'data_lake', label: 'Data Lake', sub: 'Analytics · BI', color: '#3b82f6', y: 2.0 },
  { id: 'partners', label: 'B2B Partners', sub: 'EDI · SFTP · AS2', color: '#f59e0b', y: 0.7 },
  { id: 'ai_agents', label: 'AI Agents', sub: 'KIMMP · WAANDA', color: '#a78bfa', y: -0.7 },
  { id: 'cx', label: 'CX Platform', sub: 'Commerce · Portal', color: '#10b981', y: -2.0 },
];


// ─── 3D Source System Block ───────────────────────────────────────────────────
const SourceSystemBlock = ({ system, index, activeLayer }) => {
  const meshRef = useRef();
  const x = -4.5;
  const y = system.y;
  const z = 0;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.position.y = y + Math.sin(t * 0.8 + index * 1.2) * 0.06;
    }
  });

  return (
    <group ref={meshRef} position={[x, y, z]}>
      {/* Block body */}
      <mesh>
        <boxGeometry args={[1.2, 0.65, 0.4]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive={system.color}
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      {/* Top edge accent */}
      <mesh position={[0, 0.33, 0]}>
        <boxGeometry args={[1.22, 0.02, 0.42]} />
        <meshBasicMaterial color={system.color} transparent opacity={0.8} />
      </mesh>
      {/* Label */}
      <Html position={[0, 0, 0.25]} center distanceFactor={7} zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div className="text-[8px] font-black tracking-[0.15em] uppercase text-white whitespace-nowrap">
            {system.label}
          </div>
          <div className="text-[6px] font-mono tracking-wide whitespace-nowrap" style={{ color: system.color }}>
            {system.sub}
          </div>
        </div>
      </Html>
    </group>
  );
};


// ─── 3D Integration Layer Column ──────────────────────────────────────────────
const IntegrationLayerColumn = ({ layer, index, isActive, onClick }) => {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(t * 0.5 + index * 0.8) * 0.08;
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = isActive
        ? 0.25 + Math.sin(t * 2.5) * 0.1
        : 0.05;
    }
  });

  return (
    <group ref={meshRef} position={[layer.x, 0, 0]}>
      {/* Vertical processing column */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 4.8, 6]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive={layer.color}
          emissiveIntensity={isActive ? 0.5 : 0.12}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={isActive ? 0.85 : 0.5}
        />
      </mesh>

      {/* Active glow cylinder */}
      <mesh ref={glowRef}>
        <cylinderGeometry args={[0.5, 0.5, 5.0, 6]} />
        <meshBasicMaterial
          color={layer.color}
          transparent
          opacity={0.05}
        />
      </mesh>

      {/* Top cap accent */}
      <mesh position={[0, 2.45, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.06, 6]} />
        <meshBasicMaterial color={layer.color} transparent opacity={isActive ? 0.9 : 0.4} />
      </mesh>

      {/* Bottom cap accent */}
      <mesh position={[0, -2.45, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.06, 6]} />
        <meshBasicMaterial color={layer.color} transparent opacity={isActive ? 0.9 : 0.4} />
      </mesh>

      {/* Label */}
      <Html position={[0, 2.9, 0]} center distanceFactor={7} zIndexRange={[100, 0]}>
        <div
          onClick={(e) => { e.stopPropagation(); onClick(index); }}
          className={`cursor-pointer flex flex-col items-center select-none transition-all duration-300 ${
            isActive ? 'scale-110 opacity-100' : 'scale-95 opacity-60 hover:opacity-90'
          }`}
        >
          <div
            className={`text-[7.5px] font-black tracking-[0.14em] uppercase px-2.5 py-0.5 rounded-md border whitespace-nowrap backdrop-blur-md ${
              isActive
                ? 'text-white border-cyan-400 shadow-[0_0_16px_rgba(74,182,212,0.6)] bg-blue-950/90'
                : 'text-white/70 border-white/20 bg-black/70'
            }`}
          >
            {layer.label}
          </div>
          <div className="text-[5.5px] font-mono tracking-wide whitespace-nowrap mt-0.5" style={{ color: layer.color }}>
            {layer.sub}
          </div>
        </div>
      </Html>
    </group>
  );
};


// ─── 3D Target System Block ───────────────────────────────────────────────────
const TargetSystemBlock = ({ system, index }) => {
  const meshRef = useRef();
  const x = 4.5;
  const y = system.y;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.position.y = y + Math.sin(t * 0.8 + index * 1.5 + 2) * 0.06;
    }
  });

  return (
    <group ref={meshRef} position={[x, y, 0]}>
      <mesh>
        <boxGeometry args={[1.2, 0.65, 0.4]} />
        <meshStandardMaterial
          color="#0a1628"
          emissive={system.color}
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      <mesh position={[0, 0.33, 0]}>
        <boxGeometry args={[1.22, 0.02, 0.42]} />
        <meshBasicMaterial color={system.color} transparent opacity={0.8} />
      </mesh>
      <Html position={[0, 0, 0.25]} center distanceFactor={7} zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div className="text-[8px] font-black tracking-[0.15em] uppercase text-white whitespace-nowrap">
            {system.label}
          </div>
          <div className="text-[6px] font-mono tracking-wide whitespace-nowrap" style={{ color: system.color }}>
            {system.sub}
          </div>
        </div>
      </Html>
    </group>
  );
};


// ─── Animated Data Packet traveling across the pipeline ───────────────────────
const DataPacket = ({ startX, endX, y, speed, delay, color, isPlaying }) => {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current || !isPlaying) return;
    const t = clock.getElapsedTime();
    const progress = ((t * speed + delay) % 4.0) / 4.0; // 0→1 loop
    const x = startX + (endX - startX) * progress;
    const yOsc = y + Math.sin(progress * Math.PI * 2) * 0.08;
    ref.current.position.set(x, yOsc, 0.3);
    // Fade near edges
    const edge = Math.min(progress, 1 - progress) * 4;
    ref.current.material.opacity = Math.min(edge, 1.0);
  });

  return (
    <mesh ref={ref} position={[startX, y, 0.3]}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
};


// ─── Connection Lines (Source → Layer → Target) ──────────────────────────────
const ConnectionLines = ({ activeLayerIdx, isPlaying }) => {
  const lines = useMemo(() => {
    const result = [];
    const firstLayerX = INTEGRATION_LAYERS[0].x;
    const lastLayerX = INTEGRATION_LAYERS[INTEGRATION_LAYERS.length - 1].x;

    // Source → First Layer
    SOURCE_SYSTEMS.forEach((src, i) => {
      const srcX = -4.5 + 0.6;
      const layerX = firstLayerX - 0.35;
      const mid = (srcX + layerX) / 2;
      result.push({
        id: `src-${i}`,
        points: [
          new THREE.Vector3(srcX, src.y, 0),
          new THREE.Vector3(mid, src.y * 0.3, 0),
          new THREE.Vector3(layerX, 0, 0),
        ],
        color: src.color,
        side: 'source',
      });
    });

    // Between Layers
    INTEGRATION_LAYERS.forEach((layer, i) => {
      if (i < INTEGRATION_LAYERS.length - 1) {
        const next = INTEGRATION_LAYERS[i + 1];
        result.push({
          id: `layer-${i}`,
          points: [
            new THREE.Vector3(layer.x + 0.35, 0.8, 0),
            new THREE.Vector3((layer.x + next.x) / 2, 1.0, 0),
            new THREE.Vector3(next.x - 0.35, 0.8, 0),
          ],
          color: i === activeLayerIdx ? '#ffffff' : layer.color,
          side: 'middle',
          layerIdx: i,
        });
        result.push({
          id: `layer-${i}-b`,
          points: [
            new THREE.Vector3(layer.x + 0.35, -0.8, 0),
            new THREE.Vector3((layer.x + next.x) / 2, -1.0, 0),
            new THREE.Vector3(next.x - 0.35, -0.8, 0),
          ],
          color: i === activeLayerIdx ? '#ffffff' : layer.color,
          side: 'middle',
          layerIdx: i,
        });
      }
    });

    // Last Layer → Targets
    TARGET_SYSTEMS.forEach((tgt, i) => {
      const layerX = lastLayerX + 0.35;
      const tgtX = 4.5 - 0.6;
      const mid = (layerX + tgtX) / 2;
      result.push({
        id: `tgt-${i}`,
        points: [
          new THREE.Vector3(layerX, 0, 0),
          new THREE.Vector3(mid, tgt.y * 0.3, 0),
          new THREE.Vector3(tgtX, tgt.y, 0),
        ],
        color: tgt.color,
        side: 'target',
      });
    });

    return result;
  }, [activeLayerIdx]);

  return (
    <group>
      {lines.map((line) => {
        const curve = new THREE.QuadraticBezierCurve3(line.points[0], line.points[1], line.points[2]);
        const pts = curve.getPoints(24);
        const isHighlighted = line.side === 'middle' && line.layerIdx === activeLayerIdx;
        return (
          <Line
            key={line.id}
            points={pts}
            color={line.color}
            lineWidth={isHighlighted ? 2.5 : 1.0}
            transparent
            opacity={isHighlighted ? 0.85 : 0.2}
          />
        );
      })}
    </group>
  );
};


// ─── Base Grid / Foundation ──────────────────────────────────────────────────
const ArchitectureBase = () => (
  <group position={[0, -3.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
    <gridHelper args={[12, 24, '#1e3a8a', '#0a1933']} rotation={[Math.PI / 2, 0, 0]} />
  </group>
);


// ─── Directional Flow Arrows (Source→Target) ─────────────────────────────────
const FlowDirectionIndicators = () => {
  const arrowPositions = [
    { x: -2.8, label: 'INGEST' },
    { x: -0.6, label: 'PROCESS' },
    { x: 0.6, label: 'GOVERN' },
    { x: 1.8, label: 'ROUTE' },
    { x: 3.4, label: 'DELIVER' },
  ];

  return (
    <group>
      {arrowPositions.map((pos, i) => (
        <Html key={i} position={[pos.x, -2.8, 0.5]} center distanceFactor={8}>
          <div className="flex items-center gap-0.5 pointer-events-none select-none opacity-30">
            <span className="text-[5px] font-mono font-bold tracking-[0.2em] uppercase text-cyan-400">
              {pos.label}
            </span>
            <ChevronRight className="w-2 h-2 text-cyan-400" />
          </div>
        </Html>
      ))}
    </group>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORTED COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export const EnterpriseIntegration3DModel = ({ activeStep = null }) => {
  const [activeLayerIdx, setActiveLayerIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showInspector, setShowInspector] = useState(true);

  const activeLayer = INTEGRATION_LAYERS[activeLayerIdx];

  // Auto-cycle through the 4 integration layers
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.max(1500, Math.floor(3500 / speed));
    const timer = setInterval(() => {
      setActiveLayerIdx((prev) => (prev + 1) % INTEGRATION_LAYERS.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  // Sync with external prop
  useEffect(() => {
    if (activeStep !== null && activeStep >= 0 && activeStep < INTEGRATION_LAYERS.length) {
      setActiveLayerIdx(activeStep);
      setIsPlaying(false);
    }
  }, [activeStep]);

  // Packet config — randomized routes
  const packets = useMemo(() => {
    const packs = [];
    // Source → center packets
    SOURCE_SYSTEMS.forEach((src, i) => {
      packs.push({ startX: -3.8, endX: -1.2, y: src.y * 0.5, speed: 0.3 + i * 0.05, delay: i * 0.7, color: src.color });
    });
    // Center through-flow packets
    for (let i = 0; i < 6; i++) {
      packs.push({ startX: -1.5, endX: 2.8, y: -1.5 + i * 0.6, speed: 0.25 + i * 0.04, delay: i * 0.5, color: '#4ab6d4' });
    }
    // Center → target packets
    TARGET_SYSTEMS.forEach((tgt, i) => {
      packs.push({ startX: 2.0, endX: 3.8, y: tgt.y * 0.5, speed: 0.35 + i * 0.05, delay: i * 0.6 + 1.0, color: tgt.color });
    });
    return packs;
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 relative select-none">
      {/* ── TOP HUD HEADER ── */}
      <div className="w-full bg-[#070d18]/90 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-cyan-400 opacity-75' : 'bg-amber-400 opacity-75'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-cyan-500' : 'bg-amber-500'}`} />
            </span>
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-cyan-400">
              INTEGRATION PROCESS ARCHITECTURE
            </span>
          </div>
          <p className="text-[11px] text-white/50 leading-tight">
            Source Systems → API Gateway → Event Fabric → Governance → Intelligence → Target Delivery
          </p>
        </div>

        {/* Layer Quick-Select */}
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto pb-1 sm:pb-0">
          {INTEGRATION_LAYERS.map((layer, idx) => (
            <button
              key={layer.id}
              onClick={() => {
                setActiveLayerIdx(idx);
                setIsPlaying(false);
              }}
              className={`text-[10px] font-semibold px-2 py-1.5 rounded-lg border transition-all duration-200 whitespace-nowrap ${
                activeLayerIdx === idx
                  ? 'bg-brand-blue text-white border-cyan-400 shadow-[0_0_12px_rgba(37,100,234,0.4)]'
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>


      {/* ── 3D ARCHITECTURE CANVAS ── */}
      <div className="w-full h-[460px] lg:h-[520px] relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#060c17] via-[#02050c] to-[#010307] shadow-2xl group cursor-grab active:cursor-grabbing">
        {/* Side Labels */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 backdrop-blur-md">
            <span className="text-[9px] font-mono font-bold tracking-[0.15em] uppercase text-blue-300">SOURCE SYSTEMS</span>
          </div>
        </div>
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <div className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 backdrop-blur-md">
            <span className="text-[9px] font-mono font-bold tracking-[0.15em] uppercase text-emerald-300">TARGET DELIVERY</span>
          </div>
        </div>

        {/* Active Layer Telemetry */}
        <div className="absolute bottom-14 left-4 z-10 flex flex-wrap gap-1.5 pointer-events-none">
          <div className="bg-black/70 border border-white/15 rounded-lg px-2 py-1 backdrop-blur-md flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-white/70">Active:</span>
            <span className="text-[10px] font-mono font-bold text-cyan-300">{activeLayer.label}</span>
          </div>
        </div>

        {/* Three.js Canvas */}
        <Canvas camera={{ position: [0, 1.5, 9.5], fov: 44 }} dpr={[1, 2]}>
          <ambientLight intensity={0.4} color="#1e3a8a" />
          <pointLight position={[10, 12, 10]} intensity={2.0} color="#ffffff" />
          <pointLight position={[-10, -8, -10]} intensity={1.5} color="#38bdf8" />
          <spotLight position={[0, 8, 0]} intensity={1.5} color="#4ab6d4" penumbra={0.8} />

          <group>
            {/* Source system blocks (left) */}
            {SOURCE_SYSTEMS.map((sys, i) => (
              <SourceSystemBlock key={sys.id} system={sys} index={i} activeLayer={activeLayerIdx} />
            ))}

            {/* Integration layer columns (center) */}
            {INTEGRATION_LAYERS.map((layer, i) => (
              <IntegrationLayerColumn
                key={layer.id}
                layer={layer}
                index={i}
                isActive={activeLayerIdx === i}
                onClick={(idx) => {
                  setActiveLayerIdx(idx);
                  setIsPlaying(false);
                }}
              />
            ))}

            {/* Target system blocks (right) */}
            {TARGET_SYSTEMS.map((sys, i) => (
              <TargetSystemBlock key={sys.id} system={sys} index={i} />
            ))}

            {/* Connection lines */}
            <ConnectionLines activeLayerIdx={activeLayerIdx} isPlaying={isPlaying} />

            {/* Animated data packets */}
            {packets.map((p, i) => (
              <DataPacket key={i} {...p} isPlaying={isPlaying} />
            ))}

            {/* Flow direction labels */}
            <FlowDirectionIndicators />

            {/* Architecture grid base */}
            <ArchitectureBase />
          </group>

          {/* Camera controls — limited to keep the flow readable */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 4}
            maxAzimuthAngle={Math.PI / 6}
            minAzimuthAngle={-Math.PI / 6}
          />
        </Canvas>

        {/* Playback Controls */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-black/80 border border-white/20 rounded-xl px-3 py-1.5 backdrop-blur-md shadow-xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:text-cyan-400 transition-colors p-1 rounded hover:bg-white/10"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            onClick={() => { setActiveLayerIdx((prev) => (prev === 0 ? INTEGRATION_LAYERS.length - 1 : prev - 1)); setIsPlaying(false); }}
            className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
            title="Previous Layer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setActiveLayerIdx((prev) => (prev + 1) % INTEGRATION_LAYERS.length); setIsPlaying(false); }}
            className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
            title="Next Layer"
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>
          <div className="h-3.5 w-[1px] bg-white/20 mx-1" />
          <button
            onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))}
            className="text-[10px] font-mono font-bold text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/60"
          >
            {speed}x SPEED
          </button>
        </div>

        {/* Toggle Inspector */}
        <button
          onClick={() => setShowInspector(!showInspector)}
          className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 text-[11px] font-mono font-semibold text-white/80 bg-black/80 border border-white/20 rounded-xl px-3 py-1.5 backdrop-blur-md hover:text-cyan-300 hover:border-cyan-400 transition-all"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          {showInspector ? 'Hide Details' : 'View Details'}
        </button>
      </div>


      {/* ── INTEGRATION LAYER CARDS ── */}
      <div className="w-full bg-[#08101e] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {INTEGRATION_LAYERS.map((layer, i) => {
            const isActive = activeLayerIdx === i;
            const isPassed = i < activeLayerIdx;
            return (
              <button
                key={layer.id}
                onClick={() => { setActiveLayerIdx(i); setIsPlaying(false); }}
                className={`flex flex-col text-left p-2.5 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-blue/20 border-cyan-400 shadow-[0_0_15px_rgba(74,182,212,0.3)] ring-1 ring-cyan-400/50'
                    : isPassed
                    ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400/50'
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[9px] font-mono font-bold uppercase ${isActive ? 'text-cyan-300' : isPassed ? 'text-emerald-400' : 'text-white/40'}`}>
                    LAYER {String(i + 1).padStart(2, '0')}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                </div>
                <span className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-white/70'}`}>
                  {layer.label}
                </span>
                <span className="text-[10px] text-white/40 font-mono mt-1">
                  {layer.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Layer Inspector */}
        {showInspector && (
          <div className="w-full bg-black/70 border border-white/10 rounded-xl p-3.5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 font-mono">
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400">LAYER {String(activeLayerIdx + 1).padStart(2, '0')}</span>
                <span className="text-white/30">•</span>
                <span className="text-xs text-white font-semibold">{activeLayer.label}</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-sans mt-0.5">
                {activeLayer.desc}
              </p>
            </div>

            {/* Metrics */}
            <div className="w-full lg:w-auto shrink-0 bg-[#03060c] border border-cyan-500/30 rounded-lg p-2.5 text-[10px] text-cyan-300/90 max-w-full lg:max-w-sm overflow-x-auto shadow-inner">
              <div className="text-[9px] uppercase tracking-wider text-white/40 mb-1">Layer Metrics</div>
              <code>{JSON.stringify(activeLayer.metrics, null, 0)}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterpriseIntegration3DModel;
