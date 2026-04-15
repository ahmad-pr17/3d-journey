'use client'

import { MeshStandardMaterial, CylinderGeometry } from 'three'

interface PoleProps {
  height: number
}

export default function Pole({ height }: PoleProps) {
  return (
    <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.3, 0.3, height, 64]} />
      <meshPhysicalMaterial 
        color="#ffffff"
        transmission={1}
        thickness={1}
        roughness={0.02}
        envMapIntensity={2.5}
        clearcoat={1}
        attenuationColor="#FFFF00"
        attenuationDistance={1.5}
      />
    </mesh>
  )
}
