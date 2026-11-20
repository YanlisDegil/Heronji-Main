import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── PROCEDURAL 3D VOLUMETRIC CLOUDS ───
// Creates a soft, atmospheric cloud layer between the main room and the project zone
export function CloudsTransition({ position = [0, -3.2, 0] }) {
  const groupRef = useRef()

  // Generate clusters of soft cloud puffs
  const puffs = useMemo(() => {
    const list = []
    const clusterCount = 14
    for (let c = 0; c < clusterCount; c++) {
      const cx = (Math.random() - 0.5) * 18
      const cy = (Math.random() - 0.5) * 2.2
      const cz = (Math.random() - 0.5) * 12 - 1

      // 4 to 7 overlapping puffs per cluster
      const subPuffs = 4 + Math.floor(Math.random() * 4)
      for (let p = 0; p < subPuffs; p++) {
        list.push({
          x: cx + (Math.random() - 0.5) * 2.5,
          y: cy + (Math.random() - 0.5) * 0.9,
          z: cz + (Math.random() - 0.5) * 2.5,
          radius: 0.9 + Math.random() * 1.3,
          speed: 0.05 + Math.random() * 0.08,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }
    return list
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      const p = puffs[i]
      if (p) {
        // Very gentle drifting motion
        child.position.y = p.y + Math.sin(t * p.speed + p.phase) * 0.15
        child.position.x = p.x + Math.cos(t * p.speed * 0.7 + p.phase) * 0.2
      }
    })
  })

  return (
    <group ref={groupRef} position={position}>
      {puffs.map((p, idx) => (
        <mesh key={idx} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.radius, 16, 16]} />
          <meshStandardMaterial
            color="#cbd5e1"
            roughness={0.95}
            metalness={0.05}
            transparent
            opacity={0.38}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Soft atmospheric mist sheet spanning horizontally */}
      <mesh position={[0, 0, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[32, 18]} />
        <meshStandardMaterial
          color="#94a3b8"
          roughness={1}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
