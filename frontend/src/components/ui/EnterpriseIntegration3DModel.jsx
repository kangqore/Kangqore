import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2, ShieldCheck, Activity, Cpu, Database, Network, ArrowRight, Zap, RefreshCw, Terminal, Layers } from 'lucide-react';

// ─── SCENARIOS & OPERATIONAL PIPELINE DATA ────────────────────────────────────
const SIMULATION_SCENARIOS = [
  {
    id: 'order_to_cash',
    title: 'Global Order-to-Cash Pipeline',
    subtitle: 'B2B Partner EDI 850 → Integration Fabric → Krisnam Intelligence → SAP S/4HANA & Salesforce',
    source: 'Partner Gateway (EDI 850)',
    target: 'SAP S/4HANA + Salesforce',
    throughput: '48,200 msg/s',
    avgLatency: '8.4 ms',
    sla: '99.999%',
    steps: [
      {
        phase: '01 INGESTION',
        name: 'B2B EDI & API Ingestion',
        actor: 'Edge Gateway (AS2/HTTPS)',
        desc: 'Receives EDI 850 Purchase Order over mutual TLS from Tier-1 supplier.',
        payloadIn: '{"edi": "X12-850", "partner_id": "PRT-9041", "po_num": "PO-882910", "items": 14, "val_usd": 428500}',
        status: 'RECEIVED'
      },
      {
        phase: '02 GOVERNANCE',
        name: 'AEGIS Zero-Trust Security',
        actor: 'Governance Plane',
        desc: 'Verifies partner certificate, decrypts payload, and asserts cryptographic policy rules.',
        payloadIn: '{"aegis_verdict": "PERMIT", "cert_valid": true, "signature": "0x4b7f...91a2", "latency_us": 620}',
        status: 'VERIFIED'
      },
      {
        phase: '03 NORMALIZATION',
        name: 'Protocol & Schema Mediation',
        actor: 'Canonical Engine',
        desc: 'Transforms flat EDI ANSI X12 format into Kangqore Canonical Enterprise Model (Avro).',
        payloadIn: '{"canonical_id": "CN-882910", "order_type": "STANDARD_B2B", "currency": "USD", "credit_hold": false}',
        status: 'NORMALIZED'
      },
      {
        phase: '04 EVENT FABRIC',
        name: 'Governed Integration Fabric',
        actor: 'Event Mesh (Kafka/iPaaS)',
        desc: 'Publishes order event to partitioned durable event log with idempotent deduplication.',
        payloadIn: '{"topic": "enterprise.orders.v2", "partition": 4, "offset": 1094821, "replication_ack": 3}',
        status: 'ROUTED'
      },
      {
        phase: '05 INTELLIGENCE',
        name: 'Krisnam AI Reasoning & Routing',
        actor: 'Krisnam Intelligence Engine',
        desc: 'Runs autonomous inventory allocation reasoning, detects supply chain anomaly, and optimizes fulfillment split.',
        payloadIn: '{"krisnam_reasoning": "Warehouse-East stock 82%, Warehouse-Central 18%. Optimal routing avoids 2-day delay."}',
        status: 'ORCHESTRATED'
      },
      {
        phase: '06 EXECUTION',
        name: 'Dual System Commit & Trace',
        actor: 'Target Connectors (SAP & CRM)',
        desc: 'Atomic transactional write to SAP S/4HANA General Ledger & Salesforce CX with end-to-end distributed trace.',
        payloadIn: '{"sap_doc_id": "DOC-99104", "salesforce_case": "SF-88124", "status": "COMMITTED", "trace_id": "0x8fa1...c4e9"}',
        status: 'COMPLETED'
      }
    ]
  },
  {
    id: 'event_burst',
    title: 'High-Throughput Streaming Mesh',
    subtitle: 'Kafka Real-Time IoT & Telemetry → Stream Processor → Anomaly Filter → Real-Time Analytics',
    source: 'Kafka Cluster (120k msg/s)',
    target: 'Elastic Analytics & Hot Storage',
    throughput: '124,500 msg/s',
    avgLatency: '3.2 ms',
    sla: '100.00%',
    steps: [
      {
        phase: '01 INGESTION',
        name: 'High-Velocity Event Stream',
        actor: 'Distributed Kafka Brokers',
        desc: '120,000 telemetry messages ingested per second across 64 parallel topic partitions.',
        payloadIn: '{"event_rate": 124500, "batch_size_kb": 256, "active_producers": 820}',
        status: 'INGESTED'
      },
      {
        phase: '02 GOVERNANCE',
        name: 'Stream Rate Limiting & Auth',
        actor: 'Edge Policy Filter',
        desc: 'Non-blocking hardware-accelerated JWT token validation with wire-speed filtering.',
        payloadIn: '{"tokens_validated": 124500, "rejected_malformed": 0, "overhead_ns": 85}',
        status: 'VERIFIED'
      },
      {
        phase: '03 NORMALIZATION',
        name: 'In-Flight Deserialization',
        actor: 'Protobuf / Schema Registry',
        desc: 'Schema validation against Confluent Schema Registry v4.3 with zero copy memory footprint.',
        payloadIn: '{"schema_id": "SCH-4412", "encoding": "PROTOBUF_V3", "zero_copy": true}',
        status: 'VALIDATED'
      },
      {
        phase: '04 EVENT FABRIC',
        name: 'Low-Latency Message Hub',
        actor: 'Integration Event Mesh',
        desc: 'Zero-loss pub/sub distribution across multi-region cloud brokers and on-prem clusters.',
        payloadIn: '{"fanout_ratio": "1:8", "cross_region_ms": 1.4, "delivery_guarantee": "EXACTLY_ONCE"}',
        status: 'DISPATCHED'
      },
      {
        phase: '05 INTELLIGENCE',
        name: 'Real-Time Anomaly Detection',
        actor: 'Krisnam Stream AI',
        desc: 'Sliding window ML model flags micro-fluctuations in throughput with automated throttle adjustment.',
        payloadIn: '{"anomaly_score": 0.002, "adaptive_scaling": "STEADY", "health_index": 99.8}',
        status: 'EVALUATED'
      },
      {
        phase: '06 EXECUTION',
        name: 'Sink Ingestion & Telemetry',
        actor: 'OpenSearch & Data Lake',
        desc: 'Bulk batch insertion with sub-second indexing and Prometheus telemetry export.',
        payloadIn: '{"records_indexed": 124500, "sink_latency_ms": 2.1, "distributed_trace_ok": true}',
        status: 'INDEXED'
      }
    ]
  },
  {
    id: 'ai_agent_mesh',
    title: 'Governed AI Agent Action Mesh',
    subtitle: 'Krisnam Agent Intent → AEGIS Gatekeeper → ActionEngine Mutation → System of Record',
    source: 'Autonomous KIMMP Agent',
    target: 'Workday + ServiceNow + ERP',
    throughput: '1,400 agent ops/s',
    avgLatency: '14.1 ms',
    sla: '99.99%',
    steps: [
      {
        phase: '01 INGESTION',
        name: 'Agent Intent Formulation',
        actor: 'KIMMP / WAANDA Engine',
        desc: 'Krisnam LLM translates high-level human intent ("Fix project resource bottleneck") into structured action plan.',
        payloadIn: '{"intent": "REASSIGN_PROJECT_RESOURCES", "project_id": "PRJ-302", "target_role": "SR_DATA_ARCHITECT"}',
        status: 'FORMULATED'
      },
      {
        phase: '02 GOVERNANCE',
        name: 'AEGIS Policy Pre-Flight Scan',
        actor: 'AEGIS Security Core',
        desc: 'Validates agent credentials, checks enterprise authorization matrix, and signs cryptographic action permit.',
        payloadIn: '{"policy": "HR_GOVERNANCE_V2", "permit_token": "PRM-99124", "authority_level": "LEVEL_4_AUTONOMOUS"}',
        status: 'AUTHORIZED'
      },
      {
        phase: '03 NORMALIZATION',
        name: 'Action Engine Parameterization',
        actor: 'Governed API Registry',
        desc: 'Maps agent intent into strongly-typed parameter objects for Workday HCM & ServiceNow ITSM APIs.',
        payloadIn: '{"workday_mutation": "UpdateWorkerAllocation", "service_now_change": "CHG-008291"}',
        status: 'COMPILED'
      },
      {
        phase: '04 EVENT FABRIC',
        name: 'Two-Phase Commit Orchestrator',
        actor: 'Integration Transaction Fabric',
        desc: 'Orchestrates distributed saga transaction across HR and Service Management endpoints with rollback safety.',
        payloadIn: '{"saga_id": "SAGA-7721", "steps_total": 3, "compensation_enabled": true}',
        status: 'COMMITTED'
      },
      {
        phase: '05 INTELLIGENCE',
        name: 'Post-Execution Outcome Verification',
        actor: 'Krisnam Outcome Engine',
        desc: 'Evaluates probability shift (+21% on-time delivery) and updates enterprise graph weights.',
        payloadIn: '{"expected_impact": "+21% delivery probability", "variance_predicted": -0.42}',
        status: 'VERIFIED'
      },
      {
        phase: '06 EXECUTION',
        name: 'Audit Trail & Stakeholder Alert',
        actor: 'AEGIS Immutable Audit Log',
        desc: 'Writes signed SHA-256 record to enterprise audit trail and notifies executive command center.',
        payloadIn: '{"audit_hash": "0x9c41...ee29", "notification_dispatched": true, "immutable": true}',
        status: 'AUDITED'
      }
    ]
  }
];

// ─── 3D Central Reactor Fabric ────────────────────────────────────────────────
const CentralFabricCore = ({ currentStep, isPlaying }) => {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speedMultiplier = isPlaying ? 1.0 : 0.2;
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.3 * speedMultiplier;
      coreRef.current.rotation.x = Math.sin(t * 0.2) * 0.15 * speedMultiplier;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.6 * speedMultiplier;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.45 * speedMultiplier;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.3 * speedMultiplier;
  });

  return (
    <group>
      {/* Outer Holographic Reactor Frame */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.85, 2]} />
        <meshPhysicalMaterial
          color="#2564ea"
          emissive="#4ab6d4"
          emissiveIntensity={0.65}
          roughness={0.1}
          metalness={0.8}
          transmission={0.8}
          thickness={0.6}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>

      {/* Internal Obsidian Hypercore */}
      <mesh>
        <dodecahedronGeometry args={[0.46, 0]} />
        <meshStandardMaterial
          color="#050b14"
          emissive="#2564ea"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Rotating Torus Acceleration Rings */}
      <group ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.15, 0.015, 16, 64]} />
          <meshBasicMaterial color="#4ab6d4" transparent opacity={0.85} />
        </mesh>
      </group>

      <group ref={ring2Ref} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <mesh>
          <torusGeometry args={[1.4, 0.018, 16, 64]} />
          <meshBasicMaterial color="#2564ea" transparent opacity={0.7} />
        </mesh>
      </group>

      <group ref={ring3Ref} rotation={[Math.PI / 6, -Math.PI / 3, 0]}>
        <mesh>
          <torusGeometry args={[1.65, 0.012, 16, 64]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Core Telemetry Tag */}
      <Html position={[0, -1.1, 0]} center distanceFactor={8}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div className="text-[6.5px] font-black tracking-[0.22em] uppercase px-3 py-0.5 rounded-full bg-blue-950/90 border border-cyan-400/80 text-cyan-300 shadow-[0_0_15px_rgba(74,182,212,0.5)] backdrop-blur-md">
            INTEGRATION FABRIC
          </div>
          <div className="text-[5px] tracking-widest text-white/60 font-mono mt-0.5">
            APIs · EVENTS · iPaaS · EDI
          </div>
        </div>
      </Html>
    </group>
  );
};

// ─── 3D Process Pipeline Stage Node ───────────────────────────────────────────
const PipelineStageNode = ({ index, total, stage, isActive, isPassed, onSelect }) => {
  const groupRef = useRef();
  const meshRef = useRef();
  const radius = 3.2;
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = Math.sin(angle * 2) * 0.3;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 1.5;
      meshRef.current.rotation.x = t * 1.0;
    }
  });

  return (
    <group position={[x, y, z]}>
      {/* Node Geometry */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(index);
        }}
      >
        <octahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial
          color={isActive ? '#ffffff' : isPassed ? '#00c875' : '#2564ea'}
          emissive={isActive ? '#4ab6d4' : isPassed ? '#00c875' : '#1d4ed8'}
          emissiveIntensity={isActive ? 1.2 : isPassed ? 0.6 : 0.3}
          wireframe={!isActive && !isPassed}
        />
      </mesh>

      {/* Active Pulse Aura */}
      {isActive && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.42, 0.018, 16, 64]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.55, 0.01, 16, 64]} />
            <meshBasicMaterial color="#4ab6d4" transparent opacity={0.75} />
          </mesh>
          <Sparkles count={25} scale={1.4} size={1.8} speed={1.5} opacity={0.9} color="#4ab6d4" />
        </>
      )}

      {/* Orbit Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.015, radius + 0.015, 128]} />
        <meshBasicMaterial color="#4ab6d4" transparent opacity={0.03} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating 3D Badge */}
      <Html position={[0, 0.52, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(index);
          }}
          className={`cursor-pointer transition-all duration-300 flex flex-col items-center gap-0.5 select-none ${
            isActive ? 'scale-110 opacity-100' : isPassed ? 'scale-95 opacity-80' : 'scale-90 opacity-40 hover:opacity-80'
          }`}
        >
          <div className={`text-[7px] font-black tracking-[0.16em] uppercase px-2.5 py-0.5 rounded border whitespace-nowrap backdrop-blur-md ${
            isActive
              ? 'text-white bg-blue-950/90 border-cyan-400 shadow-[0_0_20px_rgba(74,182,212,0.7)] ring-1 ring-cyan-300'
              : isPassed
              ? 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50'
              : 'text-white/70 bg-black/80 border-white/20'
          }`}>
            {stage.phase}
          </div>
          <div className="text-[5.5px] font-mono text-cyan-300 tracking-tight bg-black/60 px-1.5 py-0.2 rounded border border-white/10 whitespace-nowrap">
            {stage.name}
          </div>
        </div>
      </Html>
    </group>
  );
};

// ─── Traveling Data Packet Animation along Spline ─────────────────────────────
const TravelingDataPacket = ({ total, currentIndex, isPlaying }) => {
  const packetRef = useRef();
  const radius = 3.2;

  useFrame(({ clock }) => {
    if (!packetRef.current) return;
    const t = clock.getElapsedTime();
    // Move smoothly around the circle
    const progress = isPlaying ? (t * 0.4) % (Math.PI * 2) : ((currentIndex / total) * Math.PI * 2 - Math.PI / 2);
    const x = Math.cos(progress) * radius;
    const z = Math.sin(progress) * radius;
    const y = Math.sin(progress * 2) * 0.3;
    packetRef.current.position.set(x, y, z);
  });

  return (
    <group ref={packetRef}>
      <mesh>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <Sparkles count={15} scale={0.8} size={2.0} speed={2.0} opacity={0.9} color="#4ab6d4" />
    </group>
  );
};

// ─── 3D Synapse Interconnect Splines ──────────────────────────────────────────
const InterconnectSplines = ({ total, currentIndex }) => {
  const radius = 3.2;

  return (
    <group>
      {Array.from({ length: total }).map((_, i) => {
        const angle1 = (i / total) * Math.PI * 2 - Math.PI / 2;
        const nextIdx = (i + 1) % total;
        const angle2 = (nextIdx / total) * Math.PI * 2 - Math.PI / 2;

        const p1 = new THREE.Vector3(Math.cos(angle1) * radius, Math.sin(angle1 * 2) * 0.3, Math.sin(angle1) * radius);
        const p2 = new THREE.Vector3(Math.cos(angle2) * radius, Math.sin(angle2 * 2) * 0.3, Math.sin(angle2) * radius);
        const pMid = new THREE.Vector3(
          (p1.x + p2.x) * 0.5 * 0.85,
          0.35,
          (p1.z + p2.z) * 0.5 * 0.85
        );

        const curve = new THREE.QuadraticBezierCurve3(p1, pMid, p2);
        const pts = curve.getPoints(20);

        // Core to Node radial line
        const radialPts = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(p1.x * 0.5, 0.2, p1.z * 0.5),
          p1
        ];
        const radialCurve = new THREE.QuadraticBezierCurve3(radialPts[0], radialPts[1], radialPts[2]);
        const rPts = radialCurve.getPoints(16);

        const isActiveHop = i === currentIndex;

        return (
          <group key={i}>
            {/* Circumference Spline */}
            <Line
              points={pts}
              color={isActiveHop ? '#ffffff' : '#2564ea'}
              lineWidth={isActiveHop ? 2.5 : 1.0}
              transparent
              opacity={isActiveHop ? 0.9 : 0.25}
            />
            {/* Radial Ingestion/Dispatch Spline */}
            <Line
              points={rPts}
              color={isActiveHop ? '#4ab6d4' : '#1e3a8a'}
              lineWidth={isActiveHop ? 2.0 : 0.8}
              transparent
              opacity={isActiveHop ? 0.8 : 0.2}
            />
          </group>
        );
      })}
    </group>
  );
};

// ─── Governance Plane (Architectural Foundation) ──────────────────────────────
const GovernanceBasePlane = () => {
  const gridRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (gridRef.current) gridRef.current.rotation.z = t * 0.015;
  });

  return (
    <group position={[0, -2.1, 0]}>
      <group ref={gridRef} rotation={[-Math.PI / 2, 0, 0]}>
        <gridHelper args={[8, 16, '#2564ea', '#0f2759']} />
        <mesh position={[0, 0, -0.01]}>
          <ringGeometry args={[1.5, 4.2, 64]} />
          <meshBasicMaterial color="#00c875" transparent opacity={0.04} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <Html position={[0, -0.28, 0]} center distanceFactor={8}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div className="text-[6.5px] font-black tracking-[0.2em] uppercase px-3 py-0.5 rounded bg-emerald-950/90 border border-emerald-400/60 text-emerald-400 shadow-[0_0_15px_rgba(0,200,117,0.4)] backdrop-blur-md">
            GOVERNANCE PLANE
          </div>
          <div className="text-[5px] font-mono text-emerald-300/70 tracking-widest mt-0.5">
            AEGIS ZERO-TRUST · IDENTITY · POLICY · OBSERVABILITY
          </div>
        </div>
      </Html>
    </group>
  );
};

// ─── MAIN WORKING MODEL COMPONENT ─────────────────────────────────────────────
export const EnterpriseIntegration3DModel = ({ activeStep = null }) => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showLogDrawer, setShowLogDrawer] = useState(true);
  const [speed, setSpeed] = useState(1);

  const scenario = SIMULATION_SCENARIOS[scenarioIdx];
  const steps = scenario.steps;
  const activeStepData = steps[currentStepIdx] || steps[0];

  // Auto-play interval across the 6 pipeline phases
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.max(1200, Math.floor(3200 / speed));
    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => (prev + 1) % steps.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, speed, steps.length]);

  // Sync with external activeStep prop if provided
  useEffect(() => {
    if (activeStep !== null && activeStep >= 0 && activeStep < steps.length) {
      setCurrentStepIdx(activeStep);
      setIsPlaying(false);
    }
  }, [activeStep, steps.length]);

  return (
    <div className="w-full flex flex-col gap-4 relative select-none">
      {/* ── TOP HUD HEADER & SCENARIO SELECTOR ── */}
      <div className="w-full bg-[#070d18]/90 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-cyan-400 opacity-75' : 'bg-amber-400 opacity-75'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-cyan-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-cyan-400">
              LIVE PROCESS SIMULATOR
            </span>
            <span className="text-xs text-white/30">|</span>
            <span className="text-xs font-semibold text-white/90">
              {scenario.title}
            </span>
          </div>
          <p className="text-[11px] text-white/50 leading-tight">
            {scenario.subtitle}
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto pb-1 sm:pb-0">
          {SIMULATION_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                setScenarioIdx(idx);
                setCurrentStepIdx(0);
              }}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all duration-200 whitespace-nowrap ${
                scenarioIdx === idx
                  ? 'bg-brand-blue text-white border-cyan-400 shadow-[0_0_12px_rgba(37,100,234,0.4)]'
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              Scenario {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3D GRAPHICS WORKING CANVAS ── */}
      <div className="w-full h-[460px] lg:h-[520px] relative rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#060c17] via-[#02050c] to-[#010307] shadow-2xl group cursor-grab active:cursor-grabbing">
        {/* Real-time Telemetry Overlay Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-none">
          <div className="bg-black/70 border border-white/15 rounded-lg px-2.5 py-1 backdrop-blur-md flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-white/70">Throughput:</span>
            <span className="text-[10px] font-mono font-bold text-cyan-300">{scenario.throughput}</span>
          </div>
          <div className="bg-black/70 border border-white/15 rounded-lg px-2.5 py-1 backdrop-blur-md flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-mono text-white/70">Latency:</span>
            <span className="text-[10px] font-mono font-bold text-emerald-300">{scenario.avgLatency}</span>
          </div>
          <div className="bg-black/70 border border-white/15 rounded-lg px-2.5 py-1 backdrop-blur-md flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-mono text-white/70">AEGIS SLA:</span>
            <span className="text-[10px] font-mono font-bold text-blue-300">{scenario.sla}</span>
          </div>
        </div>

        {/* 3D Canvas */}
        <Canvas camera={{ position: [0, 4.0, 7.6], fov: 46 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} color="#1e3a8a" />
          <pointLight position={[10, 12, 10]} intensity={2.2} color="#ffffff" />
          <pointLight position={[-10, -8, -10]} intensity={1.8} color="#38bdf8" />
          <spotLight position={[0, 8, 0]} intensity={2.0} color="#4ab6d4" penumbra={0.8} />

          <group>
            {/* Core Fabric */}
            <CentralFabricCore currentStep={currentStepIdx} isPlaying={isPlaying} />

            {/* Interconnect Splines */}
            <InterconnectSplines total={steps.length} currentIndex={currentStepIdx} />

            {/* Traveling Data Packet */}
            <TravelingDataPacket total={steps.length} currentIndex={currentStepIdx} isPlaying={isPlaying} />

            {/* 6 Process Pipeline Stage Nodes */}
            <group rotation={[Math.PI * 0.06, 0, 0]}>
              {steps.map((st, i) => (
                <PipelineStageNode
                  key={st.name}
                  index={i}
                  total={steps.length}
                  stage={st}
                  isActive={currentStepIdx === i}
                  isPassed={i < currentStepIdx}
                  onSelect={(idx) => {
                    setCurrentStepIdx(idx);
                    setIsPlaying(false);
                  }}
                />
              ))}
            </group>

            {/* Base Governance Plane */}
            <GovernanceBasePlane />
          </group>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={isPlaying}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.6}
            minPolarAngle={Math.PI / 3.4}
          />
        </Canvas>

        {/* Playback Controls Float Strip */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-black/80 border border-white/20 rounded-xl px-3 py-1.5 backdrop-blur-md shadow-xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:text-cyan-400 transition-colors p-1 rounded hover:bg-white/10"
            title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            onClick={() => {
              setCurrentStepIdx((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
              setIsPlaying(false);
            }}
            className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
            title="Previous Step"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setCurrentStepIdx((prev) => (prev + 1) % steps.length);
              setIsPlaying(false);
            }}
            className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
            title="Next Step"
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

        {/* Toggle Inspector Log Button */}
        <button
          onClick={() => setShowLogDrawer(!showLogDrawer)}
          className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 text-[11px] font-mono font-semibold text-white/80 bg-black/80 border border-white/20 rounded-xl px-3 py-1.5 backdrop-blur-md hover:text-cyan-300 hover:border-cyan-400 transition-all"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          {showLogDrawer ? 'Hide Trace Logs' : 'View Trace Logs'}
        </button>
      </div>

      {/* ── STEP-BY-STEP PROCESS TIMELINE BAR ── */}
      <div className="w-full bg-[#08101e] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {steps.map((st, i) => {
            const isActive = currentStepIdx === i;
            const isPassed = i < currentStepIdx;
            return (
              <button
                key={st.name}
                onClick={() => {
                  setCurrentStepIdx(i);
                  setIsPlaying(false);
                }}
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
                    {st.phase}
                  </span>
                  {isPassed ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : isActive ? (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  ) : null}
                </div>
                <span className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-white/70'}`}>
                  {st.name}
                </span>
                <span className="text-[10px] text-white/40 font-mono mt-1">
                  {st.actor}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── ACTIVE HOP REASONING & PAYLOAD INSPECTOR ── */}
        {showLogDrawer && (
          <div className="w-full bg-black/70 border border-white/10 rounded-xl p-3.5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 font-mono">
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400">{activeStepData.phase}</span>
                <span className="text-white/30">•</span>
                <span className="text-xs text-white font-semibold">{activeStepData.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/60 border border-blue-400/40 text-blue-200">
                  {activeStepData.status}
                </span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed font-sans mt-0.5">
                {activeStepData.desc}
              </p>
            </div>

            {/* Live Wire Payload Box */}
            <div className="w-full lg:w-auto shrink-0 bg-[#03060c] border border-cyan-500/30 rounded-lg p-2.5 text-[10px] text-cyan-300/90 max-w-full lg:max-w-md overflow-x-auto shadow-inner">
              <div className="text-[9px] uppercase tracking-wider text-white/40 mb-1 flex items-center justify-between">
                <span>Wire Payload Sample</span>
                <span className="text-emerald-400">Validated</span>
              </div>
              <code>{activeStepData.payloadIn}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterpriseIntegration3DModel;
