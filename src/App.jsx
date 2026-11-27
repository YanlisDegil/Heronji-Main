import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Navbar } from './components/ui/Navbar'
import { HeroRoomScene } from './components/3d/HeroRoomScene'
import { CloudsTransition } from './components/3d/CloudsTransition'
import { VerticalProjectCorridor } from './components/3d/VerticalProjectCorridor'
import { AboutSection } from './components/ui/AboutSection'
import { playClickSound, playWarpSound, playWarningSound } from './utils/audio'
import { HiArrowDown, HiExternalLink } from 'react-icons/hi'
import { BiAtom, BiBookOpen } from 'react-icons/bi'

// ─── SILKY-SMOOTH DAMPED 3D CAMERA CONTROLLER (ZERO REACT RE-RENDERS ON SCROLL) ───
function CameraController({ targetCameraYRef, mousePosRef, isZooming }) {
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)

    if (isZooming) {
      state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 2.1, 6, dt)
      return
    }

    const targetY = targetCameraYRef.current
    const mx = mousePosRef.current.x
    const my = mousePosRef.current.y

    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 5.5, dt)
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, mx * 0.22, 4.5, dt)
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 5.3, 5.5, dt)

    state.camera.lookAt(mx * 0.08, state.camera.position.y - 0.18 + my * 0.06, 0)
  })
  return null
}

export default function App() {
  const [currentSection, setCurrentSection] = useState('hero')
  const [activeDot, setActiveDot] = useState(0)
  const [isZooming, setIsZooming] = useState(false)
  const [notReadyStates, setNotReadyStates] = useState({})

  // High-frequency refs for 60/120fps smooth 3D animation without React re-render stutter
  const targetCameraYRef = useRef(0.55)
  const mousePosRef = useRef({ x: 0, y: 0 })

  const heroRef = useRef(null)
  const cloudsRef = useRef(null)
  const proj1Ref = useRef(null)
  const proj2Ref = useRef(null)
  const proj3Ref = useRef(null)
  const proj4Ref = useRef(null)
  const proj5Ref = useRef(null)
  const aboutSectionRef = useRef(null)

  useEffect(() => {
    const computeCameraTarget = () => {
      const scrollY = window.scrollY
      const vh = window.innerHeight || 800

      // Build anchor keyframes matching actual section positions in DOM
      const anchors = [
        { s: 0, y: 0.55 },
        { s: (cloudsRef.current?.offsetTop ?? vh * 0.9) - vh * 0.25, y: -3.4 },
        { s: (proj1Ref.current?.offsetTop ?? vh * 1.4), y: -7.5 },
        { s: (proj2Ref.current?.offsetTop ?? vh * 2.4), y: -14.5 },
        { s: (proj3Ref.current?.offsetTop ?? vh * 3.4), y: -21.5 },
        { s: (proj4Ref.current?.offsetTop ?? vh * 4.4), y: -28.5 },
        { s: (proj5Ref.current?.offsetTop ?? vh * 5.4), y: -35.5 },
        { s: (aboutSectionRef.current?.offsetTop ?? vh * 6.4), y: -41.5 },
      ]

      // Piecewise linear interpolation between section anchors
      let camY = anchors[0].y
      if (scrollY <= anchors[0].s) {
        camY = anchors[0].y
      } else if (scrollY >= anchors[anchors.length - 1].s) {
        camY = anchors[anchors.length - 1].y
      } else {
        for (let i = 0; i < anchors.length - 1; i++) {
          const a = anchors[i]
          const b = anchors[i + 1]
          if (scrollY >= a.s && scrollY <= b.s) {
            const span = Math.max(1, b.s - a.s)
            const t = (scrollY - a.s) / span
            // Smoothstep easing between anchors
            const smooth = t * t * (3 - 2 * t)
            camY = a.y + (b.y - a.y) * smooth
            break
          }
        }
      }

      targetCameraYRef.current = camY

      // Only trigger React state update when crossing section boundaries
      const projStart = anchors[2].s - vh * 0.45
      const aboutStart = anchors[7].s - vh * 0.45
      if (scrollY < projStart) {
        setCurrentSection((prev) => (prev === 'hero' ? prev : 'hero'))
      } else if (scrollY < aboutStart) {
        setCurrentSection((prev) => (prev === 'projects' ? prev : 'projects'))
      } else {
        setCurrentSection((prev) => (prev === 'about' ? prev : 'about'))
      }

      // Active dot index
      let nearestIdx = 0
      let minDist = Infinity
      const dotScrollPoints = [0, anchors[2].s, anchors[3].s, anchors[4].s, anchors[5].s, anchors[6].s, anchors[7].s]
      dotScrollPoints.forEach((pt, idx) => {
        const d = Math.abs(scrollY - pt)
        if (d < minDist) {
          minDist = d
          nearestIdx = idx
        }
      })
      setActiveDot((prev) => (prev === nearestIdx ? prev : nearestIdx))
    }

    const handleMouseMove = (e) => {
      mousePosRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mousePosRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    computeCameraTarget()
    window.addEventListener('scroll', computeCameraTarget, { passive: true })
    window.addEventListener('resize', computeCameraTarget, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Silky smooth mouse-wheel damping (works with mouse wheels & trackpads, preserves pinch-zoom & touch)
    let wheelTargetY = window.scrollY
    let wheelCurrentY = window.scrollY
    let wheelRafId = null
    let wheelActive = false

    const stepWheel = () => {
      const diff = wheelTargetY - wheelCurrentY
      if (Math.abs(diff) < 0.5) {
        window.scrollTo({ top: wheelTargetY, behavior: 'instant' })
        wheelCurrentY = wheelTargetY
        wheelActive = false
        wheelRafId = null
        return
      }
      wheelCurrentY += diff * 0.14
      window.scrollTo({ top: wheelCurrentY, behavior: 'instant' })
      wheelRafId = requestAnimationFrame(stepWheel)
    }

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) return // keep browser zoom working
      e.preventDefault()
      if (!wheelActive) {
        wheelCurrentY = window.scrollY
        wheelTargetY = window.scrollY
        wheelActive = true
      }
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const delta = e.deltaMode === 1 ? e.deltaY * 36 : e.deltaY
      wheelTargetY = Math.min(maxScroll, Math.max(0, wheelTargetY + delta))
      if (!wheelRafId) {
        wheelRafId = requestAnimationFrame(stepWheel)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('scroll', computeCameraTarget)
      window.removeEventListener('resize', computeCameraTarget)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('wheel', handleWheel)
      if (wheelRafId) cancelAnimationFrame(wheelRafId)
    }
  }, [])

  // Timer countdown for "HENÜZ HAZIR DEĞİL" states (5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setNotReadyStates((prev) => {
        let hasChanges = false
        const next = { ...prev }
        Object.keys(next).forEach((key) => {
          if (next[key] > 1) {
            next[key] -= 1
            hasChanges = true
          } else if (next[key] === 1) {
            delete next[key]
            hasChanges = true
          }
        })
        return hasChanges ? next : prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleTriggerNotReady = (projectId) => {
    playWarningSound()
    setNotReadyStates((prev) => ({
      ...prev,
      [projectId]: 5,
    }))
  }

  const handleOpenProject = (project) => {
    if (project.isLive && project.url) {
      setIsZooming(true)
      playWarpSound()
      setTimeout(() => {
        window.open(project.url, '_blank', 'noopener,noreferrer')
        setIsZooming(false)
      }, 650)
    }
  }

  const handleNavigate = (section) => {
    setCurrentSection(section)
    if (section === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (section === 'projects') {
      proj1Ref.current?.scrollIntoView({ behavior: 'smooth' })
    } else if (section === 'about') {
      aboutSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navDots = [
    { label: 'Masa', ref: heroRef },
    { label: '01 Lab Dedektifi', ref: proj1Ref },
    { label: '02 Yanlış Değil', ref: proj2Ref },
    { label: '03 J.A.R.V.I.S.', ref: proj3Ref },
    { label: '04 FRIDAY', ref: proj4Ref },
    { label: '05 ULTRON', ref: proj5Ref },
    { label: 'Hakkımda', ref: aboutSectionRef },
  ]

  return (
    <div className="relative min-h-screen bg-[#111c30] text-slate-100 selection:bg-slate-700 selection:text-white font-sans overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar currentSection={currentSection} onNavigate={handleNavigate} />

      {/* Minimal Vertical Section Indicator on Right Edge */}
      <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-end gap-2.5 pointer-events-auto">
        {navDots.map((dot, idx) => (
          <button
            key={dot.label}
            onClick={() => {
              playClickSound()
              if (idx === 0) window.scrollTo({ top: 0, behavior: 'smooth' })
              else dot.ref.current?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group flex items-center gap-2 focus:outline-none"
          >
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/70 transition-all ${
                activeDot === idx
                  ? 'opacity-100 text-white'
                  : 'opacity-0 group-hover:opacity-100 text-slate-300'
              }`}
            >
              {dot.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                activeDot === idx
                  ? 'w-2.5 h-2.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                  : 'w-2 h-2 bg-slate-500/60 group-hover:bg-slate-300'
              }`}
            />
          </button>
        ))}
      </div>

      {/* ─── FIXED FULLSCREEN 3D CANVAS ─── */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Canvas
          camera={{ position: [0, 0.55, 5.3], fov: 46 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
        >
          {/* Rich Sky-Slate Horizon Background & Soft Atmospheric Fog */}
          <color attach="background" args={['#131e33']} />
          <fog attach="fog" args={['#131e33', 9, 34]} />

          {/* Balanced Realistic Studio Lighting */}
          <ambientLight intensity={0.75} color="#f1f5f9" />
          <directionalLight position={[5, 10, 6]} intensity={1.15} color="#fffcf5" />
          <directionalLight position={[-6, 6, 2]} intensity={0.45} color="#bfdbfe" />

          <Suspense fallback={null}>
            {/* Silky Smooth Camera Controller */}
            <CameraController
              targetCameraYRef={targetCameraYRef}
              mousePosRef={mousePosRef}
              isZooming={isZooming}
            />

            {/* 1. REALISTIC 3D DESK & WHITE PANORAMIC PC SETUP (Top at y = 0) */}
            <HeroRoomScene mousePosRef={mousePosRef} />

            {/* 2. REALISTIC VOLUMETRIC 3D CLOUDS (Between desk & projects) */}
            <CloudsTransition position={[0, -3.4, 0]} density={54} spread={[22, 2.8, 12]} />

            {/* 3. VERTICAL 3D PROJECT MONITORS (Stacked along Y-axis) */}
            <VerticalProjectCorridor
              notReadyStates={notReadyStates}
              onTriggerNotReady={handleTriggerNotReady}
              onOpenProject={handleOpenProject}
            />

            {/* Lower Clouds Layer above Hakkımda */}
            <CloudsTransition position={[0, -39.5, 0]} density={36} spread={[20, 2.4, 10]} />
          </Suspense>
        </Canvas>
      </div>

      {/* ─── SCROLLABLE CONTENT SECTIONS ─── */}
      <div className="relative z-10 pointer-events-none">
        {/* 1. HERO SECTION (Positioned compactly on left so 3D desk & PC stand out clearly) */}
        <section ref={heroRef} className="min-h-screen flex flex-col justify-between pt-24 pb-8 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="pointer-events-auto max-w-md mt-2 sm:mt-8 bg-slate-950/45 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-slate-700/60 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-slate-300 text-[11px] font-mono mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>HERONJI.FX // DONANIM &amp; 3D MİMARİ</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              HERONJI <br />
              <span className="text-slate-300">TOPLULUĞU</span>
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              2026 Kayseri MEB Uluslararası Çizgi İzleyen Robot çalışmalarından gerçek zamanlı
              3D bilim laboratuvarlarına uzanan bağımsız mühendislik alanı.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 mt-5">
              <button
                onClick={() => {
                  playClickSound()
                  handleNavigate('projects')
                }}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-white text-slate-900 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Projeleri Gör</span>
                <HiArrowDown className="text-sm" />
              </button>

              <a
                href="https://lab-dedektifi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="px-3.5 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all flex items-center gap-1.5"
              >
                <BiAtom className="text-emerald-400 text-sm" />
                <span>Lab Dedektifi</span>
                <HiExternalLink className="text-slate-400" />
              </a>

              <a
                href="https://yanlisdegil.github.io/Yanlis-Degil/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="px-3.5 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-all flex items-center gap-1.5"
              >
                <BiBookOpen className="text-sky-400 text-sm" />
                <span>Yanlış Değil</span>
                <HiExternalLink className="text-slate-400" />
              </a>
            </div>
          </div>

          {/* Bottom Scroll Prompt */}
          <div className="pointer-events-auto flex items-center justify-between text-xs font-mono text-slate-200 border-t border-slate-700/50 pt-3 bg-slate-950/35 backdrop-blur-sm px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>HERONJI MASAÜSTÜ KURULUMU</span>
            </div>
            <button
              onClick={() => handleNavigate('projects')}
              className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
            >
              <span>AŞAĞI KAYDIRIN // BULUTLARDAN GEÇİN</span>
              <HiArrowDown className="animate-bounce" />
            </button>
          </div>
        </section>

        {/* ─── 3D CLOUDS STRATUM ─── */}
        <div ref={cloudsRef} className="h-[55vh] flex items-center justify-center">
          <div className="pointer-events-auto px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-600/50 text-xs font-mono text-slate-200 shadow-lg">
            ☁️ BULUT KATMANI // PROJELERE İNİLİYOR
          </div>
        </div>

        {/* ─── 2. VERTICAL PROJECTS SECTIONS ─── */}
        {/* Project 1: Laboratuvar Dedektifi */}
        <section ref={proj1Ref} className="min-h-screen flex flex-col justify-end pb-14 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="pointer-events-auto max-w-md bg-slate-950/65 backdrop-blur-md p-5 rounded-xl border border-slate-700/70 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono font-semibold text-emerald-400">01 // CANLI PROJE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Laboratuvar Dedektifi</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Fizik, Kimya ve Biyoloji deneylerini tarayıcıda çalıştıran 3D bilim simülasyonu.
            </p>
            <div className="mt-3">
              <a
                href="https://lab-dedektifi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playWarpSound()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                <span>Siteyi Aç (lab-dedektifi.vercel.app)</span>
                <HiExternalLink />
              </a>
            </div>
          </div>
        </section>

        {/* Project 2: Yanlış Değil */}
        <section ref={proj2Ref} className="min-h-screen flex flex-col justify-end pb-14 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="pointer-events-auto max-w-md bg-slate-950/65 backdrop-blur-md p-5 rounded-xl border border-slate-700/70 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="text-xs font-mono font-semibold text-sky-400">02 // CANLI PLATFORM</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Yanlış Değil</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              "Yanlışını yakalar, nedenini anlatır." Felsefe, bilim ve kavram yanılgılarını çözümleyen eğitim platformu.
            </p>
            <div className="mt-3">
              <a
                href="https://yanlisdegil.github.io/Yanlis-Degil/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                <span>Siteyi Aç (yanlisdegil.github.io/Yanlis-Degil)</span>
                <HiExternalLink />
              </a>
            </div>
          </div>
        </section>

        {/* Project 3: J.A.R.V.I.S. */}
        <section ref={proj3Ref} className="min-h-screen flex flex-col justify-end pb-14 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="pointer-events-auto max-w-md bg-slate-950/65 backdrop-blur-md p-5 rounded-xl border border-slate-700/70 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-xs font-mono font-semibold text-purple-400">03 // DONANIM PROTOKOLÜ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">J.A.R.V.I.S.</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              C/C++ ve Python tabanlı mikrodenetleyici donanım kontrolü ve otonom sistem çekirdeği.
            </p>
            <div className="mt-3">
              <button
                onClick={() => handleTriggerNotReady('jarvis')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
              >
                <span>Durumu Kontrol Et (Kilitli)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Project 4: FRIDAY */}
        <section ref={proj4Ref} className="min-h-screen flex flex-col justify-end pb-14 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="pointer-events-auto max-w-md bg-slate-950/65 backdrop-blur-md p-5 rounded-xl border border-slate-700/70 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-mono font-semibold text-amber-400">04 // ROBOTİK TELEMETRİ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">FRIDAY Telemetri</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              2026 Kayseri MEB Çizgi İzleyen Robot sensör kalibrasyonu, PID hata katsayısı ve anlık motor telemetri analizi.
            </p>
            <div className="mt-3">
              <button
                onClick={() => handleTriggerNotReady('friday')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
              >
                <span>Durumu Kontrol Et (Kilitli)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Project 5: ULTRON */}
        <section ref={proj5Ref} className="min-h-screen flex flex-col justify-end pb-14 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="pointer-events-auto max-w-md bg-slate-950/65 backdrop-blur-md p-5 rounded-xl border border-slate-700/70 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-xs font-mono font-semibold text-rose-400">05 // GÜVENLİK ÇEKİRDEĞİ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">ULTRON Mimari</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Merkeziyetsiz gömülü cihaz haberleşmesi ve donanım seviyesinde otonom süreç güvenliği.
            </p>
            <div className="mt-3">
              <button
                onClick={() => handleTriggerNotReady('ultron')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
              >
                <span>Durumu Kontrol Et (Kilitli)</span>
              </button>
            </div>
          </div>
        </section>

        {/* ─── 3. ABOUT SECTION (HAKKIMDA) ─── */}
        <div ref={aboutSectionRef} className="pointer-events-auto relative bg-[#0e1726]/95 border-t border-slate-800">
          <AboutSection />
        </div>
      </div>
    </div>
  )
}
