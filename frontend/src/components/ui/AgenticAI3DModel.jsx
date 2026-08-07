import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// ─── 1. Reasoning Core (LLM Engine - Step 1 Highlight) ───────────────────────
const ReasoningCore = ({ isActive }) => {
  const coreRef = useRef();
  const outerRef = useRef();

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (coreRef.current) {
      // Pulsing scale and intensity
      const pulse = 1.0 + Math.sin(elapsed * 4) * (isActive ? 0.08 : 0.03);
      coreRef.current.scale.setScalar(pulse);
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = elapsed * 0.4;
      outerRef.current.rotation.x = elapsed * 0.25;
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {/* Label */}
      <Html position={[0, 1.25, 0]} center distanceFactor={8}>
        <div 
          className={`text-center font-extrabold tracking-widest text-[9.5px] bg-[#0f172a]/95 border px-2 py-0.5 rounded uppercase select-none transition-all duration-500 shadow-lg ${
            isActive 
              ? 'text-cyan-400 border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.5)] scale-110' 
              : 'text-white/60 border-white/10'
          }`}
          style={{ 
            fontFamily: 'Inter, sans-serif',
            transform: 'scale(0.38)', 
            transformOrigin: 'center',
            width: '105px'
          }}
        >
          REASONING CORE
        </div>
      </Html>

      {/* Central Pulsing Nucleus */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshPhysicalMaterial 
          color={isActive ? "#22d3ee" : "#3b82f6"}
          emissive={isActive ? "#22d3ee" : "#1d4ed8"}
          emissiveIntensity={isActive ? 2.2 : 0.85}
          roughness={0.05}
          transmission={0.9}
          transparent
          opacity={0.8}
          clearcoat={1.0}
        />
      </mesh>

      {/* Inner Glowing Point */}
      <pointLight 
        distance={3} 
        intensity={isActive ? 8.0 : 2.5} 
        color={isActive ? "#22d3ee" : "#3b82f6"} 
      />

      {/* Outer Rotating Wireframe Sphere */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[0.62, 16, 16]} />
        <meshBasicMaterial 
          color={isActive ? "#22d3ee" : "#60a5fa"}
          wireframe
          transparent
          opacity={isActive ? 0.65 : 0.25}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

// ─── 2. Orchestration Loop (Planning/Frameworks - Step 0 Highlight) ──────────
const OrchestrationLoop = ({ isActive }) => {
  const ringRef = useRef();

  // Deterministic positions of planning nodes
  const nodes = useMemo(() => [
    { label: 'GOAL', angle: 0 },
    { label: 'DECOMPOSE', angle: Math.PI / 2 },
    { label: 'PLAN', angle: Math.PI },
    { label: 'CORRECT', angle: (3 * Math.PI) / 2 }
  ], []);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.getElapsedTime() * (isActive ? -0.45 : -0.2);
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {/* Flat Orbit Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.08, 1.12, 64]} />
        <meshBasicMaterial 
          color={isActive ? "#22d3ee" : "#3b82f6"} 
          transparent 
          opacity={isActive ? 0.75 : 0.25} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Rotating Nodes */}
      <group ref={ringRef}>
        {nodes.map((n, idx) => {
          const x = Math.cos(n.angle) * 1.1;
          const z = Math.sin(n.angle) * 1.1;

          return (
            <group key={idx} position={[x, 0, z]}>
              {/* Small Glowing Node Sphere */}
              <mesh>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial 
                  color={isActive ? "#22d3ee" : "#60a5fa"} 
                  transparent
                  opacity={0.9} 
                />
              </mesh>
              {/* Inner brighter core */}
              <mesh scale={0.5}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>

              {/* Node label */}
              <Html position={[0, 0.16, 0]} center distanceFactor={8}>
                <div 
                  className={`px-1 rounded font-mono font-black text-[8px] tracking-widest bg-black/90 border transition-all duration-300 ${
                    isActive 
                      ? 'text-cyan-400 border-cyan-400/50 scale-105' 
                      : 'text-white/40 border-white/5'
                  }`}
                  style={{ transform: 'scale(0.35)', transformOrigin: 'center' }}
                >
                  {n.label}
                </div>
              </Html>
            </group>
          );
        })}
      </group>

      {/* Label for Orchestrator */}
      <Html position={[1.4, 0, 0]} center distanceFactor={8}>
        <div 
          className={`font-extrabold tracking-widest text-[9.5px] bg-[#0f172a]/95 border px-2 py-0.5 rounded uppercase select-none transition-all duration-500 shadow-lg ${
            isActive 
              ? 'text-cyan-400 border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.5)] scale-110' 
              : 'text-white/60 border-white/10'
          }`}
          style={{ 
            fontFamily: 'Inter, sans-serif',
            transform: 'scale(0.38)', 
            transformOrigin: 'center',
            width: '105px'
          }}
        >
          ORCHESTRATOR
        </div>
      </Html>
    </group>
  );
};

// ─── 3. Enterprise Integrations (Tools/APIs/DBs - Step 2 Highlight) ─────────
const EnterpriseIntegrations = ({ isActive }) => {
  const groupRef = useRef();

  const blocks = useMemo(() => [
    { pos: [-0.6, -0.65, 0.4], label: 'DB / VECTOR', size: 0.14 },
    { pos: [0.6, -0.65, 0.4], label: 'APIs', size: 0.14 },
    { pos: [0.0, -0.75, -0.5], label: 'SaaS / ERP', size: 0.16 },
  ], []);

  useFrame((state) => {
    if (groupRef.current) {
      const elapsed = state.clock.getElapsedTime();
      groupRef.current.children.forEach((child, idx) => {
        // Slow float offset up and down
        child.position.y = blocks[idx].pos[1] + Math.sin(elapsed * 2 + idx) * 0.05;
        child.rotation.y = elapsed * 0.15 + idx;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {blocks.map((b, idx) => (
        <group key={idx} position={b.pos}>
          {/* Hexagonal prism structure or Box */}
          <mesh>
            <cylinderGeometry args={[b.size, b.size * 1.1, b.size * 1.5, 6]} />
            <meshPhysicalMaterial 
              color={isActive ? "#10b981" : "#1e40af"}
              emissive={isActive ? "#10b981" : "#1e3a8a"}
              emissiveIntensity={isActive ? 1.8 : 0.3}
              roughness={0.1}
              metalness={0.9}
              transmission={0.4}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh scale={1.03}>
            <cylinderGeometry args={[b.size, b.size * 1.1, b.size * 1.5, 6]} />
            <meshBasicMaterial 
              color={isActive ? "#34d399" : "#60a5fa"} 
              wireframe 
              transparent 
              opacity={isActive ? 0.8 : 0.25} 
            />
          </mesh>

          {/* Label */}
          <Html position={[0, -0.22, 0]} center distanceFactor={8}>
            <div 
              className={`font-black text-[7.5px] tracking-wider px-1 bg-black/90 border rounded transition-all duration-300 ${
                isActive 
                  ? 'text-emerald-400 border-emerald-400/50 scale-105' 
                  : 'text-white/40 border-white/5'
              }`}
              style={{ transform: 'scale(0.35)', transformOrigin: 'center', whiteSpace: 'nowrap' }}
            >
              {b.label}
            </div>
          </Html>
        </group>
      ))}

      {/* General label for Integrations */}
      <Html position={[0, -1.0, 0]} center distanceFactor={8}>
        <div 
          className={`font-extrabold tracking-widest text-[9.5px] bg-[#0f172a]/95 border px-2 py-0.5 rounded uppercase select-none transition-all duration-500 shadow-lg ${
            isActive 
              ? 'text-emerald-400 border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-110' 
              : 'text-white/60 border-white/10'
          }`}
          style={{ 
            fontFamily: 'Inter, sans-serif',
            transform: 'scale(0.38)', 
            transformOrigin: 'center',
            width: '105px'
          }}
        >
          INTEGRATION
        </div>
      </Html>
    </group>
  );
};

// ─── 4. Governance Shell (Guardrails/Observability - Step 3 Highlight) ──────
const GovernanceShell = ({ isActive }) => {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.08;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {/* Outer Geodesic Shell Wireframe */}
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshBasicMaterial 
          color={isActive ? "#fb7185" : "#3b82f6"} 
          wireframe 
          transparent 
          opacity={isActive ? 0.38 : 0.07} 
          depthWrite={false}
        />
      </mesh>

      {/* Label for Guardrails */}
      <Html position={[-1.4, 0.9, 0]} center distanceFactor={8}>
        <div 
          className={`font-extrabold tracking-widest text-[9.5px] bg-[#0f172a]/95 border px-2 py-0.5 rounded uppercase select-none transition-all duration-500 shadow-lg ${
            isActive 
              ? 'text-rose-400 border-rose-400/50 shadow-[0_0_12px_rgba(251,113,133,0.5)] scale-110' 
              : 'text-white/60 border-white/10'
          }`}
          style={{ 
            fontFamily: 'Inter, sans-serif',
            transform: 'scale(0.38)', 
            transformOrigin: 'center',
            width: '105px'
          }}
        >
          GOVERNANCE
        </div>
      </Html>
    </group>
  );
};

// ─── Flowing Data Particles ──────────────────────────────────────────────────
const FlowingParticle = ({ start, end, speed, color, isActive }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      const elapsed = state.clock.getElapsedTime() * speed;
      const progress = (elapsed % 1.0);
      ref.current.position.lerpVectors(start, end, progress);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.018, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={isActive ? 0.98 : 0.15} />
    </mesh>
  );
};

const DataFlows = ({ activeStep }) => {
  const flows = useMemo(() => {
    const list = [];
    // Orchestrator to Core
    list.push({ start: new THREE.Vector3(1.1, 0.1, 0), end: new THREE.Vector3(0, 0.1, 0), speed: 0.6, color: "#22d3ee", stepIndex: 0 });
    // Core to Integrations
    list.push({ start: new THREE.Vector3(0, 0.1, 0), end: new THREE.Vector3(-0.6, -0.65, 0.4), speed: 0.75, color: "#10b981", stepIndex: 2 });
    list.push({ start: new THREE.Vector3(0, 0.1, 0), end: new THREE.Vector3(0.6, -0.65, 0.4), speed: 0.9, color: "#10b981", stepIndex: 2 });
    list.push({ start: new THREE.Vector3(0, 0.1, 0), end: new THREE.Vector3(0.0, -0.75, -0.5), speed: 0.65, color: "#10b981", stepIndex: 2 });
    // Integrations back to Core
    list.push({ start: new THREE.Vector3(-0.6, -0.65, 0.4), end: new THREE.Vector3(0, 0.1, 0), speed: 0.7, color: "#3b82f6", stepIndex: 2 });
    return list;
  }, []);

  return (
    <group>
      {flows.map((flow, i) => (
        <FlowingParticle 
          key={i} 
          start={flow.start} 
          end={flow.end} 
          speed={flow.speed} 
          color={flow.color}
          isActive={activeStep === null || flow.stepIndex === activeStep}
        />
      ))}
    </group>
  );
};

// ─── Rotatable Content Wrapper (Very Slow Axis Rotation & Dynamic Aspect Alignment) ──────
const AgenticAIModelContent = ({ activeStep }) => {
  const groupRef = useRef();
  const { size } = useThree();

  const aspect = size.width / size.height;
  const isMobile = size.width < 1024;
  
  // Mathematical offsets matching the visual weight and design parameters of modern-web apps
  const groupX = isMobile ? 0 : 0.75 * aspect;
  const groupScale = isMobile ? 0.42 : 0.60;
  const groupY = isMobile ? -0.05 : -0.1;

  useFrame((state) => {
    if (groupRef.current) {
      // Slow continuous ambient rotation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.024;
    }
  });

  return (
    <group ref={groupRef} scale={groupScale} position={[groupX, groupY, 0]}>
      {/* 4 Architectural layers aligned with left-side index cards */}
      <OrchestrationLoop isActive={activeStep === 0} />
      <ReasoningCore isActive={activeStep === 1} />
      <EnterpriseIntegrations isActive={activeStep === 2} />
      <GovernanceShell isActive={activeStep === 3} />
      
      {/* Reactive connection flows */}
      <DataFlows activeStep={activeStep} />
    </group>
  );
};

// Static fallback image setup
const STATIC_FALLBACK_SRC = '/images/capabilities/agentic-ai-tools-dark-illustration.png';
const STATIC_FALLBACK_ALT = 'Agentic AI Tools & Technology Architecture: Orchestration, Models, Integration, and Monitoring layers.';

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

const useStaticOnly = () => {
  const [staticOnly, setStaticOnly] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setStaticOnly(mq.matches || !hasWebGL());
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return staticOnly;
};

// ─── Main 3D Canvas Component ─────────────────────────────────────────────────
export const AgenticAI3DModel = ({ activeStep = null }) => {
  const staticOnly = useStaticOnly();

  if (staticOnly) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-transparent">
        <img
          src={STATIC_FALLBACK_SRC}
          alt={STATIC_FALLBACK_ALT}
          loading="lazy"
          decoding="async"
          className="w-full h-auto max-w-lg object-contain animate-float"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] relative overflow-hidden bg-transparent">
      <Canvas 
        camera={{ position: [0, 0.15, 4.2], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-3, 5, -3]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[3, -3, 3]} intensity={0.8} color="#ffffff" />
        
        <AgenticAIModelContent activeStep={activeStep} />

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 2.4} 
          maxPolarAngle={Math.PI / 1.9}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};
