import React, { useState } from 'react'
import {
  setSoundEnabled,
  getSoundEnabled,
  playClickSound,
  playHoverSound,
} from '../../utils/audio'
import {
  HiVolumeUp,
  HiVolumeOff,
  HiExternalLink,
  HiSparkles,
} from 'react-icons/hi'
import { BiAtom } from 'react-icons/bi'

export function Navbar({ currentSection = 'hero', onNavigate }) {
  const [soundOn, setSoundOn] = useState(getSoundEnabled())

  const handleToggleSound = () => {
    const newState = !soundOn
    setSoundOn(newState)
    setSoundEnabled(newState)
    if (newState) playClickSound()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between pointer-events-auto">
      {/* Brand logo & status */}
      <div
        onClick={() => {
          playClickSound()
          onNavigate && onNavigate('hero')
        }}
        onMouseEnter={playHoverSound}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="relative w-9 h-9 rounded-lg bg-slate-900 border border-cyan-500/30 flex items-center justify-center overflow-hidden group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all">
          <BiAtom className="text-xl text-cyan-400 group-hover:rotate-180 transition-transform duration-700" />
          <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-orbitron font-bold text-sm sm:text-base tracking-wider text-slate-100 group-hover:text-cyan-400 transition-colors">
              HERONJI.FX
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              TOPLULUK
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
            HERONJI TOPLULUĞU // ANA MERKEZ
          </p>
        </div>
      </div>

      {/* Center Nav Links (Glassmorphism Pill) */}
      <nav className="glass-panel px-3 sm:px-5 py-1.5 rounded-full flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
        <button
          onClick={() => {
            playClickSound()
            onNavigate && onNavigate('hero')
          }}
          onMouseEnter={playHoverSound}
          className={`px-2.5 py-1 rounded-full transition-all ${
            currentSection === 'hero'
              ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Ana Ekran
        </button>

        <button
          onClick={() => {
            playClickSound()
            onNavigate && onNavigate('projects')
          }}
          onMouseEnter={playHoverSound}
          className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1.5 ${
            currentSection === 'projects'
              ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HiSparkles className="text-cyan-400" />
          Projeler (5)
        </button>

        <button
          onClick={() => {
            playClickSound()
            onNavigate && onNavigate('about')
          }}
          onMouseEnter={playHoverSound}
          className={`px-2.5 py-1 rounded-full transition-all ${
            currentSection === 'about'
              ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Hakkımda
        </button>
      </nav>

      {/* Right controls: Sound Toggle & Quick Live Link */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          onMouseEnter={playHoverSound}
          title={soundOn ? 'Sesi Kapat' : 'Sesi Aç'}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all ${
            soundOn
              ? 'bg-slate-900 border border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
              : 'bg-slate-900/60 border border-slate-800 text-slate-500'
          }`}
        >
          {soundOn ? <HiVolumeUp className="text-base" /> : <HiVolumeOff className="text-base" />}
        </button>

        {/* Live Lab Dedektifi direct button */}
        <a
          href="https://lab-dedektifi.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={playHoverSound}
          onClick={() => playClickSound()}
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:scale-105"
        >
          <span>Lab Dedektifi</span>
          <HiExternalLink />
        </a>
      </div>
    </header>
  )
}
