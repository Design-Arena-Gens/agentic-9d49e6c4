'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

export default function Studio() {
  const floorMaterial = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      metalness: 0.8,
      roughness: 0.2,
    }), []
  )

  const wallMaterial = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#2a2a2a',
      metalness: 0.3,
      roughness: 0.7,
    }), []
  )

  return (
    <group>
      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* Back wall with gradient */}
      <mesh position={[0, 5, -10]} receiveShadow>
        <planeGeometry args={[50, 10]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Accent panels */}
      <mesh position={[-8, 2, -5]} rotation={[0, Math.PI / 6, 0]}>
        <boxGeometry args={[0.2, 4, 3]} />
        <meshStandardMaterial color="#4a9eff" emissive="#1a4a8a" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh position={[8, 2, -5]} rotation={[0, -Math.PI / 6, 0]}>
        <boxGeometry args={[0.2, 4, 3]} />
        <meshStandardMaterial color="#ff9966" emissive="#8a3a1a" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Floating geometric elements */}
      <mesh position={[-4, 3, -3]} rotation={[0.5, 0.5, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} transparent opacity={0.3} />
      </mesh>

      <mesh position={[5, 4, -4]} rotation={[0.3, 0.8, 0.2]}>
        <octahedronGeometry args={[0.4]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}
