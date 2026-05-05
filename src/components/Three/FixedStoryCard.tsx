'use client'

import * as THREE from 'three'
import { Text, RoundedBox, Billboard } from '@react-three/drei'

interface FixedStoryCardProps {
  position: [number, number, number]
  title: string
  description: string
  color: string
  scrollOffset: number
  range: [number, number]
}

export default function FixedStoryCard({ position, title, description, color, scrollOffset, range }: FixedStoryCardProps) {
  // Calculate visibility based on scroll range
  const [start, end] = range
  
  // Debug: Make it wider and more visible
  const opacity = THREE.MathUtils.smoothstep(scrollOffset, start - 0.1, start) * 
                  (1 - THREE.MathUtils.smoothstep(scrollOffset, end, end + 0.1))
  
  const isVisible = opacity > 0.001

  // REMOVED early null return for debugging
  
  return (
    <group position={position} renderOrder={100} visible={isVisible}>
      <Billboard follow={true}>
        <RoundedBox args={[4.2, 2.7, 0.1]} radius={0.15} smoothness={4}>
          <meshPhysicalMaterial 
            color="#0D47A1" 
            emissive="#1A237E"
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.2}
            transparent 
            opacity={0.9 * opacity} 
            clearcoat={1}
            depthTest={false} 
            depthWrite={false}
          />
          
          {/* Title - using material-depthTest and material-depthWrite shorthand */}
          <Text
            position={[0, 0.7, 0.12]}
            fontSize={0.4}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            fontWeight={800}
            outlineWidth={0.02}
            outlineColor="#000000"
            fillOpacity={opacity}
            material-depthTest={false}
            material-depthWrite={false}
            material-transparent={true}
          >
            {title}
          </Text>
          
          {/* Description */}
          <Text
            position={[0, -0.2, 0.12]}
            fontSize={0.22}
            color="#E3F2FD"
            anchorX="center"
            anchorY="middle"
            maxWidth={3.8}
            textAlign="center"
            lineHeight={1.4}
            fontWeight={500}
            outlineWidth={0.01}
            outlineColor="#000000"
            fillOpacity={opacity}
            material-depthTest={false}
            material-depthWrite={false}
            material-transparent={true}
          >
            {description}
          </Text>
        </RoundedBox>
        
        {/* Decorative Sphere */}
        <mesh position={[0, -1.6, 0]} renderOrder={101}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={3 * opacity} 
            transparent 
            opacity={opacity}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>
      </Billboard>
    </group>
  )
}
