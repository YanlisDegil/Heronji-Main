import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Navbar } from './components/ui/Navbar'
import { HeroRoomScene } from './components/3d/HeroRoomScene'
import { CloudsTransition } from './components/3d/CloudsTransition'
import { VerticalProjectCorridor, VERTICAL_PROJECTS } from './components/3d/VerticalProjectCorridor'
import { AboutSection } from './components/ui/AboutSection'
import { playClickSound, playWarpSound, playWarningSound } from './utils/audio'
import { HiArrowDown, HiExternalLink } from 'react-icons/hi'
import { BiAtom, BiBookOpen } from 'react-icons/bi'

// ─── SMOOTH 3D CAMERA CONTROLLER TRACKING SCROLL ───
function CameraController({ scrollProgress, isZooming }) {
  useFrame((state) => {
    if (isZooming) {
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 2.2, 0.08)
      return
    }

    // Map scrollProgress (0 to 1) to camera vertical trajectory
    // 0: Hero room [y = 1.25]
    // ~0.15: Clouds mist layer [y = -3.5]
    // ~0.30: Lab Dedektifi [y = -7.0]
    // ~0.45: Yanlış Değil [y = -14.0]
    // ~0.60: J.A.R.V.I.S. [y = -21.0]
    // ~0.72: FRIDAY [y = -28.0]
    // ~0.85: ULTRON [y = -35.0]
    // 1.00: Hakkımda bottom [y = -41.0]
    const targetY = 1.25 - scrollProgress * 42.0

    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5.4, 0.08)

    // Camera looks slightly ahead along the descent
    state.camera.lookAt(0, targetY - 0.2, 0)
  })
  return null
}

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState('hero')
  const [isZooming, setIsZooming] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [notReadyStates, setNotReadyStates] = useState({})

  const heroRef = useRef(null)
  const proj1Ref = useRef(null)
  const proj2Ref = useRef(null)
  const proj3Ref = useRef(null)
  const proj4Ref = useRef(null)
  const proj5Ref = useRef(null)
  const aboutSectionRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0
      setScrollProgress(progress)

      if (progress < 0.15) {
        setCurrentSection('hero')
      } else if (progress < 0.85) {
        setCurrentSection('projects')
      } else {
        setCurrentSection('about')
      }
    }

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      setMousePos({ x, y })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
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
      }, 700)
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

  return (
    <div className="relative min-h-screen bg-[#0b1324] text-slate-100 selection:bg-slate-700 selection:text-white font-sans overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar currentSection={currentSection} onNavigate={handleNavigate} />

      {/* ─── FIXED FULLSCREEN 3D CANVAS (RICH ATMOSPHERE & REAL 3D SCENE) ─── */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Canvas
          camera={{ position: [0, 1.25, 5.4], fov: 46 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
        >
          {/* Atmospheric Background & Volumetric Fog (NO PITCH BLACK!) */}
          <color attach="background" args={['#0e1726']} />
          <fog attach="fog" args={['#0e1726', 7, 36]} />

          {/* Balanced Studio Lighting with Warm Key and Soft Cool Fills */}
          <ambientLight intensity={0.7} color="#e2e8f0" />
          <directionalLight position={[5, 10, 6]} intensity={1.1} color="#ffffff" />
          <directionalLight position={[-6, 6, -3]} intensity={0.5} color="#93c5fd" />

          <Suspense fallback={null}>
            {/* Smooth 3D Camera tracking the vertical descent */}
            <CameraController scrollProgress={scrollProgress} isZooming={isZooming} />

            {/* 1. HERO ROOM & DESK WORKSTATION (Top at y = 0) */}
            <HeroRoomScene liftProgress={0} mousePos={mousePos} />

            {/* 2. PROCEDURAL 3D CLOUDS & MIST BARRIER (Soft transition between room & projects) */}
            <CloudsTransition position={[0, -3.2, 0]} />

            {/* 3. VERTICAL 3D PROJECT MONITORS (Stacked vertically along Y-axis) */}
            <VerticalProjectCorridor
              notReadyStates={notReadyStates}
              onTriggerNotReady={handleTriggerNotReady}
              onOpenProject={handleOpenProject}
            />

            {/* Clouds at the lower boundary near Hakkımda */}
            <CloudsTransition position={[0, -39.0, 0]} />
          </Suspense>
        </Canvas>
      </div>

      {/* ─── SCROLLABLE CONTENT SECTIONS (NO BLOCKING BOTTOM BARS!) ─── */}
      <div className="relative z-10 pointer-events-none">
        {/* 1. HERO SECTION (ROOM & DESK VIEW) */}
        <section ref={heroRef} className="min-h-screen flex flex-col justify-between pt-28 pb-12 px-4 sm:px-8 max-w-6xl mx-auto">
          {/* Headline & Mission */}
          <div className="pointer-events-auto max-w-xl mt-4 sm:mt-12 bg-slate-950/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-800/60 shadow-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-700/80 text-slate-300 text-xs font-mono mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>HERONJI.FX // GÖMÜLÜ SİSTEMLER &amp; 3D MİMARİ</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              HERONJI <br />
              <span className="text-slate-300">TOPLULUĞU</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              2026 Kayseri MEB Uluslararası Çizgi İzleyen Robot çalışmalarından gerçek zamanlı 
              3D bilim laboratuvarlarına kadar uzanan bağımsız mühendislik ve geliştirme alanı.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => {
                  playClickSound()
                  handleNavigate('projects')
                }}
                className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-white text-slate-900 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Projeleri İncele (Aşağı İn)</span>
                <HiArrowDown className="text-sm" />
              </button>

              <a
                href="https://lab-dedektifi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-all flex items-center gap-2"
              >
                <BiAtom className="text-emerald-400 text-base" />
                <span>Lab Dedektifi</span>
                <HiExternalLink className="text-slate-400" />
              </a>

              <a
                href="https://yanlisdegil.github.io/Yanlis-Degil/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-all flex items-center gap-2"
              >
                <BiBookOpen className="text-sky-400 text-base" />
                <span>Yanlış Değil</span>
                <HiExternalLink className="text-slate-400" />
              </a>
            </div>
          </div>

          {/* Bottom Scroll Prompt */}
          <div className="pointer-events-auto flex items-center justify-between text-xs font-mono text-slate-300 border-t border-slate-800/80 pt-4 bg-slate-950/30 backdrop-blur-sm px-4 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>MASA EKRANI: HERONJI TOPLULUĞU</span>
            </div>
            <button
              onClick={() => handleNavigate('projects')}
              className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
            >
              <span>AŞAĞI KAYDIRIN // 3D BULUTLARDAN GEÇİN</span>
              <HiArrowDown className="animate-bounce" />
            </button>
          </div>
        </section>

        {/* ─── 3D CLOUDS STRATUM (PASSING THROUGH MIST) ─── */}
        <div className="h-[40vh] flex items-center justify-center">
          <div className="pointer-events-auto px-4 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-sm border border-slate-700/60 text-xs font-mono text-slate-300">
            ☁️ 3D ATMOSFER TABAKASI // PROJE KORİDORUNA İNİLİYOR
          </div>
        </div>

        {/* ─── 2. VERTICAL PROJECTS SECTIONS (ONE FULL VIEWPORT PER SCREEN) ─── */}
        {/* Project 1: Laboratuvar Dedektifi */}
        <section ref={proj1Ref} className="min-h-screen flex flex-col justify-end pb-16 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="pointer-events-auto max-w-md bg-slate-950/60 backdrop-blur-md p-5 rounded-xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono font-semibold text-emerald-400">01 // CANLI PROJE</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Laboratuvar Dedektifi</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Fizik, Kimya ve Biyoloji deneylerini tarayıcıda çalıştıran 3D bilim simülasyonu. 
              Doğrudan ekrana veya butona tıklayarak giriş yapabilirsiniz.
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
        <section ref={proj2Ref} className="min-h-screen flex flex-col justify-end pb-16 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="pointer-events-auto max-w-md bg-slate-950/60 backdrop-blur-md p-5 rounded-xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="text-xs font-mono font-semibold text-sky-400">02 // CANLI PLATFORM</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Yanlış Değil</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              "Yanlışını yakalar, nedenini anlatır." Felsefe, bilim ve kavram yanılgılarını 
              çözümleyen interaktif eğitim platformu.
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
        <section ref={proj3Ref} className="min-h-screen flex flex-col justify-end pb-16 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="pointer-events-auto max-w-md bg-slate-950/60 backdrop-blur-md p-5 rounded-xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-xs font-mono font-semibold text-purple-400">03 // DONANIM PROTOKOLÜ</span>
            </div>
            <h2 className="text-2xl font-bold text-white">J.A.R.V.I.S.</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              C/C++ ve Python tabanlı mikrodenetleyici donanım kontrolü, sensör entegrasyonu ve otonom sistem çekirdeği.
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
        <section ref={proj4Ref} className="min-h-screen flex flex-col justify-end pb-16 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="pointer-events-auto max-w-md bg-slate-950/60 backdrop-blur-md p-5 rounded-xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-mono font-semibold text-amber-400">04 // ROBOTİK TELEMETRİ</span>
            </div>
            <h2 className="text-2xl font-bold text-white">FRIDAY Telemetri</h2>
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
        <section ref={proj5Ref} className="min-h-screen flex flex-col justify-end pb-16 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="pointer-events-auto max-w-md bg-slate-950/60 backdrop-blur-md p-5 rounded-xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-xs font-mono font-semibold text-rose-400">05 // GÜVENLİK ÇEKİRDEĞİ</span>
            </div>
            <h2 className="text-2xl font-bold text-white">ULTRON Mimari</h2>
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
        <div ref={aboutSectionRef} className="pointer-events-auto relative bg-[#0b1324]/95 border-t border-slate-800">
          <AboutSection />
        </div>
      </div>
    </div>
  )
}
