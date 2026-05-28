import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.icon} aria-hidden="true">🎡</span>
          <span className={styles.name}>Who Pays?</span>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <Link to="/" className={styles.link}>Play</Link>
          <Link to="/how-it-works" className={styles.link}>How it Works</Link>
          <a href="mailto:sponsor@whopays.app" className={styles.link}>Advertise</a>
        </nav>

        <p className={styles.copy}>
          © 2025 Who Pays? &mdash; Settle bills with drama 😈
        </p>
      </div>
    </footer>
  )
}
