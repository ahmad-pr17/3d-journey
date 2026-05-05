import { useMemo } from 'react'
import { Sparkles, Instances, Instance } from '@react-three/drei'

export default function Landscape() {
  // Generate random positions for grass blades
  const grassData = useMemo(() => {
    const data = []
    for (let i = 0; i < 3000; i++) {
      data.push({
        position: [
          (Math.random() - 0.5) * 30, // X spread
          -2.0,                       // Rooted at forest floor
          (Math.random() - 0.5) * 30  // Z spread
        ] as [number, number, number],
        rotation: [0, Math.random() * Math.PI, 0] as [number, number, number],
        scale: 0.5 + Math.random() * 1.0
      })
    }
    return data
  }, [])

  return (
    <group>
      {/* Magic Fireflies / Sparkles inside the forest (Persistent) */}
      <Sparkles 
        count={300} 
        scale={[40, 20, 40]} // Spread throughout the forest
        size={2} 
        speed={0.5} 
        color="#FDD835" 
        opacity={0.8}
        position={[0, 5, 0]}
      />
      
      {/* Grass Instances on the Forest Floor */}
      <Instances range={3000}>
        <coneGeometry args={[0.05, 0.4, 3]} />
        <meshStandardMaterial color="#2b5329" roughness={0.8} />
        {grassData.map((props, i) => (
          <Instance key={i} {...props} />
        ))}
      </Instances>
    </group>
  )
}

