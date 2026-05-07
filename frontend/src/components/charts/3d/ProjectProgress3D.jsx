import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Cylinder Progress Bar Component
 * Used for visualizing project progress in 3D space
 */
const ProgressCylinder = ({ progress, color = '#0D8ABC', label }) => {
  const meshRef = useRef();
  const fillRef = useRef();

  // Gentle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const maxHeight = 3;
  const currentHeight = (progress / 100) * maxHeight;

  return (
    <group ref={meshRef}>
      {/* Background cylinder (empty state) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, maxHeight, 32]} />
        <meshStandardMaterial
          color="#E5E7EB"
          transparent
          opacity={0.2}
          roughness={0.4}
        />
      </mesh>

      {/* Filled progress cylinder */}
      <mesh
        ref={fillRef}
        position={[0, -maxHeight / 2 + currentHeight / 2, 0]}
      >
        <cylinderGeometry args={[0.5, 0.5, currentHeight, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Progress text */}
      <Text
        position={[0, maxHeight / 2 + 0.5, 0]}
        fontSize={0.4}
        color="#1F2937"
        anchorX="center"
        anchorY="middle"
      >
        {`${Math.round(progress)}%`}
      </Text>

      {/* Label */}
      {label && (
        <Text
          position={[0, -maxHeight / 2 - 0.5, 0]}
          fontSize={0.2}
          color="#6B7280"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {label}
        </Text>
      )}
    </group>
  );
};

/**
 * 3D Project Progress Visualization
 * Interactive 3D representation of project completion
 */
const ProjectProgress3D = ({ 
  progress = 65, 
  color = '#0D8ABC',
  label = 'Project Progress',
  height = 300 
}) => {
  return (
    <div style={{ width: '100%', height: `${height}px` }}>
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        <ProgressCylinder progress={progress} color={color} label={label} />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default ProjectProgress3D;
