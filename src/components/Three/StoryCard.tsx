'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Image, RoundedBox, useScroll } from '@react-three/drei'
import * as THREE from 'three'

interface StoryCardProps {
  index: number
  total: number
  title: string
  description: string
  color: string
  growth: number
}

export default function StoryCard({ index, total, title, description, color }: StoryCardProps) {
  const cardRef = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const offset = (index + 1) * 3 // Vertical spacing along the tree

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const threshold = (index + 1) / (total + 1)
    
    if (cardRef.current) {
      // Use scroll.offset directly for reactivity
      const currentGrowth = scroll.offset;

      // Visibility based on growth
      cardRef.current.visible = currentGrowth > threshold
      
      // Position tracking (attached to branches)
      const targetY = offset * currentGrowth
      cardRef.current.position.y = THREE.MathUtils.lerp(cardRef.current.position.y, targetY, 0.1)
      
      // Animate ONLY on scroll (tied to growth value)
      const scrollRotation = currentGrowth * Math.PI * 6 // Rotates 3 full times total over the scroll timeline
      
      // Gentle leaf-like swaying that only happens when you scroll
      cardRef.current.rotation.z = Math.sin(scrollRotation + index) * 0.2
      cardRef.current.rotation.x = Math.cos(scrollRotation + index) * 0.15
      
      const angle = (index / total) * Math.PI * 2 + currentGrowth * Math.PI * 2
      const radius = 3 * (currentGrowth > threshold ? 1 : 0)
      cardRef.current.position.x = Math.cos(angle) * radius
      cardRef.current.position.z = Math.sin(angle) * radius
      cardRef.current.lookAt(0, targetY, 0)
    }
  })

  return (
    <group ref={cardRef}>
      <RoundedBox args={[3, 2, 0.1]} radius={0.1} smoothness={4}>
        <meshPhysicalMaterial 
          color="#81D4FA" 
          emissive="#00B0FF"
          emissiveIntensity={2}
          roughness={0.1}
          metalness={0.2}
          transparent 
          opacity={1}
          clearcoat={1}
        />
        
        {/* Title */}
        <Text
          position={[0, 0.5, 0.1]}
          fontSize={0.25}
          color="#263238"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>
        
        {/* Description (shorter version or UI overlay instead) */}
      </RoundedBox>
      
      {/* Decorative Sky Blue elements */}
      <mesh position={[0, -1.2, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#03A9F4" emissive="#03A9F4" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}
