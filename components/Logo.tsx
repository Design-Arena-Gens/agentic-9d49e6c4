'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'

export default function Logo() {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)
  const particlesRef = useRef<THREE.Points>(null)

  // Logo particles forming effect
  const [logoPositions, logoColors] = useMemo(() => {
    const count = 500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const angle = (i / count) * Math.PI * 4
      const radius = (i / count) * 2

      positions[i3] = Math.cos(angle) * radius
      positions[i3 + 1] = Math.sin(i * 0.5) * 0.5
      positions[i3 + 2] = Math.sin(angle) * radius

      colors[i3] = 1
      colors[i3 + 1] = 0.8
      colors[i3 + 2] = 0.4
    }

    return [positions, colors]
  }, [])

  const logoParticleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(logoPositions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(logoColors, 3))
    return geo
  }, [logoPositions, logoColors])

  const logoParticleMaterial = useMemo(() =>
    new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }), []
  )

  useFrame((state, delta) => {
    timeRef.current += delta

    if (groupRef.current) {
      // Fade in after delay
      const fadeInStart = 6
      const fadeInDuration = 2
      const opacity = Math.min(1, Math.max(0, (timeRef.current - fadeInStart) / fadeInDuration))

      groupRef.current.visible = opacity > 0

      if (opacity > 0) {
        // Formation animation
        const formationProgress = Math.min(1, (timeRef.current - fadeInStart) / 3)
        const scale = formationProgress * formationProgress * (3 - 2 * formationProgress) // smoothstep
        groupRef.current.scale.setScalar(scale)

        // Gentle floating
        groupRef.current.position.y = 2.5 + Math.sin(timeRef.current * 0.8) * 0.1
        groupRef.current.rotation.y = Math.sin(timeRef.current * 0.3) * 0.1
      }
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.3
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < positions.length; i += 3) {
        const angle = timeRef.current * 2 + i * 0.1
        const radius = 2 + Math.sin(timeRef.current + i * 0.05) * 0.5
        positions[i] = Math.cos(angle) * radius
        positions[i + 2] = Math.sin(angle) * radius
        positions[i + 1] += Math.sin(timeRef.current * 2 + i) * 0.01
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={[0, 2.5, 0]} visible={false}>
      {/* Swirling particles around logo */}
      <points ref={particlesRef} geometry={logoParticleGeometry} material={logoParticleMaterial} />

      {/* Main Logo */}
      <Center>
        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffa500"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Logo ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.05, 16, 64]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ff8800"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </Center>

      {/* Glowing light from logo */}
      <pointLight position={[0, 0, 0]} intensity={3} color="#ffa500" distance={10} />
    </group>
  )
}
