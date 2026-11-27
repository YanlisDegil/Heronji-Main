import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { CloudsTransition } from './CloudsTransition'
import { playClickSound, playWarningSound, playWarpSound } from '../../utils/audio'

export const VERTICAL_PROJECTS = [
  {
    id: 'lab-dedektifi',
    number: '01',
    title: 'LABORATUVAR DEDEKTİFİ',
    tagline: '3D İnteraktif Bilim Laboratuvarı',
    description: 'Fizik, Kimya ve Biyoloji deneylerini tarayıcıda çalıştıran gerçek zamanlı simülasyon motoru.',
    status: 'CANLI & YAYINDA',
    statusColor: '#10b981',
    url: 'https://lab-dedektifi.vercel.app/',
    isLive: true,
    yPos: -7.5,
    accentColor: '#38bdf8',
  },
  {
    id: 'yanlis-degil',
    number: '02',
    title: 'YANLIŞ DEĞİL',
    tagline: 'Felsefe, Bilim ve Eleştirel Düşünce',
    description: 'Yanlışını yakalar, nedenini anlatır. MEB müfredatına uygun interaktif kavram yanılgısı analiz sistemi.',
    status: 'CANLI PLATFORM',
    statusColor: '#38bdf8',
    url: 'https://yanlisdegil.github.io/Yanlis-Degil/',
    isLive: true,
    yPos: -14.5,
    accentColor: '#60a5fa',
  },
  {
    id: 'jarvis',
    number: '03',
    title: 'J.A.R.V.I.S.',
    tagline: 'Gömülü Sensör & Otonom Kontrol Motoru',
    description: 'C/C++ ve Python tabanlı mikrodenetleyici kontrolü, gömülü sistemler ve otonom robot yönetimi.',
    status: 'DONANIM PROTOKOLÜ',
    statusColor: '#a78bfa',
    isLive: false,
    yPos: -21.5,
    accentColor: '#a78bfa',
  },
  {
    id: 'friday',
    number: '04',
    title: 'FRIDAY',
    tagline: 'Robotik Sensör & PID Algoritma Takibi',
    description: '2026 Kayseri MEB Çizgi İzleyen Robot sensör kalibrasyonu, telemetri ve anlık hız eğrileri.',
    status: 'GELİŞTİRİLİYOR',
    statusColor: '#fbbf24',
    isLive: false,
    yPos: -28.5,
    accentColor: '#fbbf24',
  },
  {
    id: 'ultron',
    number: '05',
    title: 'ULTRON',
    tagline: 'Donanım Güvenliği & Dağıtık Ağ',
    description: 'Merkeziyetsiz donanım haberleşmesi ve otonom firmware koruma mimarisi.',
    status: 'KİLİTLİ SİSTEM',
    statusColor: '#f87171',
    isLive: false,
    yPos: -35.5,
    accentColor: '#f87171',
  },
]

export function VerticalProjectCorridor({
  notReadyStates = {},
  onTriggerNotReady,
  onOpenProject,
}) {
  return (
    <group position={[0, 0, 0]}>
      {VERTICAL_PROJECTS.map((proj) => (
        <VerticalScreenPod
          key={proj.id}
          project={proj}
          isNotReady={Boolean(notReadyStates[proj.id])}
          remainingSeconds={notReadyStates[proj.id] || 0}
          onTriggerNotReady={() => onTriggerNotReady(proj.id)}
          onOpenProject={() => onOpenProject(proj)}
        />
      ))}
    </group>
  )
}

function VerticalScreenPod({
  project,
  isNotReady,
  remainingSeconds,
  onTriggerNotReady,
  onOpenProject,
}) {
  const groupRef = useRef()
  const miniModelRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (miniModelRef.current) {
      miniModelRef.current.rotation.y = t * 0.7
    }
  })

  const handleScreenClick = (e) => {
    e.stopPropagation()
    if (project.isLive && project.url) {
      playWarpSound()
      onOpenProject && onOpenProject()
    } else {
      playWarningSound()
      onTriggerNotReady && onTriggerNotReady()
    }
  }

  return (
    <group ref={groupRef} position={[0, project.yPos, 0]}>
      {/* ─── ARCHITECTURAL PEDESTAL & PODIUM ─── */}
      {/* Heavy stone/concrete plinth base */}
      <mesh position={[0, -2.1, 0]}>
        <cylinderGeometry args={[1.6, 1.9, 0.25, 32]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Modern dual steel support columns */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, -1.1, 0]}>
          <boxGeometry args={[0.08, 1.8, 0.12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.25} />
        </mesh>
      ))}

      {/* Monitor Outer Chassis Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.6, 2.7, 0.14]} />
        <meshStandardMaterial
          color={hovered ? '#1e293b' : '#0f172a'}
          metalness={0.6}
          roughness={0.35}
        />
      </mesh>

      {/* Screen Border Chamfer */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[4.45, 2.55, 0.015]} />
        <meshStandardMaterial
          color={isNotReady ? '#450a0a' : hovered ? '#334155' : '#1e293b'}
          roughness={0.5}
        />
      </mesh>

      {/* Active Screen Display Glass Surface (Clickable!) */}
      <mesh
        position={[0, 0, 0.085]}
        onClick={handleScreenClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        <planeGeometry args={[4.35, 2.45]} />
        <meshStandardMaterial
          color={isNotReady ? '#1c1917' : '#090d16'}
          roughness={0.2}
          metalness={0.15}
        />
      </mesh>

      {/* ─── SCREEN CONTENT (CLEAN, PROMINENT & DIRECT) ─── */}
      {isNotReady ? (
        /* WARNING / NOT READY OVERLAY */
        <group position={[0, 0, 0.1]}>
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.24}
            color="#f87171"
            anchorX="center"
            anchorY="middle"
          >
            HENÜZ HAZIR DEĞİL
          </Text>

          <Text
            position={[0, 0.18, 0]}
            fontSize={0.11}
            color="#cbd5e1"
            anchorX="center"
            anchorY="middle"
          >
            Bu modül geliştirme ve donanım test aşamasındadır.
          </Text>

          <Text
            position={[0, -0.15, 0]}
            fontSize={0.1}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            {`Durum sıfırlanıyor: ${remainingSeconds} saniye`}
          </Text>

          {/* Progress bar */}
          <group position={[0, -0.42, 0]}>
            <mesh>
              <boxGeometry args={[2.6, 0.035, 0.005]} />
              <meshBasicMaterial color="#374151" />
            </mesh>
            <mesh
              position={[(remainingSeconds / 5 - 1) * 1.3, 0, 0.002]}
              scale={[remainingSeconds / 5, 1, 1]}
            >
              <boxGeometry args={[2.6, 0.035, 0.005]} />
              <meshBasicMaterial color="#f87171" />
            </mesh>
          </group>
        </group>
      ) : (
        /* NORMAL SCREEN VIEW */
        <group position={[0, 0, 0.1]}>
          {/* Top Header Badge */}
          <Text
            position={[-1.9, 0.98, 0]}
            fontSize={0.085}
            color={project.statusColor}
            anchorX="left"
            anchorY="middle"
          >
            {`• ${project.status}`}
          </Text>

          <Text
            position={[1.9, 0.98, 0]}
            fontSize={0.08}
            color="#64748b"
            anchorX="right"
            anchorY="middle"
          >
            {`SİSTEM #${project.number}`}
          </Text>

          {/* Main Title */}
          <Text
            position={[0, 0.58, 0]}
            fontSize={0.24}
            color="#f8fafc"
            anchorX="center"
            anchorY="middle"
          >
            {project.title}
          </Text>

          {/* Tagline */}
          <Text
            position={[0, 0.28, 0]}
            fontSize={0.105}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            {project.tagline}
          </Text>

          {/* 3D Mini Interactive Hologram / Object on Screen */}
          <group ref={miniModelRef} position={[0, -0.18, 0.08]}>
            {project.id === 'lab-dedektifi' ? (
              /* 3D Beaker with Liquid */
              <group scale={0.48}>
                <mesh position={[0, 0.25, 0]}>
                  <cylinderGeometry args={[0.22, 0.7, 0.9, 24]} />
                  <meshStandardMaterial
                    color="#e2e8f0"
                    transparent
                    opacity={0.45}
                    roughness={0.1}
                  />
                </mesh>
                <mesh position={[0, -0.05, 0]}>
                  <cylinderGeometry args={[0.55, 0.65, 0.4, 24]} />
                  <meshStandardMaterial color="#0284c7" roughness={0.15} />
                </mesh>
              </group>
            ) : project.id === 'yanlis-degil' ? (
              /* 3D Book / Learning Slate */
              <group scale={0.5}>
                <mesh>
                  <boxGeometry args={[0.9, 0.08, 0.65]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.5} />
                </mesh>
                <mesh position={[0, 0.045, 0]}>
                  <boxGeometry args={[0.82, 0.02, 0.58]} />
                  <meshStandardMaterial color="#f8fafc" roughness={0.8} />
                </mesh>
              </group>
            ) : project.id === 'jarvis' ? (
              /* Microcontroller Board */
              <group scale={0.52}>
                <mesh>
                  <boxGeometry args={[0.7, 0.03, 0.5]} />
                  <meshStandardMaterial color="#15803d" roughness={0.4} />
                </mesh>
                <mesh position={[0, 0.02, 0]}>
                  <boxGeometry args={[0.3, 0.02, 0.3]} />
                  <meshStandardMaterial color="#1f2937" roughness={0.3} metalness={0.8} />
                </mesh>
              </group>
            ) : project.id === 'friday' ? (
              /* Line Sensor Array */
              <group scale={0.5}>
                <mesh>
                  <boxGeometry args={[0.8, 0.03, 0.18]} />
                  <meshStandardMaterial color="#1f2937" roughness={0.4} />
                </mesh>
                {[-0.3, -0.15, 0, 0.15, 0.3].map((sx, i) => (
                  <mesh key={i} position={[sx, 0.025, 0]}>
                    <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.8} />
                  </mesh>
                ))}
              </group>
            ) : (
              /* Security Shield Node */
              <group scale={0.48}>
                <mesh>
                  <octahedronGeometry args={[0.55]} />
                  <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.7} />
                </mesh>
              </group>
            )}
          </group>

          {/* Primary Action Button directly in 3D */}
          <group
            position={[0, -0.72, 0.02]}
            onClick={handleScreenClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHovered(true)
            }}
          >
            <mesh>
              <boxGeometry args={[2.8, 0.28, 0.02]} />
              <meshStandardMaterial
                color={project.isLive ? '#0284c7' : '#1e293b'}
                roughness={0.35}
              />
            </mesh>
            <Text
              position={[0, 0, 0.018]}
              fontSize={0.095}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {project.id === 'lab-dedektifi'
                ? '▶ LABORATUVAR DEDEKTİFİ\'NE GİR'
                : project.id === 'yanlis-degil'
                ? '▶ YANLIŞ DEĞİL PLATFORMUNU AÇ'
                : '🔒 MODÜLÜ KONTROL ET'}
            </Text>
          </group>
        </group>
      )}

      {/* Gentle, realistic key lighting specifically illuminating this screen */}
      <pointLight
        position={[0, 0.6, 1.4]}
        color="#f8fafc"
        intensity={hovered ? 1.4 : 1.0}
        distance={5}
      />

      {/* Realistic Cloud Wisps drifting gently around the base of the podium */}
      <CloudsTransition position={[0, -2.1, -0.5]} density={12} spread={[7.5, 1.0, 3.5]} />
    </group>
  )
}
