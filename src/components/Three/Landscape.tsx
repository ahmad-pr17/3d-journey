'use client'

import { useRef } from 'react'
import { Sparkles, Float, MeshWobbleMaterial, useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export default function Landscape() {
  const scroll = useScroll()
  const sparklesRef = useRef<any>(null)
  const wobbleMaterials = useRef<any[]>([])

  useFrame(() => {
    const growth = scroll.offset
    const fireflyOpacity = Math.max(0, 0.5 - growth)
    const orbOpacity = Math.max(0.1, 1 - growth * 1.5)

    if (sparklesRef.current) {
      // Sparkles uses a ShaderMaterial where opacity can be updated
      sparklesRef.current.material.opacity = fireflyOpacity
    }
    
    wobbleMaterials.current.forEach(mat => {
      if (mat) {
        mat.opacity = orbOpacity
      }
    })
  })

  return (
    <group>
      {/* Magic Fireflies / Sparkles inside the forest */}
      <Sparkles 
        ref={sparklesRef}
        count={300} 
        scale={[40, 20, 40]} // Spread throughout the forest
        size={2} 
        speed={0.5} 
        color="#FDD835" 
        transparent
        position={[0, 5, 0]}
      />
      
      {/* Floating Sky Blue Orbs - representing ascending dreams */}
      {[...Array(10)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh 
            position={[
              (Math.random() - 0.5) * 30,
              5 + Math.random() * 20,
              (Math.random() - 0.5) * 30
            ]}
          >
            <sphereGeometry args={[0.1, 16, 16]} />
            <MeshWobbleMaterial 
              ref={(el) => { wobbleMaterials.current[i] = el }}
              factor={0.6} speed={2} color="#81D4FA" 
              transparent 
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

