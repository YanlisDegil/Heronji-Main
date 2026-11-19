// Cyberpunk Synthesized Sound Engine using Web Audio API (Zero external assets needed)

let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

let isSoundEnabled = true

export function setSoundEnabled(enabled) {
  isSoundEnabled = enabled
}

export function getSoundEnabled() {
  return isSoundEnabled
}

export function playHoverSound() {
  if (!isSoundEnabled) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(680, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(920, ctx.currentTime + 0.06)
    
    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.06)
  } catch (e) {
    // ignore
  }
}

export function playClickSound() {
  if (!isSoundEnabled) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(440, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08)
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.08)
  } catch (e) {
    // ignore
  }
}

export function playWarningSound() {
  if (!isSoundEnabled) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    
    // Double beep for lock/error
    const times = [0, 0.12]
    times.forEach((t) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(260, ctx.currentTime + t)
      osc.frequency.setValueAtTime(220, ctx.currentTime + t + 0.08)
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime + t)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.09)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start(ctx.currentTime + t)
      osc.stop(ctx.currentTime + t + 0.09)
    })
  } catch (e) {
    // ignore
  }
}

export function playWarpSound() {
  if (!isSoundEnabled) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(180, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.6)
    
    gain.gain.setValueAtTime(0.01, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.3)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.7)
  } catch (e) {
    // ignore
  }
}
