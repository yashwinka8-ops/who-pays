import { MODE_CONFIG } from './dares.js'

export function generateShareCard(winnerName, mode, wheelTitle, dareText = null) {
  const canvas = document.getElementById('share-canvas')
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const W = 800, H = 1000
  canvas.width = W
  canvas.height = H

  const config = MODE_CONFIG[mode]

  /* Background */
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#141414')
  bg.addColorStop(1, '#1c1c1c')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  /* Subtle ambient glow */
  const glow = ctx.createRadialGradient(W / 2, 200, 40, W / 2, 200, 500)
  glow.addColorStop(0, 'rgba(217,119,6,0.15)')
  glow.addColorStop(1, 'rgba(217,119,6,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  /* ---- Mode tag (top-left) ---- */
  const tagX = 50, tagY = 50, tagW = 130, tagH = 36
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  _roundRect(ctx, tagX, tagY, tagW, tagH, 18)
  ctx.fill()
  ctx.font = "700 14px 'Outfit', Arial"
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.textAlign = 'center'
  ctx.fillText(config.label, tagX + tagW / 2, tagY + 23)

  /* ---- Question ---- */
  ctx.textAlign = 'center'
  const question = wheelTitle && wheelTitle.trim()
  if (question) {
    ctx.font = "500 22px 'Outfit', Arial"
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.fillText('THE QUESTION', W / 2, 130)

    const qFontSize = question.length > 25 ? 28 : question.length > 15 ? 32 : 36
    ctx.font = `800 ${qFontSize}px 'Outfit', Arial`
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    const qY = 180
    ctx.fillText(`"${question}"`, W / 2, qY)
  }

  /* ---- Spacing before result ---- */
  const resultY = question ? 280 : 200

  /* ---- Badge ---- */
  const bW = 200, bH = 44, bX = (W - bW) / 2, bY = resultY + 10
  const grad = ctx.createLinearGradient(bX, 0, bX + bW, 0)
  grad.addColorStop(0, '#d97706')
  grad.addColorStop(1, '#f59e0b')
  ctx.fillStyle = grad
  _roundRect(ctx, bX, bY, bW, bH, 22)
  ctx.fill()
  ctx.font = "800 14px 'Outfit', Arial"
  ctx.fillStyle = '#fff'
  ctx.fillText(config.badge, W / 2, bY + 28)

  /* ---- Winner Name ---- */
  const nameFontSize = winnerName.length > 10 ? 64 : winnerName.length > 6 ? 78 : 92
  ctx.font = `900 ${nameFontSize}px 'Outfit', Arial`
  const nameGrad = ctx.createLinearGradient(100, bY + 130, W - 100, bY + 230)
  nameGrad.addColorStop(0, '#d97706')
  nameGrad.addColorStop(1, '#f59e0b')
  ctx.fillStyle = nameGrad
  ctx.fillText(winnerName, W / 2, bY + 190)

  /* ---- Subtitle ---- */
  ctx.font = "600 24px 'Outfit', Arial"
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText(config.subtitle, W / 2, bY + 250)

  /* ---- Dare box ---- */
  let bottomY = bY + 310
  if (dareText) {
    const dbX = 70, dbW = W - 140, dbH = 80, dbY = bottomY
    _roundRect(ctx, dbX, dbY, dbW, dbH, 14)
    ctx.fillStyle = 'rgba(13,148,136,0.08)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(13,148,136,0.2)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.font = "600 17px 'Outfit', Arial"
    ctx.fillStyle = '#0d9488'
    _wrapText(ctx, dareText, W / 2, dbY + 36, dbW - 50, 24)
    bottomY = dbY + dbH + 40
  }

  /* ---- Divider ---- */
  const divY = bottomY + 20
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(100, divY); ctx.lineTo(W - 100, divY); ctx.stroke()

  /* ---- Brand ---- */
  ctx.font = "700 18px 'Outfit', Arial"
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.fillText('🎡 Who Pays?', W / 2, divY + 50)

  ctx.font = "500 13px 'Outfit', Arial"
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.fillText('whopays.fun', W / 2, divY + 76)

  /* ---- Download ---- */
  const link = document.createElement('a')
  link.download = `who-pays-${winnerName.toLowerCase().replace(/\s+/g, '-')}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

function _roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function _wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y)
      line = words[n] + ' '
      y += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line.trim(), x, y)
}
