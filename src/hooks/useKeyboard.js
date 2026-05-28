import { useEffect } from 'react'
import { useGame } from '../context/GameContext.jsx'

/**
 * Global keyboard handler.
 * Space → spin (when on the play page)
 */
export function useKeyboard(onSpin) {
  const { state } = useGame()

  useEffect(() => {
    function handler(e) {
      // Space to spin — ignore if typing in an input/textarea
      if (
        e.code === 'Space' &&
        !['INPUT', 'TEXTAREA', 'BUTTON'].includes(e.target.tagName)
      ) {
        e.preventDefault()
        if (!state.isSpinning && state.activeNames.length >= 2) {
          onSpin?.()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [state.isSpinning, state.activeNames, onSpin])
}
