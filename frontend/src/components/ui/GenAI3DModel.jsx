import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// ─── Obsidian Core Shader ───────────────────────────────────────────────────
const obsidianShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Fresnel effect for glossy obsidian rim
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      
      // Base dark glass color (deep purple/gray)
      vec3 baseColor = vec3(0.145, 0.388, 0.922);
      // Rim highlight color (cyan/electric blue)
      vec3 rimColor = vec3(1.0, 1.0, 1.0); // #ffffff
      
      vec3 finalColor = mix(baseColor, rimColor, fresnel * 0.8);
      
      gl_FragColor = vec4(finalColor, 0.95);
    }
  `
};

// ─── Central Neural Obsidian Core ────────────────────────────────────────────
const NeuralCore = () => {
  const pointsRef = useRef();
  const linesRef = useRef();
  const innerCoreRef = useRef();
  const outerGlassRef = useRef();
  
  // Create an organic cluster of points for the neural network
  const [nodes, connections] = useMemo(() => {
    const nodeArr = [];
    const count = 200; // denser network
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 0.6 + Math.random() * 0.6; 
      
      const x = radius * 1.3 * Math.sin(phi) * Math.cos(theta);
      const y = radius * 0.9 * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      nodeArr.push(new THREE.Vector3(x, y, z));
    }

    const connArr = [];
    for (let i = 0; i < count; i++) {
      let connectionsMade = 0;
      for (let j = i + 1; j < count; j++) {
        if (nodeArr[i].distanceTo(nodeArr[j]) < 0.4 && connectionsMade < 3) {
          connArr.push(nodeArr[i], nodeArr[j]);
          connectionsMade++;
        }
      }
    }
    
    return [nodeArr, connArr];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.1;
      pointsRef.current.rotation.z = Math.sin(t * 0.1) * 0.1;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = t * 0.1;
      linesRef.current.rotation.z = Math.sin(t * 0.1) * 0.1;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 0.4;
      innerCoreRef.current.rotation.x = t * 0.25;
    }
    if (outerGlassRef.current) {
      outerGlassRef.current.rotation.y = t * 0.15;
      outerGlassRef.current.rotation.z = -t * 0.15;
    }
  });

  return (
    <group>
      {/* Neural Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodes.length}
            array={new Float32Array(nodes.flatMap(v => [v.x, v.y, v.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.8} />
      </points>

      {/* Neural Synapses */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connections.length}
            array={new Float32Array(connections.flatMap(v => [v.x, v.y, v.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#60a5fa" transparent opacity={0.15} />
      </lineSegments>

      {/* Solid Obsidian Inner Core */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshPhysicalMaterial 
          color="#2563eb" 
          metalness={0.9} 
          roughness={0.1} 
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          emissive="#3b82f6"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Glossy Obsidian Outer Glass (Shattered look via wireframe/custom shader) */}
      <mesh ref={outerGlassRef}>
        <octahedronGeometry args={[0.65, 1]} />
        <shaderMaterial
          vertexShader={obsidianShader.vertexShader}
          fragmentShader={obsidianShader.fragmentShader}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          wireframe={true}
        />
      </mesh>
      
      {/* Floating Sparkles around the core */}
      <Sparkles count={80} scale={3} size={1.5} speed={0.3} opacity={0.6} color="#ffffff" />
      
      <Html position={[0, -1.4, 0]} center distanceFactor={8}>
        <div className="text-[6px] font-bold text-white tracking-[0.25em] uppercase select-none whitespace-nowrap bg-blue-600/80 backdrop-blur-sm px-2.5 py-1 rounded border border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Generative Core
        </div>
      </Html>
    </group>
  );
};

// ─── Active Connection Beam ──────────────────────────────────────────────────
const ConnectionBeam = ({ activePos }) => {
  if (!activePos) return null;
  return (
    <Line
      points={[[0, 0, 0], activePos]}
      color="#ffffff"
      lineWidth={4}
      transparent
      opacity={0.8}
      dashed
      dashSize={0.15}
      dashScale={1}
      dashOffset={0}
    />
  );
};

// ─── Orbiting Stage Node ─────────────────────────────────────────────────────
const StageNode = ({ index, total, label, isActive, color, dualLabels, setNodePos }) => {
  const groupRef = useRef();
  const innerRef = useRef();
  const ringRef = useRef();
  
  // Pre-calculate fixed orbit parameters
  const angle = (index / total) * Math.PI * 2;
  const radius = 2.6; // Slightly wider orbit for 6 items
  
  useFrame(({ clock }) => {
    // Slow orbit around the center
    const t = clock.getElapsedTime() * 0.04;
    const currentAngle = angle + t;
    
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(currentAngle) * radius;
      groupRef.current.position.z = Math.sin(currentAngle) * radius;
      // Smooth vertical bob
      groupRef.current.position.y = Math.sin(currentAngle * 2 + index) * 0.5;
      
      if (isActive && setNodePos) {
        setNodePos([groupRef.current.position.x, groupRef.current.position.y, groupRef.current.position.z]);
      }
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.x = t * 12;
      innerRef.current.rotation.y = t * 18;
    }
    
    if (ringRef.current && isActive) {
      ringRef.current.rotation.z = -t * 25;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Node Shape - Octahedron */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshBasicMaterial color={isActive ? '#ffffff' : color} wireframe={!isActive} />
      </mesh>
      
      {/* Solid inner core for nodes */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={isActive ? '#ffffff' : '#60a5fa'} transparent opacity={0.9} />
      </mesh>

      {/* Active Glowing Rings */}
      {isActive && (
        <group ref={ringRef}>
          <mesh rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[0.28, 0.015, 16, 64]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
          </mesh>
          <mesh rotation={[0, Math.PI/2, 0]}>
            <torusGeometry args={[0.38, 0.008, 16, 64]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
          </mesh>
        </group>
      )}

      {/* Orbit Trail */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.01, radius + 0.01, 128]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Particles following the active node */}
      {isActive && (
        <Sparkles count={25} scale={1.2} size={1.2} speed={0.8} opacity={0.8} color="#ffffff" />
      )}

      {/* Label HTML */}
      <Html position={[0, 0.5, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
        <div className={`transition-all duration-300 flex flex-col items-center gap-1 select-none ${isActive ? 'scale-110 opacity-100' : 'scale-90 opacity-40 hover:opacity-70'}`}>
          <div className={`text-[7px] font-bold tracking-[0.15em] px-2.5 py-1 rounded border whitespace-nowrap bg-black/80 backdrop-blur-md ${
            isActive ? 'text-white border-white shadow-[0_0_20px_rgba(255,255,255,0.5)]' : 'text-white border-white/40'
          }`}>
            {label}
          </div>
          {isActive && dualLabels && (
            <div className="flex gap-2 text-[6px] font-bold tracking-widest bg-black/50 px-1.5 py-0.5 rounded-sm border border-white/40 backdrop-blur-sm">
              <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">MANAGED</span>
              <span className="text-white/30">|</span>
              <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">SELF-HOSTED</span>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

// ─── Inner Data Rings (Core Subcomponents) ───────────────────────────────────
const InnerDataRings = () => {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.4;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.3;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.2;
  });

  return (
    <group>
      {/* Ring 1 - Context */}
      <group rotation={[Math.PI / 3, 0, 0]}>
        <mesh ref={ring1Ref}>
          <ringGeometry args={[1.1, 1.11, 64]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} side={THREE.DoubleSide} />
          <mesh position={[1.105, 0, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </mesh>
        <Html position={[1.1, 0, 0]} center distanceFactor={8}>
           <div className="text-[5px] font-bold text-white tracking-widest bg-blue-500/80 px-1 py-0.5 rounded border border-white/50 backdrop-blur-sm">CONTEXT</div>
        </Html>
      </group>

      {/* Ring 2 - Grounding */}
      <group rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <mesh ref={ring2Ref}>
          <ringGeometry args={[1.3, 1.31, 64]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} side={THREE.DoubleSide} />
          <mesh position={[0, 1.305, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#60a5fa" />
          </mesh>
        </mesh>
        <Html position={[0, 1.3, 0]} center distanceFactor={8}>
           <div className="text-[5px] font-bold text-white tracking-widest bg-blue-500/80 px-1 py-0.5 rounded border border-white/50 backdrop-blur-sm">GROUNDING</div>
        </Html>
      </group>

      {/* Ring 3 - Guardrails */}
      <group rotation={[0, Math.PI / 2, Math.PI / 6]}>
        <mesh ref={ring3Ref}>
          <ringGeometry args={[1.5, 1.51, 64]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} side={THREE.DoubleSide} />
          <mesh position={[-1.505, 0, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </mesh>
        <Html position={[-1.5, 0, 0]} center distanceFactor={8}>
           <div className="text-[5px] font-bold text-white tracking-widest bg-blue-500/80 px-1 py-0.5 rounded border border-white/50 backdrop-blur-sm">GUARDRAILS</div>
        </Html>
      </group>
    </group>
  );
};

// ─── Main Scene Component ────────────────────────────────────────────────────
export const GenAI3DModel = ({ activeStep = null }) => {
  const [activeNodePos, setActiveNodePos] = React.useState(null);

  // The 6 layers for GenAI toolchain
  const stages = [
    { label: "01 FOUNDATION", color: "#ffffff" },
    { label: "02 RETRIEVAL", color: "#ffffff" },
    { label: "03 ORCHESTRATE", color: "#ffffff" },
    { label: "04 GUARDRAILS",  color: "#ffffff" },
    { label: "05 EVALUATION",  color: "#ffffff" },
    { label: "06 TUNING",  color: "#ffffff" },
  ];

  return (
    <div className="w-full h-[500px] lg:h-[600px] relative pointer-events-auto cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 3.5, 8], fov: 45 }} dpr={[1, 2]}>
        {/* Environment Lights suitable for dark Obsidian theme */}
        <ambientLight intensity={0.4} color="#2563eb" />
        <pointLight position={[10, 10, 10]} intensity={2.0} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#60a5fa" />
        <spotLight position={[0, 5, 0]} intensity={1.5} color="#ffffff" penumbra={1} />

        <group>
          {/* Central Neural Obsidian Core */}
          <NeuralCore />
          <InnerDataRings />

          {/* Active Data Beam */}
          {activeStep !== null && <ConnectionBeam activePos={activeNodePos} />}

          {/* Orbiting Stages */}
          <group rotation={[Math.PI * 0.15, 0, 0]}>
            {stages.map((stage, i) => (
              <StageNode 
                key={stage.label}
                index={i}
                total={stages.length}
                label={stage.label}
                color={stage.color}
                isActive={activeStep === null ? false : activeStep === i}
                dualLabels={true}
                setNodePos={activeStep === i ? setActiveNodePos : undefined}
              />
            ))}
          </group>
        </group>

        {/* Controls */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate={activeStep === null}
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      
      {/* Decorative gradient vignette for depth */}
      <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
    </div>
  );
};
