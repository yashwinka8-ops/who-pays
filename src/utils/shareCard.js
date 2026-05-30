import { MODE_CONFIG } from './dares.js'

export function generateShareCard(winnerName, mode, wheelTitle, dareText = null) {
  return new Promise((resolve, reject) => {
    const canvas = document.getElementById('share-canvas')
    if (!canvas) {
      reject(new Error('Canvas not found'))
      return
    }

  const ctx = canvas.getContext('2d')
  // 9:16 Aspect Ratio for Instagram Stories / WhatsApp Status
  const W = 1080, H = 1920
  canvas.width = W
  canvas.height = H

  const config = MODE_CONFIG[mode]

  /* ---- 1. Background ---- */
  ctx.fillStyle = '#0a0a0c'
  ctx.fillRect(0, 0, W, H)

  // Amber ambient glow top-center
  const glowTop = ctx.createRadialGradient(W / 2, H * 0.3, 0, W / 2, H * 0.3, 900)
  glowTop.addColorStop(0, 'rgba(245, 158, 11, 0.18)') 
  glowTop.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glowTop
  ctx.fillRect(0, 0, W, H)

  // Teal ambient glow bottom
  const glowBottom = ctx.createRadialGradient(W / 2, H * 0.9, 0, W / 2, H * 0.9, 800)
  glowBottom.addColorStop(0, 'rgba(13, 148, 136, 0.15)')
  glowBottom.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glowBottom
  ctx.fillRect(0, 0, W, H)

  // Top left label
  const tagW = 160, tagH = 46, tagX = 60, tagY = 60
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  _roundRect(ctx, tagX, tagY, tagW, tagH, 23)
  ctx.fill()
  ctx.font = "700 18px 'Outfit', sans-serif"
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.textAlign = 'center'
  ctx.fillText(config.label.toUpperCase(), tagX + tagW / 2, tagY + 29)


  /* ---- 2. Dynamic Layout Calculation ---- */
  let currentY = H * 0.18

  const question = wheelTitle && wheelTitle.trim()
  if (question) {
    ctx.font = "600 36px 'Outfit', sans-serif"
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.fillText('THE QUESTION', W / 2, currentY)
    
    currentY += 70
    ctx.font = "800 72px 'Outfit', sans-serif"
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    _wrapText(ctx, `"${question}"`, W / 2, currentY, W - 160, 90)
    
    // Add extra space based on question length
    const lines = Math.ceil(ctx.measureText(`"${question}"`).width / (W - 160))
    currentY += (lines * 90) + 120
  } else {
    currentY = H * 0.28
  }

  /* ---- 3. Badge ---- */
  const bW = 320, bH = 70, bX = (W - bW) / 2
  const grad = ctx.createLinearGradient(bX, 0, bX + bW, 0)
  grad.addColorStop(0, '#f59e0b')
  grad.addColorStop(1, '#ea580c')
  ctx.fillStyle = grad
  _roundRect(ctx, bX, currentY, bW, bH, 35)
  ctx.fill()
  
  ctx.font = "800 26px 'Outfit', sans-serif"
  ctx.fillStyle = '#fff'
  ctx.letterSpacing = '2px' // Simulated via padding natively or font
  ctx.fillText(config.badge.toUpperCase(), W / 2, currentY + 46)

  currentY += 180

  /* ---- 4. Winner Name ---- */
  const nameFontSize = winnerName.length > 12 ? 140 : winnerName.length > 7 ? 170 : 220
  ctx.font = `900 ${nameFontSize}px 'Outfit', sans-serif`
  
  const nameGrad = ctx.createLinearGradient(0, currentY - 120, 0, currentY + 40)
  nameGrad.addColorStop(0, '#fef3c7')
  nameGrad.addColorStop(0.5, '#f59e0b')
  nameGrad.addColorStop(1, '#b45309')
  ctx.fillStyle = nameGrad
  
  // Neon Drop Shadow
  ctx.shadowColor = 'rgba(245, 158, 11, 0.4)'
  ctx.shadowBlur = 60
  ctx.shadowOffsetY = 15
  ctx.fillText(winnerName, W / 2, currentY)
  
  // Reset Shadow
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  currentY += 100

  /* ---- 5. Subtitle ---- */
  ctx.font = "600 48px 'Outfit', sans-serif"
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText(config.subtitle, W / 2, currentY)

  currentY += 160

  /* ---- 6. Dare Box ---- */
  if (dareText) {
    const dbW = W - 200, dbX = 100
    // Estimate height needed
    ctx.font = "700 36px 'Outfit', sans-serif"
    const lines = Math.ceil(ctx.measureText(dareText).width / (dbW - 80))
    const dbH = Math.max(180, lines * 50 + 90)

    ctx.fillStyle = 'rgba(13,148,136,0.08)'
    _roundRect(ctx, dbX, currentY, dbW, dbH, 40)
    ctx.fill()
    ctx.strokeStyle = 'rgba(13,148,136,0.25)'
    ctx.lineWidth = 4
    ctx.stroke()

    ctx.fillStyle = '#2dd4bf'
    _wrapText(ctx, dareText, W / 2, currentY + 80, dbW - 80, 50)
  }

  /* ---- 7. Footer Branding ---- */
  const footY = H - 160
  
  // Subtle glowing line
  const lineGrad = ctx.createLinearGradient(200, 0, W - 200, 0)
  lineGrad.addColorStop(0, 'rgba(255,255,255,0)')
  lineGrad.addColorStop(0.5, 'rgba(255,255,255,0.15)')
  lineGrad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = lineGrad
  ctx.fillRect(200, footY - 80, W - 400, 2)

  ctx.font = "800 42px 'Outfit', sans-serif"
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.fillText('🎡 Who Pays?', W / 2, footY)
  
  ctx.font = "600 26px 'Outfit', sans-serif"
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.fillText('whopays.fun', W / 2, footY + 45)

  /* ---- Return Blob ---- */
  canvas.toBlob((blob) => {
    if (blob) resolve(blob)
    else reject(new Error('Failed to generate image'))
  }, 'image/png')
  })
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
