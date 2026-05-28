import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.emoji} aria-hidden="true">🎡</div>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Wheel Not Found</h2>
        <p className={styles.desc}>
          This page doesn't exist — but your bill still does. Spin the wheel to decide who pays for this mistake.
        </p>
        <Link to="/" className={styles.btn} id="404-home-btn">
          🎡 Back to the Wheel
        </Link>
      </div>
    </div>
  )
}
