import { useImperativeHandle, forwardRef, useRef } from 'react'
import { useGame } from '../../context/GameContext.jsx'
import { useWheel } from '../../hooks/useWheel.js'
import { useSound } from '../../hooks/useSound.js'
import styles from './WheelCanvas.module.css'

export default forwardRef(function WheelCanvas({ onSpinEnd, overrideNames }, ref) {
  const { state, setSpinning } = useGame()
  const { playTick } = useSound()

  const currentNames = overrideNames || state.activeNames

  const { canvasRef, spin } = useWheel({
    names: currentNames,
    onSpinEnd: (winner) => {
      setSpinning(false)
      onSpinEnd?.(winner)
    },
  })

  function handleSpin() {
    if (state.isSpinning || currentNames.length < 2) return
    setSpinning(true)
    spin((vel) => {
      const speed = Math.min(vel / 0.3, 10)
      playTick(speed)
    })
  }

  // Expose triggerSpin to parent for Space key shortcut
  useImperativeHandle(ref, () => ({ triggerSpin: handleSpin }))

  const canSpin = currentNames.length >= 2 && !state.isSpinning

  return (
    <div className={styles.wrapper} id="wheel-wrapper">
      {/* Pointer arrow */}
      <div className={styles.pointer} aria-hidden="true">
        <svg viewBox="0 0 36 54" fill="none">
          <polygon
            points="0,8 18,18 36,8 18,54"
            fill="white"
            filter="drop-shadow(0 3px 8px rgba(0,0,0,0.6))"
          />
        </svg>
      </div>

      {/* Outer glow ring */}
      <div
        className={`${styles.glowRing} ${state.isSpinning ? styles.glowRingActive : ''}`}
        aria-hidden="true"
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        id="wheel-canvas"
        className={styles.canvas}
        onClick={handleSpin}
        role="img"
        aria-label="Spinning wheel"
      />

      {/* Center spin button */}
      <button
        id="spin-btn"
        className={`${styles.centerBtn} ${state.isSpinning ? styles.centerBtnSpinning : ''}`}
        onClick={handleSpin}
        disabled={!canSpin}
        aria-label={state.isSpinning ? 'Spinning…' : 'Spin the wheel'}
      >
        <span className={styles.centerBtnText}>
          {state.isSpinning ? '…' : 'SPIN'}
        </span>
      </button>
    </div>
  )
})
