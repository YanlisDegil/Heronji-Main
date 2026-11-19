import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { playClickSound, playWarningSound, playWarpSound } from '../../utils/audio'

export const PROJECTS = [
  {
    id: 'lab-dedektifi',
    title: 'LAB DEDEKTİFİ',
    fullTitle: 'Laboratuvar Dedektifi',
    tagline: '3D İnteraktif Bilim Laboratuvarı',
    description: 'Fizik, Kimya ve Biyoloji deneylerini web tarayıcısında gerçek zamanlı 3D simülasyonlarla sunan bilim platformu.',
    status: 'CANLI & AKTİF',
    statusColor: '#10b981',
    tech: ['Three.js', 'React', 'Tailwind', 'Vite'],
    url: 'https://lab-dedektifi.vercel.app/',
    isLive: true,
  },
  {
    id: 'yanlis-degil',
    title: 'YANLIŞ DEĞİL',
    fullTitle: 'Yanlış Değil Platformu',
    tagline: 'Felsefe, Bilim ve Eleştirel Düşünce',
    description: 'Yanlışını yakalar, nedenini anlatır. MEB müfredatına uygun interaktif soru, felsefe ve kavram yanılgısı analiz sistemi.',
    status: 'CANLI PROJE',
    statusColor: '#38bdf8',
    tech: ['Vanilla JS', 'Eğitim Motoru', 'API'],
    url: 'https://yanlisdegil.github.io/Yanlis-Degil/',
    isLive: false, // click on screen triggers not ready test, but button links to live site
  },
  {
    id: 'jarvis',
    title: 'J.A.R.V.I.S.',
    fullTitle: 'J.A.R.V.I.S. Donanım & Asistan',
    tagline: 'Gömülü Sensör & Otonom Kontrol Motoru',
    description: 'C/C++ ve Python tabanlı mikrodenetleyici kontrolü, gömülü sistemler ve otonom robot yönetimi.',
    status: 'DONANIM PROTOKOLÜ',
    statusColor: '#94a3b8',
    tech: ['C / C++', 'Python', 'Gömülü Sistemler'],
    isLive: false,
  },
  {
    id: 'friday',
    title: 'FRIDAY',
    fullTitle: 'F.R.I.D.A.Y. Telemetri Arayüzü',
    tagline: 'Robotik Sensör & PID Algoritma Takibi',
    description: 'Çizgi izleyen robot sensör kalibrasyonu, hız eğrileri ve gerçek zamanlı telemetri analiz platformu.',
    status: 'GELİŞTİRİLİYOR',
    statusColor: '#94a3b8',
    tech: ['C++', 'Sensör Dizisi', 'Gerçek Zamanlı Veri'],
    isLive: false,
  },
  {
    id: 'ultron',
    title: 'ULTRON',
    fullTitle: 'ULTRON Dağıtık Mimari',
    tagline: 'Donanım Güvenliği & Süreç Otomasyonu',
    description: 'Merkeziyetsiz donanım haberleşmesi ve güvenli gömülü firmware dağıtım çekirdeği.',
    status: 'KİLİTLİ',
    statusColor: '#94a3b8',
    tech: ['Embedded Security', 'CAN Bus', 'Firmware'],
    isLive: false,
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
  const screenSpacing = 6.2

  useFrame(() => {
    if (!groupRef.current) return
    const targetX = -activeIndex * screenSpacing
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      0.08
    )

    if (isZooming) {
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        3.2,
        0.06
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
        <RealisticScreenPod
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

function RealisticScreenPod({
  project,
  index,
  position,
  isActive,
  isNotReady,
  remainingSeconds,
  onClick,
}) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current) {
      // Subtle natural breathing motion
      meshRef.current.position.y = position[1]
      const tilt = isActive ? 0 : index < 2 ? 0.04 : -0.04
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        tilt,
        0.05
      )
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
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* ─── REALISTIC HARDWARE MONITOR STAND & CHASSIS (0 NEON) ─── */}
      {/* Heavy cast aluminum desk mount */}
      <mesh position={[0, -2.1, 0]}>
        <cylinderGeometry args={[0.65, 0.75, 0.12, 24]} />
        <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Monitor vertical stand column */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[0.14, 1.8, 0.14]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Monitor Outer Chassis Frame (Matte Charcoal with subtle bevel) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.2, 2.5, 0.12]} />
        <meshStandardMaterial
          color={isActive ? '#18202f' : '#111827'}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Slim Screen Bezel Trim */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[4.05, 2.35, 0.015]} />
        <meshStandardMaterial
          color={isNotReady ? '#3f1d1d' : '#0f172a'}
          roughness={0.6}
        />
      </mesh>

      {/* Active Screen Display Glass */}
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[3.95, 2.25]} />
        <meshStandardMaterial
          color={isNotReady ? '#1c1917' : '#090d16'}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* ─── SCREEN CONTENT (CLEAN, SOBER, EDITORIAL) ─── */}
      {isNotReady ? (
        /* SADE "HENÜZ HAZIR DEĞİL" UYARISI */
        <group position={[0, 0, 0.09]}>
          <Text
            position={[0, 0.45, 0]}
            fontSize={0.22}
            color="#f87171"
            anchorX="center"
            anchorY="middle"
          >
            HENÜZ HAZIR DEĞİL
          </Text>

          <Text
            position={[0, 0.15, 0]}
            fontSize={0.105}
            color="#cbd5e1"
            anchorX="center"
            anchorY="middle"
          >
            Bu proje geliştirilme ve test aşamasındadır.
          </Text>

          <Text
            position={[0, -0.15, 0]}
            fontSize={0.095}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            {`Durum sıfırlanıyor: ${remainingSeconds} saniye`}
          </Text>

          {/* Minimalist Progress Line */}
          <group position={[0, -0.4, 0]}>
            <mesh>
              <boxGeometry args={[2.4, 0.03, 0.005]} />
              <meshBasicMaterial color="#374151" />
            </mesh>
            <mesh
              position={[(remainingSeconds / 5 - 1) * 1.2, 0, 0.002]}
              scale={[remainingSeconds / 5, 1, 1]}
            >
              <boxGeometry args={[2.4, 0.03, 0.005]} />
              <meshBasicMaterial color="#f87171" />
            </mesh>
          </group>
        </group>
      ) : (
        /* NORMAL CLEAN SCREEN VIEW */
        <group position={[0, 0, 0.09]}>
          {/* Top Status Header */}
          <Text
            position={[-1.7, 0.88, 0]}
            fontSize={0.08}
            color={project.statusColor}
            anchorX="left"
            anchorY="middle"
          >
            {`• ${project.status}`}
          </Text>

          <Text
            position={[1.7, 0.88, 0]}
            fontSize={0.075}
            color="#64748b"
            anchorX="right"
            anchorY="middle"
          >
            {`MODÜL 0${index + 1}`}
          </Text>

          {/* Project Title */}
          <Text
            position={[0, 0.48, 0]}
            fontSize={0.21}
            color="#f8fafc"
            anchorX="center"
            anchorY="middle"
          >
            {project.title}
          </Text>

          {/* Tagline */}
          <Text
            position={[0, 0.22, 0]}
            fontSize={0.095}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            {project.tagline}
          </Text>

          {/* Realistic 3D Mini Model on Screen */}
          <group position={[0, -0.22, 0.05]}>
            {project.id === 'lab-dedektifi' ? (
              /* Realistic Lab Flask with liquid */
              <group scale={0.4}>
                {/* Conical Flask Glass Body */}
                <mesh position={[0, 0.2, 0]}>
                  <cylinderGeometry args={[0.2, 0.65, 0.8, 20]} />
                  <meshStandardMaterial
                    color="#e2e8f0"
                    transparent
                    opacity={0.5}
                    roughness={0.1}
                  />
                </mesh>
                {/* Liquid inside */}
                <mesh position={[0, -0.05, 0]}>
                  <cylinderGeometry args={[0.5, 0.6, 0.35, 20]} />
                  <meshStandardMaterial color="#0284c7" roughness={0.2} />
                </mesh>
              </group>
            ) : project.id === 'yanlis-degil' ? (
              /* Educational Book / Slate Model */
              <group scale={0.45}>
                <mesh>
                  <boxGeometry args={[0.85, 0.06, 0.65]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.6} />
                </mesh>
                <mesh position={[0, 0.035, 0]}>
                  <boxGeometry args={[0.78, 0.02, 0.58]} />
                  <meshStandardMaterial color="#f8fafc" roughness={0.8} />
                </mesh>
              </group>
            ) : (
              /* Microcontroller chip model */
              <group scale={0.45}>
                <mesh>
                  <boxGeometry args={[0.6, 0.04, 0.6]} />
                  <meshStandardMaterial color="#1f2937" roughness={0.4} metalness={0.3} />
                </mesh>
                <mesh position={[0, 0.025, 0]}>
                  <boxGeometry args={[0.35, 0.02, 0.35]} />
                  <meshStandardMaterial color="#111827" roughness={0.2} metalness={0.8} />
                </mesh>
              </group>
            )}
          </group>

          {/* Clean Action Button */}
          <group position={[0, -0.68, 0]}>
            <mesh>
              <boxGeometry args={[2.2, 0.24, 0.01]} />
              <meshStandardMaterial
                color={project.isLive ? '#0284c7' : '#1f2937'}
                roughness={0.4}
              />
            </mesh>
            <Text
              position={[0, 0, 0.015]}
              fontSize={0.085}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {project.isLive
                ? '▶ CANLI LABORATUVARA GİR'
                : project.id === 'yanlis-degil'
                ? '▶ YANLIŞ DEĞİL SİTESİNİ AÇ'
                : 'DURUMU KONTROL ET'}
            </Text>
          </group>
        </group>
      )}

      {/* Gentle, realistic screen surface illumination */}
      <pointLight
        position={[0, 0, 0.8]}
        color="#f8fafc"
        intensity={isActive ? 0.8 : 0.25}
        distance={3.5}
      />
    </group>
  )
}
