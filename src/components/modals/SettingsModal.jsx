import { useGame } from '../../context/GameContext.jsx'
import styles from './ResultModal.module.css' // Reusing ResultModal styling for consistency
import { Volume2, VolumeX, PartyPopper } from 'lucide-react'

export default function SettingsModal({ onClose }) {
  const { state, updateSettings } = useGame()
  const { soundEnabled, confettiEnabled } = state.settings || { soundEnabled: true, confettiEnabled: true }

  return (
    <>
      <div className={`${styles.overlay} ${styles.overlayVisible}`} onClick={onClose} aria-hidden="true" />
      <div className={`${styles.modal} ${styles.modalVisible}`} style={{ maxWidth: '340px' }} role="dialog" aria-label="Settings">
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        
        <h2 className={styles.name} style={{ fontSize: '32px', marginBottom: '24px' }}>Settings</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {soundEnabled ? <Volume2 size={24} color="var(--accent-teal)" /> : <VolumeX size={24} color="var(--text-muted)" />}
              <span style={{ fontSize: '16px', fontWeight: '600' }}>Sound Effects</span>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
              <input 
                type="checkbox" 
                checked={soundEnabled} 
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })} 
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                backgroundColor: soundEnabled ? 'var(--accent-teal)' : 'var(--border)', 
                borderRadius: '24px', transition: '0.3s'
              }}>
                <span style={{
                  position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px',
                  backgroundColor: 'white', borderRadius: '50%', transition: '0.3s',
                  transform: soundEnabled ? 'translateX(20px)' : 'translateX(0)'
                }}/>
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <PartyPopper size={24} color={confettiEnabled ? "var(--accent-amber)" : "var(--text-muted)"} />
              <span style={{ fontSize: '16px', fontWeight: '600' }}>Confetti</span>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
              <input 
                type="checkbox" 
                checked={confettiEnabled} 
                onChange={(e) => updateSettings({ confettiEnabled: e.target.checked })} 
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                backgroundColor: confettiEnabled ? 'var(--accent-amber)' : 'var(--border)', 
                borderRadius: '24px', transition: '0.3s'
              }}>
                <span style={{
                  position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px',
                  backgroundColor: 'white', borderRadius: '50%', transition: '0.3s',
                  transform: confettiEnabled ? 'translateX(20px)' : 'translateX(0)'
                }}/>
              </span>
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
