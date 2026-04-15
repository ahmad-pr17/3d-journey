'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useFBX } from '@react-three/drei'
import * as THREE from 'three'

interface ModelTreeProps {
  growth: number
}

export default function ModelTree({ growth }: ModelTreeProps) {
  // Load the external tree model
  const fbx = useFBX('/models/tree.fbx')
  const treeRef = useRef<THREE.Group>(null)

  // Use a clipping plane to simulate growth (bottom-up reveal)
  const clippingPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), [])

  // Apply clipping planes to the original materials of the FBX
  useEffect(() => {
    if (fbx) {
      fbx.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          if (mesh.material) {
            // If it's an array of materials, handle each
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            materials.forEach((mat) => {
              mat.clippingPlanes = [clippingPlane]
              mat.clipShadows = true
              mat.transparent = true // Usually needed for clipping to look clean
              mat.side = THREE.DoubleSide
            })
          }
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [fbx, clippingPlane])

  useFrame(() => {
    // Reveal from bottom (-2.0) upwards
    const maxHeight = 40
    const clipY = -2.0 + growth * (maxHeight + 2)
    clippingPlane.constant = clipY
  })

  return (
    <primitive
      ref={treeRef}
      object={fbx}
      scale={0.04} // Adjusted scale for better visibility
      position={[0, -2.0,]}
      rotation={[0, 0, 0]}
    />
  )
}
