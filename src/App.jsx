import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import PlayPage from './pages/PlayPage.jsx'
import HowItWorksPage from './pages/HowItWorksPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.app}>
      {/* Ambient background orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
      </div>

      <div className={styles.layout}>
        <Header />
        <main className={styles.main}>
          <Routes>
            <Route path="/"               element={<PlayPage />} />
            <Route path="/how-it-works"   element={<HowItWorksPage />} />
            <Route path="*"               element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  )
}
