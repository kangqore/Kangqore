import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// ─── Glowing Shader for Nodes ────────────────────────────────────────────────
const glowShader = {
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    uniform vec3 uColor;
    uniform float uIntensity;
    void main() {
      float glow = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      gl_FragColor = vec4(uColor, glow * uIntensity);
    }
  `
};

// ─── Gradient Shader for Stage Cores ─────────────────────────────────────────
const gradientShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    void main() {
      vec3 colorBottom = vec3(0.145, 0.388, 0.922); // #2563eb
      vec3 colorTop = vec3(0.376, 0.647, 0.980);    // #60a5fa
      gl_FragColor = vec4(mix(colorBottom, colorTop, vUv.y), 0.9);
    }
  `
};

// ─── Central Neural Brain ────────────────────────────────────────────────────
const NeuralBrain = () => {
  const pointsRef = useRef();
  const linesRef = useRef();
  const innerCoreRef = useRef();
  const outerCoreRef = useRef();
  
  // Create an organic cluster of points
  const [nodes, connections] = useMemo(() => {
    const nodeArr = [];
    const count = 150;
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 0.5 + Math.random() * 0.4; // slightly larger scatter
      
      const x = radius * 1.2 * Math.sin(phi) * Math.cos(theta);
      const y = radius * 0.8 * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      nodeArr.push(new THREE.Vector3(x, y, z));
    }

    const connArr = [];
    for (let i = 0; i < count; i++) {
      let connectionsMade = 0;
      for (let j = i + 1; j < count; j++) {
        if (nodeArr[i].distanceTo(nodeArr[j]) < 0.35 && connectionsMade < 4) {
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
      pointsRef.current.rotation.y = t * 0.15;
      pointsRef.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = t * 0.15;
      linesRef.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 0.5;
      innerCoreRef.current.rotation.x = t * 0.3;
    }
    if (outerCoreRef.current) {
      outerCoreRef.current.rotation.y = t * 0.2;
      outerCoreRef.current.rotation.z = -t * 0.1;
      const scale = 1 + Math.sin(t * 2) * 0.05;
      outerCoreRef.current.scale.set(scale, scale, scale);
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
        <pointsMaterial size={0.035} color="#60a5fa" transparent opacity={0.9} />
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
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.25} />
      </lineSegments>

      {/* Advanced Inner Core (Icosahedron) */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Pulsing Outer Core Glow */}
      <mesh ref={outerCoreRef}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <shaderMaterial
          vertexShader={glowShader.vertexShader}
          fragmentShader={glowShader.fragmentShader}
          uniforms={{
            uColor: { value: new THREE.Color('#2563eb') },
            uIntensity: { value: 1.2 }
          }}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Floating Sparkles around the core */}
      <Sparkles count={50} scale={2.5} size={2} speed={0.4} opacity={0.5} color="#ffffff" />
      
      <Html position={[0, -1.2, 0]} center distanceFactor={8}>
        <div className="text-[6px] font-bold text-black tracking-[0.2em] uppercase select-none whitespace-nowrap bg-white px-2 py-1 rounded border border-white shadow-[0_0_15px_rgba(255,255,255,0.6)]">
          MLOps Platform Core
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
      color="#22d3ee"
      lineWidth={3}
      transparent
      opacity={0.6}
      dashed
      dashSize={0.2}
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
  const radius = 2.4; // Slightly wider orbit
  
  useFrame(({ clock }) => {
    // Slow orbit around the center
    const t = clock.getElapsedTime() * 0.05;
    const currentAngle = angle + t;
    
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(currentAngle) * radius;
      groupRef.current.position.z = Math.sin(currentAngle) * radius;
      // More pronounced vertical bob
      groupRef.current.position.y = Math.sin(currentAngle * 3 + index) * 0.4;
      
      if (isActive && setNodePos) {
        setNodePos([groupRef.current.position.x, groupRef.current.position.y, groupRef.current.position.z]);
      }
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.x = t * 10;
      innerRef.current.rotation.y = t * 15;
    }
    
    if (ringRef.current && isActive) {
      ringRef.current.rotation.z = -t * 20;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Node Shape - Advanced Icosahedron */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.18, 0]} />
        <meshBasicMaterial color={isActive ? '#ffffff' : color} wireframe={!isActive} />
      </mesh>
      
      {/* Solid inner core */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <shaderMaterial 
          vertexShader={gradientShader.vertexShader}
          fragmentShader={gradientShader.fragmentShader}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Active Glowing Rings */}
      {isActive && (
        <group ref={ringRef}>
          <mesh rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[0.3, 0.015, 16, 64]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.9} />
          </mesh>
          <mesh rotation={[0, Math.PI/2, 0]}>
            <torusGeometry args={[0.4, 0.008, 16, 64]} />
            <meshBasicMaterial color="#818cf8" transparent opacity={0.5} />
          </mesh>
        </group>
      )}

      {/* Orbit Trail */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.01, radius + 0.01, 128]} />
        <meshBasicMaterial color="#1e3a8a" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Particles following the node */}
      {isActive && (
        <Sparkles count={20} scale={1} size={1.5} speed={0.8} opacity={0.8} color="#ffffff" />
      )}

      {/* Label HTML */}
      <Html position={[0, 0.5, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
        <div className={`transition-all duration-300 flex flex-col items-center gap-1 select-none ${isActive ? 'scale-110 opacity-100' : 'scale-90 opacity-40 hover:opacity-70'}`}>
          <div className={`text-[7px] font-bold tracking-[0.15em] px-2 py-1 rounded border whitespace-nowrap bg-black/80 backdrop-blur-md ${
            isActive ? 'text-white border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'text-slate-300 border-white/10'
          }`}>
            {label}
          </div>
          {isActive && dualLabels && (
            <div className="flex gap-2 text-[6px] font-bold tracking-widest bg-black/40 px-1.5 py-0.5 rounded-sm border border-white/5 backdrop-blur-sm">
              <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">MANAGED</span>
              <span className="text-white/30">|</span>
              <span className="text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.8)]">SELF-HOSTED</span>
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
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.5;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.4;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.3;
  });

  return (
    <group>
      {/* Ring 1 - Compute */}
      <group rotation={[Math.PI / 3, 0, 0]}>
        <mesh ref={ring1Ref}>
          <ringGeometry args={[1.0, 1.01, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
          {/* Data packet */}
          <mesh position={[1.005, 0, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </mesh>
        <Html position={[1.0, 0, 0]} center distanceFactor={8}>
           <div className="text-[5px] font-bold text-white tracking-widest bg-blue-600/60 px-1 py-0.5 rounded border border-blue-400/50 backdrop-blur-sm">COMPUTE</div>
        </Html>
      </group>

      {/* Ring 2 - Storage */}
      <group rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <mesh ref={ring2Ref}>
          <ringGeometry args={[1.2, 1.21, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
          <mesh position={[0, 1.205, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </mesh>
        <Html position={[0, 1.2, 0]} center distanceFactor={8}>
           <div className="text-[5px] font-bold text-white tracking-widest bg-blue-600/60 px-1 py-0.5 rounded border border-blue-400/50 backdrop-blur-sm">STORAGE</div>
        </Html>
      </group>

      {/* Ring 3 - Security */}
      <group rotation={[0, Math.PI / 2, Math.PI / 6]}>
        <mesh ref={ring3Ref}>
          <ringGeometry args={[1.4, 1.41, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
          <mesh position={[-1.405, 0, 0]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </mesh>
        <Html position={[-1.4, 0, 0]} center distanceFactor={8}>
           <div className="text-[5px] font-bold text-white tracking-widest bg-blue-600/60 px-1 py-0.5 rounded border border-blue-400/50 backdrop-blur-sm">SECURITY</div>
        </Html>
      </group>
    </group>
  );
};

// ─── Main Scene Component ────────────────────────────────────────────────────
export const MLOps3DModel = ({ activeStep = null }) => {
  const [activeNodePos, setActiveNodePos] = React.useState(null);

  const stages = [
    { label: "01 PIPELINE", color: "#ffffff" },
    { label: "02 REGISTRY", color: "#ffffff" },
    { label: "03 FEATURES", color: "#ffffff" },
    { label: "04 SERVING",  color: "#ffffff" },
    { label: "05 MONITOR",  color: "#ffffff" },
  ];

  return (
    <div className="w-full h-[500px] lg:h-[600px] relative pointer-events-auto cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 3, 7], fov: 45 }} dpr={[1, 2]}>
        {/* Environment Lights */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#818cf8" />
        <spotLight position={[0, 5, 0]} intensity={2} color="#ffffff" penumbra={1} />

        <group>
          {/* Central Brain */}
          <NeuralBrain />
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
      
      {/* Decorative gradient vignette */}
      <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_120px_rgba(0,0,0,0.8)]" />
    </div>
  );
};
