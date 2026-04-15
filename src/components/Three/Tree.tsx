'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MeshPhysicalMaterial } from 'three'

interface TreeProps {
  growth: number
  height: number
}

function Branch({ position, rotation, scale, length, radius }: any) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <cylinderGeometry args={[radius * 0.8, radius, length, 16]} />
      <meshPhysicalMaterial 
        color="#FFF176"
        emissive="#FFD54F"
        emissiveIntensity={1.5}
        roughness={0.1}
        metalness={0.2}
        clearcoat={1}
        transparent
        opacity={1}
      />
    </mesh>
  )
}

export default function Tree({ growth, height }: TreeProps) {
  const treeRef = useRef<THREE.Group>(null)

  // Sub-branches logic
  const branches = useMemo(() => [
    { pos: [0, 2, 0], rot: [0, 0, Math.PI / 4], len: 2, rad: 0.15 },
    { pos: [0, 4, 0], rot: [0, 0, -Math.PI / 4], len: 2.5, rad: 0.12 },
    { pos: [0, 6, 0], rot: [0, 0, Math.PI / 3], len: 3, rad: 0.1 },
    { pos: [0, 8, 0], rot: [0, 1.5, -Math.PI / 3], len: 3.5, rad: 0.08 },
  ], [])

  return (
    <group ref={treeRef}>
      {/* Main Trunk - organic and visible crystalline material */}
      <mesh position={[0, (height * Math.max(0.08, growth)) / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.6 * (1 - growth * 0.4), height * Math.max(0.08, growth), 32]} />
        <meshPhysicalMaterial 
          color="#FFF176"
          emissive="#FFD54F"
          emissiveIntensity={2}
          roughness={0.2}
          metalness={0.1}
          clearcoat={0.5}
          reflectivity={1}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Growing Branches - placed more organically */}
      {branches.map((b, i) => {
        const branchGrowth = Math.max(0, (growth - (i + 1) / (branches.length + 1)) * 2)
        const currentLen = b.len * branchGrowth
        
        return (
          <group 
            key={i} 
            position={[0, b.pos[1] * growth, 0]}
            visible={branchGrowth > 0}
          >
            <Branch 
               position={[0, currentLen / 2, 0]}
               rotation={b.rot}
               length={currentLen}
               radius={b.rad * (1 - branchGrowth * 0.2)}
               scale={[1, 1, 1]}
            />
          </group>
        )
      })}
    </group>
  )
}
