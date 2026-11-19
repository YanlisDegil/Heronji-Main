import React from 'react'
import {
  HiChevronLeft,
  HiChevronRight,
  HiExternalLink,
  HiLockClosed,
} from 'react-icons/hi'
import { PROJECTS } from '../3d/ScreenCorridor'
import { playClickSound, playWarningSound, playWarpSound } from '../../utils/audio'

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
    } else if (currentProject.url) {
      playClickSound()
      window.open(currentProject.url, '_blank', 'noopener,noreferrer')
    } else {
      playWarningSound()
      onTriggerNotReady(currentProject.id)
    }
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 px-4 sm:px-8 pointer-events-none flex flex-col items-center">
      {/* Project Card Bottom Overlay (Clean & Neutral) */}
      <div className="glass-panel-elevated pointer-events-auto p-4 sm:p-5 rounded-xl max-w-2xl w-full transition-all duration-300 mb-2 border border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isNotReady ? '#f87171' : currentProject.statusColor }}
              />
              <span
                className="text-xs font-mono font-medium uppercase text-slate-300"
              >
                {isNotReady ? 'ERİŞİM KISITLI' : currentProject.status}
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {`[ ${activeIndex + 1} / ${PROJECTS.length} ]`}
              </span>
            </div>

            <h3 className="font-semibold text-lg text-slate-100">
              {currentProject.fullTitle}
            </h3>

            <p className="text-xs text-slate-300 mt-1 line-clamp-2">
              {isNotReady
                ? `Bu modül henüz hazır değil (${remainingSec} saniye).`
                : currentProject.description}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleMainAction}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                isNotReady
                  ? 'bg-rose-950/70 border border-rose-800 text-rose-300'
                  : currentProject.isLive
                  ? 'bg-slate-100 hover:bg-white text-slate-900 font-semibold shadow-sm'
                  : currentProject.url
                  ? 'bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200'
                  : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400'
              }`}
            >
              {isNotReady ? (
                <>
                  <HiLockClosed className="text-sm" />
                  <span>HENÜZ HAZIR DEĞİL ({remainingSec}s)</span>
                </>
              ) : currentProject.isLive ? (
                <>
                  <span>Projeyi Aç (Canlı)</span>
                  <HiExternalLink className="text-sm" />
                </>
              ) : currentProject.url ? (
                <>
                  <span>Siteyi Ziyaret Et</span>
                  <HiExternalLink className="text-sm" />
                </>
              ) : (
                <>
                  <HiLockClosed className="text-sm" />
                  <span>Durumu Gör (Kilitli)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Dots / Selector */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800">
          <button
            onClick={handlePrev}
            aria-label="Önceki Proje"
            className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
          >
            <HiChevronLeft className="text-base" />
          </button>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {PROJECTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  playClickSound()
                  onSelectIndex(idx)
                }}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-all ${
                  idx === activeIndex
                    ? 'bg-slate-800 text-slate-100 border border-slate-600 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{p.title}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Sonraki Proje"
            className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
          >
            <HiChevronRight className="text-base" />
          </button>
        </div>
      </div>
    </div>
  )
}
