import * as React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import ModelTree from './ModelTree'
import Landscape from './Landscape'
import FixedStoryCard from './FixedStoryCard'

function LightingRig() {
  const scroll = useScroll()
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const dirRef = useRef<THREE.DirectionalLight>(null)

  // Colors for day/night cycle
  const nightColor = new THREE.Color('#020210')
  const dawnColor = new THREE.Color('#FF8C00')
  const dayColor = new THREE.Color('#87CEEB')

  useFrame((state) => {
    const offset = scroll.offset

    // Interpolate background color
    if (offset < 0.5) {
      state.scene.background = nightColor.clone().lerp(dawnColor, offset * 2)
    } else {
      state.scene.background = dawnColor.clone().lerp(dayColor, (offset - 0.5) * 2)
    }

    // Interpolate lights
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(0.2, 1.5, offset)
      const ambientNight = new THREE.Color('#1E3A8A')
      const ambientDay = new THREE.Color('#FFFFFF')
      ambientRef.current.color.copy(ambientNight).lerp(ambientDay, offset)
    }

    if (dirRef.current) {
      dirRef.current.intensity = THREE.MathUtils.lerp(0, 3, offset)
      dirRef.current.position.set(5, 10 * offset, 5) // Sun rising effect
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.2} color="#1E3A8A" />
      <directionalLight ref={dirRef} castShadow />
      <pointLight position={[10, 10, 10]} intensity={2} color="#FFD54F" />
    </>
  )
}

function TreeGrowthWrapper({ story }: { story: any[] }) {
  const scroll = useScroll()
  const cameraTarget = useRef(new THREE.Vector3(0, 2, 0))

  useFrame((state) => {
    const offset = scroll.offset // 0 to 1

    let targetPos = new THREE.Vector3()
    let currentLookTarget = new THREE.Vector3()

    if (offset < 0.25) {
      const localOffset = offset / 0.25
      targetPos.lerpVectors(new THREE.Vector3(0, 1, 15), new THREE.Vector3(-1, 2.5, 9), localOffset)
      currentLookTarget.lerpVectors(new THREE.Vector3(0, 2, 0), new THREE.Vector3(-2, 2.5, 7), localOffset)
    } else if (offset < 0.5) {
      const localOffset = (offset - 0.25) / 0.25
      targetPos.lerpVectors(new THREE.Vector3(-1, 2.5, 9), new THREE.Vector3(1.5, 4.5, 4), localOffset)
      currentLookTarget.lerpVectors(new THREE.Vector3(-2, 2.5, 7), new THREE.Vector3(2.5, 4.5, 2), localOffset)
    } else if (offset < 0.75) {
      const localOffset = (offset - 0.5) / 0.25
      targetPos.lerpVectors(new THREE.Vector3(1.5, 4.5, 4), new THREE.Vector3(0, 8.5, 2), localOffset)
      currentLookTarget.lerpVectors(new THREE.Vector3(2.5, 4.5, 2), new THREE.Vector3(-1.5, 8.5, 0), localOffset)
    } else {
      const localOffset = (offset - 0.75) / 0.25
      targetPos.lerpVectors(new THREE.Vector3(0, 8.5, 2), new THREE.Vector3(0, 15.5, 7), localOffset)
      currentLookTarget.lerpVectors(new THREE.Vector3(-1.5, 8.5, 0), new THREE.Vector3(0, 15.5, 4), localOffset)
    }

    // Smoothly interpolate camera position
    state.camera.position.lerp(targetPos, 0.05)
    
    // Smoothly interpolate LookAt target
    cameraTarget.current.lerp(currentLookTarget, 0.05)
    state.camera.lookAt(cameraTarget.current)
  })

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Static Scenery (Drawn First) */}
      <Landscape />
      
      {/* 2. Trees */}
      <ModelTree position={[0, -2.0, 0]} scale={0.04} />
      <ModelTree position={[-4, -2.0, 2]} scale={0.035} rotation={[0, Math.PI / 4, 0]} />
      <ModelTree position={[4, -2.0, -3]} scale={0.045} rotation={[0, -Math.PI / 6, 0]} />
      <ModelTree position={[-3, -2.0, -6]} scale={0.03} rotation={[0, Math.PI / 3, 0]} />
      <ModelTree position={[5, -2.0, 4]} scale={0.05} rotation={[0, Math.PI, 0]} />
      <ModelTree position={[-6, -2.0, -1]} scale={0.038} rotation={[0, -Math.PI / 2, 0]} />
      <ModelTree position={[2, -2.0, -8]} scale={0.042} rotation={[0, Math.PI / 8, 0]} />

      {/* 3. Story Cards (Drawn LAST with high renderOrder and depthTest: false) */}
      {story.map((item) => (
        <FixedStoryCard
          key={item.id}
          position={item.cardPos as [number, number, number]}
          title={item.title}
          description={item.description}
          color={item.color}
          scrollOffset={scroll.offset}
          range={item.range as [number, number]}
        />
      ))}
    </group>
  )
}

const story = [
  {
    id: 1,
    title: "Roots & Ambition",
    description: "Like a tree seeking the sky, our journey begins in the quiet shadows. Every grand ascent starts with a single intent to grow.",
    color: "#FDD835",
    cardPos: [-2, 2.5, 7], 
    range: [0, 0.3] // Start at 0
  },
  {
    id: 2,
    title: "Chasing the Light",
    description: "Obstacles are merely branches in the structural path of our ascent. We adapt, twisting gracefully around them.",
    color: "#03A9F4",
    cardPos: [2.5, 4.5, 2],
    range: [0.3, 0.55] // Touches precisely at 0.3
  },
  {
    id: 3,
    title: "Weathering the Wind",
    description: "The canopy sways but the foundation holds firm. Resilience is the invisible resin that keeps the bark intact.",
    color: "#FFEE58",
    cardPos: [-1.5, 8.5, 0],
    range: [0.55, 0.8] // Touches precisely at 0.55
  },
  {
    id: 4,
    title: "The Silent Summit",
    description: "At the peak, the forest reveals its interconnected splendor. A breathtaking view earned by unwavering vertical patience.",
    color: "#29B6F6",
    cardPos: [0, 15.5, 4],
    range: [0.8, 1.0] // Touches precisely at 0.8
  },
]

export default function ThreeScene() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="canvas-container" style={{ background: '#020210', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#fff' }}>Loading cinematic experience...</p>
      </div>
    )
  }

  return (
    <div className="canvas-container">
      <Canvas shadows gl={{ localClippingEnabled: true }} camera={{ position: [0, 1, 15], fov: 50 }}>
        <Suspense fallback={null}>
          <ScrollControls pages={story.length + 2} damping={0.25} style={{ overflowX: 'hidden' }}>
            <LightingRig />
            <TreeGrowthWrapper story={story} />
          </ScrollControls>

          <EffectComposer>
            <DepthOfField
              focusDistance={0.01}
              focalLength={0.01} // More subtle blur
              bokehScale={1.5}  // Reduced blur
              height={480}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
