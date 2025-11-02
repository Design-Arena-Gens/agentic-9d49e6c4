'use client'

import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('../components/Scene'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      color: '#fff',
      fontSize: '24px'
    }}>
      Loading Experience...
    </div>
  )
})

export default function Home() {
  return <Scene />
}
