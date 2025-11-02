'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PersonProps {
  position: [number, number, number]
  rotation: [number, number, number]
  animation: 'walking' | 'working' | 'smiling'
  delay: number
}

export default function Person({ position, rotation, animation, delay }: PersonProps) {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(-delay)

  // Create a stylized human figure
  const geometry = useMemo(() => ({
    body: new THREE.CapsuleGeometry(0.25, 0.8, 8, 16),
    head: new THREE.SphereGeometry(0.2, 16, 16),
    limb: new THREE.CapsuleGeometry(0.08, 0.5, 8, 16),
  }), [])

  const material = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#2a2a2a',
      metalness: 0.3,
      roughness: 0.4,
    }), []
  )

  const accentMaterial = useMemo(() =>
    new THREE.MeshStandardMaterial({
      color: '#4a9eff',
      metalness: 0.5,
      roughness: 0.3,
      emissive: '#1a4a8a',
      emissiveIntensity: 0.2,
    }), []
  )

  useFrame((state, delta) => {
    if (!groupRef.current) return
    timeRef.current += delta

    if (timeRef.current < 0) return

    const t = timeRef.current

    // Animations based on type
    if (animation === 'walking') {
      groupRef.current.position.x = position[0] + Math.sin(t * 0.5) * 0.3
      groupRef.current.rotation.y = rotation[1] + Math.sin(t * 2) * 0.1
    } else if (animation === 'working') {
      groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.8) * 0.15
    } else if (animation === 'smiling') {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Body */}
      <mesh geometry={geometry.body} material={material} position={[0, 1, 0]} castShadow />

      {/* Head */}
      <mesh geometry={geometry.head} material={accentMaterial} position={[0, 1.7, 0]} castShadow />

      {/* Arms */}
      <mesh geometry={geometry.limb} material={material} position={[-0.4, 1, 0]} rotation={[0.3, 0, 0.2]} castShadow />
      <mesh geometry={geometry.limb} material={material} position={[0.4, 1, 0]} rotation={[-0.3, 0, -0.2]} castShadow />

      {/* Legs */}
      <mesh geometry={geometry.limb} material={material} position={[-0.15, 0.3, 0]} rotation={[0, 0, 0]} castShadow />
      <mesh geometry={geometry.limb} material={material} position={[0.15, 0.3, 0]} rotation={[0, 0, 0]} castShadow />
    </group>
  )
}
