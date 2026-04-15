'use client'

import { Sparkles, Float, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface LandscapeProps {
  growth: number
}

export default function Landscape({ growth }: LandscapeProps) {
  // Fireflies fade out as growth approaches 1.0 (daytime)
  const fireflyOpacity = Math.max(0, 0.5 - growth)

  return (
    <group>
      {/* Magic Fireflies / Sparkles inside the forest */}
      <Sparkles 
        count={300} 
        scale={[40, 20, 40]} // Spread throughout the forest
        size={2} 
        speed={0.5} 
        color="#FDD835" 
        opacity={fireflyOpacity}
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
            <MeshWobbleMaterial factor={0.6} speed={2} color="#81D4FA" 
              transparent opacity={Math.max(0.1, 1 - growth * 1.5)} 
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

