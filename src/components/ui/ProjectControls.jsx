import React from 'react'
import {
  HiChevronLeft,
  HiChevronRight,
  HiExternalLink,
  HiLockClosed,
  HiSparkles,
} from 'react-icons/hi'
import { PROJECTS } from '../3d/ScreenCorridor'
import { playClickSound, playHoverSound, playWarningSound, playWarpSound } from '../../utils/audio'

export function ProjectControls({
  activeIndex = 0,
  onSelectIndex,
  onOpenProject,
  notReadyStates = {},
  onTriggerNotReady,
}) {
  const currentProject = PROJECTS[activeIndex]
  const isNotReady = Boolean(notReadyStates[currentProject.id])
  const remainingSec = notReadyStates[currentProject.id] || 0

  const handlePrev = () => {
    playClickSound()
    onSelectIndex((activeIndex - 1 + PROJECTS.length) % PROJECTS.length)
  }

  const handleNext = () => {
    playClickSound()
    onSelectIndex((activeIndex + 1) % PROJECTS.length)
  }

  const handleMainAction = () => {
    if (currentProject.isLive) {
      playWarpSound()
      onOpenProject(currentProject)
    } else {
      playWarningSound()
      onTriggerNotReady(currentProject.id)
    }
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 px-4 sm:px-8 pointer-events-none flex flex-col items-center">
      {/* Dynamic Project Quick Card Overlay */}
      <div className="glass-panel-glow pointer-events-auto p-4 sm:p-5 rounded-2xl max-w-2xl w-full shadow-2xl transition-all duration-300 mb-4 border border-cyan-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Project Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: isNotReady ? '#ef4444' : currentProject.statusColor }}
              />
              <span
                className="text-xs font-mono font-semibold uppercase"
                style={{ color: isNotReady ? '#ef4444' : currentProject.statusColor }}
              >
                {isNotReady ? '⚠️ ERİŞİM KİLİTLİ ⚠️' : currentProject.status}
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {`[ ${activeIndex + 1} / ${PROJECTS.length} ]`}
              </span>
            </div>

            <h3 className="font-orbitron font-bold text-lg sm:text-xl text-slate-100 flex items-center gap-2">
              {currentProject.fullTitle}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2">
              {isNotReady
                ? `Bu modül henüz hazır değil. Şu an geliştirilme aşamasındadır (${remainingSec} sn).`
                : currentProject.description}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleMainAction}
              onMouseEnter={playHoverSound}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                isNotReady
                  ? 'bg-rose-600/30 border border-rose-500 text-rose-300 hover:bg-rose-600/40'
                  : currentProject.isLive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105'
                  : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {isNotReady ? (
                <>
                  <HiLockClosed className="text-base text-rose-400" />
                  <span>HENÜZ HAZIR DEĞİL ({remainingSec}s)</span>
                </>
              ) : currentProject.isLive ? (
                <>
                  <HiSparkles className="text-base" />
                  <span>Projeye Git (Canlı)</span>
                  <HiExternalLink className="text-base" />
                </>
              ) : (
                <>
                  <HiLockClosed className="text-base" />
                  <span>İncele (Kilitli)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Dots / Selector */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
          {/* Arrow Left */}
          <button
            onClick={handlePrev}
            onMouseEnter={playHoverSound}
            aria-label="Önceki Proje"
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-cyan-400 flex items-center justify-center transition-all"
          >
            <HiChevronLeft className="text-lg" />
          </button>

          {/* 5 Screen Indicators */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
            {PROJECTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  playClickSound()
                  onSelectIndex(idx)
                }}
                onMouseEnter={playHoverSound}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                  idx === activeIndex
                    ? 'bg-cyan-500/25 border border-cyan-400/80 text-cyan-200 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: p.statusColor }}
                />
                <span className="hidden sm:inline">{p.title}</span>
                <span className="sm:hidden">{idx + 1}</span>
              </button>
            ))}
          </div>

          {/* Arrow Right */}
          <button
            onClick={handleNext}
            onMouseEnter={playHoverSound}
            aria-label="Sonraki Proje"
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-cyan-400 flex items-center justify-center transition-all"
          >
            <HiChevronRight className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  )
}
