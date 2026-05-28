import { useCallback } from 'react'

const COLORS = [
  '#d97706','#f59e0b','#c2410c','#0d9488',
  '#059669','#e11d48','#dc2626','#fcd34d',
  '#fb923c','#34d399','#fbbf24',
]

/**
 * Launches confetti particles into a container element.
 * Returns a cleanup function.
 */
export function useConfetti() {
  const launch = useCallback((containerId = 'confetti-root', isWinner = false) => {
    const container = document.getElementById(containerId)
    if (!container) return

    // Clear old pieces
    container.innerHTML = ''

    const palette = isWinner
      ? ['#ffd700', '#ffec61', '#fff', '#d97706', '#f59e0b']
      : COLORS

    const count = isWinner ? 130 : 90

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      const color = palette[Math.floor(Math.random() * palette.length)]
      const x     = Math.random() * 100
      const delay = Math.random() * 1.2
      const dur   = 2.5 + Math.random() * 2
      const size  = 6 + Math.random() * 9
      const rad   = Math.random() > 0.5 ? '50%' : '3px'
      const rot   = Math.random() * 360

      el.style.cssText = `
        position:absolute;
        top:-20px;
        left:${x}%;
        width:${size}px;
        height:${size}px;
        background:${color};
        border-radius:${rad};
        transform:rotate(${rot}deg);
        animation:confetti-fall ${dur}s ${delay}s linear forwards;
        pointer-events:none;
      `
      container.appendChild(el)
    }

    // Auto clean after longest animation
    const timer = setTimeout(() => { container.innerHTML = '' }, 5500)
    return () => { clearTimeout(timer); container.innerHTML = '' }
  }, [])

  return { launch }
}
