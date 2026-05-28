import { useState, useRef } from 'react'
import { useGame } from '../../context/GameContext.jsx'
import { getSegmentColor } from '../../utils/colors.js'
import styles from './NamePanel.module.css'

const QUICK_NAMES = ['you', 'bestie', 'dude', 'bro', 'sis', 'friend']

export default function NamePanel() {
  const { state, addName, removeName, clearNames, updateName } = useGame()
  const [inputVal, setInputVal] = useState('')
  const [shake, setShake] = useState(false)
  const [editingName, setEditingName] = useState(null)
  const [editVal, setEditVal] = useState('')
  const inputRef = useRef(null)

  function handleAdd() {
    const trimmed = inputVal.trim()
    if (!trimmed) { triggerShake(); return }
    if (state.names.includes(trimmed)) { triggerShake(); return }
    addName(trimmed)
    setInputVal('')
    inputRef.current?.focus()
  }

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  function startEdit(name) {
    setEditingName(name)
    setEditVal(name)
  }

  function commitEdit() {
    const trimmed = editVal.trim()
    if (editingName && trimmed && trimmed !== editingName) {
      if (!state.names.includes(trimmed)) {
        updateName(editingName, trimmed)
      }
    }
    setEditingName(null)
  }

  function handleEditKey(e) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditingName(null)
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <section className={styles.panel} aria-labelledby="names-heading">
      <h2 className={styles.heading} id="names-heading">
        Add Friends
        <span className={styles.badge}>{state.names.length}</span>
      </h2>

      {/* Input row */}
      <div className={`${styles.inputRow} ${shake ? styles.shake : ''}`}>
        <input
          ref={inputRef}
          id="name-input"
          type="text"
          className={styles.input}
          placeholder='e.g. "Sarah" or "Marketing"'
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKey}
          maxLength={20}
          autoComplete="off"
          aria-label="Enter friend's name"
        />
        <button
          id="add-name-btn"
          className={styles.addBtn}
          onClick={handleAdd}
          aria-label="Add name"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Quick-add suggestions */}
      <div className={styles.quickRow} aria-label="Quick add suggestions">
        <span className={styles.quickLabel}>Quick:</span>
        {QUICK_NAMES.map(n => (
          <button
            key={n}
            className={styles.quickBtn}
            onClick={() => addName(n)}
            aria-label={`Add ${n}`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Names list */}
      {state.names.length > 0 ? (
        <ul className={styles.list} aria-label="Participant list">
          {state.names.map((name, i) => {
            const isEliminated = state.mode === 'elimination' && !state.activeNames.includes(name);
            return (
              <li key={name} className={`${styles.nameItem} ${isEliminated ? styles.eliminated : ''}`} onDoubleClick={() => startEdit(name)}>
                <span
                  className={styles.dot}
                  style={{ background: getSegmentColor(i, state.names.length) }}
                  aria-hidden="true"
                />
                {editingName === name ? (
                  <input
                    type="text"
                    className={styles.editInput}
                    value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={handleEditKey}
                    autoFocus
                  />
                ) : (
                  <span className={styles.nameLabel} title="Double-click to edit">{name}</span>
                )}
                {isEliminated && (
                  <span className={styles.elimTag} aria-label="Eliminated">Out</span>
                )}
                <button
                  className={styles.removeBtn}
                  onClick={() => removeName(name)}
                  aria-label={`Remove ${name}`}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.emptyHint}>Add at least 2 players to spin!</p>
      )}

      {state.names.length > 0 && (
        <button
          id="clear-all-btn"
          className={styles.clearBtn}
          onClick={clearNames}
        >
          🗑️ Clear All
        </button>
      )}
    </section>
  )
}
