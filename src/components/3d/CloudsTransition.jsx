import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Generate a procedural, feathery volumetric cloud puff texture
function createCloudTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, size, size)

  // Layer multiple slightly offset soft radial puffs for an organic, wispy silhouette
  const subBlobs = [
    { x: 0.5, y: 0.5, r: 0.45, a: 0.55 },
    { x: 0.36, y: 0.54, r: 0.32, a: 0.4 },
    { x: 0.64, y: 0.52, r: 0.34, a: 0.4 },
    { x: 0.48, y: 0.37, r: 0.32, a: 0.42 },
    { x: 0.52, y: 0.63, r: 0.3, a: 0.32 },
    { x: 0.28, y: 0.44, r: 0.24, a: 0.25 },
    { x: 0.72, y: 0.44, r: 0.25, a: 0.25 },
  ]

  subBlobs.forEach((b) => {
    const cx = b.x * size
    const cy = b.y * size
    const rad = b.r * size
    const grad = ctx.createRadialGradient(cx, cy, rad * 0.05, cx, cy, rad)
    grad.addColorStop(0, `rgba(255, 255, 255, ${b.a})`)
    grad.addColorStop(0.45, `rgba(245, 248, 255, ${b.a * 0.65})`)
    grad.addColorStop(0.75, `rgba(220, 232, 248, ${b.a * 0.22})`)
    grad.addColorStop(1, 'rgba(200, 215, 235, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cx, cy, rad, 0, Math.PI * 2)
    ctx.fill()
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// ─── REALISTIC VOLUMETRIC 3D CLOUD DECK ───
export function CloudsTransition({ position = [0, -3.5, 0], density = 46, spread = [20, 2.8, 12] }) {
  const groupRef = useRef()
  const cloudTexture = useMemo(() => createCloudTexture(), [])

  // Generate layered cloud sprites with realistic top-lit shading
  const cloudSprites = useMemo(() => {
    const items = []
    const [sx, sy, sz] = spread

    for (let i = 0; i < density; i++) {
      // Cluster around centers so clouds look natural rather than uniform grid
      const clusterAngle = (i / density) * Math.PI * 6
      const x = ((i % 7) - 3) * (sx / 6.5) + Math.sin(clusterAngle * 1.7) * 1.6
      const yNorm = ((i * 37) % 100) / 100 - 0.5 // -0.5 to +0.5
      const y = yNorm * sy
      const z = Math.cos(clusterAngle * 1.3) * (sz * 0.42) - 0.5

      // Sunlit top vs shadowed bottom color shading
      let color = '#e2e8f0'
      if (yNorm > 0.15) {
        color = '#f8fafc' // sunlit upper wisps
      } else if (yNorm < -0.15) {
        color = '#64748b' // cool shadow underside
      } else {
        color = '#cbd5e1'
      }

      items.push({
        x,
        y,
        z,
        scaleX: 3.4 + ((i * 13) % 10) * 0.36,
        scaleY: 2.2 + ((i * 17) % 10) * 0.24,
        rot: ((i * 23) % 314) / 100,
        color,
        opacity: 0.28 + ((i * 11) % 10) * 0.025,
        speed: 0.12 + ((i * 7) % 10) * 0.02,
        phase: i * 0.7,
      })
    }
    return items
  }, [density, spread])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const children = groupRef.current.children
    for (let i = 0; i < cloudSprites.length; i++) {
      const sprite = children[i]
      const d = cloudSprites[i]
      if (!sprite || !d) continue
      sprite.position.x = d.x + Math.sin(t * d.speed * 0.4 + d.phase) * 0.45
      sprite.position.y = d.y + Math.cos(t * d.speed * 0.5 + d.phase) * 0.14
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {cloudSprites.map((c, idx) => (
        <sprite
          key={idx}
          position={[c.x, c.y, c.z]}
          scale={[c.scaleX, c.scaleY, 1]}
        >
          <spriteMaterial
            map={cloudTexture}
            color={c.color}
            transparent
            opacity={c.opacity}
            depthWrite={false}
            rotation={c.rot}
          />
        </sprite>
      ))}
    </group>
  )
}
