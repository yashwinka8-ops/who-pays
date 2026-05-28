import { Link } from 'react-router-dom'
import styles from './HowItWorksPage.module.css'

const STEPS = [
  {
    icon: '👥',
    title: 'Add Your Friends',
    desc: 'Type in everyone\'s name or use quick-add suggestions. Add as many as you want — the wheel adjusts automatically.',
    color: 'var(--accent-amber)',
  },
  {
    icon: '🎮',
    title: 'Pick a Game Mode',
    desc: 'Choose Pay Mode to settle bills, Dare Mode for party games, or Elimination Mode to crown a winner.',
    color: 'var(--accent-teal)',
  },
  {
    icon: '🎡',
    title: 'Spin the Wheel',
    desc: 'Hit SPIN and watch the drama unfold. Physics-based momentum makes every spin feel real.',
    color: 'var(--accent-rust)',
  },
  {
    icon: '😱',
    title: 'Face the Consequence',
    desc: 'The loser pays, takes the dare, or gets eliminated. No arguing — the wheel has spoken!',
    color: 'var(--accent-rust)',
  },
]

const MODES = [
  {
    icon: '💸',
    title: 'Pay Mode',
    subtitle: 'Classic Bill Splitter',
    desc: 'The most viral use case. Spin before ordering and whoever loses pays for everyone. Used by millions of friend groups to avoid awkward bill conversations.',
    usecases: ['Restaurant bills', 'Petrol money', 'Snack runs', 'Online orders'],
    gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
  },
  {
    icon: '😈',
    title: 'Dare Mode',
    subtitle: 'Party Game Changer',
    desc: 'The loser gets a random dare from our built-in list of 20+ dares. Perfect for house parties, hostel nights, and group hangouts.',
    usecases: ['House parties', 'Hostel nights', 'College groups', 'Road trips'],
    gradient: 'linear-gradient(135deg, #c2410c, #e11d48)',
  },
  {
    icon: '💀',
    title: 'Elimination Mode',
    subtitle: 'Last One Standing',
    desc: 'Each spin removes a player until only one survives. Perfect for high-stakes games where someone needs to be the ultimate winner.',
    usecases: ['Drinking games', 'Truth or Dare', 'Group challenges', 'Competitions'],
    gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
  },
]

const VIRAL_TIPS = [
  { icon: '📸', tip: 'Screenshot the winner modal and post it to your WhatsApp story' },
  { icon: '📲', tip: 'Share the result card (PNG download) directly in your group chat' },
  { icon: '🎬', tip: 'Screen-record the spin for TikTok or Instagram Reels' },
  { icon: '🔗', tip: 'Send the link to your hostel/class group — they\'ll use it instantly' },
]

export default function HowItWorksPage() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>✨ No more awkward bill fights</span>
          <h1 className={styles.heroTitle}>
            How <span className="gradient-text">Who Pays?</span> Works
          </h1>
          <p className={styles.heroDesc}>
            The viral wheel that's settling bills, triggering dares, and creating drama
            in friend groups across WhatsApp, Instagram, and everywhere else.
          </p>
          <Link to="/" className={styles.heroBtn} id="try-it-btn">
            🎡 Try It Now — It's Free
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className={styles.section} aria-labelledby="steps-heading">
        <h2 className={styles.sectionTitle} id="steps-heading">
          4 Steps to Settle Anything
        </h2>
        <div className={styles.stepsGrid}>
          {STEPS.map((step, i) => (
            <div key={i} className={styles.stepCard}>
              <div className={styles.stepNumber} style={{ borderColor: step.color }}>
                {i + 1}
              </div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modes */}
      <section className={styles.section} aria-labelledby="modes-heading">
        <h2 className={styles.sectionTitle} id="modes-heading">
          3 Modes, Infinite Drama
        </h2>
        <div className={styles.modesGrid}>
          {MODES.map((mode, i) => (
            <div key={i} className={styles.modeCard}>
              <div
                className={styles.modeGradientBar}
                style={{ background: mode.gradient }}
                aria-hidden="true"
              />
              <div className={styles.modeIcon}>{mode.icon}</div>
              <div className={styles.modeSubtitle}>{mode.subtitle}</div>
              <h3 className={styles.modeTitle}>{mode.title}</h3>
              <p className={styles.modeDesc}>{mode.desc}</p>
              <ul className={styles.usecaseList}>
                {mode.usecases.map(u => (
                  <li key={u} className={styles.usecase}>
                    <span className={styles.usecaseDot} style={{ background: mode.gradient }} />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Viral tips */}
      <section className={styles.section} aria-labelledby="viral-heading">
        <h2 className={styles.sectionTitle} id="viral-heading">
          📲 How People Share It
        </h2>
        <p className={styles.sectionSubtitle}>
          The result modal is designed to be screenshot-worthy. Here's how friend groups use it:
        </p>
        <div className={styles.tipsGrid}>
          {VIRAL_TIPS.map((t, i) => (
            <div key={i} className={styles.tipCard}>
              <span className={styles.tipIcon}>{t.icon}</span>
              <p className={styles.tipText}>{t.tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section} aria-labelledby="faq-heading">
        <h2 className={styles.sectionTitle} id="faq-heading">FAQs</h2>
        <div className={styles.faqGrid}>
          {[
            { q: 'Is it really random?', a: 'Yes — we use a cryptographically-seeded random spin velocity. Nobody can predict the outcome.' },
            { q: 'Does it save my friend list?', a: 'Yes! Your names are saved in browser storage so they\'re there next time you open the app.' },
            { q: 'Can I use it offline?', a: 'Yes! Once loaded, it works completely offline. No internet needed to spin.' },
            { q: 'How do I share the result?', a: 'Hit "Share Result" in the winner modal — it downloads a PNG card you can post anywhere.' },
            { q: 'Is there a mobile app?', a: 'Not yet — but the website works perfectly on phones. Just open it in your mobile browser!' },
            { q: 'How many players can I add?', a: 'As many as you want! The wheel automatically adjusts segment sizes.' },
          ].map(({ q, a }, i) => (
            <div key={i} className={styles.faqCard}>
              <h3 className={styles.faqQ}>{q}</h3>
              <p className={styles.faqA}>{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to settle it? 🎡</h2>
        <p className={styles.ctaDesc}>
          Add your friends, pick a mode, and let the wheel decide. No drama — just results.
        </p>
        <Link to="/" className={styles.ctaBtn} id="bottom-cta-btn">
          Start Spinning — Free Forever
        </Link>
      </section>

    </div>
  )
}
