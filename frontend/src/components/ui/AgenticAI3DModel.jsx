import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';


// Custom shader representing a glowing holographic blue gradient
const sphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uActive;
    uniform float uTime;
    void main() {
      // Y-position gradient mapping from bottom to top
      float grad = (vPosition.y + 0.62) / 1.24;
      
      // Royal blue gradient mix
      vec3 bottomColor = vec3(0.01, 0.05, 0.28); 
      vec3 topColor = vec3(0.0, 0.40, 0.95);     
      vec3 gradientColor = mix(bottomColor, topColor, clamp(grad, 0.0, 1.0));
      
      // Holographic edge rim glow
      float pulse = 0.5 + 0.5 * sin(uTime * 3.5);
      float glowFactor = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
      vec3 glowColor = vec3(0.0, 0.70, 1.0) * glowFactor * (uActive > 0.5 ? 2.8 : 0.9) * (0.8 + 0.2 * pulse);
      
      vec3 finalColor = gradientColor + glowColor;
      float alpha = uActive > 0.5 ? 0.90 : 0.65;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

// ─── 1. Neural Network Synapses Core (Models - Step 1 Highlight) ─────────────
const NeuralNetworkCore = ({ isActive }) => {
  const pointsRef = useRef();
  const linesRef = useRef();
  const shaderRef = useRef();

  // Generate 80 nodes on a sphere to act as neurons
  const [nodes, connections] = useMemo(() => {
    const nodeArr = [];
    const count = 80;
    const radius = 0.55;

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      nodeArr.push(new THREE.Vector3(x, y, z));
    }

    const connArr = [];
    // Connect nodes that are close to each other
    for (let i = 0; i < count; i++) {
      let connectionsMade = 0;
      for (let j = i + 1; j < count; j++) {
        if (nodeArr[i].distanceTo(nodeArr[j]) < 0.28 && connectionsMade < 3) {
          connArr.push(nodeArr[i], nodeArr[j]);
          connectionsMade++;
        }
      }
    }

    return [nodeArr, connArr];
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = elapsed;
      shaderRef.current.uniforms.uActive.value = isActive ? 1.0 : 0.0;
    }
    
    // Animate points to simulate neural firing
    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed * 0.15;
      pointsRef.current.rotation.x = elapsed * 0.08;
      
      // Dynamic scaling loop on focus
      const pulse = 1.0 + Math.sin(elapsed * 5.0) * (isActive ? 0.08 : 0.02);
      pointsRef.current.scale.setScalar(pulse);
    }

    if (linesRef.current) {
      linesRef.current.rotation.y = elapsed * 0.15;
      linesRef.current.rotation.x = elapsed * 0.08;
      linesRef.current.scale.setScalar(1.0 + Math.sin(elapsed * 5.0) * (isActive ? 0.08 : 0.02));
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* Central Glass Nucleus Shield */}
      <mesh>
        <sphereGeometry args={[0.62, 32, 32]} />
        <shaderMaterial 
          ref={shaderRef}
          vertexShader={sphereShader.vertexShader}
          fragmentShader={sphereShader.fragmentShader}
          uniforms={{
            uActive: { value: 0.0 },
            uTime: { value: 0.0 }
          }}
          transparent
        />
      </mesh>

      {/* Neural Core Label */}
      <Html position={[0, 1.45, 0]} center distanceFactor={8}>
        <div 
          className={`text-center font-extrabold tracking-widest text-[9.5px] bg-[#090d16] border px-3 py-1 rounded uppercase select-none transition-all duration-500 whitespace-nowrap ${
            isActive 
              ? 'text-white border-white shadow-[0_0_20px_rgba(255,255,255,0.9)] scale-110' 
              : 'text-white/60 border-white/20 shadow-[0_0_8px_rgba(255,255,255,0.2)]'
          }`}
          style={{ 
            fontFamily: 'Inter, sans-serif',
            transform: 'scale(0.24)',
            transformOrigin: 'center'
          }}
        >
          REASONING CORE
        </div>
      </Html>

      {/* Glowing Point Light */}
      <pointLight 
        distance={3.5} 
        intensity={isActive ? 30.0 : 8.0} 
        color="#ffffff" 
      />

      {/* Synapse Points (Neurons) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position"
            args={[new Float32Array(nodes.flatMap(n => [n.x, n.y, n.z])), 3]}
          />
        </bufferGeometry>
        <pointsMaterial 
          color="#ffffff"
          size={isActive ? 0.045 : 0.03}
          sizeAttenuation
          transparent
          opacity={isActive ? 0.95 : 0.4}
        />
      </points>

      {/* Synapse Lines (Synaptic Links) */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position"
            args={[new Float32Array(connections.flatMap(c => [c.x, c.y, c.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color="#ffffff"
          transparent
          opacity={isActive ? 1.0 : 0.35}
          linewidth={isActive ? 3 : 1.5}
        />
      </lineSegments>
    </group>
  );
};

// ─── 2. Holographic Scanner Ring (Orchestration - Step 0 Highlight) ─────────
const HolographicScanner = ({ isActive }) => {
  const groupRef = useRef();

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Moves up and down scanning the core
      const speed = isActive ? 2.5 : 1.2;
      groupRef.current.position.y = Math.sin(elapsed * speed) * 0.7 + 0.2;
      groupRef.current.rotation.y = elapsed * (isActive ? 1.5 : 0.6);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Scanner Ring Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.15, 64]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={isActive ? 0.9 : 0.55} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Inner glowing edge helper */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={0.98}>
        <ringGeometry args={[1.05, 1.07, 64]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={isActive ? 0.95 : 0.6} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Small floating processor nodes along scanner */}
      {Array.from({ length: 4 }).map((_, idx) => {
        const angle = (idx * Math.PI) / 2;
        const x = Math.cos(angle) * 1.1;
        const z = Math.sin(angle) * 1.1;

        return (
          <group key={idx} position={[x, 0, z]}>
            <mesh>
              <boxGeometry args={[0.08, 0.08, 0.08]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={isActive ? 0.95 : 0.6} />
            </mesh>
            <Html position={[0, 0.16, 0]} center distanceFactor={8}>
              <div 
                className={`px-1.5 py-0.5 rounded font-mono font-black text-[8px] tracking-widest bg-black border transition-all duration-300 whitespace-nowrap ${
                  isActive 
                    ? 'text-white border-white scale-105 shadow-[0_0_12px_rgba(255,255,255,0.8)]' 
                    : 'text-white/80 border-white/30 shadow-[0_0_4px_rgba(255,255,255,0.2)]'
                }`}
                style={{
                  transform: 'scale(0.20)',
                  transformOrigin: 'center'
                }}
              >
                PLANNER_0{idx + 1}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Section Label */}
      <Html position={[1.4, 0, 0]} center distanceFactor={8}>
        <div 
          className={`font-extrabold tracking-widest text-[9.5px] bg-[#090d16] border px-3 py-1 rounded uppercase select-none transition-all duration-500 whitespace-nowrap ${
            isActive 
              ? 'text-white border-white shadow-[0_0_20px_rgba(255,255,255,0.9)] scale-110' 
              : 'text-white/60 border-white/20 shadow-[0_0_8px_rgba(255,255,255,0.2)]'
          }`}
          style={{ 
            fontFamily: 'Inter, sans-serif',
            transform: 'scale(0.24)',
            transformOrigin: 'center'
          }}
        >
          ORCHESTRATOR
        </div>
      </Html>
    </group>
  );
};

// ─── 3. Microchip Stack Plates (Integration - Step 2 Highlight) ──────────────
const MicrochipStack = ({ isActive }) => {
  const stackRef = useRef();

  useFrame((state) => {
    if (stackRef.current) {
      const elapsed = state.clock.getElapsedTime();
      stackRef.current.rotation.y = elapsed * 0.12;
      // Ambient slow up-and-down drift
      stackRef.current.position.y = -0.9 + Math.sin(elapsed * 1.5) * 0.04;
    }
  });

  return (
    <group ref={stackRef}>
      {/* 3 Stacked Processor Glass Plates */}
      {[0, 1, 2].map((idx) => {
        const yOffset = idx * 0.22;
        const color = isActive ? "#ffffff" : "#cbd5e1"; 
        const outlineColor = isActive ? "#ffffff" : "#94a3b8"; 

        return (
          <group key={idx} position={[0, yOffset, 0]}>
            {/* Glass Plate Square Box */}
            <mesh>
              <boxGeometry args={[1.4, 0.02, 1.4]} />
              <meshPhysicalMaterial 
                color={color}
                emissive={color}
                emissiveIntensity={isActive ? 6.0 : 1.8}
                roughness={0.05}
                transmission={0.85}
                transparent
                opacity={isActive ? 0.95 : 0.75}
              />
            </mesh>

            {/* Outlines of Plate */}
            <mesh scale={[1.02, 1.05, 1.02]}>
              <boxGeometry args={[1.4, 0.02, 1.4]} />
              <meshBasicMaterial 
                color={outlineColor} 
                wireframe 
                transparent 
                opacity={isActive ? 0.95 : 0.45} 
              />
            </mesh>

            {/* Small micro processor cores on top of each plate */}
            <mesh position={[-0.4, 0.08, -0.4]}>
              <boxGeometry args={[0.15, 0.1, 0.15]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={isActive ? 0.95 : 0.6} />
            </mesh>
            <mesh position={[0.4, 0.08, 0.4]}>
              <boxGeometry args={[0.15, 0.1, 0.15]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={isActive ? 0.95 : 0.6} />
            </mesh>

            {/* Text badge indicating layer function */}
            {idx === 0 && (
              <Html position={[0.85, 0, 0.85]} center distanceFactor={8}>
                <div 
                  className={`font-mono text-[8px] font-bold bg-black px-1.5 py-0.5 border rounded whitespace-nowrap transition-all duration-500 ${
                    isActive 
                      ? 'text-white border-white shadow-[0_0_12px_rgba(255,255,255,0.8)]' 
                      : 'text-white/80 border-white/30 shadow-[0_0_4px_rgba(255,255,255,0.2)]'
                  }`}
                  style={{
                    transform: 'scale(0.20)',
                    transformOrigin: 'center'
                  }}
                >
                  DB / MEMORY
                </div>
              </Html>
            )}
            {idx === 1 && (
              <Html position={[0.85, 0, 0.85]} center distanceFactor={8}>
                <div 
                  className={`font-mono text-[8px] font-bold bg-black px-1.5 py-0.5 border rounded whitespace-nowrap transition-all duration-500 ${
                    isActive 
                      ? 'text-white border-white shadow-[0_0_12px_rgba(255,255,255,0.8)]' 
                      : 'text-white/80 border-white/30 shadow-[0_0_4px_rgba(255,255,255,0.2)]'
                  }`}
                  style={{
                    transform: 'scale(0.20)',
                    transformOrigin: 'center'
                  }}
                >
                  APIs
                </div>
              </Html>
            )}
            {idx === 2 && (
              <Html position={[0.85, 0, 0.85]} center distanceFactor={8}>
                <div 
                  className={`font-mono text-[8px] font-bold bg-black px-1.5 py-0.5 border rounded whitespace-nowrap transition-all duration-500 ${
                    isActive 
                      ? 'text-white border-white shadow-[0_0_12px_rgba(255,255,255,0.8)]' 
                      : 'text-white/80 border-white/30 shadow-[0_0_4px_rgba(255,255,255,0.2)]'
                  }`}
                  style={{
                    transform: 'scale(0.20)',
                    transformOrigin: 'center'
                  }}
                >
                  SaaS / ERP
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Integration Label */}
      <Html position={[0, -0.25, 0]} center distanceFactor={8}>
        <div 
          className={`font-extrabold tracking-widest text-[9.5px] bg-[#090d16] border px-3 py-1 rounded uppercase select-none transition-all duration-500 whitespace-nowrap ${
            isActive 
              ? 'text-white border-white shadow-[0_0_20px_rgba(255,255,255,0.9)] scale-110' 
              : 'text-white/60 border-white/20 shadow-[0_0_8px_rgba(255,255,255,0.2)]'
          }`}
          style={{ 
            fontFamily: 'Inter, sans-serif',
            transform: 'scale(0.24)',
            transformOrigin: 'center'
          }}
        >
          INTEGRATION
        </div>
      </Html>
    </group>
  );
};

// ─── 4. Geodesic Governance Shield (Monitoring - Step 3 Highlight) ─────────
const GeodesicShield = ({ isActive }) => {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      ref.current.rotation.z = state.clock.getElapsedTime() * 0.025;
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* Geodesic Dome Mesh Grid */}
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.58, 2]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={isActive ? 6.0 : 1.5}
          wireframe 
          transparent 
          opacity={isActive ? 0.95 : 0.6} 
          depthWrite={false}
        />
      </mesh>

      {/* Governance Shield Label */}
      <Html position={[-1.4, 0.95, 0]} center distanceFactor={8}>
        <div 
          className={`font-extrabold tracking-widest text-[9.5px] bg-[#090d16] border px-3 py-1 rounded uppercase select-none transition-all duration-500 whitespace-nowrap ${
            isActive 
              ? 'text-white border-white shadow-[0_0_20px_rgba(255,255,255,0.9)] scale-110' 
              : 'text-white/80 border-white/30 shadow-[0_0_8px_rgba(255,255,255,0.25)]'
          }`}
          style={{ 
            fontFamily: 'Inter, sans-serif',
            transform: 'scale(0.24)',
            transformOrigin: 'center'
          }}
        >
          GOVERNANCE
        </div>
      </Html>
    </group>
  );
};

// ─── Curving Bezier Dynamic Data Flows ────────────────────────────────────────
const CurvedFlowSegment = ({ start, control, end, speed, color, isActive }) => {
  const curve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...control),
      new THREE.Vector3(...end)
    );
  }, [start, control, end]);

  const linePoints = useMemo(() => curve.getPoints(50), [curve]);
  const particleRef = useRef();

  useFrame((state) => {
    if (particleRef.current) {
      const elapsed = state.clock.getElapsedTime() * speed;
      const progress = elapsed % 1.0;
      const point = curve.getPointAt(progress);
      particleRef.current.position.copy(point);
    }
  });

  return (
    <group>
      {/* Path Line (Faint trace) */}
      <Line 
        points={linePoints} 
        color={color} 
        lineWidth={isActive ? 2.5 : 1.0} 
        transparent 
        opacity={isActive ? 0.8 : 0.25} 
      />
      {/* Flowing Pulse particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 1.0 : 0.3} />
      </mesh>
    </group>
  );
};

const CurvedDataFlows = ({ activeStep }) => {
  // Flow lines routing data between the 3 layers
  const curves = useMemo(() => [
    // Layer 3 (Integrations) to Central Core
    { start: [-0.5, -0.6, 0.4], control: [-0.9, -0.1, 0.1], end: [0, 0.2, 0], speed: 0.58, color: "#ffffff", stepIndex: 2 },
    { start: [0.5, -0.6, 0.4], control: [0.9, -0.1, 0.1], end: [0, 0.2, 0], speed: 0.65, color: "#ffffff", stepIndex: 2 },
    { start: [0.0, -0.7, -0.5], control: [0.1, -0.2, -0.8], end: [0, 0.2, 0], speed: 0.5, color: "#ffffff", stepIndex: 2 },
    
    // Scanner node loops to Core
    { start: [1.1, 0.2, 0.0], control: [0.7, 0.6, 0.5], end: [0, 0.2, 0], speed: 0.8, color: "#ffffff", stepIndex: 0 },
    { start: [-1.1, 0.2, 0.0], control: [-0.7, -0.2, -0.5], end: [0, 0.2, 0], speed: 0.72, color: "#ffffff", stepIndex: 0 },
  ], []);

  return (
    <group>
      {curves.map((curve, idx) => (
        <CurvedFlowSegment 
          key={idx}
          start={curve.start}
          control={curve.control}
          end={curve.end}
          speed={curve.speed}
          color={curve.color}
          isActive={activeStep === null || curve.stepIndex === activeStep}
        />
      ))}
    </group>
  );
};

// ─── Main Content Coordinates Wrapper ──────────────────────────────────────
const AgenticAIModelContent = ({ activeStep }) => {
  const groupRef = useRef();
  const { size } = useThree();

  const aspect = size.width / size.height;
  const isMobile = size.width < 1024;
  
  // Responsive alignment
  const groupX = isMobile ? 0 : 0.75 * aspect;
  const groupScale = isMobile ? 0.27 : 0.38;
  const groupY = isMobile ? -0.18 : -0.24;

  useFrame((state) => {
    if (groupRef.current) {
      // Ultra-slow smooth rotation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.016;
    }
  });

  return (
    <group ref={groupRef} scale={groupScale} position={[groupX, groupY, 0]}>
      {/* 4 Architectural layers aligned with left-side index cards */}
      <HolographicScanner isActive={activeStep === 0} />
      <NeuralNetworkCore isActive={activeStep === 1} />
      <MicrochipStack isActive={activeStep === 2} />
      <GeodesicShield isActive={activeStep === 3} />
      
      {/* Laser curved data flows */}
      <CurvedDataFlows activeStep={activeStep} />
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
        camera={{ position: [0, 0.1, 4.0], fov: 40 }}
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
          minPolarAngle={Math.PI / 2.3} 
          maxPolarAngle={Math.PI / 1.9}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};
