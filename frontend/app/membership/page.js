"use client"
import Link from "next/link"
import Header from "../../components/Header"
import BottomNav from "../../components/BottomNav"
import styles from "./membership.module.css"

export default function MembershipPage() {
  return (
    <>
      <main className={styles.container}>
        <Header />

        <section className={styles.content}>
          <h1 className={styles.title}>Activation Center</h1>
          <p className={styles.subtitle}>Complete activation in two clear steps: purchase your code, then activate your wallet.</p>

          <div className={styles.stepsGrid}>
            <article className={styles.stepCard}>
              <span className={styles.stepBadge}>Step 1</span>
              <h3>Purchase Activation Code</h3>
              <p>View official account details, pay manually, and submit proof via WhatsApp.</p>
              <ul>
                <li>Amount: N10,000</li>
                <li>Manual bank transfer supported</li>
                <li>Fast verification support</li>
              </ul>
              <Link href="/manual-payment" className={styles.stepBtn}>Go To Purchase Page</Link>
            </article>

            <article className={styles.stepCard}>
              <span className={styles.stepBadge}>Step 2</span>
              <h3>Activate With Code</h3>
              <p>After payment is confirmed and you receive your code, activate your wallet here.</p>
              <ul>
                <li>Secure one-time code activation</li>
                <li>Unlock withdrawal access</li>
                <li>Wallet status changes to Active</li>
              </ul>
              <Link href="/membership/activate-code" className={styles.stepBtn}>Go To Activate Code</Link>
            </article>
          </div>

          <section className={styles.noteCard}>
            <h4>Important</h4>
            <p>Only use official Terezo Wallet payment details. Do not share your password or activation code publicly.</p>
          </section>
        </section>
      </main>

      <BottomNav />
    </>
  )
}
