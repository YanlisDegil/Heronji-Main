import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

export function HeroRoomScene({ liftProgress = 0, mousePos = { x: 0, y: 0 } }) {
  const roomGroupRef = useRef()
  const avatarCoreRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const screenGlowRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Smooth room lift based on scroll/drag progress
    if (roomGroupRef.current) {
      roomGroupRef.current.position.y = liftProgress * 10
      roomGroupRef.current.position.z = -liftProgress * 3
      // Subtle mouse parallax
      roomGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        roomGroupRef.current.rotation.y,
        mousePos.x * 0.12,
        0.05
      )
      roomGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        roomGroupRef.current.rotation.x,
        -mousePos.y * 0.08,
        0.05
      )
    }

    // Avatar core rotation & pulsing
    if (avatarCoreRef.current) {
      avatarCoreRef.current.rotation.x = t * 0.4
      avatarCoreRef.current.rotation.y = t * 0.6
      const s = 1 + Math.sin(t * 2) * 0.05
      avatarCoreRef.current.scale.set(s, s, s)
    }

    // Holographic orbital rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.8
      ring1Ref.current.rotation.y = t * 0.5
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.7
      ring2Ref.current.rotation.z = t * 0.4
    }

    // Pulsing screen glow
    if (screenGlowRef.current) {
      screenGlowRef.current.material.opacity = 0.15 + Math.sin(t * 3) * 0.05
    }
  })

  return (
    <group ref={roomGroupRef} position={[0, -0.6, 0]}>
      {/* ─── 1. FUTURISTIC ARCHITECTURAL ROOM & WALLS ─── */}
      {/* Dark floor with subtle reflections */}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial
          color="#030712"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Cyber Floor Grid Lines */}
      <gridHelper args={[26, 26, '#0284c7', '#0f172a']} position={[0, -1.79, 0]} />

      {/* Back Wall Panel */}
      <mesh position={[0, 4, -7]}>
        <planeGeometry args={[26, 12]} />
        <meshStandardMaterial color="#050b14" roughness={0.7} />
      </mesh>

      {/* Futuristic LED Wall Accents */}
      {[-5, 5].map((x, i) => (
        <group key={i} position={[x, 2, -6.9]}>
          <mesh>
            <boxGeometry args={[0.08, 6, 0.02]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={3}
            />
          </mesh>
          <pointLight color="#38bdf8" intensity={1.5} distance={5} />
        </group>
      ))}

      {/* Horizontal Ambient Wall Strip */}
      <mesh position={[0, 4.5, -6.9]}>
        <boxGeometry args={[18, 0.06, 0.02]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={3} />
      </mesh>

      {/* ─── 2. HIGH-TECH DESK (CARBON FIBER & CHROME) ─── */}
      <group position={[0, -0.7, -1]}>
        {/* Main Desktop Surface */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.2, 0.12, 2.4]} />
          <meshStandardMaterial
            color="#0b1329"
            roughness={0.25}
            metalness={0.7}
          />
        </mesh>

        {/* Neon Cyan Desk Edge Lighting */}
        <mesh position={[0, -0.01, 1.21]}>
          <boxGeometry args={[5.2, 0.04, 0.02]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={3}
          />
        </mesh>

        {/* Desk Underglow Light */}
        <pointLight position={[0, -0.3, 0]} color="#0284c7" intensity={2} distance={4} />

        {/* Angular Geometric Legs */}
        {[-2.2, 2.2].map((x, i) => (
          <group key={i} position={[x, -0.5, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.16, 1.0, 2.0]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Glowing Accent on legs */}
            <mesh position={[i === 0 ? 0.09 : -0.09, 0, 0]}>
              <boxGeometry args={[0.02, 0.8, 1.8]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={2} />
            </mesh>
          </group>
        ))}

        {/* Cyber Server Tower on Right Side of Desk */}
        <group position={[2.1, 0.7, -0.2]}>
          <mesh>
            <boxGeometry args={[0.45, 1.1, 0.8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Glass window with RGB coolant pipe inside */}
          <mesh position={[-0.23, 0, 0]}>
            <boxGeometry args={[0.02, 0.9, 0.6]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={2} transparent opacity={0.7} />
          </mesh>
          {/* Power button */}
          <mesh position={[-0.23, 0.45, 0.3]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
        </group>

        {/* Cyber Keyboard & Touchpad */}
        <group position={[0, 0.07, 0.4]}>
          <mesh>
            <boxGeometry args={[1.5, 0.025, 0.55]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Backlit Key Grid */}
          <mesh position={[0, 0.015, 0]}>
            <planeGeometry args={[1.4, 0.48]} />
            <meshStandardMaterial color="#0284c7" emissive="#0ea5e9" emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* Holographic Mouse */}
        <mesh position={[1.05, 0.08, 0.4]}>
          <boxGeometry args={[0.16, 0.04, 0.28]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
      </group>

      {/* ─── 3. THE CENTERPIECE MONITOR: "HERONJI TOPLULUĞU" ─── */}
      <group position={[0, 0.6, -1.2]}>
        {/* Curved Stand */}
        <mesh position={[0, -0.65, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.6, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.95, 0]}>
          <cylinderGeometry args={[0.45, 0.5, 0.04, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Monitor Bezel Frame (Sleek Ultra-Wide) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.6, 1.8, 0.12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Monitor Screen Glass (Active OLED Display) */}
        <mesh position={[0, 0, 0.07]}>
          <boxGeometry args={[3.45, 1.68, 0.02]} />
          <meshStandardMaterial
            color="#020617"
            roughness={0.1}
            metalness={0.5}
            emissive="#030b1c"
            emissiveIntensity={1}
          />
        </mesh>

        {/* Glowing Ambient Screen Volume */}
        <mesh ref={screenGlowRef} position={[0, 0, 0.2]}>
          <planeGeometry args={[3.8, 2.0]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Primary Screen Text: "HERONJI TOPLULUĞU" */}
        <Text
          position={[0, 0.38, 0.09]}
          fontSize={0.22}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.018}
          outlineColor="#0284c7"
          font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Ga4tL1R_C4546qBxP_W2vxmddvc9A.woff2"
        >
          HERONJI TOPLULUĞU
        </Text>

        {/* Subtitle: "HERONJI.FX // SİSTEM YÖNETİM MERKEZİ" */}
        <Text
          position={[0, 0.12, 0.09]}
          fontSize={0.1}
          color="#a855f7"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.008}
          outlineColor="#581c87"
        >
          HERONJI.FX // CREATIVE LABS & CORE ARCHITECTURE
        </Text>

        {/* System Terminal Status Lines */}
        <Text
          position={[0, -0.15, 0.09]}
          fontSize={0.075}
          color="#22c55e"
          anchorX="center"
          anchorY="middle"
        >
          ● AKTİF ÇEKİRDEK: ONLINE  |  V1.0  |  5 SİSTEM BAĞLI
        </Text>

        {/* Prompt on Screen */}
        <Text
          position={[0, -0.42, 0.09]}
          fontSize={0.08}
          color="#fde047"
          anchorX="center"
          anchorY="middle"
        >
          ▼ AŞAĞI KAYDIRIN // PROJELERİ GÖRÜNTÜLEYİN ▼
        </Text>

        {/* Light cast from the screen */}
        <pointLight color="#38bdf8" intensity={2.5} distance={6} position={[0, 0, 0.8]} />
      </group>

      {/* ─── 4. FLOATING 3D CYBER AVATAR CORE (ABOVE THE DESK) ─── */}
      <group position={[0, 2.4, -0.8]}>
        {/* Holographic Inner Polyhedron */}
        <mesh ref={avatarCoreRef}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.8}
            wireframe
            wireframeLinewidth={2}
          />
        </mesh>

        {/* Inner Solid Pulsing Core */}
        <mesh>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#a855f7"
            emissiveIntensity={2.5}
            roughness={0.1}
          />
        </mesh>

        {/* Holographic Orbit Ring 1 */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[0.85, 0.02, 16, 48]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={3}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Holographic Orbit Ring 2 */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.05, 0.018, 16, 48]} />
          <meshStandardMaterial
            color="#f43f5e"
            emissive="#e11d48"
            emissiveIntensity={2.5}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Avatar Core Light */}
        <pointLight color="#8b5cf6" intensity={3} distance={5} />
      </group>
    </group>
  )
}
