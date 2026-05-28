import { Link, NavLink } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo} aria-label="Who Pays? Home">
          <span className={styles.logoIcon} aria-hidden="true">🎡</span>
          <span className={styles.logoText}>
            Who <span className="gradient-text">Pays?</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            Play
          </NavLink>
          <NavLink
            to="/how-it-works"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            How it Works
          </NavLink>
        </nav>

        {/* CTA */}
        <Link to="/" className={styles.ctaBtn} id="header-play-btn">
          🎡 Spin Now
        </Link>
      </div>
    </header>
  )
}
