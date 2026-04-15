'use client'

import dynamic from 'next/dynamic'

const ThreeScene = dynamic(() => import('@/components/Three/ThreeScene'), { ssr: false })

export default function Home() {
  return (
    <main style={{ 
      width: '100vw', 
      minHeight: '100vh', 
      overflow: 'hidden' 
    }}>
      <ThreeScene />
      
      
    </main>
  )
}
