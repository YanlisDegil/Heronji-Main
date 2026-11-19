import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

export function HeroRoomScene({ liftProgress = 0, mousePos = { x: 0, y: 0 } }) {
  const roomGroupRef = useRef()

  useFrame(() => {
    if (roomGroupRef.current) {
      // Smooth physical lift upwards on scroll
      roomGroupRef.current.position.y = liftProgress * 11
      roomGroupRef.current.position.z = -liftProgress * 2.5

      // Natural, subtle mouse parallax
      roomGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        roomGroupRef.current.rotation.y,
        mousePos.x * 0.05,
        0.05
      )
      roomGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        roomGroupRef.current.rotation.x,
        -mousePos.y * 0.04,
        0.05
      )
    }
  })

  return (
    <group ref={roomGroupRef} position={[0, -0.6, 0]}>
      {/* ─── REALISTIC STUDIO ARCHITECTURAL ROOM ─── */}
      {/* Matte Dark Hardwood / Concrete Floor */}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial
          color="#0c1017"
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>

      {/* Warm Soft Back Wall */}
      <mesh position={[0, 4, -6.5]}>
        <planeGeometry args={[26, 12]} />
        <meshStandardMaterial color="#0e131d" roughness={0.85} />
      </mesh>

      {/* ─── SOLID MATTE WALNUT WORKSTATION (REALISTIC DESK) ─── */}
      <group position={[0, -0.7, -0.8]}>
        {/* Solid Wooden Table Top */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.8, 0.12, 2.2]} />
          <meshStandardMaterial
            color="#281e18"
            roughness={0.65}
            metalness={0.05}
          />
        </mesh>

        {/* Beveled Desk Front Edge */}
        <mesh position={[0, -0.01, 1.1]}>
          <boxGeometry args={[4.8, 0.04, 0.02]} />
          <meshStandardMaterial color="#1a1410" roughness={0.7} />
        </mesh>

        {/* Industrial Matte Steel Table Legs */}
        {[-2.0, 2.0].map((x, i) => (
          <group key={i} position={[x, -0.5, 0]}>
            <mesh>
              <boxGeometry args={[0.1, 0.95, 1.8]} />
              <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.45, 0]}>
              <boxGeometry args={[0.16, 0.05, 1.9]} />
              <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* ─── REAL HARDWARE & ROBOTICS ACCESSORIES ON DESK ─── */}
        {/* Microcontroller PCB (Green Circuit Board - Kayseri Robotik Hatırası) */}
        <group position={[-1.4, 0.08, 0.3]} rotation={[0, 0.2, 0]}>
          {/* Main PCB board */}
          <mesh>
            <boxGeometry args={[0.55, 0.02, 0.38]} />
            <meshStandardMaterial color="#15803d" roughness={0.5} />
          </mesh>
          {/* MCU Main Chip (Black IC) */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.2, 0.02, 0.2]} />
            <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Solder / Pin Rows */}
          {[-0.15, 0.15].map((z, idx) => (
            <mesh key={idx} position={[0, 0.015, z]}>
              <boxGeometry args={[0.45, 0.015, 0.025]} />
              <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
          {/* Status LED (tiny green dot) */}
          <mesh position={[0.2, 0.018, 0.1]}>
            <boxGeometry args={[0.02, 0.01, 0.02]} />
            <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* Çizgi İzleyen Sensör Dizisi Modülü (Line Follower Sensor Array) */}
        <group position={[-1.35, 0.08, -0.25]} rotation={[0, -0.1, 0]}>
          <mesh>
            <boxGeometry args={[0.65, 0.025, 0.14]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          {/* 5 IR Sensor Pairs */}
          {[-0.24, -0.12, 0, 0.12, 0.24].map((sx, sIdx) => (
            <mesh key={sIdx} position={[sx, 0.025, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Minimalist Aluminum Keyboard */}
        <group position={[0, 0.075, 0.35]}>
          {/* Keyboard Base */}
          <mesh>
            <boxGeometry args={[1.4, 0.02, 0.45]} />
            <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Matte Dark Keycap Array */}
          <mesh position={[0, 0.015, 0]}>
            <boxGeometry args={[1.32, 0.015, 0.38]} />
            <meshStandardMaterial color="#1f2937" roughness={0.6} />
          </mesh>
        </group>

        {/* Minimalist Wireless Mouse */}
        <group position={[1.0, 0.08, 0.35]}>
          <mesh>
            <boxGeometry args={[0.16, 0.035, 0.26]} />
            <meshStandardMaterial color="#374151" metalness={0.4} roughness={0.4} />
          </mesh>
        </group>

        {/* Minimalist Studio Desk Lamp */}
        <group position={[1.8, 0.45, -0.3]}>
          {/* Lamp Base */}
          <mesh position={[0, -0.38, 0]}>
            <cylinderGeometry args={[0.16, 0.18, 0.04, 20]} />
            <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Lamp Stem */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.75, 12]} />
            <meshStandardMaterial color="#4b5563" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Lamp Hood */}
          <mesh position={[-0.18, 0.35, 0]} rotation={[0, 0, 0.5]}>
            <coneGeometry args={[0.12, 0.22, 16]} />
            <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Warm Downward Soft Light */}
          <pointLight
            position={[-0.18, 0.25, 0]}
            color="#fed7aa"
            intensity={1.2}
            distance={3.5}
            decay={2}
          />
        </group>
      </group>

      {/* ─── REALISTIC STUDIO MONITOR: "HERONJI TOPLULUĞU" ─── */}
      <group position={[0, 0.55, -1.0]}>
        {/* Aluminum Monitor Stand */}
        <mesh position={[0, -0.65, 0]}>
          <boxGeometry args={[0.08, 0.6, 0.05]} />
          <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.95, 0]}>
          <cylinderGeometry args={[0.38, 0.42, 0.03, 24]} />
          <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Monitor Thin Outer Frame (Matte Black Bezel) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.4, 1.7, 0.08]} />
          <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Display Panel Glass (Realistic High-Res Screen) */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[3.3, 1.6]} />
          <meshStandardMaterial
            color="#0b101b"
            roughness={0.25}
            metalness={0.2}
          />
        </mesh>

        {/* Screen Text: "HERONJI TOPLULUĞU" in Clean, Crisp Editorial Typography */}
        <Text
          position={[0, 0.35, 0.06]}
          fontSize={0.2}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
        >
          HERONJI TOPLULUĞU
        </Text>

        {/* Subtitle */}
        <Text
          position={[0, 0.1, 0.06]}
          fontSize={0.095}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          Donanım, Gömülü Sistemler &amp; 3D Bilim Mimarisi
        </Text>

        {/* System Line */}
        <Text
          position={[0, -0.18, 0.06]}
          fontSize={0.075}
          color="#64748b"
          anchorX="center"
          anchorY="middle"
        >
          MEB 2026 Robotik  //  C / C++  //  Python  //  Three.js
        </Text>

        {/* Subtle Scroll Instruction */}
        <Text
          position={[0, -0.44, 0.06]}
          fontSize={0.075}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          Aşağı Kaydırın  —  Projeleri İnceleyin ↓
        </Text>

        {/* Soft, Realistic Screen Face Light */}
        <pointLight position={[0, 0, 0.6]} color="#e2e8f0" intensity={0.9} distance={4} />
      </group>

      {/* Main Studio Key & Ambient Lighting (Realistic, Soft, Non-Neon) */}
      <ambientLight intensity={0.55} color="#cbd5e1" />
      <directionalLight position={[4, 6, 4]} intensity={1.1} color="#f8fafc" />
      <directionalLight position={[-4, 4, -2]} intensity={0.45} color="#94a3b8" />
    </group>
  )
}
