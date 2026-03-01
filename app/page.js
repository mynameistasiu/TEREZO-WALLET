"use client"
import Link from "next/link"
import Logo from "../components/Logo"
import styles from "./landing.module.css"

export default function Home() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brandWrap}>
          <Logo variant="monogram" size={44} />
          <div>
            <div className={styles.headerText}>Terezo Wallet</div>
            <div className={styles.headerSubtext}>Earn. Activate. Withdraw.</div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Link href="/auth/login" className={styles.navLink}>
            Login
          </Link>
          <Link href="/auth/register" className={styles.navButton}>
            Get Started
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.badge}>Trusted Reward Wallet Platform</div>
        <h1 className={styles.heroTitle}>A secure wallet built for simple daily earnings</h1>
        <p className={styles.heroDescription}>
          Terezo Wallet helps you complete simple verified tasks, track your progress, and grow your wallet in a structured way.
          New users receive a welcome bonus and unlock withdrawals after account activation.
        </p>

        <div className={styles.ctaSection}>
          <Link href="/auth/register" className={styles.btnPrimary}>Create Free Account</Link>
          <Link href="/auth/login" className={styles.btnSecondary}>Login to Dashboard</Link>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <h3>N64,000</h3>
            <p>Welcome bonus</p>
          </div>
          <div className={styles.statCard}>
            <h3>4 Steps</h3>
            <p>Progress to full access</p>
          </div>
          <div className={styles.statCard}>
            <h3>24/7</h3>
            <p>Wallet tracking</p>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>01</span>
            <h4>Create Account</h4>
            <p>Register in minutes with your basic details.</p>
          </div>
          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>02</span>
            <h4>Complete Tasks</h4>
            <p>Do verified social tasks and earn wallet rewards.</p>
          </div>
          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>03</span>
            <h4>Activate Wallet</h4>
            <p>Use your activation code to unlock withdrawals.</p>
          </div>
          <div className={styles.stepCard}>
            <span className={styles.stepNumber}>04</span>
            <h4>Withdraw Earnings</h4>
            <p>Submit bank details and request withdrawals securely.</p>
          </div>
        </div>
      </section>

      <section className={styles.trust}>
        <h2 className={styles.sectionTitle}>Why Users Trust Terezo Wallet</h2>
        <div className={styles.trustGrid}>
          <div className={styles.trustCard}>
            <h4>Structured Growth</h4>
            <p>Four-step journey with clear progress and goals.</p>
          </div>
          <div className={styles.trustCard}>
            <h4>Verified Activity</h4>
            <p>Task flow and wallet updates are tracked per user account.</p>
          </div>
          <div className={styles.trustCard}>
            <h4>Activation Security</h4>
            <p>Wallet remains inactive until valid activation is completed.</p>
          </div>
          <div className={styles.trustCard}>
            <h4>Transparent Payments</h4>
            <p>Clear account details and payment confirmation workflow.</p>
          </div>
        </div>

        <div className={styles.legalLinks}>
          <Link href="/terms">Terms & Conditions</Link>
          <span className={styles.divider}>|</span>
          <Link href="/privacy">Privacy Policy</Link>
          <span className={styles.divider}>|</span>
          <Link href="/contact">Contact Us</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>TW by Terezo Wallet | Trusted rewards. Real progress. Smart withdrawals.</p>
      </footer>
    </main>
  )
}
