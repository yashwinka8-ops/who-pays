import { X } from 'lucide-react'
import StatsPanel from '../panels/StatsPanel.jsx'
import styles from './ResultModal.module.css'

export default function StatsModal({ onClose }) {
  return (
    <>
      <div className={`${styles.overlay} ${styles.overlayVisible}`} onClick={onClose} aria-hidden="true" />
      <div className={`${styles.modal} ${styles.modalVisible}`} role="dialog" aria-modal="true" aria-labelledby="stats-title" style={{ padding: '16px', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left' }}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <h2 id="stats-title" className={styles.name} style={{ fontSize: '32px', marginBottom: '16px', textAlign: 'center' }}>History & Stats</h2>
        <div style={{ marginTop: '20px' }}>
          <StatsPanel />
        </div>
      </div>
    </>
  )
}
