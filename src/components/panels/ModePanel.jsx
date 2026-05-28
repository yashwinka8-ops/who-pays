import { useGame } from '../../context/GameContext.jsx'
import { MODE_CONFIG } from '../../utils/dares.js'
import { Wallet, Zap, UserMinus, Search, MessageCircleHeart, Gift, Swords } from 'lucide-react'
import styles from './ModePanel.module.css'

const MODE_ICONS = {
  pay: <Wallet size={22} strokeWidth={2} />,
  dare: <Zap size={22} strokeWidth={2} />,
  elimination: <UserMinus size={22} strokeWidth={2} />,
  truth: <MessageCircleHeart size={22} strokeWidth={2} />,
  prize: <Gift size={22} strokeWidth={2} />,
  challenge: <Swords size={22} strokeWidth={2} />
}

export default function ModePanel() {
  const { state, setMode, setWheelTitle } = useGame()
  const modes = Object.values(MODE_CONFIG)

  return (
    <section className={styles.panel} aria-labelledby="mode-heading">
      <h2 className={styles.heading} id="mode-heading">Game Mode</h2>

      {/* Mode tabs */}
      <div className={styles.tabs} role="tablist" aria-label="Select game mode">
        {modes.map(m => (
          <button
            key={m.id}
            id={`tab-${m.id}`}
            role="tab"
            aria-selected={state.mode === m.id}
            className={`${styles.tab} ${state.mode === m.id ? styles.tabActive : ''}`}
            onClick={() => setMode(m.id)}
          >
            <span className={styles.tabIcon}>{MODE_ICONS[m.id]}</span>
            <span className={styles.tabLabel}>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Active mode description */}
      <p className={styles.modeDesc}>
        {MODE_CONFIG[state.mode].description}
      </p>

      {/* Custom title */}
      <div className={styles.titleGroup}>
        <label htmlFor="wheel-title-input" className={styles.label}>
          Custom Wheel Title
        </label>
        <div className={styles.inputWrapper}>
          <Search size={14} className={styles.inputIcon} />
          <input
            id="wheel-title-input"
            type="text"
            className={styles.titleInput}
            placeholder={`e.g. Who buys tea?`}
            maxLength={40}
            onChange={e => setWheelTitle(e.target.value)}
          />
        </div>
      </div>
    </section>
  )
}
