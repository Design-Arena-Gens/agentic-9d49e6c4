'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles() {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, colors, scales] = useMemo(() => {
    const count = 2000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Distribute particles in a volume
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = Math.random() * 8
      positions[i3 + 2] = (Math.random() - 0.5) * 20

      // Golden/warm particle colors
      const warmth = Math.random()
      colors[i3] = 1
      colors[i3 + 1] = 0.7 + warmth * 0.3
      colors[i3 + 2] = 0.3 + warmth * 0.2

      scales[i] = Math.random() * 0.5 + 0.5
    }

    return [positions, colors, scales]
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1))
    return geo
  }, [positions, colors, scales])

  const material = useMemo(() =>
    new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }), []
  )

  useFrame((state, delta) => {
    if (!pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < positions.length; i += 3) {
      // Floating upward motion
      positions[i + 1] += delta * 0.3

      // Circular drift
      const angle = state.clock.elapsedTime * 0.2 + i * 0.01
      positions[i] += Math.sin(angle) * delta * 0.1
      positions[i + 2] += Math.cos(angle) * delta * 0.1

      // Reset particles that go too high
      if (positions[i + 1] > 8) {
        positions[i + 1] = 0
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.rotation.y += delta * 0.05
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}
