import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Navbar } from './components/ui/Navbar'
import { HeroRoomScene } from './components/3d/HeroRoomScene'
import { ScreenCorridor, PROJECTS } from './components/3d/ScreenCorridor'
import { SpaceBackground } from './components/3d/SpaceBackground'
import { ProjectControls } from './components/ui/ProjectControls'
import { AboutSection } from './components/ui/AboutSection'
import { playClickSound, playWarpSound, playWarningSound } from './utils/audio'
import { HiArrowDown, HiExternalLink } from 'react-icons/hi'
import { BiAtom, BiBookOpen } from 'react-icons/bi'

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [currentSection, setCurrentSection] = useState('hero')
  const [isZooming, setIsZooming] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [notReadyStates, setNotReadyStates] = useState({})

  const aboutSectionRef = useRef(null)
  const projectsSectionRef = useRef(null)

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
      }, 750)
    }
  }

  const handleNavigate = (section) => {
    setCurrentSection(section)
    if (section === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (section === 'projects') {
      window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })
    } else if (section === 'about') {
      aboutSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Smooth lift of room on scroll
  const roomLiftProgress = Math.min(1, Math.max(0, scrollProgress * 2.8))

  return (
    <div className="relative min-h-screen bg-[#070a0f] text-slate-100 selection:bg-slate-700 selection:text-white font-sans">
      {/* Top Navbar */}
      <Navbar currentSection={currentSection} onNavigate={handleNavigate} />

      {/* ─── 3D CANVAS (REALISTIC LIGHTING & MATERIALS) ─── */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Canvas
          camera={{ position: [0, 1.25, 5.2], fov: 46 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={['#070a0f']} />

          {/* Neutral, Soft Studio Lighting */}
          <ambientLight intensity={0.6} color="#ffffff" />
          <directionalLight position={[4, 8, 4]} intensity={0.9} color="#ffffff" />
          <directionalLight position={[-4, 5, -2]} intensity={0.35} color="#cbd5e1" />

          <Suspense fallback={null}>
            {/* Subtle floating dust motes */}
            <SpaceBackground count={100} />

            {/* 1. REALISTIC WORKSTATION SCENE (Slides up on scroll) */}
            <HeroRoomScene liftProgress={roomLiftProgress} mousePos={mousePos} />

            {/* 2. REALISTIC MONITORS CORRIDOR */}
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

      {/* ─── SCROLLABLE CONTENT & HERO OVERLAYS ─── */}
      <div className="relative z-10 pointer-events-none">
        {/* HERO SECTION OVERLAY */}
        <section className="min-h-screen flex flex-col justify-between pt-28 pb-12 px-4 sm:px-8 max-w-6xl mx-auto">
          {/* Headline & Mission */}
          <div className="pointer-events-auto max-w-2xl mt-4 sm:mt-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>HERONJI.FX // GÖMÜLÜ SİSTEMLER &amp; 3D MİMARİ</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              HERONJI <br />
              <span className="text-slate-300">TOPLULUĞU</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
              2026 Kayseri MEB Uluslararası Çizgi İzleyen Robot çalışmalarından gerçek zamanlı 
              3D bilim laboratuvarlarına kadar uzanan bağımsız mühendislik ve geliştirme alanı.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => {
                  playClickSound()
                  handleNavigate('projects')
                }}
                className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-white text-slate-900 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Projeleri Gör</span>
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
          <div className="pointer-events-auto flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>MASA EKRANI: HERONJI TOPLULUĞU</span>
            </div>
            <button
              onClick={() => handleNavigate('projects')}
              className="flex items-center gap-2 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <span>AŞAĞI KAYDIRIN // PROJELERE GEÇİN</span>
              <HiArrowDown />
            </button>
          </div>
        </section>

        {/* ─── 2. PROJECTS CORRIDOR SPACER & CONTROLS ─── */}
        <section
          ref={projectsSectionRef}
          className="min-h-screen relative flex flex-col justify-end pb-32 pt-20 px-4 sm:px-8 max-w-6xl mx-auto"
        >
          {/* Top Header */}
          <div className="pointer-events-auto max-w-md mb-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Sistemler &amp; Modüller
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ekranları kaydırarak inceleyin veya doğrudan platformlara giriş yapın.
            </p>
          </div>

          {/* Clean Floating Project Controller */}
          <ProjectControls
            activeIndex={activeProjectIndex}
            onSelectIndex={setActiveProjectIndex}
            onOpenProject={handleOpenProject}
            notReadyStates={notReadyStates}
            onTriggerNotReady={handleTriggerNotReady}
          />
        </section>

        {/* ─── 3. ABOUT SECTION ─── */}
        <div ref={aboutSectionRef} className="pointer-events-auto relative bg-[#070a0f] border-t border-slate-800/80">
          <AboutSection />
        </div>
      </div>
    </div>
  )
}
