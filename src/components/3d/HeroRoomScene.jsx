import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Generate a sharp CanvasTexture mimicking the HERONJI screen from the user's desk photo
function createMonitorScreenTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 576
  const ctx = canvas.getContext('2d')

  // Clean bright interface background (matches the white/clean UI in user's photo)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 1024, 576)

  // Left subtle blurred sidebar tint (matches YouTube Studio / channel layout in photo)
  ctx.fillStyle = '#f3f4f6'
  ctx.fillRect(0, 0, 210, 576)
  ctx.fillStyle = '#e5e7eb'
  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    ctx.roundRect(24, 36 + i * 52, 150, 24, 6)
    ctx.fill()
  }

  // Right subtle sidebar tint
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(830, 0, 194, 576)

  // Top Banner art
  const bannerGrad = ctx.createLinearGradient(250, 24, 780, 100)
  bannerGrad.addColorStop(0, '#0f172a')
  bannerGrad.addColorStop(0.5, '#1e293b')
  bannerGrad.addColorStop(1, '#334155')
  ctx.fillStyle = bannerGrad
  ctx.beginPath()
  ctx.roundRect(250, 22, 540, 86, 14)
  ctx.fill()

  ctx.fillStyle = '#f8fafc'
  ctx.font = 'bold 28px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('HERONJI TOPLULUĞU', 520, 74)

  // Channel Avatar Circle
  ctx.fillStyle = '#1e293b'
  ctx.beginPath()
  ctx.arc(305, 165, 38, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 24px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('H.fx', 305, 173)

  // Channel Title: HERONJI
  ctx.textAlign = 'left'
  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 34px Inter, system-ui, sans-serif'
  ctx.fillText('HERONJI', 362, 154)

  ctx.fillStyle = '#475569'
  ctx.font = '18px Inter, system-ui, sans-serif'
  ctx.fillText('@heronji.fx  •  Donanım, Yazılım & 3D Bilim', 362, 182)

  // Action pills ("Analytics", "Kanalı özelleştir", "Topluluk")
  const pills = [
    { x: 362, w: 120, text: 'Analytics' },
    { x: 492, w: 155, text: 'Kanalı özelleştir' },
    { x: 657, w: 120, text: 'Topluluk' },
  ]
  pills.forEach((p) => {
    ctx.fillStyle = '#f1f5f9'
    ctx.beginPath()
    ctx.roundRect(p.x, 198, p.w, 32, 16)
    ctx.fill()
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.fillStyle = '#0f172a'
    ctx.font = '600 14px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(p.text, p.x + p.w / 2, 219)
  })

  // Tabs Row
  ctx.textAlign = 'left'
  ctx.font = '600 16px Inter, system-ui, sans-serif'
  const tabs = ['Videolar', 'Shorts', 'Projeler', 'Topluluk']
  let tabX = 255
  tabs.forEach((tab, idx) => {
    ctx.fillStyle = idx === 1 ? '#0f172a' : '#64748b'
    ctx.fillText(tab, tabX, 272)
    if (idx === 1) {
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(tabX, 282, 54, 3)
    }
    tabX += 110
  })

  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(250, 285)
  ctx.lineTo(790, 285)
  ctx.stroke()

  // 3 Project / Shorts Thumbnail Cards matching the photo
  const cards = [
    { x: 255, bg: '#1e293b', accent: '#ef4444', title: 'Lab Dedektifi 3D' },
    { x: 435, bg: '#3b0764', accent: '#a855f7', title: 'Kayseri Robotik' },
    { x: 615, bg: '#0f172a', accent: '#38bdf8', title: 'Yanlış Değil' },
  ]
  cards.forEach((c) => {
    const grad = ctx.createLinearGradient(c.x, 305, c.x + 160, 530)
    grad.addColorStop(0, c.bg)
    grad.addColorStop(1, c.accent)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.roundRect(c.x, 305, 162, 232, 12)
    ctx.fill()

    // Inner bright detail
    ctx.fillStyle = 'rgba(255,255,255,0.14)'
    ctx.beginPath()
    ctx.arc(c.x + 81, 405, 36, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(c.title, c.x + 81, 512)
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

// Spinning PC Case Fan with realistic pastel multi-color RGB ring
function PCFan({ position, rotation = [0, 0, 0], size = 0.24, color1 = '#7dd3fc', color2 = '#f9a8d4' }) {
  const bladeRef = useRef()
  useFrame((_, delta) => {
    if (bladeRef.current) {
      bladeRef.current.rotation.z -= delta * 6.5
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* White square outer housing */}
      <mesh>
        <boxGeometry args={[size, size, 0.03]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Inner dark cutout */}
      <mesh position={[0, 0, 0.004]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[size * 0.42, size * 0.42, 0.032, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {/* Soft Pastel RGB Ring */}
      <mesh position={[0, 0, 0.017]}>
        <torusGeometry args={[size * 0.38, size * 0.045, 12, 28]} />
        <meshStandardMaterial
          color={color1}
          emissive={color2}
          emissiveIntensity={1.35}
          roughness={0.2}
        />
      </mesh>
      {/* Spinning blades & center hub */}
      <group ref={bladeRef} position={[0, 0, 0.015]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[size * 0.14, size * 0.14, 0.025, 16]} />
          <meshStandardMaterial color="#ffffff" emissive={color1} emissiveIntensity={0.6} />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((b) => (
          <mesh key={b} rotation={[0.35, 0, (b * Math.PI) / 3]} position={[0, 0, 0]}>
            <boxGeometry args={[size * 0.68, size * 0.07, 0.008]} />
            <meshStandardMaterial color="#e2e8f0" transparent opacity={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function HeroRoomScene({ mousePosRef }) {
  const roomGroupRef = useRef()
  const screenTexture = useMemo(() => createMonitorScreenTexture(), [])

  // Curved white AIO liquid cooler hoses
  const aioTubes = useMemo(() => {
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.02, 0.08, -0.05),
      new THREE.Vector3(0.08, 0.15, 0.08),
      new THREE.Vector3(0.14, 0.34, 0.06),
      new THREE.Vector3(0.1, 0.44, -0.05),
    ])
    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.03, 0.06, -0.05),
      new THREE.Vector3(0.12, 0.12, 0.05),
      new THREE.Vector3(0.18, 0.32, 0.03),
      new THREE.Vector3(0.14, 0.44, -0.08),
    ])
    return [curve1, curve2]
  }, [])

  // Curved white GPU power cable
  const gpuCable = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.05, -0.08, 0.06),
      new THREE.Vector3(-0.04, -0.2, 0.09),
      new THREE.Vector3(-0.08, -0.29, 0.02),
    ])
  }, [])

  useFrame((_, delta) => {
    if (!roomGroupRef.current || !mousePosRef) return
    const mx = mousePosRef.current.x
    const my = mousePosRef.current.y

    roomGroupRef.current.rotation.y = THREE.MathUtils.damp(
      roomGroupRef.current.rotation.y,
      mx * 0.045,
      5,
      delta
    )
    roomGroupRef.current.rotation.x = THREE.MathUtils.damp(
      roomGroupRef.current.rotation.x,
      -my * 0.028,
      5,
      delta
    )
  })

  // Books on upper shelf matching the photo's colorful spines
  const leftShelfBooks = [
    { x: -0.52, h: 0.44, w: 0.045, c: '#334155', rot: 0 },
    { x: -0.47, h: 0.42, w: 0.04, c: '#1e293b', rot: 0 },
    { x: -0.42, h: 0.45, w: 0.05, c: '#7c2d12', rot: 0 },
    { x: -0.36, h: 0.41, w: 0.045, c: '#14532d', rot: 0 },
    { x: -0.31, h: 0.43, w: 0.04, c: '#1e3a8a', rot: 0 },
    { x: -0.25, h: 0.39, w: 0.05, c: '#3f3f46', rot: 0 },
    { x: -0.19, h: 0.42, w: 0.045, c: '#991b1b', rot: 0 },
    { x: -0.12, h: 0.4, w: 0.045, c: '#0f172a', rot: -0.14 },
  ]
  const rightShelfBooks = [
    { x: 0.22, h: 0.41, w: 0.03, c: '#15803d', rot: 0.16 },
    { x: 0.27, h: 0.42, w: 0.03, c: '#0369a1', rot: 0.16 },
    { x: 0.32, h: 0.4, w: 0.03, c: '#b45309', rot: 0.16 },
    { x: 0.37, h: 0.43, w: 0.03, c: '#e2e8f0', rot: 0.16 },
    { x: 0.42, h: 0.41, w: 0.03, c: '#4338ca', rot: 0.16 },
    { x: 0.47, h: 0.42, w: 0.03, c: '#be123c', rot: 0.16 },
    { x: 0.52, h: 0.39, w: 0.03, c: '#334155', rot: 0.16 },
  ]

  return (
    <group ref={roomGroupRef} position={[0.25, -0.35, 0]}>
      {/* ─── 1. DESK & OVERHEAD CABINET/SHELVING STRUCTURE ─── */}
      <group position={[0, -0.65, -0.4]}>
        {/* Main White Desk Tabletop */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.4, 0.08, 1.85]} />
          <meshStandardMaterial color="#eceae4" roughness={0.45} metalness={0.04} />
        </mesh>

        {/* Left White Vertical Side Wall Panel */}
        <mesh position={[-2.16, 0.65, -0.15]}>
          <boxGeometry args={[0.07, 2.8, 1.55]} />
          <meshStandardMaterial color="#e6e3dc" roughness={0.55} />
        </mesh>

        {/* Back Cream/Off-White Panel behind Desk */}
        <mesh position={[0, 1.1, -0.9]}>
          <boxGeometry args={[4.4, 2.3, 0.06]} />
          <meshStandardMaterial color="#dad5ca" roughness={0.8} />
        </mesh>

        {/* Dark Walnut Vertical Divider & Accent Pillars */}
        <mesh position={[0.45, 0.72, -0.84]}>
          <boxGeometry args={[0.24, 1.4, 0.08]} />
          <meshStandardMaterial color="#4b3424" roughness={0.65} />
        </mesh>
        {/* Left bottom leg accent */}
        <mesh position={[-1.95, -0.68, 0.35]}>
          <boxGeometry args={[0.32, 1.28, 0.8]} />
          <meshStandardMaterial color="#4b3424" roughness={0.65} />
        </mesh>

        {/* Right Side Under-Desk Drawer Cabinet (3 White Drawers + Silver Knobs) */}
        <group position={[1.55, -0.68, 0.15]}>
          <mesh>
            <boxGeometry args={[1.15, 1.28, 1.45]} />
            <meshStandardMaterial color="#e5e2db" roughness={0.5} />
          </mesh>
          {[0.4, 0, -0.4].map((dy, idx) => (
            <group key={idx} position={[0, dy, 0.735]}>
              {/* Drawer front plate */}
              <mesh>
                <boxGeometry args={[1.08, 0.36, 0.03]} />
                <meshStandardMaterial color="#f1efe9" roughness={0.45} />
              </mesh>
              {/* Metallic round knob */}
              <mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.032, 0.025, 0.04, 16]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Overhead Bookshelf / Cabinet Hutch */}
        <group position={[0, 1.45, -0.45]}>
          {/* Shelf Bottom Board */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[4.4, 0.07, 0.9]} />
            <meshStandardMaterial color="#ebe8e1" roughness={0.5} />
          </mesh>
          {/* Shelf Top Board */}
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[4.4, 0.07, 0.9]} />
            <meshStandardMaterial color="#ebe8e1" roughness={0.5} />
          </mesh>

          {/* Left Closed White Cabinet Door */}
          <group position={[-1.12, 0.325, 0.45]}>
            <mesh>
              <boxGeometry args={[2.05, 0.6, 0.04]} />
              <meshStandardMaterial color="#f2f0ea" roughness={0.45} />
            </mesh>
            {/* Silver Vertical Handle */}
            <mesh position={[0.9, 0, 0.04]}>
              <cylinderGeometry args={[0.015, 0.015, 0.34, 12]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
            </mesh>
          </group>

          {/* Dark Walnut Middle Divider on Open Shelf */}
          <mesh position={[0.68, 0.325, -0.02]}>
            <boxGeometry args={[0.18, 0.6, 0.85]} />
            <meshStandardMaterial color="#4b3424" roughness={0.65} />
          </mesh>

          {/* Books in Shelf */}
          <group position={[0.55, 0.035, 0.1]}>
            {leftShelfBooks.map((b, i) => (
              <mesh key={i} position={[b.x, b.h / 2, 0]} rotation={[0, 0, b.rot]}>
                <boxGeometry args={[b.w, b.h, 0.28]} />
                <meshStandardMaterial color={b.c} roughness={0.75} />
              </mesh>
            ))}
            {rightShelfBooks.map((b, i) => (
              <mesh key={i} position={[b.x + 0.25, b.h / 2, 0]} rotation={[0, 0, b.rot]}>
                <boxGeometry args={[b.w, b.h, 0.28]} />
                <meshStandardMaterial color={b.c} roughness={0.75} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Left Power Strip & Plugs on Side Wall (Authentic Detail from Photo) */}
        <group position={[-2.11, 0.72, 0.25]} rotation={[0, 0, 0.06]}>
          <mesh>
            <boxGeometry args={[0.06, 0.48, 0.14]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
          {/* Plugs & White Charger Bricks */}
          {[0.12, 0, -0.14].map((py, idx) => (
            <mesh key={idx} position={[0.06, py, 0]}>
              <boxGeometry args={[0.08, 0.07, 0.07]} />
              <meshStandardMaterial color={idx === 0 ? '#1e293b' : '#f1f5f9'} roughness={0.4} />
            </mesh>
          ))}
        </group>

        {/* ─── 2. BLACK DESK MAT, MECHANICAL KEYBOARD & HONEYCOMB MOUSE ─── */}
        {/* Large Black Desk Mat */}
        <mesh position={[-0.45, 0.044, 0.35]}>
          <boxGeometry args={[2.55, 0.012, 0.85]} />
          <meshStandardMaterial color="#14161b" roughness={0.85} />
        </mesh>

        {/* White & Grey Compact Mechanical Keyboard */}
        <group position={[-0.58, 0.07, 0.34]} rotation={[0.08, 0.08, 0]}>
          {/* Keyboard White Frame */}
          <mesh>
            <boxGeometry args={[1.05, 0.04, 0.38]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.35} />
          </mesh>
          {/* Subtle Pastel Under-Keycap Backlight */}
          <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.98, 0.32]} />
            <meshStandardMaterial
              color="#dbeafe"
              emissive="#a7f3d0"
              emissiveIntensity={0.45}
            />
          </mesh>
          {/* Keycap Rows (White & Grey Clusters) */}
          {[-0.11, -0.05, 0.01, 0.07, 0.13].map((kz, rowIdx) => (
            <group key={rowIdx} position={[0, 0.032, kz]}>
              {/* Main white keys */}
              <mesh position={[-0.08, 0, 0]}>
                <boxGeometry args={[0.62, 0.022, 0.045]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.4} />
              </mesh>
              {/* Grey accent keys (modifiers & numpad) */}
              <mesh position={[0.35, 0, 0]}>
                <boxGeometry args={[0.2, 0.022, 0.045]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.45} />
              </mesh>
              <mesh position={[-0.44, 0, 0]}>
                <boxGeometry args={[0.08, 0.022, 0.045]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.45} />
              </mesh>
            </group>
          ))}
          {/* Top-right silver rotary knob */}
          <mesh position={[0.46, 0.035, -0.13]}>
            <cylinderGeometry args={[0.022, 0.022, 0.03, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* White Honeycomb Gaming Mouse */}
        <group position={[0.26, 0.075, 0.36]} rotation={[0, -0.12, 0]}>
          <mesh scale={[1, 0.55, 1.65]}>
            <sphereGeometry args={[0.075, 20, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.35} />
          </mesh>
          {/* Subtle internal RGB glow through honeycomb shell */}
          <mesh position={[0, 0.02, -0.02]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#fbcfe8" emissive="#a5f3fc" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* ─── 3. MONITOR & WHITE GAS-SPRING MONITOR ARM ─── */}
        {/* White Articulated Monitor Arm */}
        <group position={[-0.78, 0.04, -0.35]}>
          {/* Desk Clamp Base */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.09, 0.1, 0.08, 20]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.35} metalness={0.2} />
          </mesh>
          {/* Lower Arm Angled Back/Up */}
          <mesh position={[0.16, 0.25, -0.05]} rotation={[0.15, 0, -0.58]}>
            <boxGeometry args={[0.07, 0.52, 0.07]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.35} />
          </mesh>
          {/* Upper Arm Reaching to Monitor Mount */}
          <mesh position={[0.25, 0.52, -0.02]} rotation={[0.1, 0, 0.42]}>
            <boxGeometry args={[0.065, 0.42, 0.065]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.35} />
          </mesh>
        </group>

        {/* 27" Matte Black Monitor */}
        <group position={[-0.5, 0.88, -0.25]}>
          {/* Thin Black Bezel Frame */}
          <mesh>
            <boxGeometry args={[1.95, 1.12, 0.055]} />
            <meshStandardMaterial color="#14161a" roughness={0.4} metalness={0.4} />
          </mesh>
          {/* Active Monitor Screen displaying HERONJI CanvasTexture */}
          <mesh position={[0, 0.01, 0.03]}>
            <planeGeometry args={[1.88, 1.04]} />
            <meshBasicMaterial map={screenTexture} />
          </mesh>
          {/* Subtle Light Cast onto Desk from Screen */}
          <pointLight position={[0, 0, 0.7]} color="#f8fafc" intensity={0.65} distance={3} />
        </group>

        {/* ─── 4. WHITE PANORAMIC FISH-TANK PC CASE (SAĞDAKİ AKVARYUM KASA) ─── */}
        <group position={[1.38, 0.64, 0.06]} rotation={[0, -0.22, 0]}>
          {/* 4 White Case Feet */}
          {[
            [-0.45, -0.54, 0.35],
            [0.45, -0.54, 0.35],
            [-0.45, -0.54, -0.35],
            [0.45, -0.54, -0.35],
          ].map((fp, i) => (
            <mesh key={i} position={fp}>
              <boxGeometry args={[0.1, 0.05, 0.1]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
            </mesh>
          ))}

          {/* Case Top, Bottom & Rear White Frame */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[1.05, 0.05, 0.85]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <boxGeometry args={[1.05, 0.05, 0.85]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.35} />
          </mesh>
          {/* Right Solid White Side Panel (PSU / Cable Chamber) */}
          <mesh position={[0.5, 0.01, 0]}>
            <boxGeometry args={[0.05, 1.02, 0.85]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.35} />
          </mesh>
          {/* Front-Right Solid White Strip */}
          <mesh position={[0.38, 0.01, 0.41]}>
            <boxGeometry args={[0.28, 1.02, 0.04]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.35} />
          </mesh>

          {/* Dark Internal Motherboard Backplate */}
          <mesh position={[0.12, 0.01, -0.02]}>
            <boxGeometry args={[0.03, 0.92, 0.72]} />
            <meshStandardMaterial color="#181b22" roughness={0.6} />
          </mesh>

          {/* Internal Components Mounted on Motherboard */}
          <group position={[-0.02, 0.02, -0.02]}>
            {/* White AIO CPU Pump Block with round LCD display */}
            <mesh position={[0.04, 0.08, -0.05]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.1, 0.1, 0.08, 24]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
            <mesh position={[-0.005, 0.08, -0.05]} rotation={[0, -Math.PI / 2, 0]}>
              <circleGeometry args={[0.075, 24]} />
              <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={0.4} />
            </mesh>

            {/* 2 Illuminated RAM Sticks */}
            {[0.05, 0.09].map((rz, idx) => (
              <mesh key={idx} position={[0.06, 0.08, rz]}>
                <boxGeometry args={[0.04, 0.18, 0.018]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#bae6fd"
                  emissiveIntensity={1.2}
                />
              </mesh>
            ))}

            {/* AIO White Curved Liquid Cooler Tubes */}
            {aioTubes.map((curve, idx) => (
              <mesh key={idx}>
                <tubeGeometry args={[curve, 24, 0.018, 10, false]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.35} />
              </mesh>
            ))}

            {/* Matte Black Graphics Card (GEFORCE GPU) */}
            <mesh position={[-0.04, -0.1, 0.02]}>
              <boxGeometry args={[0.24, 0.1, 0.48]} />
              <meshStandardMaterial color="#1f2937" roughness={0.35} metalness={0.5} />
            </mesh>
            {/* White Braided GPU Power Cable */}
            <mesh>
              <tubeGeometry args={[gpuCable, 16, 0.016, 8, false]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>
          </group>

          {/* ─── CASE FANS (MATCHING PHOTO'S EXACT LAYOUT) ─── */}
          {/* 3 Bottom Intake Fans */}
          {[-0.24, 0, 0.24].map((fz, i) => (
            <PCFan
              key={`bot-${i}`}
              position={[-0.14, -0.45, fz]}
              rotation={[-Math.PI / 2, 0, 0]}
              size={0.22}
              color1={i === 0 ? '#7dd3fc' : i === 1 ? '#a7f3d0' : '#f9a8d4'}
              color2={i === 1 ? '#6ee7b7' : '#c4b5fd'}
            />
          ))}

          {/* 3 Vertical Side Fans (Along Rear-Right Wall) */}
          {[0.25, 0, -0.25].map((fy, i) => (
            <PCFan
              key={`side-${i}`}
              position={[0.16, fy, 0.23]}
              rotation={[0, -Math.PI / 2, 0]}
              size={0.22}
              color1={i === 0 ? '#a7f3d0' : i === 1 ? '#7dd3fc' : '#67e8f9'}
              color2="#f9a8d4"
            />
          ))}

          {/* 1 Rear Exhaust Fan */}
          <PCFan
            position={[-0.15, 0.18, -0.39]}
            rotation={[0, 0, 0]}
            size={0.22}
            color1="#7dd3fc"
            color2="#f472b6"
          />

          {/* 2 Top Radiator Fans */}
          {[-0.15, 0.12].map((fz, i) => (
            <PCFan
              key={`top-${i}`}
              position={[-0.12, 0.47, fz]}
              rotation={[Math.PI / 2, 0, 0]}
              size={0.22}
              color1="#f9a8d4"
              color2="#7dd3fc"
            />
          ))}

          {/* Soft Interior Pastel Light Inside Glass Case */}
          <pointLight position={[-0.08, 0.05, 0.05]} color="#e0f2fe" intensity={1.3} distance={2.2} />

          {/* Panoramic Tempered Glass Panels (Left Side + Front) */}
          <mesh position={[-0.51, 0.01, 0]}>
            <boxGeometry args={[0.015, 0.96, 0.82]} />
            <meshStandardMaterial
              color="#e2e8f0"
              transparent
              opacity={0.14}
              roughness={0.05}
              metalness={0.3}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[-0.14, 0.01, 0.415]}>
            <boxGeometry args={[0.75, 0.96, 0.015]} />
            <meshStandardMaterial
              color="#e2e8f0"
              transparent
              opacity={0.14}
              roughness={0.05}
              metalness={0.3}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>

      {/* Natural Warm Room Lighting for the Desk Setup */}
      <ambientLight intensity={0.65} color="#f8fafc" />
      <directionalLight position={[2, 5, 4]} intensity={1.1} color="#fffbeb" />
      <directionalLight position={[-4, 3, 2]} intensity={0.5} color="#e2e8f0" />
    </group>
  )
}
