'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import Person from './Person'
import Particles from './Particles'
import Logo from './Logo'
import Studio from './Studio'

export default function Experience() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const timeRef = useRef(0)

  useFrame((state, delta) => {
    timeRef.current += delta

    if (cameraRef.current) {
      const t = timeRef.current * 0.15

      // Cinematic camera movement
      const radius = 12 + Math.sin(t * 0.3) * 2
      const height = 1.8 + Math.sin(t * 0.2) * 0.5
      const angle = t * 0.4

      cameraRef.current.position.x = Math.sin(angle) * radius
      cameraRef.current.position.y = height
      cameraRef.current.position.z = Math.cos(angle) * radius

      cameraRef.current.lookAt(0, 1.5, 0)
    }
  })

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 1.6, 10]} fov={50} />

      {/* Warm cinematic lighting */}
      <ambientLight intensity={0.3} color="#fff5e6" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        color="#ffd4a3"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.8} color="#a8c8ff" />
      <spotLight
        position={[0, 10, 0]}
        intensity={1.2}
        angle={0.6}
        penumbra={0.5}
        color="#ffffff"
        castShadow
      />

      {/* Rim lighting */}
      <pointLight position={[-8, 3, -8]} intensity={2} color="#ff9966" distance={20} />
      <pointLight position={[8, 3, -8]} intensity={2} color="#6699ff" distance={20} />

      <Environment preset="warehouse" />

      <Studio />

      {/* Multiple people in various poses */}
      <Person position={[-2.5, 0, -1]} rotation={[0, 0.3, 0]} animation="walking" delay={0} />
      <Person position={[2, 0, -0.5]} rotation={[0, -0.5, 0]} animation="working" delay={1.5} />
      <Person position={[0, 0, 3]} rotation={[0, Math.PI, 0]} animation="smiling" delay={3} />
      <Person position={[-3.5, 0, 2]} rotation={[0, 0.8, 0]} animation="walking" delay={2} />
      <Person position={[3.5, 0, 1.5]} rotation={[0, -0.8, 0]} animation="working" delay={4} />

      <Particles />
      <Logo />

      <fog attach="fog" args={['#0a0a0a', 10, 30]} />
    </>
  )
}
