'use client';

import { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { CommitNode, useRepoStore } from '@/store/repoStore';

// Vibrant color palette for commits
const VIBRANT_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f97316', // Orange
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#84cc16', // Lime
];

function getVibrantColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return VIBRANT_COLORS[Math.abs(hash) % VIBRANT_COLORS.length];
}

interface CommitSphereProps {
  node: CommitNode;
  isSelected: boolean;
  isFiltered: boolean;
  onClick: () => void;
}

function CommitSphere({ node, isSelected, isFiltered, onClick }: CommitSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Simplified: single sphere, no double glow
  const baseScale = isSelected ? 0.45 : hovered ? 0.35 : 0.28;
  const opacity = isFiltered ? 0.2 : 1;
  const color = getVibrantColor(node.commit.author.name);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Only scale animation, no position animation
      // This keeps lines connected to nodes
      if (isSelected) {
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.06 + 1;
        meshRef.current.scale.setScalar(baseScale * pulse);
      } else if (hovered) {
        // Subtle hover scale
        const hover = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 1;
        meshRef.current.scale.setScalar(baseScale * hover);
      } else {
        meshRef.current.scale.setScalar(baseScale);
      }
    }
  });

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick();
  }, [onClick]);

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  return (
    <group position={[node.position.x, node.position.y, node.position.z]}>
      {/* Single commit sphere - no outer glow circle */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.6 : hovered ? 0.4 : 0.2}
          transparent
          opacity={opacity}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
      
      {/* Tooltip on hover */}
      {hovered && (
        <Html position={[0, 0.8, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-xs max-w-[220px]">
            <p className="text-indigo-600 font-mono font-semibold">{node.commit.sha.slice(0, 7)}</p>
            <p className="text-gray-700 truncate">{node.commit.message.split('\n')[0]}</p>
            <p className="text-gray-500 text-[10px] mt-1">{node.commit.author.name}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function CommitConnections({ nodes }: { nodes: CommitNode[] }) {
  const lines = useMemo(() => {
    const connections: { start: [number, number, number]; end: [number, number, number]; color: string }[] = [];
    
    const shaToNode = new Map<string, CommitNode>();
    nodes.forEach(n => shaToNode.set(n.commit.sha, n));
    
    nodes.forEach(node => {
      node.commit.parents.forEach(parent => {
        const parentNode = shaToNode.get(parent.sha);
        if (parentNode) {
          connections.push({
            start: [node.position.x, node.position.y, node.position.z],
            end: [parentNode.position.x, parentNode.position.y, parentNode.position.z],
            color: getVibrantColor(node.commit.author.name),
          });
        }
      });
    });
    
    return connections;
  }, [nodes]);

  return (
    <>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={[line.start, line.end]}
          color={line.color}
          lineWidth={1.5}
          transparent
          opacity={0.4}
        />
      ))}
    </>
  );
}

function Background() {
  const { gl } = useThree();
  
  useMemo(() => {
    // Slightly darker light background for better contrast
    gl.setClearColor('#f1f5f9', 1);
  }, [gl]);
  
  return null;
}

interface CommitGalaxySceneProps {
  nodes: CommitNode[];
  selectedCommit: string | null;
  filteredAuthors: Set<string>;
  onSelectCommit: (sha: string) => void;
}

function CommitGalaxyScene({ nodes, selectedCommit, filteredAuthors, onSelectCommit }: CommitGalaxySceneProps) {
  return (
    <>
      <Background />
      
      {/* Lighting */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.4} color="#e0e7ff" />
      
      {/* Camera Controls */}
      <PerspectiveCamera makeDefault position={[0, 8, 25]} fov={50} />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={80}
        dampingFactor={0.08}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        enableDamping
      />
      
      {/* Commit nodes */}
      {nodes.map(node => {
        const isFiltered = filteredAuthors.size > 0 && !filteredAuthors.has(node.commit.author.name);
        return (
          <CommitSphere
            key={node.commit.sha}
            node={node}
            isSelected={selectedCommit === node.commit.sha}
            isFiltered={isFiltered}
            onClick={() => onSelectCommit(node.commit.sha)}
          />
        );
      })}
      
      {/* Connections */}
      <CommitConnections nodes={nodes} />
    </>
  );
}

interface CommitGalaxyProps {
  className?: string;
  filteredNodes?: { commit: { sha: string } }[];
}

export function CommitGalaxy({ className, filteredNodes }: CommitGalaxyProps) {
  const allNodes = useRepoStore((state) => state.commitNodes);
  const selectedCommit = useRepoStore((state) => state.selectedCommit);
  const selectedAuthor = useRepoStore((state) => state.selectedAuthor);
  const setSelectedCommit = useRepoStore((state) => state.setSelectedCommit);
  
  // Use filtered nodes if provided, otherwise use all nodes
  const nodes = filteredNodes || allNodes;
  
  const filteredAuthors = useMemo(() => {
    return selectedAuthor ? new Set([selectedAuthor]) : new Set<string>();
  }, [selectedAuthor]);
  
  const handleSelectCommit = useCallback((sha: string) => {
    const commit = allNodes.find(n => n.commit.sha === sha)?.commit || null;
    setSelectedCommit(commit);
  }, [allNodes, setSelectedCommit]);

  if (nodes.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <Canvas
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        onPointerMissed={() => {
          setSelectedCommit(null);
        }}
      >
        <CommitGalaxyScene
          nodes={nodes as CommitNode[]}
          selectedCommit={selectedCommit?.sha || null}
          filteredAuthors={filteredAuthors}
          onSelectCommit={handleSelectCommit}
        />
      </Canvas>
    </div>
  );
}

