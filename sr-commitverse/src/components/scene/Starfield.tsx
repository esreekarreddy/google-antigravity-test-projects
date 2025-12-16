'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function StarfieldPoints() {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Distribute stars in a sphere
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Mix of cyan, white, and subtle magenta
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        // White/blue stars
        colors[i * 3] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.9) {
        // Cyan accent
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 1;
      } else {
        // Magenta accent
        colors[i * 3] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      }
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      // Slow rotation
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.5}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Floating orbs that look like distant galaxies
function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  
  const orbs = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20,
        -20 - Math.random() * 30,
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 1.5,
      color: i % 2 === 0 ? '#00ffff' : '#ff00ff',
      speed: 0.5 + Math.random() * 0.5,
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const orb = orbs[i];
        child.position.y += Math.sin(state.clock.elapsedTime * orb.speed + i) * 0.002;
        child.position.x += Math.cos(state.clock.elapsedTime * orb.speed * 0.5 + i) * 0.001;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[orb.scale, 16, 16]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Starfield() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <StarfieldPoints />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}
