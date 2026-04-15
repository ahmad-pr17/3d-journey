import * as React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import ModelTree from './ModelTree'
import Landscape from './Landscape'
import StoryCard from './StoryCard'
import Overlay from './Overlay'

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

  useFrame((state) => {
    const offset = scroll.offset // 0 to 1

    // Drone Takeoff Journey Camera Logic
    if (offset < 0.3) {
      // Phase 1: Drift forward through the forest floor
      // Map 0 -> 0.3 to 0 -> 1 normalized
      const localOffset = offset / 0.3
      const targetZ = THREE.MathUtils.lerp(15, 6, localOffset)
      const targetY = THREE.MathUtils.lerp(1, 2, localOffset)
      
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.1)
      state.camera.lookAt(0, 2, 0)
    } else if (offset < 0.7) {
      // Phase 2: Climb the trees
      const localOffset = (offset - 0.3) / 0.4
      const targetY = THREE.MathUtils.lerp(2, 12, localOffset)
      const targetLookY = THREE.MathUtils.lerp(2, 12, localOffset)
      
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 6, 0.1)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.1)
      state.camera.lookAt(0, targetLookY, 0)
    } else {
      // Phase 3: Summit & look at sky
      const localOffset = (offset - 0.7) / 0.3
      const targetY = THREE.MathUtils.lerp(12, 18, localOffset)
      const targetLookY = THREE.MathUtils.lerp(12, 28, localOffset) // look up!
      
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 6, 0.1)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.1)
      state.camera.lookAt(0, targetLookY, 0)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <ModelTree growth={scroll.offset} />

      {story.map((item, index) => (
        <StoryCard
          key={item.id}
          index={index}
          total={story.length}
          title={item.title}
          description={item.description}
          color={item.color}
          growth={scroll.offset}
        />
      ))}
      <Landscape growth={scroll.offset} />
    </group>
  )
}

const story = [
  {
    id: 1,
    title: "Origins",
    description: "Our story begins in the vast blue expanse of the sky, where dreams take flight among the golden clouds.",
    color: "#FDD835",
  },
  {
    id: 2,
    title: "The Climb",
    description: "Scaling the heights of ambition, the pole represents our vertical journey towards a better future.",
    color: "#03A9F4",
  },
  {
    id: 3,
    title: "Peak Horizon",
    description: "Reaching the summit, we see the landscape of our achievements glowing in the morning sun.",
    color: "#FFEE58",
  },
  {
    id: 4,
    title: "Legacy",
    description: "The story continues, leaving behind a trail of blue and gold for those who follow the path.",
    color: "#29B6F6",
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
      <Canvas shadows camera={{ position: [0, 1, 15], fov: 50 }}>
        <Suspense fallback={null}>
          <ScrollControls pages={story.length + 2} damping={0.25} style={{ overflowX: 'hidden' }}>
            <LightingRig />
            <TreeGrowthWrapper story={story} />
            <Scroll html>
              <Overlay story={story} />
            </Scroll>
          </ScrollControls>

          <EffectComposer>
            <DepthOfField 
              focusDistance={0.01} 
              focalLength={0.02} 
              bokehScale={3} 
              height={480} 
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
