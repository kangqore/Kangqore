import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Radar Chart Component
 * Rotating 3D version of performance radar
 */
const RadarMesh = ({ data, autoRotate = true }) => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  const points = data.map((item, i) => {
    const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
    const radius = item.value / 100 * 2;
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );
  });

  // Add first point again to close the shape
  points.push(points[0]);

  return (
    <group ref={groupRef}>
      {/* Grid lines */}
      {[0.5, 1, 1.5, 2].map((radius, i) => {
        const gridPoints = [];
        for (let j = 0; j <= data.length; j++) {
          const angle = (Math.PI * 2 * j) / data.length - Math.PI / 2;
          gridPoints.push(
            new THREE.Vector3(
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius
            )
          );
        }
        return (
          <Line
            key={`grid-${i}`}
            points={gridPoints}
            color="#D1D5DB"
            lineWidth={1}
          />
        );
      })}

      {/* Axis lines */}
      {data.map((item, i) => {
        const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
        return (
          <Line
            key={`axis-${i}`}
            points={[
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(Math.cos(angle) * 2, 0, Math.sin(angle) * 2),
            ]}
            color="#E5E7EB"
            lineWidth={1}
          />
        );
      })}

      {/* Data line */}
      <Line
        points={points}
        color="#0D8ABC"
        lineWidth={3}
      />

      {/* Data points */}
      {data.map((item, i) => {
        const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
        const radius = item.value / 100 * 2;
        return (
          <Sphere
            key={`point-${i}`}
            args={[0.08, 16, 16]}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
          >
            <meshStandardMaterial color="#0D8ABC" emissive="#0D8ABC" emissiveIntensity={0.5} />
          </Sphere>
        );
      })}

      {/* Labels */}
      {data.map((item, i) => {
        const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
        const labelRadius = 2.5;
        return (
          <Text
            key={`label-${i}`}
            position={[Math.cos(angle) * labelRadius, 0, Math.sin(angle) * labelRadius]}
            fontSize={0.2}
            color="#374151"
            anchorX="center"
            anchorY="middle"
          >
            {item.label}
          </Text>
        );
      })}
    </group>
  );
};

/**
 * 3D Radar Chart Visualization
 * Interactive rotating performance radar
 */
const RadarChart3D = ({ 
  data = [
    { label: 'Quality', value: 85 },
    { label: 'Speed', value: 70 },
    { label: 'Reliability', value: 90 },
    { label: 'Security', value: 95 },
    { label: 'Innovation', value: 75 },
  ],
  autoRotate = true,
  height = 400 
}) => {
  return (
    <div style={{ width: '100%', height: `${height}px` }}>
      <Canvas camera={{ position: [0, 4, 4], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        
        <RadarMesh data={data} autoRotate={autoRotate} />
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
        />
      </Canvas>
    </div>
  );
};

export default RadarChart3D;
