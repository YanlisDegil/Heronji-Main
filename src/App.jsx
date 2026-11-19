import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Navbar } from './components/ui/Navbar'
import { HeroRoomScene } from './components/3d/HeroRoomScene'
import { ScreenCorridor, PROJECTS } from './components/3d/ScreenCorridor'
import { SpaceBackground } from './components/3d/SpaceBackground'
import { ProjectControls } from './components/ui/ProjectControls'
import { AboutSection } from './components/ui/AboutSection'
import { playClickSound, playHoverSound, playWarpSound, playWarningSound } from './utils/audio'
import { HiArrowDown, HiSparkles, HiExternalLink, HiCode } from 'react-icons/hi'
import { BiAtom } from 'react-icons/bi'

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [currentSection, setCurrentSection] = useState('hero')
  const [isZooming, setIsZooming] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [notReadyStates, setNotReadyStates] = useState({}) // { [projectId]: remainingSeconds }

  const aboutSectionRef = useRef(null)
  const projectsSectionRef = useRef(null)

  // Track global scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0
      setScrollProgress(progress)

      if (scrollY < window.innerHeight * 0.4) {
        setCurrentSection('hero')
      } else if (scrollY < window.innerHeight * 1.5) {
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

  // Trigger "HENÜZ HAZIR DEĞİL" for 5 seconds
  const handleTriggerNotReady = (projectId) => {
    playWarningSound()
    setNotReadyStates((prev) => ({
      ...prev,
      [projectId]: 5,
    }))
  }

  // Handle live project opening (Lab Dedektifi) with zoom animation
  const handleOpenProject = (project) => {
    if (project.isLive && project.url) {
      setIsZooming(true)
      playWarpSound()
      setTimeout(() => {
        window.open(project.url, '_blank', 'noopener,noreferrer')
        setIsZooming(false)
      }, 900)
    }
  }

  // Navigation jump
  const handleNavigate = (section) => {
    setCurrentSection(section)
    if (section === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (section === 'projects') {
      window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' })
    } else if (section === 'about') {
      aboutSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Room lift calculation: smoothly lifts the room when scrolling past 0
  const roomLiftProgress = Math.min(1, Math.max(0, scrollProgress * 2.8))

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-cyan-500/30 font-sans">
      {/* Top Navbar */}
      <Navbar currentSection={currentSection} onNavigate={handleNavigate} />

      {/* ─── FIXED FULLSCREEN 3D CANVAS (THREE.JS) ─── */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Canvas
          camera={{ position: [0, 1.2, 5.8], fov: 46 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={['#030712']} />

          {/* Ambient & Directional Lights */}
          <ambientLight intensity={0.4} color="#0c192c" />
          <directionalLight position={[5, 10, 5]} intensity={1.2} color="#bae6fd" />
          <directionalLight position={[-5, 8, -3]} intensity={0.8} color="#c084fc" />

          <Suspense fallback={null}>
            {/* Floating Cyber Space Dust & Stars */}
            <SpaceBackground count={500} />

            {/* 1. HERO ROOM & DESK SCENE (Lifts up as user scrolls) */}
            <HeroRoomScene liftProgress={roomLiftProgress} mousePos={mousePos} />

            {/* 2. HOLOGRAPHIC MULTI-SCREEN CORRIDOR (Visible as user scrolls down) */}
            <group position={[0, -roomLiftProgress * 0.2 + (1 - roomLiftProgress) * -12, 0]}>
              <ScreenCorridor
                activeIndex={activeProjectIndex}
                onSelectProject={handleOpenProject}
                isZooming={isZooming}
                notReadyStates={notReadyStates}
                onTriggerNotReady={handleTriggerNotReady}
              />
            </group>
          </Suspense>
        </Canvas>
      </div>

      {/* ─── SCROLLABLE HTML OVERLAYS & CONTENT SECTIONS ─── */}
      <div className="relative z-10 pointer-events-none">
        {/* HERO SECTION OVERLAY */}
        <section className="min-h-screen flex flex-col justify-between pt-28 pb-12 px-4 sm:px-8 max-w-7xl mx-auto">
          {/* Top Hero Headline */}
          <div className="pointer-events-auto max-w-2xl mt-4 sm:mt-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>HERONJI.FX // SİSTEM ÇEKİRDEĞİ ONLINE</span>
            </div>

            <h1 className="font-orbitron text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              HERONJI <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent text-glow-cyan">
                TOPLULUĞU
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-sans">
              3D interaktif bilim motorları, otonom yapay zeka ajanları ve yeni nesil web mimarileri. 
              Geleceğin teknolojilerini keşfetmek için projelerimizi inceleyin.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => {
                  playClickSound()
                  handleNavigate('projects')
                }}
                onMouseEnter={playHoverSound}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 flex items-center gap-2"
              >
                <HiSparkles className="text-base" />
                <span>Projeleri Keşfet</span>
                <HiArrowDown className="text-sm animate-bounce" />
              </button>

              <a
                href="https://lab-dedektifi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
                onMouseEnter={playHoverSound}
                className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
              >
                <BiAtom className="text-base" />
                <span>Lab Dedektifi (Canlı)</span>
                <HiExternalLink />
              </a>

              <button
                onClick={() => {
                  playClickSound()
                  handleNavigate('about')
                }}
                onMouseEnter={playHoverSound}
                className="px-5 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition-all"
              >
                Hakkımda
              </button>
            </div>
          </div>

          {/* Bottom Scroll Prompt */}
          <div className="pointer-events-auto flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/60 pt-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>MASA EKRANI: HERONJI TOPLULUĞU</span>
            </div>
            <button
              onClick={() => handleNavigate('projects')}
              className="flex items-center gap-2 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <span>AŞAĞI KAYDIRIN // ODA VE MASA YUKARI KAYACAK</span>
              <HiArrowDown className="animate-bounce" />
            </button>
          </div>
        </section>

        {/* ─── 2. PROJECTS CORRIDOR SPACER & CONTROLS ─── */}
        <section
          ref={projectsSectionRef}
          className="min-h-screen relative flex flex-col justify-end pb-32 pt-20 px-4 sm:px-8 max-w-7xl mx-auto"
        >
          {/* Subtle Top Hint */}
          <div className="pointer-events-auto max-w-lg mb-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-cyan-400 text-xs font-mono">
              <HiCode className="text-sm" />
              <span>3D PROJE KORİDORU // YATAY GEÇİŞ YAPILABİLİR</span>
            </div>
            <h2 className="font-orbitron text-2xl sm:text-4xl font-bold text-white mt-2">
              PROJELER &amp; SİSTEMLER
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ekranlara tıklayarak doğrudan inceleyin veya canlı projeye giriş yapın.
            </p>
          </div>

          {/* Floating Interactive Project Controller Bar */}
          <ProjectControls
            activeIndex={activeProjectIndex}
            onSelectIndex={setActiveProjectIndex}
            onOpenProject={handleOpenProject}
            notReadyStates={notReadyStates}
            onTriggerNotReady={handleTriggerNotReady}
          />
        </section>

        {/* ─── 3. ABOUT & COMMUNITY DOSSIER SECTION ─── */}
        <div ref={aboutSectionRef} className="pointer-events-auto relative bg-[#030712]/90 backdrop-blur-md border-t border-slate-900">
          <AboutSection />
        </div>
      </div>
    </div>
  )
}
