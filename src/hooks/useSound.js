import { useRef, useCallback } from 'react'
import { useGame } from '../context/GameContext.jsx'

/**
 * Web Audio sound engine hook.
 * All sounds are generated procedurally — no audio files needed.
 */
export function useSound() {
  const { state } = useGame()
  const ctxRef = useRef(null)

  function getCtx() {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }

  /** Tick — plays once per wheel segment crossed */
  const playTick = useCallback((speed = 1) => {
    if (!state.settings?.soundEnabled) return
    try {
      const c = getCtx()
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.connect(gain)
      gain.connect(c.destination)
      osc.frequency.setValueAtTime(500 + speed * 50, c.currentTime)
      osc.type = 'triangle'
      gain.gain.setValueAtTime(0.15, c.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.07)
      osc.start(c.currentTime)
      osc.stop(c.currentTime + 0.07)
    } catch { /* blocked by browser policy — silently ignore */ }
  }, [state.settings?.soundEnabled])

  /** Fanfare — winner reveal in Pay mode */
  const playFanfare = useCallback(() => {
    if (!state.settings?.soundEnabled) return
    try {
      const c = getCtx()
      const notes = [523.25, 659.25, 783.99, 1046.5]
      notes.forEach((freq, i) => {
        const osc = c.createOscillator()
        const gain = c.createGain()
        osc.connect(gain)
        gain.connect(c.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        const t = c.currentTime + i * 0.13
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(0.18, t + 0.04)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45)
        osc.start(t)
        osc.stop(t + 0.5)
      })
    } catch { /* ignore */ }
  }, [state.settings?.soundEnabled])

  /** Loser sound — sad slide for Dare mode */
  const playLoser = useCallback(() => {
    if (!state.settings?.soundEnabled) return
    try {
      const c = getCtx()
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.connect(gain)
      gain.connect(c.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(400, c.currentTime)
      osc.frequency.exponentialRampToValueAtTime(160, c.currentTime + 0.6)
      gain.gain.setValueAtTime(0.12, c.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.7)
      osc.start(c.currentTime)
      osc.stop(c.currentTime + 0.8)
    } catch { /* ignore */ }
  }, [state.settings?.soundEnabled])

  /** Elimination crunch — noise burst */
  const playElim = useCallback(() => {
    if (!state.settings?.soundEnabled) return
    try {
      const c = getCtx()
      const bufLen = Math.floor(c.sampleRate * 0.15)
      const buf = c.createBuffer(1, bufLen, c.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * 0.4
      const src = c.createBufferSource()
      src.buffer = buf
      const gain = c.createGain()
      src.connect(gain)
      gain.connect(c.destination)
      gain.gain.setValueAtTime(0.3, c.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15)
      src.start()
    } catch { /* ignore */ }
  }, [state.settings?.soundEnabled])

  return { playTick, playFanfare, playLoser, playElim }
}
