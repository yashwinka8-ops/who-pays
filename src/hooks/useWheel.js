import { useRef, useCallback, useEffect } from 'react'
import { getSegmentColor } from '../utils/colors.js'

const FRICTION    = 0.986
const MIN_VEL     = 0.003
const CENTER_R    = 46   // px — center circle radius

/**
 * useWheel — encapsulates all Canvas drawing + spin physics.
 *
 * Returns:
 *   canvasRef  — attach to <canvas ref={canvasRef}>
 *   spin()     — starts a spin
 *   isSpinning — boolean
 */
export function useWheel({ names, onSpinEnd }) {
  const canvasRef      = useRef(null)
  const angleRef       = useRef(0)          // current rotation (radians)
  const velocityRef    = useRef(0)
  const spinningRef    = useRef(false)
  const rafRef         = useRef(null)
  const lastSegRef     = useRef(-1)
  const onSpinEndRef   = useRef(onSpinEnd)
  const namesRef       = useRef(names)
  const tickCbRef      = useRef(null)       // injected by component for sound

  // Keep refs fresh
  useEffect(() => { onSpinEndRef.current = onSpinEnd }, [onSpinEnd])
  useEffect(() => { namesRef.current = names },          [names])

  /* ---- Drawing ---- */
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx    = canvas.getContext('2d')
    const dpr    = window.devicePixelRatio || 1
    const W      = canvas.width  / dpr
    const H      = canvas.height / dpr
    const cx     = W / 2
    const cy     = H / 2
    const r      = Math.min(W, H) / 2 - 8
    const names  = namesRef.current
    const angle  = angleRef.current

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(dpr, dpr)

    if (names.length === 0) {
      _drawEmpty(ctx, cx, cy, r)
      _drawCenter(ctx, cx, cy)
      ctx.restore()
      return
    }

    const segAngle = (2 * Math.PI) / names.length

    names.forEach((name, i) => {
      const start = angle + i * segAngle
      const end   = start + segAngle
      const mid   = start + segAngle / 2

      // Segment
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, end)
      ctx.closePath()
      ctx.fillStyle = getSegmentColor(i, names.length)
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.22)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Text
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(mid)
      
      const normalizedMid = ((mid % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
      const isLeftHalf = normalizedMid > Math.PI / 2 && normalizedMid < 3 * Math.PI / 2

      const fontSize = Math.min(17, Math.max(9, Math.floor(r * 0.12 - names.length * 0.3)))
      ctx.font = `800 ${fontSize}px 'Inter', sans-serif`
      ctx.fillStyle = '#fff'
      ctx.shadowColor = 'rgba(0,0,0,0.6)'
      ctx.shadowBlur  = 4
      ctx.textBaseline = 'middle'
      const display = name.length > 13 ? name.slice(0, 12) + '…' : name
      
      if (isLeftHalf) {
        ctx.rotate(Math.PI)
        ctx.textAlign = 'left'
        ctx.fillText(display, -(r - 16), 0, r * 0.72)
      } else {
        ctx.textAlign = 'right'
        ctx.fillText(display, r - 16, 0, r * 0.72)
      }
      
      ctx.restore()
    })

    _drawCenter(ctx, cx, cy)
    ctx.restore()
  }, [])

  /* ---- Segment under pointer ---- */
  function getWinnerIndex() {
    const names = namesRef.current
    if (!names.length) return 0
    const segAngle  = (2 * Math.PI) / names.length
    let normalized  = ((3 * Math.PI / 2) - angleRef.current) % (2 * Math.PI)
    if (normalized < 0) normalized += 2 * Math.PI
    return Math.floor(normalized / segAngle) % names.length
  }

  /* ---- Tick detection ---- */
  function checkTick() {
    const names = namesRef.current
    if (!names.length) return
    const segAngle   = (2 * Math.PI) / names.length
    let normalized   = ((3 * Math.PI / 2) - angleRef.current) % (2 * Math.PI)
    if (normalized < 0) normalized += 2 * Math.PI
    const seg = Math.floor(normalized / segAngle) % names.length
    if (seg !== lastSegRef.current) {
      lastSegRef.current = seg
      tickCbRef.current?.(velocityRef.current)
    }
  }

  /* ---- Physics loop ---- */
  function loop() {
    velocityRef.current *= FRICTION
    angleRef.current    += velocityRef.current
    angleRef.current     = angleRef.current % (2 * Math.PI)
    checkTick()
    draw()

    if (velocityRef.current > MIN_VEL) {
      rafRef.current = requestAnimationFrame(loop)
    } else {
      // Stopped
      velocityRef.current = 0
      spinningRef.current = false
      const idx    = getWinnerIndex()
      const winner = namesRef.current[idx]
      onSpinEndRef.current?.(winner)
    }
  }

  /* ---- Public: spin() ---- */
  const spin = useCallback((onTickCb) => {
    if (spinningRef.current) return
    if (!namesRef.current || namesRef.current.length < 2) return

    tickCbRef.current       = onTickCb
    spinningRef.current     = true
    lastSegRef.current      = -1
    velocityRef.current     = (24 + Math.random() * 16) * (Math.PI / 180) * 16

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [])

  /* ---- Setup canvas DPI ---- */
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr  = window.devicePixelRatio || 1
    const size = canvas.getBoundingClientRect()
    canvas.width  = (size.width  || 500) * dpr
    canvas.height = (size.height || 500) * dpr
    canvas.style.width  = `${size.width  || 500}px`
    canvas.style.height = `${size.height || 500}px`
    draw()
  }, [draw])

  /* ---- Effects ---- */
  useEffect(() => {
    const ro = new ResizeObserver(() => setupCanvas())
    if (canvasRef.current) ro.observe(canvasRef.current.parentElement)
    setTimeout(setupCanvas, 60)
    return () => ro.disconnect()
  }, [setupCanvas])

  // Redraw whenever names change
  useEffect(() => { draw() }, [names, draw])

  // Idle slow rotation when empty
  useEffect(() => {
    let raf
    function idleTick() {
      if (!spinningRef.current && namesRef.current.length === 0) {
        angleRef.current += 0.004
        draw()
      }
      raf = requestAnimationFrame(idleTick)
    }
    raf = requestAnimationFrame(idleTick)
    return () => cancelAnimationFrame(raf)
  }, [draw])

  return { canvasRef, spin, isSpinning: spinningRef }
}

/* ---- Private helpers ---- */
function _drawEmpty(ctx, cx, cy, r) {
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, 2 * Math.PI)
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 2
  ctx.setLineDash([12, 8])
  ctx.stroke()
  ctx.setLineDash([])
  ctx.font = "700 18px 'Inter', sans-serif"
  ctx.fillStyle = 'rgba(255,255,255,0.14)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Add friends', cx, cy - 14)
  ctx.font = "500 14px 'Inter', sans-serif"
  ctx.fillText('to start spinning', cx, cy + 14)
}

function _drawCenter(ctx, cx, cy) {
  ctx.beginPath()
  ctx.arc(cx, cy, CENTER_R, 0, 2 * Math.PI)
  ctx.fillStyle = '#0a0a0f'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.09)'
  ctx.lineWidth = 3
  ctx.stroke()
}
