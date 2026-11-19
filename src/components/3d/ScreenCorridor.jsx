import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { playClickSound, playWarningSound, playWarpSound, playHoverSound } from '../../utils/audio'

export const PROJECTS = [
  {
    id: 'lab-dedektifi',
    title: 'LAB DEDEKTİFİ',
    fullTitle: 'Laboratuvar Dedektifi',
    tagline: '3D İnteraktif Bilim Laboratuvarı',
    description: 'Fizik, Kimya ve Biyoloji deneylerini web tarayıcısında gerçek zamanlı 3D simülasyonlarla sunan interaktif bilim platformu.',
    status: 'CANLI & YAYINDA',
    statusColor: '#22c55e',
    badgeColor: '#15803d',
    tech: ['Three.js', 'React', 'Tailwind', 'Vite'],
    url: 'https://lab-dedektifi.vercel.app/',
    isLive: true,
    themeColor: '#38bdf8',
    glowColor: '#0284c7',
  },
  {
    id: 'yanlis-degil',
    title: 'YANLIŞ DEĞİL',
    fullTitle: 'Yanlış Değil Platformu',
    tagline: 'Felsefe, Bilim ve Eleştirel Düşünce',
    description: 'Toplumda doğru bilinen bilimsel ve felsefi yanılgıları çürüten, kaynaklı ve tarafsız dijital araştırma kütüphanesi.',
    status: 'GELİŞTİRİLİYOR',
    statusColor: '#f59e0b',
    badgeColor: '#b45309',
    tech: ['Next.js', 'PostgreSQL', 'Knowledge Graph'],
    isLive: false,
    themeColor: '#f59e0b',
    glowColor: '#d97706',
  },
  {
    id: 'jarvis',
    title: 'J.A.R.V.I.S.',
    fullTitle: 'J.A.R.V.I.S. Otonom Asistan',
    tagline: 'Otonom Yapay Zeka & Donanım Entegrasyonu',
    description: 'Doğal dil işlemeyle çalışan, kişisel iş akışlarını ve yerel donanımları yönetebilen yeni nesil otonom agent motoru.',
    status: 'PROTOKOL KİLİTLİ',
    statusColor: '#8b5cf6',
    badgeColor: '#6d28d9',
    tech: ['Gemini 2.0 / 3.8', 'Python', 'WebSockets', 'IoT'],
    isLive: false,
    themeColor: '#a855f7',
    glowColor: '#7c3aed',
  },
  {
    id: 'friday',
    title: 'FRIDAY',
    fullTitle: 'F.R.I.D.A.Y. Analiz Arayüzü',
    tagline: 'Taktiksel Hızlı Tepki & Veri Görselleştirme',
    description: 'Büyük veri kümelerini anlık analiz ederek görsel karar destek panelleri üreten yüksek hızlı analitik zeka arayüzü.',
    status: 'EĞİTİM AŞAMASINDA',
    statusColor: '#06b6d4',
    badgeColor: '#0891b2',
    tech: ['WebGL', 'Rust Core', 'Machine Learning'],
    isLive: false,
    themeColor: '#06b6d4',
    glowColor: '#0891b2',
  },
  {
    id: 'ultron',
    title: 'ULTRON',
    fullTitle: 'ULTRON Savunma & Dağıtık Ağ',
    tagline: 'Merkeziyetsiz Güvenlik & Süreç Otomasyonu',
    description: 'Kendi kendini denetleyen, sistem açıklarını tespit edip otonom koruma kalkanı oluşturan dağıtık güvenlik mimarisi.',
    status: 'DEVRE DIŞI',
    statusColor: '#ef4444',
    badgeColor: '#b91c1c',
    tech: ['Zero-Trust', 'Wasm', 'P2P Mesh'],
    isLive: false,
    themeColor: '#f43f5e',
    glowColor: '#e11d48',
  },
]

export function ScreenCorridor({
  activeIndex = 0,
  onSelectProject,
  isZooming = false,
  notReadyStates = {},
  onTriggerNotReady,
}) {
  const groupRef = useRef()
  const screenSpacing = 6.8

  useFrame((state) => {
    if (!groupRef.current) return
    // Smooth horizontal position tracking
    const targetX = -activeIndex * screenSpacing
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      0.08
    )

    // Zooming effect into active screen when clicking live project
    if (isZooming) {
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        3.5,
        0.05
      )
    } else {
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        0,
        0.08
      )
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {PROJECTS.map((proj, idx) => (
        <ProjectScreenPod
          key={proj.id}
          project={proj}
          index={idx}
          position={[idx * screenSpacing, 0, 0]}
          isActive={idx === activeIndex}
          isNotReady={Boolean(notReadyStates[proj.id])}
          remainingSeconds={notReadyStates[proj.id] || 0}
          onClick={() => {
            if (proj.isLive) {
              playWarpSound()
              onSelectProject && onSelectProject(proj)
            } else {
              playWarningSound()
              onTriggerNotReady && onTriggerNotReady(proj.id)
            }
          }}
        />
      ))}
    </group>
  )
}

function ProjectScreenPod({
  project,
  index,
  position,
  isActive,
  isNotReady,
  remainingSeconds,
  onClick,
}) {
  const meshRef = useRef()
  const glowRef = useRef()
  const miniModelRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      // Floating wave animation
      const floatY = Math.sin(t * 1.5 + index * 0.8) * 0.08
      meshRef.current.position.y = position[1] + floatY

      // Tilt slightly towards center if not active
      const tilt = isActive ? 0 : index < 2 ? 0.06 : -0.06
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        tilt,
        0.05
      )
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = isNotReady
        ? 0.4 + Math.sin(t * 12) * 0.25 // Fast warning flashing
        : isActive
        ? 0.25 + Math.sin(t * 2) * 0.08
        : hovered
        ? 0.2
        : 0.08
    }

    // Mini 3D preview model inside screen rotation
    if (miniModelRef.current) {
      miniModelRef.current.rotation.y = t * 0.8
      miniModelRef.current.rotation.x = t * 0.4
    }
  })

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        playHoverSound()
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* ─── 1. OUTER CHASSIS & STAND ─── */}
      {/* Heavy base stand */}
      <mesh position={[0, -2.1, 0]}>
        <cylinderGeometry args={[0.7, 0.85, 0.16, 24]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Stand column */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 1.7, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Glowing ring on stand */}
      <mesh position={[0, -1.1, 0]}>
        <torusGeometry args={[0.15, 0.025, 12, 24]} />
        <meshStandardMaterial
          color={isNotReady ? '#ef4444' : project.themeColor}
          emissive={isNotReady ? '#dc2626' : project.glowColor}
          emissiveIntensity={3}
        />
      </mesh>

      {/* Monitor Outer Chassis Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.4, 2.7, 0.18]} />
        <meshStandardMaterial
          color="#0b1329"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Futuristic Beveled Border Trim */}
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[4.25, 2.55, 0.02]} />
        <meshStandardMaterial
          color={isNotReady ? '#ef4444' : isActive ? project.themeColor : '#334155'}
          emissive={isNotReady ? '#dc2626' : isActive ? project.glowColor : '#0f172a'}
          emissiveIntensity={isNotReady ? 2.5 : isActive ? 1.5 : 0.2}
          roughness={0.4}
        />
      </mesh>

      {/* Screen Surface (Glass Display) */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[4.1, 2.4]} />
        <meshStandardMaterial
          color={isNotReady ? '#1c0505' : '#030712'}
          emissive={isNotReady ? '#450a0a' : '#040b17'}
          emissiveIntensity={1}
          roughness={0.05}
          metalness={0.8}
        />
      </mesh>

      {/* Volumetric Holographic Glow Field */}
      <mesh ref={glowRef} position={[0, 0, 0.25]}>
        <planeGeometry args={[4.5, 2.8]} />
        <meshBasicMaterial
          color={isNotReady ? '#ef4444' : project.themeColor}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ─── 2. SCREEN CONTENT ─── */}
      {isNotReady ? (
        /* WARNING / NOT READY OVERLAY (WHEN CLICKED) */
        <group position={[0, 0, 0.14]}>
          <Text
            position={[0, 0.55, 0]}
            fontSize={0.24}
            color="#ef4444"
            anchorX="center"
            anchorY="middle"
          >
            HENÜZ HAZIR DEĞİL
          </Text>

          <Text
            position={[0, 0.22, 0]}
            fontSize={0.12}
            color="#fca5a5"
            anchorX="center"
            anchorY="middle"
          >
            [ BU MODÜL GELİŞTİRİLME AŞAMASINDA ]
          </Text>

          <Text
            position={[0, -0.05, 0]}
            fontSize={0.1}
            color="#f87171"
            anchorX="center"
            anchorY="middle"
          >
            {`Sıfırlanıyor: ${remainingSeconds} saniye`}
          </Text>

          {/* Animated Countdown Progress Bar on Screen */}
          <group position={[0, -0.35, 0]}>
            {/* Background bar */}
            <mesh>
              <boxGeometry args={[3.0, 0.08, 0.01]} />
              <meshBasicMaterial color="#450a0a" />
            </mesh>
            {/* Active countdown fill */}
            <mesh position={[(remainingSeconds / 5 - 1) * 1.5, 0, 0.005]} scale={[remainingSeconds / 5, 1, 1]}>
              <boxGeometry args={[3.0, 0.08, 0.01]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          </group>

          <Text
            position={[0, -0.65, 0]}
            fontSize={0.085}
            color="#991b1b"
            anchorX="center"
            anchorY="middle"
          >
            HERONJI SİSTEM PROTOKOLÜ // ERİŞİM KISITLI
          </Text>
        </group>
      ) : (
        /* NORMAL SCREEN VIEW */
        <group position={[0, 0, 0.14]}>
          {/* Top Status Header */}
          <Text
            position={[-1.75, 0.95, 0]}
            fontSize={0.08}
            color={project.statusColor}
            anchorX="left"
            anchorY="middle"
          >
            {`● ${project.status}`}
          </Text>

          <Text
            position={[1.75, 0.95, 0]}
            fontSize={0.075}
            color="#64748b"
            anchorX="right"
            anchorY="middle"
          >
            {`MODÜL #${index + 1} // HERONJI.FX`}
          </Text>

          {/* Project Title */}
          <Text
            position={[0, 0.58, 0]}
            fontSize={0.22}
            color={isActive ? project.themeColor : '#ffffff'}
            anchorX="center"
            anchorY="middle"
          >
            {project.title}
          </Text>

          {/* Subtitle / Tagline */}
          <Text
            position={[0, 0.32, 0]}
            fontSize={0.105}
            color="#cbd5e1"
            anchorX="center"
            anchorY="middle"
          >
            {project.tagline}
          </Text>

          {/* 3D Mini Interactive Hologram on Screen */}
          <group ref={miniModelRef} position={[0, -0.15, 0.1]}>
            {project.id === 'lab-dedektifi' ? (
              /* Mini Bohr Atom for Lab Dedektifi */
              <group scale={0.42}>
                <mesh>
                  <sphereGeometry args={[0.24, 16, 16]} />
                  <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={2.5} />
                </mesh>
                <mesh rotation={[Math.PI / 3, 0, 0]}>
                  <torusGeometry args={[0.55, 0.02, 12, 32]} />
                  <meshBasicMaterial color="#38bdf8" />
                </mesh>
                <mesh rotation={[-Math.PI / 3, 0, 0]}>
                  <torusGeometry args={[0.55, 0.02, 12, 32]} />
                  <meshBasicMaterial color="#8b5cf6" />
                </mesh>
              </group>
            ) : project.id === 'yanlis-degil' ? (
              /* Neural / Question core for Yanlış Değil */
              <group scale={0.38}>
                <mesh>
                  <octahedronGeometry args={[0.45]} />
                  <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={2} wireframe />
                </mesh>
                <mesh>
                  <sphereGeometry args={[0.2, 16, 16]} />
                  <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={2} />
                </mesh>
              </group>
            ) : project.id === 'jarvis' ? (
              /* AI Arc Reactor for J.A.R.V.I.S. */
              <group scale={0.4}>
                <mesh>
                  <torusGeometry args={[0.45, 0.05, 16, 32]} />
                  <meshStandardMaterial color="#a855f7" emissive="#7c3aed" emissiveIntensity={3} />
                </mesh>
                <mesh>
                  <cylinderGeometry args={[0.2, 0.2, 0.08, 16]} />
                  <meshStandardMaterial color="#c084fc" emissive="#9333ea" emissiveIntensity={2} />
                </mesh>
              </group>
            ) : project.id === 'friday' ? (
              /* Tactical Prism for Friday */
              <group scale={0.38}>
                <mesh>
                  <tetrahedronGeometry args={[0.5]} />
                  <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={2.5} wireframe />
                </mesh>
              </group>
            ) : (
              /* Shield Core for Ultron */
              <group scale={0.38}>
                <mesh>
                  <dodecahedronGeometry args={[0.45]} />
                  <meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={2} wireframe />
                </mesh>
              </group>
            )}
          </group>

          {/* Action Button on Screen */}
          <group position={[0, -0.68, 0]}>
            <mesh>
              <boxGeometry args={[2.4, 0.28, 0.02]} />
              <meshStandardMaterial
                color={project.isLive ? '#0284c7' : '#1e293b'}
                emissive={project.isLive ? '#0369a1' : '#0f172a'}
                emissiveIntensity={1}
              />
            </mesh>
            <Text
              position={[0, 0, 0.02]}
              fontSize={0.095}
              color={project.isLive ? '#ffffff' : '#94a3b8'}
              anchorX="center"
              anchorY="middle"
            >
              {project.isLive
                ? '▶ PROJEYE GİRİŞ YAP (CANLI SİTE) ◀'
                : '🔒 MODÜLÜ İNCELE (KİLİTLİ)'}
            </Text>
          </group>
        </group>
      )}

      {/* Screen Spot Light */}
      <pointLight
        position={[0, 0, 1.2]}
        color={isNotReady ? '#ef4444' : project.themeColor}
        intensity={isActive ? 2.2 : 0.8}
        distance={4}
      />
    </group>
  )
}
