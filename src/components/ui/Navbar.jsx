import React, { useState } from 'react'
import {
  setSoundEnabled,
  getSoundEnabled,
  playClickSound,
} from '../../utils/audio'
import {
  HiVolumeUp,
  HiVolumeOff,
  HiExternalLink,
} from 'react-icons/hi'
import { BiAtom, BiBookOpen } from 'react-icons/bi'

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
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
          <span className="font-mono font-bold text-xs text-slate-100">H.fx</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base tracking-tight text-slate-100">
              HERONJI.FX
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
              TOPLULUK
            </span>
          </div>
        </div>
      </div>

      {/* Center Nav Links (Clean Pill) */}
      <nav className="glass-panel px-3 sm:px-4 py-1.5 rounded-full flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-medium">
        <button
          onClick={() => {
            playClickSound()
            onNavigate && onNavigate('hero')
          }}
          className={`px-3 py-1 rounded-full transition-all ${
            currentSection === 'hero'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Çalışma Alanı
        </button>

        <button
          onClick={() => {
            playClickSound()
            onNavigate && onNavigate('projects')
          }}
          className={`px-3 py-1 rounded-full transition-all ${
            currentSection === 'projects'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Projeler (5)
        </button>

        <button
          onClick={() => {
            playClickSound()
            onNavigate && onNavigate('about')
          }}
          className={`px-3 py-1 rounded-full transition-all ${
            currentSection === 'about'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Hakkımda
        </button>
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          title={soundOn ? 'Sesi Kapat' : 'Sesi Aç'}
          className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all"
        >
          {soundOn ? <HiVolumeUp className="text-sm" /> : <HiVolumeOff className="text-sm" />}
        </button>

        {/* Live Lab Dedektifi quick button */}
        <a
          href="https://lab-dedektifi.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playClickSound()}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all"
        >
          <BiAtom className="text-emerald-400 text-sm" />
          <span>Lab Dedektifi</span>
          <HiExternalLink className="text-slate-400" />
        </a>
      </div>
    </header>
  )
}
