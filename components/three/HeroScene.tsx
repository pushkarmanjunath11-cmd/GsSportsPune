'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

function FootballSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.25
  })

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} castShadow>
        <Sphere args={[1.8, 64, 64]}>
          <MeshDistortMaterial
            color="#e8162a"
            attach="material"
            distort={0.12}
            speed={1.5}
            roughness={0.1}
            metalness={0.8}
            emissive="#8b0000"
            emissiveIntensity={0.3}
          />
        </Sphere>
      </mesh>

      {/* Inner glow sphere */}
      <mesh scale={1.05}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color="#e8162a" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
    </Float>
  )
}

function ParticleField() {
  const points = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (!points.current) return
    points.current.rotation.y = state.clock.elapsedTime * 0.03
    points.current.rotation.x = state.clock.elapsedTime * 0.01
  })

  const count = 800
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#e8162a" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

function RingOrbit() {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ringRef.current) return
    ringRef.current.rotation.x = Math.PI / 3 + state.clock.elapsedTime * 0.1
    ringRef.current.rotation.z = state.clock.elapsedTime * 0.05
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[3, 0.015, 16, 200]} />
      <meshBasicMaterial color="#e8162a" transparent opacity={0.25} />
    </mesh>
  )
}

export function HeroScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#e8162a" />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="#ffffff" />
        <spotLight position={[0, 8, 0]} intensity={1} color="#e8162a" angle={0.4} penumbra={1} />

        <Suspense fallback={null}>
          <FootballSphere />
          <ParticleField />
          <RingOrbit />
        </Suspense>
      </Canvas>
    </div>
  )
}