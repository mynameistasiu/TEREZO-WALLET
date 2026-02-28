"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Header from "../../components/Header"
import BottomNav from "../../components/BottomNav"
import styles from "./membership.module.css"
import { API_BASE } from "../../config"
import { parseJsonSafe } from "../../lib/apiError"

export default function MembershipPage() {
  const [isMember, setIsMember] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) return
    try {
      const parsed = JSON.parse(stored)
      setIsMember(Boolean(parsed.isMember || localStorage.getItem("tw_wallet_activated") === "1"))
      if (parsed.id) {
        fetch(`${API_BASE}/api/user/${parsed.id}/dashboard`)
          .then(parseJsonSafe)
          .then((data) => {
            if (!data || !data.id) return
            const active = Boolean(data.isMember)
            setIsMember(active)
            const merged = { ...parsed, isMember: active, balance: Number(data.balance ?? parsed.balance ?? 0) }
            localStorage.setItem("user", JSON.stringify(merged))
            if (active) localStorage.setItem("tw_wallet_activated", "1")
          })
          .catch(() => {})
      }
    } catch {}
  }, [])

  return (
    <>
      <main className={styles.container}>
        <Header />

        <section className={styles.content}>
          <h1 className={styles.title}>Activation Center</h1>
          <p className={styles.subtitle}>Complete activation in two clear steps: purchase your code, then activate your wallet.</p>

          {isMember && (
            <section className={styles.noteCard}>
              <h4>Membership Active</h4>
              <p>Your wallet is already activated. You can now continue to withdrawal and other premium features.</p>
              <Link href="/withdraw" className={styles.stepBtn} style={{ marginTop: 10 }}>Go To Withdraw</Link>
            </section>
          )}

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
