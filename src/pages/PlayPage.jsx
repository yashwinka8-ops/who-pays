import { useState, useCallback, useRef } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { MODE_CONFIG } from '../utils/dares.js'
import ModePanel from '../components/panels/ModePanel.jsx'
import NamePanel from '../components/panels/NamePanel.jsx'
import WheelCanvas from '../components/wheel/WheelCanvas.jsx'
import StatsPanel from '../components/panels/StatsPanel.jsx'
import ResultModal from '../components/modals/ResultModal.jsx'
import SettingsModal from '../components/modals/SettingsModal.jsx'
import StatsModal from '../components/modals/StatsModal.jsx'
import { useKeyboard } from '../hooks/useKeyboard.js'
import { Settings, BarChart2 } from 'lucide-react'
import styles from './PlayPage.module.css'

export default function PlayPage() {
  const { state, recordWinner } = useGame()
  const [winner, setWinner] = useState(null)
  const [challengeOpponent, setChallengeOpponent] = useState(null)
  const [challengeMatch, setChallengeMatch] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const wheelRef = useRef(null)

  const defaultTitle = {
    pay:         'Who pays the bill?',
    dare:        'Who gets the dare?',
    elimination: 'Who gets eliminated?',
  }[state.mode]

  const wheelTitle = state.wheelTitle || defaultTitle

  /* Called when wheel stops */
  const handleSpinEnd = useCallback((name) => {
    if (state.mode === 'challenge' && !challengeMatch) {
      const others = state.activeNames.filter(n => n !== name)
      const opp = others.length > 0 ? others[Math.floor(Math.random() * others.length)] : 'Unknown'
      setChallengeOpponent(opp)
      setTimeout(() => setWinner(name), 420)
    } else {
      recordWinner({ name, mode: state.mode })
      setTimeout(() => setWinner(name), 420)
    }
  }, [state.mode, challengeMatch, state.activeNames, recordWinner])

  function handleClose() { 
    setWinner(null) 
    setChallengeOpponent(null)
    setChallengeMatch(null)
  }

  function handleStartChallengeSpin() {
    setChallengeMatch([winner, challengeOpponent])
    setWinner(null)
    setChallengeOpponent(null)
    setTimeout(() => {
      wheelRef.current?.triggerSpin?.()
    }, 100)
  }

  function handleSpinViaKeyboard() { wheelRef.current?.triggerSpin?.() }
  useKeyboard(handleSpinViaKeyboard)

  function handleSpinAgain() {
    handleClose()
    setTimeout(() => {
      wheelRef.current?.triggerSpin?.()
    }, 100)
  }

  const statusMsg = (() => {
    if (state.activeNames.length < 2)  return 'Add at least 2 friends to start!'
    if (state.isSpinning)              return "🎡 Spinning… who's unlucky?"
    if (state.mode === 'elimination' && state.activeNames.length === 1)
                                       return `🏆 ${state.activeNames[0]} is the last survivor!`
    return `${state.activeNames.length} players ready — tap SPIN or press Space!`
  })()

  return (
    <div className={styles.page}>
      {/* Confetti root */}
      <div id="confetti-root" className={styles.confettiRoot} aria-hidden="true" />

      {/* Share canvas (hidden) */}
      <canvas id="share-canvas" style={{ display: 'none' }} aria-hidden="true" />
      
      <div className={styles.topNav}>
        <button 
          onClick={() => setShowStats(true)}
          className={`${styles.iconBtn} ${styles.mobileStatsBtn}`}
          aria-label="History & Stats"
        >
          <BarChart2 size={22} color="var(--text-muted)" />
        </button>
        <button 
          onClick={() => setShowSettings(true)}
          className={styles.iconBtn}
          aria-label="Settings"
        >
          <Settings size={22} color="var(--text-muted)" />
        </button>
      </div>

      <div className={styles.grid}>

        <div className={styles.modeArea}>
          <ModePanel />
        </div>

        <div className={styles.nameArea}>
          <NamePanel />
          <div className={styles.adSlot} role="complementary" aria-label="Advertisement">
            <span className={styles.adLabel}>AD</span>
            <p className={styles.adText}>
              Sponsor this wheel<br />
              <a href="mailto:sponsor@whopays.fun" className={styles.adLink}>
                sponsor@whopays.fun
              </a>
            </p>
          </div>
        </div>

        {/* Center — Wheel */}
        <section className={styles.center} aria-label="Spinning wheel">
          <h1 className={styles.wheelTitle}>{challengeMatch ? 'Challenge Spin!' : wheelTitle}</h1>

          <WheelCanvas ref={wheelRef} onSpinEnd={handleSpinEnd} overrideNames={challengeMatch} />

          {/* Footer Banner */}
          <div className={styles.footerBanner}>
            <p
              className={`${styles.status} ${
                state.isSpinning        ? styles.statusSpinning :
                state.activeNames.length >= 2 ? styles.statusReady : ''
              }`}
              aria-live="polite"
            >
              {statusMsg}
            </p>
            <p className={styles.keyHint}>Press <kbd>Space</kbd> to spin</p>
          </div>
        </section>

        {/* Right panel */}
        <aside className={styles.right} aria-label="Stats and history">
          <StatsPanel />
        </aside>

      </div>


      {/* Result modal */}
      {winner && (
        <ResultModal
          winner={winner}
          challengeOpponent={challengeOpponent}
          onClose={handleClose}
          onSpinAgain={handleSpinAgain}
          onStartChallengeSpin={handleStartChallengeSpin}
        />
      )}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
      {showStats && (
        <StatsModal onClose={() => setShowStats(false)} />
      )}
    </div>
  )
}
