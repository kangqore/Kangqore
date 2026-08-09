import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

// ─── Cerebrum Hemisphere Lobe ────────────────────────────────────────────────
const CerebrumHemisphere = ({ isLeft }) => {
  const geom = useMemo(() => {
    const g = new THREE.SphereGeometry(1.0, 48, 48);
    const pos = g.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      
      // Shape into a realistic cerebrum hemisphere (narrower X, elongated Z)
      x *= 0.65;
      y *= 0.85;
      z *= 1.25;
      
      // Frontal lobe slope (narrower & curved downwards at front)
      if (z > 0) {
        x *= 0.85;
        y *= (1 - (z / 1.25) * 0.18);
      }
      
      // Temporal lobe sweep (downwards & forward middle bulge)
      if (y < 0 && z > -0.2 && z < 0.4) {
        y -= 0.18;
        x *= 1.05;
      }
      
      // Occipital lobe definition (rear curves)
      if (z < 0) {
        x *= 1.05;
      }

      // Sculpt detailed gyri/sulci wrinkles (organic folds)
      const norm = new THREE.Vector3(x, y, z).normalize();
      const wrinkle = 0.11 * (
        Math.sin(x * 9) * Math.cos(y * 9) + 
        Math.sin(z * 9) * Math.cos(x * 9)
      );
      
      x += norm.x * wrinkle;
      y += norm.y * wrinkle;
      z += norm.z * wrinkle;

      pos.setXYZ(i, x, y, z);
    }
    
    g.computeVertexNormals();
    return g;
  }, []);

  const xOffset = isLeft ? -0.42 : 0.42;

  return (
    <group position={[xOffset, 0.22, 0]}>
      {/* Solid bright white glass lobe - highly transparent */}
      <mesh geometry={geom}>
        <meshPhysicalMaterial 
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.15}
          roughness={0.06}
          transmission={0.94}
          thickness={0.2}
          transparent
          opacity={0.12}
          depthWrite={false}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
        />
      </mesh>
      
      {/* White outline wireframe overlay */}
      <mesh geometry={geom}>
        <meshBasicMaterial 
          color="#ffffff" 
          wireframe 
          transparent 
          opacity={0.28} 
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

// ─── Cerebellum (Rear-Bottom Bulge with Horizontal Ridges) ────────────────────
const Cerebellum = () => {
  const geom = useMemo(() => {
    const g = new THREE.SphereGeometry(0.55, 32, 32);
    const pos = g.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      
      // Shape cerebellum (flat and wide)
      x *= 0.95;
      y *= 0.55;
      z *= 0.72;
      
      // Apply cerebellum's characteristic tight horizontal fold lines
      const norm = new THREE.Vector3(x, y, z).normalize();
      const wrinkle = 0.03 * Math.sin(y * 32); // Tight horizontal ridges
      
      x += norm.x * wrinkle;
      y += norm.y * wrinkle;
      z += norm.z * wrinkle;
      
      pos.setXYZ(i, x, y, z);
    }
    
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group position={[0, -0.42, -0.65]}>
      <mesh geometry={geom}>
        <meshPhysicalMaterial 
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.15}
          roughness={0.06}
          transmission={0.9}
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={geom}>
        <meshBasicMaterial 
          color="#ffffff" 
          wireframe 
          transparent 
          opacity={0.22} 
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

// ─── Brainstem (Base Cylinder) ────────────────────────────────────────────────
const Brainstem = () => {
  return (
    <group position={[0, -0.85, -0.15]}>
      <mesh>
        <cylinderGeometry args={[0.2, 0.16, 0.7, 16]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.1}
          roughness={0.1}
          transmission={0.9}
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.205, 0.165, 0.7, 16]} />
        <meshBasicMaterial 
          color="#ffffff" 
          wireframe 
          transparent 
          opacity={0.18} 
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

// ─── Main Integrated Solid Brain Shell ────────────────────────────────────────
const SolidBrainShell = () => {
  return (
    <group>
      <CerebrumHemisphere isLeft={true} />
      <CerebrumHemisphere isLeft={false} />
      <Cerebellum />
      <Brainstem />
    </group>
  );
};

// ─── Legacy Estate (Deep Indigo Blue - Top Layer) ─────────────────────────────
const LegacyEstate = () => {
  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 9; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 1.5,
          0.7 + (Math.random() - 0.5) * 0.35,
          -0.55 + (Math.random() - 0.5) * 0.4
        ],
        size: 0.085 + Math.random() * 0.04
      });
    }
    return arr;
  }, []);

  const lines = useMemo(() => {
    const arr = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const p1 = new THREE.Vector3(...nodes[i].position);
        const p2 = new THREE.Vector3(...nodes[j].position);
        if (p1.distanceTo(p2) < 1.1) {
          arr.push([nodes[i].position, nodes[j].position]);
        }
      }
    }
    return arr;
  }, [nodes]);

  return (
    <group>
      {/* Label for Legacy System */}
      <Html position={[0, 0.76, 0]} center distanceFactor={8}>
        <div 
          className="text-center font-extrabold tracking-widest text-[11px] text-[#ef4444] bg-[#0f172a]/95 border border-[#ef4444]/45 px-2 py-0.5 rounded uppercase select-none shadow-[0_0_8px_rgba(239,68,68,0.4)]"
          style={{ 
            fontFamily: 'Inter, sans-serif',
            transform: 'scale(0.38)', 
            transformOrigin: 'center',
            width: '92px'
          }}
        >
          LEGACY SYSTEM
        </div>
      </Html>

      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[node.size, 32, 32]} />
          <meshStandardMaterial 
            color="#2563eb" 
            emissive="#1e3a8a"
            emissiveIntensity={0.6}
            roughness={0.2} 
            metalness={0.8} 
          />
        </mesh>
      ))}
      {lines.map((line, i) => (
        <Line 
          key={i} 
          points={[line[0], line[1]]} 
          color="#3b82f6" 
          opacity={0.35} 
          transparent 
          lineWidth={1.0} 
        />
      ))}
    </group>
  );
};

// ─── Agent Runtime (Floating Royal Blue Pods with Modernization Rules) ────────
const AgentRuntime = ({ activeStep, setActiveStep }) => {
  const steps = useMemo(() => [
    {
      title: "PIN BEHAVIOR",
      stage: "STAGE 01",
      desc: "Behavior is pinned before anything moves"
    },
    {
      title: "COMPILE GRAPH",
      stage: "STAGE 02",
      desc: "Target state compiles to a work graph"
    },
    {
      title: "CUT SEAMS",
      stage: "STAGE 03",
      desc: "Rules recovered, then seams cut"
    },
    {
      title: "STRANGLER FACADE",
      stage: "STAGE 04",
      desc: "Strangler-fig rollout behind a facade"
    },
    {
      title: "GATED ROLLOUT",
      stage: "STAGE 05",
      desc: "Gated, reversible, and cumulative"
    }
  ], []);

  return (
    <group position={[0, -0.05, 0]}>
      {steps.map((step, i) => {
        const xPos = -1.0 + i * 0.5;
        const isHovered = activeStep === i;
        const labelY = i % 2 === 0 ? 0.35 : 0.20;
        
        return (
          <group 
            key={step.title} 
            position={[xPos, 0, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setActiveStep(i);
            }}
            onPointerOut={() => setActiveStep(null)}
          >
            {/* Core 3D Sphere Node (Replaced flat circles) */}
            <mesh>
              <sphereGeometry args={[0.088, 32, 32]} />
              <meshStandardMaterial 
                color={isHovered ? "#60a5fa" : "#3b82f6"} 
                emissive={isHovered ? "#93c5fd" : "#1d4ed8"} 
                emissiveIntensity={isHovered ? 2.5 : 0.8}
                roughness={0.08}
                metalness={0.88}
              />
            </mesh>
            
            {/* Outer wireframe sphere */}
            <mesh>
              <sphereGeometry args={[0.106, 16, 16]} />
              <meshBasicMaterial 
                color={isHovered ? "#93c5fd" : "#60a5fa"}
                wireframe
                transparent
                opacity={isHovered ? 0.45 : 0.22}
              />
            </mesh>

            {/* Labeled HTML Stage Card */}
            <Html 
              position={[0, labelY, 0]} 
              center 
              distanceFactor={8}
            >
              <div 
                className={`flex flex-col text-center transition-all duration-300 rounded border select-none ${
                  isHovered 
                    ? 'bg-blue-600 border-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' 
                    : 'bg-[#0f172a]/95 border-white/10'
                }`}
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  padding: '3px 5px',
                  borderWidth: '0.5px',
                  width: '78px',
                  transform: 'scale(0.38)', 
                  transformOrigin: 'center'
                }}
              >
                <div 
                  className="text-center font-bold tracking-widest text-[11px] text-cyan-400 mb-0.5 select-none"
                >
                  {step.stage}
                </div>
                <div 
                  className={`font-black tracking-widest text-[11px] leading-tight ${
                    isHovered ? 'text-white' : 'text-slate-200'
                  }`}
                >
                  {step.title}
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

// ─── Cloud-Native Services (Bright Royal Blue Cubes - Bottom Layer) ──────────────
const CloudNativeServices = () => {
  const cubes = useMemo(() => {
    const list = [];
    for (let x = -1.0; x <= 1.0; x += 0.65) {
      for (let z = -0.25; z <= 0.25; z += 0.5) {
        list.push([x, 0, z]);
      }
    }
    return list;
  }, []);

  return (
    <group position={[0, -0.85, 0]}>
      {/* Label for Cloud Native Core Target State (Blue theme) */}
      <Html position={[0, -0.32, 0]} center distanceFactor={8}>
        <div 
          className="text-center font-extrabold tracking-widest text-[11px] text-[#60a5fa] bg-[#0f172a]/95 border border-[#60a5fa]/45 px-2 py-0.5 rounded uppercase select-none shadow-[0_0_8px_rgba(96,165,250,0.4)]"
          style={{ 
            fontFamily: 'Inter, sans-serif',
            transform: 'scale(0.38)', 
            transformOrigin: 'center',
            width: '105px'
          }}
        >
          CLOUD NATIVE CORE
        </div>
      </Html>
      {cubes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshPhysicalMaterial 
            color="#3b82f6" 
            roughness={0.05} 
            metalness={0.15}
            transmission={0.88}
            thickness={0.4}
            transparent
            opacity={0.85}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
          />
          <mesh>
            <boxGeometry args={[0.07, 0.07, 0.07]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.65} />
          </mesh>
        </mesh>
      ))}
    </group>
  );
};

// ─── Data Flow Paths (Blue Gradient Flows - 5 Coordinates) ────────────────────
const FlowingParticle = ({ start, end, speed, color, isActive }) => {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      const t = (state.clock.getElapsedTime() * speed) % 1.0;
      ref.current.position.copy(start).lerp(end, t);
    }
  });

  return (
    <>
      <Line 
        points={[start, end]} 
        color={color} 
        opacity={isActive ? 0.22 : 0.06} 
        transparent 
        lineWidth={0.5} 
      />
      <mesh ref={ref}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 0.98 : 0.2} />
      </mesh>
    </>
  );
};

const DataFlows = ({ activeStep }) => {
  const podsX = [-1.0, -0.5, 0.0, 0.5, 1.0];

  const flows = useMemo(() => {
    const list = [];
    
    // Top to Middle (Deep Blue to Royal Blue Flow)
    podsX.forEach((x, index) => {
      list.push({
        start: new THREE.Vector3(x * 0.7, 0.7, index % 2 === 0 ? 0.25 : -0.25),
        end: new THREE.Vector3(x, 0.0, 0),
        speed: 0.5 + Math.random() * 0.25,
        color: "#2563eb", 
        stepIndex: index
      });
    });

    // Middle to Bottom (Royal Blue to Bright Sky Blue Flow)
    podsX.forEach((x, index) => {
      list.push({
        start: new THREE.Vector3(x, -0.05, 0),
        end: new THREE.Vector3(x * 0.8, -0.85, index % 2 === 0 ? 0.25 : -0.25),
        speed: 0.5 + Math.random() * 0.25,
        color: "#60a5fa", 
        stepIndex: index
      });
    });

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
const ModernizationModelContent = ({ activeStep, setActiveStep }) => {
  const groupRef = useRef();
  const { size } = useThree();

  const aspect = size.width / size.height;
  const isMobile = size.width < 1024;
  
  // Mathematically derived offsets to center the brain inside the right 52% column
  const groupX = isMobile ? 0 : 0.75 * aspect;
  const groupScale = isMobile ? 0.40 : 0.585; // Reduced by 10% (0.65 * 0.9 = 0.585)
  const groupY = isMobile ? -0.05 : -0.15;    // Shifted downward

  useFrame((state) => {
    if (groupRef.current) {
      // Steady continuous rotation on Y axis (0.032 speed - accelerated 2x)
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.032;
    }
  });

  return (
    <group ref={groupRef} scale={groupScale} position={[groupX, groupY, 0]}>
      <SolidBrainShell />
      
      <group position={[0, 0.15, 0]}>
        <LegacyEstate />
        <AgentRuntime activeStep={activeStep} setActiveStep={setActiveStep} />
        <CloudNativeServices />
        <DataFlows activeStep={activeStep} />
      </group>
    </group>
  );
};

// ─── Static fallback ─────────────────────────────────────────────────────────
// Shown instead of the WebGL canvas when the visitor has asked for reduced
// motion or the browser cannot give us a 3D context. Same meaning as the model,
// in a form that is static, accessible and ~10 KB. Initialized true so a
// server/prerender pass and the first paint both get real markup rather than an
// empty <canvas>; the effect downgrades to the canvas only once we know it is
// safe to animate.
const STATIC_FALLBACK_SRC = '/images/capabilities/agentic-modernization-stack.svg';
const STATIC_FALLBACK_ALT =
  'Agentic modernization pipeline: a tangled legacy estate is scanned by a runtime of six agents — scan, map, plan, refactor, verify and gate — and emerges as discrete, API-connected cloud-native services.';

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
export const AgenticModernization3DModel = ({ activeStep: propActiveStep }) => {
  const [localActiveStep, setLocalActiveStep] = useState(null);
  const activeStep = propActiveStep !== undefined && propActiveStep !== null ? propActiveStep : localActiveStep;
  const setActiveStep = propActiveStep !== undefined && propActiveStep !== null ? () => {} : setLocalActiveStep;
  const staticOnly = useStaticOnly();

  if (staticOnly) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-transparent">
        <img
          src={STATIC_FALLBACK_SRC}
          alt={STATIC_FALLBACK_ALT}
          loading="lazy"
          decoding="async"
          className="w-full h-auto max-w-lg object-contain"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] relative overflow-hidden bg-transparent">
      <Canvas 
        camera={{ position: [0, 0.15, 4.3], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.4} />
        <pointLight position={[6, 6, 6]} intensity={1.8} />
        <directionalLight position={[-3, 5, -3]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[3, -3, 3]} intensity={1.0} color="#ffffff" />
        
        <ModernizationModelContent 
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 1.95}
          autoRotate={false}
          autoRotateSpeed={0.15}
        />
      </Canvas>
    </div>
  );
};
