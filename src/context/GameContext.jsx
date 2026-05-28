import { createContext, useContext, useReducer, useEffect } from 'react'

/* ---- Initial State ---- */
const initialState = {
  names: [],          // All participant names (persisted)
  activeNames: [],    // Current round participants (changes in elim mode)
  mode: 'pay',        // 'pay' | 'dare' | 'elimination'
  isSpinning: false,
  round: 1,
  history: [],        // [{ round, name, mode, emoji }]
  leaderboard: {},    // { name: lossCount }
  wheelTitle: '',     // Custom wheel title
  settings: {         // Global user preferences
    soundEnabled: true,
    confettiEnabled: true,
  },
}

/* ---- Action Types ---- */
const A = {
  ADD_NAME:        'ADD_NAME',
  REMOVE_NAME:     'REMOVE_NAME',
  CLEAR_NAMES:     'CLEAR_NAMES',
  SET_MODE:        'SET_MODE',
  SET_SPINNING:    'SET_SPINNING',
  RECORD_WINNER:   'RECORD_WINNER',
  CLEAR_HISTORY:   'CLEAR_HISTORY',
  RESET_ELIM:      'RESET_ELIM',
  SET_WHEEL_TITLE: 'SET_WHEEL_TITLE',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  UPDATE_NAME:     'UPDATE_NAME',
  HYDRATE:         'HYDRATE',
}

/* ---- Reducer ---- */
function gameReducer(state, action) {
  switch (action.type) {

    case A.HYDRATE:
      return { ...state, ...action.payload }

    case A.ADD_NAME: {
      const name = action.payload.trim()
      if (!name || state.names.includes(name)) return state
      const names = [...state.names, name]
      const activeNames = state.mode === 'elimination'
        ? [...state.activeNames, name]
        : [...names]
      return { ...state, names, activeNames }
    }

    case A.REMOVE_NAME: {
      const name = action.payload
      const names = state.names.filter(n => n !== name)
      const activeNames = state.activeNames.filter(n => n !== name)
      return { ...state, names, activeNames }
    }

    case A.UPDATE_NAME: {
      const { oldName, newName } = action.payload
      const name = newName.trim()
      if (!name || state.names.includes(name)) return state
      
      const names = state.names.map(n => n === oldName ? name : n)
      const activeNames = state.activeNames.map(n => n === oldName ? name : n)
      
      // Transfer leaderboard stats
      const leaderboard = { ...state.leaderboard }
      if (leaderboard[oldName] !== undefined) {
        leaderboard[name] = leaderboard[oldName]
        delete leaderboard[oldName]
      }

      // Update history
      const history = state.history.map(h => h.name === oldName ? { ...h, name } : h)

      return { ...state, names, activeNames, leaderboard, history }
    }

    case A.CLEAR_NAMES:
      return { ...state, names: [], activeNames: [] }

    case A.SET_MODE: {
      const mode = action.payload
      const activeNames = [...state.names] // reset active list on mode change
      return { ...state, mode, activeNames }
    }

    case A.SET_SPINNING:
      return { ...state, isSpinning: action.payload }

    case A.RECORD_WINNER: {
      const { name, mode } = action.payload

      // History entry
      const entry = { round: state.round, name, mode }
      const history = [entry, ...state.history]

      // Leaderboard
      const leaderboard = {
        ...state.leaderboard,
        [name]: (state.leaderboard[name] || 0) + 1,
      }

      // Elimination — remove winner (loser) from active list
      const activeNames = mode === 'elimination'
        ? state.activeNames.filter(n => n !== name)
        : state.activeNames

      return {
        ...state,
        history,
        leaderboard,
        activeNames,
        round: state.round + 1,
        isSpinning: false,
      }
    }

    case A.CLEAR_HISTORY:
      return { ...state, history: [] }

    case A.RESET_ELIM:
      return { ...state, activeNames: [...state.names], round: 1 }

    case A.SET_WHEEL_TITLE:
      return { ...state, wheelTitle: action.payload }

    case A.UPDATE_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload } }

    default:
      return state
  }
}

/* ---- Context ---- */
const GameContext = createContext(null)

/* ---- Provider ---- */
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('whopays_state')
      if (saved) {
        const { names, leaderboard, settings } = JSON.parse(saved)
        dispatch({
          type: A.HYDRATE,
          payload: { 
            names: names || [], 
            activeNames: names ? [...names] : [], 
            leaderboard: leaderboard || {},
            settings: settings || initialState.settings
          },
        })
      }
    } catch { /* ignore */ }
  }, [])

  // Persist names + leaderboard + settings on change
  useEffect(() => {
    try {
      localStorage.setItem('whopays_state', JSON.stringify({
        names: state.names,
        leaderboard: state.leaderboard,
        settings: state.settings,
      }))
    } catch { /* ignore */ }
  }, [state.names, state.leaderboard, state.settings])

  /* ---- Action Creators ---- */
  const actions = {
    addName:       (name)  => dispatch({ type: A.ADD_NAME,        payload: name }),
    removeName:    (name)  => dispatch({ type: A.REMOVE_NAME,     payload: name }),
    clearNames:    ()      => dispatch({ type: A.CLEAR_NAMES }),
    setMode:       (mode)  => dispatch({ type: A.SET_MODE,        payload: mode }),
    setSpinning:   (bool)  => dispatch({ type: A.SET_SPINNING,    payload: bool }),
    recordWinner:  (info)  => dispatch({ type: A.RECORD_WINNER,   payload: info }),
    clearHistory:  ()      => dispatch({ type: A.CLEAR_HISTORY }),
    resetElim:     ()      => dispatch({ type: A.RESET_ELIM }),
    setWheelTitle: (title) => dispatch({ type: A.SET_WHEEL_TITLE, payload: title }),
    updateSettings: (opts) => dispatch({ type: A.UPDATE_SETTINGS, payload: opts }),
    updateName:    (oldName, newName) => dispatch({ type: A.UPDATE_NAME, payload: { oldName, newName } }),
  }

  return (
    <GameContext.Provider value={{ state, ...actions }}>
      {children}
    </GameContext.Provider>
  )
}

/* ---- Hook ---- */
export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>')
  return ctx
}
