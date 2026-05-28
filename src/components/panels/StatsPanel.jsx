import { useGame } from '../../context/GameContext.jsx'
import { Wallet, Zap, UserMinus, Download, Trash2 } from 'lucide-react'
import styles from './StatsPanel.module.css'

const MEDALS = ['🥇','🥈','🥉','4️⃣','5️⃣']

export default function StatsPanel() {
  const { state, clearHistory, resetElim } = useGame()

  const leaderboard = Object.entries(state.leaderboard)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  function exportCSV() {
    if (state.history.length === 0) return
    const header = "Round,Name,Mode\n"
    const rows = state.history.map(h => `${h.round},"${h.name.replace(/"/g, '""')}",${h.mode}`).join("\n")
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `whopays_history_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.container}>

      {/* Elimination Survivors — only in elim mode */}
      {state.mode === 'elimination' && state.names.length > 0 && (
        <section className={styles.card} aria-labelledby="elim-heading">
          <h2 className={styles.heading} id="elim-heading">⚔️ Survivors</h2>
          <ul className={styles.survivorList}>
            {state.names.map(name => {
              const isOut = !state.activeNames.includes(name)
              return (
                <li key={name} className={`${styles.survivorItem} ${isOut ? styles.eliminated : ''}`}>
                  <span className={styles.survivorName}>{name}</span>
                  {isOut && <span className={styles.elimTag}>Out</span>}
                </li>
              )
            })}
          </ul>
          {state.activeNames.length <= 1 && (
            <button className={styles.resetBtn} onClick={resetElim} id="reset-elim-btn">
              🔄 Restart Elimination
            </button>
          )}
        </section>
      )}

      {/* History */}
      <section className={styles.card} aria-labelledby="history-heading">
        <h2 className={styles.heading} id="history-heading">📜 History</h2>

        {state.history.length === 0 ? (
          <p className={styles.empty}>No rounds yet — spin!</p>
        ) : (
          <>
            <ul className={styles.historyList}>
              {state.history.slice(0, 8).map((entry, i) => {
                const icon = {
                  pay: <Wallet size={14} color="var(--accent-amber)" />,
                  dare: <Zap size={14} color="var(--accent-teal)" />,
                  elimination: <UserMinus size={14} color="var(--accent-red)" />
                }[entry.mode];
                return (
                  <li key={i} className={styles.historyItem}>
                    <span className={styles.histRound}>R{entry.round}</span>
                    <span className={styles.histName}>{entry.name}</span>
                    <span className={styles.histIcon}>{icon}</span>
                  </li>
                );
              })}
            </ul>
            <div className={styles.btnRow}>
              <button className={styles.actionBtn} onClick={exportCSV} title="Export as CSV">
                <Download size={14} /> Export CSV
              </button>
              <button className={styles.actionBtn} onClick={clearHistory} id="clear-history-btn" style={{ color: 'var(--accent-red)' }}>
                <Trash2 size={14} /> Clear
              </button>
            </div>
          </>
        )}
      </section>

      {/* Leaderboard */}
      <section className={styles.card} aria-labelledby="lb-heading">
        <h2 className={styles.heading} id="lb-heading">🏆 Top Losers</h2>

        {leaderboard.length === 0 ? (
          <p className={styles.empty}>Spin to build stats!</p>
        ) : (
          <ul className={styles.lbList}>
            {leaderboard.map(([name, count], i) => (
              <li key={name} className={styles.lbItem}>
                <span className={styles.lbMedal}>{MEDALS[i]}</span>
                <span className={styles.lbName}>{name}</span>
                <span className={styles.lbCount}>{count}×</span>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  )
}
