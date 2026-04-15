'use client'

interface StoryItem {
  id: number
  title: string
  description: string
  color: string
}

interface OverlayProps {
  story: StoryItem[]
}

export default function Overlay({ story }: OverlayProps) {
  return (
    <div className="ui-layer" style={{ width: '100vw' }}>
      {/* Intro Section */}
      <section style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 className="accent-text" style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          THE JOURNEY
        </h1>
        <p style={{ maxWidth: '600px', fontSize: '1.2rem', color: '#E0E0E0' }}>
          Scroll to explore a story of vertical ambition and celestial wonders.
          A path forged in <span style={{ color: '#FDD835', fontWeight: 'bold' }}>Yellow</span> and <span style={{ color: '#03A9F4', fontWeight: 'bold' }}>Sky Blue</span>.
        </p>
        <div style={{ marginTop: '2rem', animation: 'bounce 2s infinite', color: '#fff' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </section>

      {/* Story Sections Mapping */}
      {story.map((item, index) => (
        <section key={item.id} style={{ 
          height: '400vh', // Vertical space for each story point
          position: 'relative',
          padding: '0 5vw'
        }}>
          <div className="glass-card" style={{ 
            position: 'sticky', 
            top: '30%', 
            maxWidth: '400px',
            marginLeft: index % 2 === 0 ? '0' : 'auto',
            marginRight: index % 2 === 0 ? 'auto' : '0',
            opacity: 1, 
            pointerEvents: 'auto',
            zIndex: 20
          }}>
            <h2 style={{ marginBottom: '1rem', borderBottom: `4px solid ${item.color}`, display: 'inline-block' }}>
              {item.title}
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              {item.description}
            </p>
          </div>
        </section>
      ))}

      {/* Outro Section */}
      <section style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(5px)'
      }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <h2 className="accent-text">TO BE CONTINUED</h2>
          <p style={{ marginTop: '1rem' }}>Your story is just beginning.</p>
          <button className="ui-element" style={{
            marginTop: '1.5rem',
            padding: '0.8rem 2rem',
            background: 'var(--primary-yellow)',
            border: 'none',
            borderRadius: '50px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(253, 216, 53, 0.4)'
          }}>
            START OVER
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-10px);}
          60% {transform: translateY(-5px);}
        }
      `}</style>
    </div>
  )
}
