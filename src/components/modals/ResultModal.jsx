import React, { useEffect, useState } from 'react'
import { useGame } from '../../context/GameContext.jsx'
import { useSound } from '../../hooks/useSound.js'
import { useConfetti } from '../../hooks/useConfetti.js'
import { MODE_CONFIG, getRandomDare, getRandomPunishment, getRandomTruth, getRandomPrize, getRandomChallenge } from '../../utils/dares.js'
import { generateShareCard } from '../../utils/shareCard.js'
import { Trophy, Wallet, Zap, UserMinus, Share2, Copy, Download, RotateCcw, MessageCircleHeart, Gift, Swords, Play } from 'lucide-react'
import styles from './ResultModal.module.css'

export default function ResultModal({ winner, challengeOpponent, onClose, onSpinAgain, onStartChallengeSpin }) {
  const { state } = useGame()
  const { playFanfare, playLoser, playElim } = useSound()
  const { launch } = useConfetti()
  const [copied, setCopied] = useState(false)

  const config = winner ? MODE_CONFIG[state.mode] : null
  const isVisible = !!winner

  const displayText = React.useMemo(() => {
    if (!winner) return null;
    if (state.mode === 'dare') return getRandomDare();
    if (state.mode === 'elimination') return `Consolation: ${getRandomPunishment()}`;
    if (state.mode === 'truth') return getRandomTruth();
    if (state.mode === 'prize') return getRandomPrize();
    if (state.mode === 'challenge' && challengeOpponent) return getRandomChallenge();
    return null;
  }, [winner, state.mode, challengeOpponent]);

  // Play sound + confetti on reveal
  useEffect(() => {
    if (!winner) return
    const doConfetti = (isWinner) => {
      if (state.settings?.confettiEnabled) launch('confetti-root', isWinner)
    }

    if (state.mode === 'pay')         { playFanfare(); doConfetti(false) }
    else if (state.mode === 'prize')  { playFanfare(); doConfetti(true) }
    else if (state.mode === 'dare' || state.mode === 'truth') { playLoser(); doConfetti(false) }
    else if (state.mode === 'elimination') {
      playElim()
      const isGameOver = state.activeNames.length === 0
      if (isGameOver) doConfetti(true)
    }
    else if (state.mode === 'challenge' && !challengeOpponent) {
      playFanfare(); doConfetti(true) // Final winner gets fanfare
    }
    else if (state.mode === 'challenge' && challengeOpponent) {
      playFanfare(); doConfetti(false) // Just picked two opponents
    }
  }, [winner, state.settings?.confettiEnabled])

  // Close on Escape
  useEffect(() => {
    if (!isVisible) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isVisible, onClose])

  async function handleDownloadCard() {
    const title = state.wheelTitle
      || { pay: 'Who pays?', dare: 'Who gets dared?', elimination: 'Who gets eliminated?', truth: 'Who tells the truth?', prize: 'Who gets the prize?', challenge: 'Challenge!' }[state.mode]
    
    try {
      const blob = await generateShareCard(winner, state.mode, title, displayText)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `whopays-${winner.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to generate card:', err)
    }
  }

  const isLastManStanding = state.mode === 'elimination' && state.activeNames.length === 0
  const isChallengeFinal  = state.mode === 'challenge' && !challengeOpponent
  const displayBadge      = isLastManStanding ? 'SURVIVOR!' : (isChallengeFinal ? 'CHAMPION!' : config?.badge)
  const displaySubtitle   = isLastManStanding ? 'is the last one standing!' : (isChallengeFinal ? 'won the challenge!' : config?.subtitle)

  const titleText = (state.mode === 'challenge' && challengeOpponent) 
    ? `${winner} vs ${challengeOpponent}` 
    : winner

  const shareText = `${titleText} ${displaySubtitle} ${displayText ? `\n\nResult: ${displayText}` : ''}\n\n🎡 Played on Who Pays?`;

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        const title = state.wheelTitle
          || { pay: 'Who pays?', dare: 'Who gets dared?', elimination: 'Who gets eliminated?', truth: 'Who tells the truth?', prize: 'Who gets the prize?', challenge: 'Challenge!' }[state.mode]
        
        const blob = await generateShareCard(winner, state.mode, title, displayText)
        const file = new File([blob], `whopays-${winner.toLowerCase().replace(/\s+/g, '-')}.png`, { type: 'image/png' })
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Who Pays?',
            text: shareText,
            files: [file]
          })
        } else {
          // Fallback to text if browser doesn't support sharing files natively
          await navigator.share({
            title: 'Who Pays?',
            text: shareText,
          })
        }
      } catch (err) { /* ignore cancel */ }
    } else {
      handleCopyText()
    }
  }

  function handleCopyText() {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const MODE_ICONS = {
    pay: <Wallet size={52} strokeWidth={1.5} color="var(--accent-amber)" />,
    dare: <Zap size={52} strokeWidth={1.5} color="var(--accent-teal)" />,
    elimination: <UserMinus size={52} strokeWidth={1.5} color="var(--accent-red)" />,
    truth: <MessageCircleHeart size={52} strokeWidth={1.5} color="var(--accent-pink)" />,
    prize: <Gift size={52} strokeWidth={1.5} color="var(--accent-gold)" />,
    challenge: <Swords size={52} strokeWidth={1.5} color="var(--accent-rust)" />
  }

  const displayIcon = isLastManStanding ? <Trophy size={52} strokeWidth={1.5} color="var(--accent-gold)" /> : MODE_ICONS[state.mode]

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.overlay} ${isVisible ? styles.overlayVisible : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`${styles.modal} ${isVisible ? styles.modalVisible : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-modal-title"
      >
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close result"
          id="modal-close-btn"
        >
          ✕
        </button>

        <div className={styles.iconWrapper} aria-hidden="true">{displayIcon}</div>

        <span className={styles.badge}>{displayBadge}</span>

        <h2 className={styles.name} id="result-modal-title">{titleText}</h2>

        <p className={styles.subtitle}>{displaySubtitle}</p>

        {displayText && (
          <div className={styles.dareBox}>
            <p className={styles.dareText}>{displayText}</p>
          </div>
        )}

        <div className={styles.actions}>
          {state.mode === 'challenge' && challengeOpponent ? (
            <button
              className={styles.btnPrimary}
              onClick={onStartChallengeSpin}
              style={{ background: 'var(--accent-rust)' }}
            >
              <Play size={18} /> Spin for Winner!
            </button>
          ) : (
            <>
              <button
                id="modal-spin-again-btn"
                className={styles.btnPrimary}
                onClick={onSpinAgain}
              >
                <RotateCcw size={18} /> Spin Again
              </button>
              
              <div className={styles.shareGroup}>
                <button
                  className={styles.btnSecondary}
                  onClick={handleDownloadCard}
                  title="Save Image"
                >
                  <Download size={18} /> Save
                </button>
                {!!navigator.share && (
                  <button
                    className={styles.btnSecondary}
                    onClick={handleNativeShare}
                    title="Share"
                  >
                    <Share2 size={18} /> Share
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
