"use client"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "../../components/Header"
import BottomNav from "../../components/BottomNav"
import styles from "./profile.module.css"

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount)

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      router.replace("/auth/login")
      return
    }
    try {
      setUser(JSON.parse(stored))
    } catch {
      router.replace("/auth/login")
    }
  }, [router])

  const initials = useMemo(() => {
    if (!user?.firstName && !user?.fullName) return "TW"
    const source = user.firstName || user.fullName || "TW"
    return source
      .split(" ")
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("")
  }, [user])

  const referralLink = useMemo(() => {
    if (!user?.id || typeof window === "undefined") return ""
    return `${window.location.origin}/auth/register?ref=${user.id}`
  }, [user])

  const handleCopyLink = async () => {
    if (!referralLink) return
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("pendingUser")
    localStorage.removeItem("tw_task_state")
    sessionStorage.clear()
    router.replace("/auth/login")
    setTimeout(() => {
      if (typeof window !== "undefined") window.location.href = "/auth/login"
    }, 60)
  }

  if (!user) {
    return (
      <main className={styles.loadingWrap}>
        <p>Loading profile...</p>
      </main>
    )
  }

  return (
    <>
      <main className={styles.page}>
        <Header />

        <section className={styles.heroCard}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.heroText}>
            <h1>{user.fullName || user.firstName || "Terezo User"}</h1>
            <p>{user.email || "No email added"}</p>
            <span className={`${styles.statusChip} ${user.isMember ? styles.active : styles.inactive}`}>
              Wallet {user.isMember ? "Active" : "Inactive"}
            </span>
          </div>
          <div className={styles.heroBalance}>
            <small>Available Balance</small>
            <strong>{formatCurrency(Number(user.balance || 0))}</strong>
          </div>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h3>Account Details</h3>
            <div className={styles.infoList}>
              <div><span>First Name</span><strong>{user.firstName || "Not set"}</strong></div>
              <div><span>Email</span><strong>{user.email || "Not set"}</strong></div>
              <div><span>Phone</span><strong>{user.phone || "Not set"}</strong></div>
              <div><span>KYC</span><strong>{user.kycStatus || "Unverified"}</strong></div>
            </div>
          </article>

          <article className={styles.card}>
            <h3>Quick Actions</h3>
            <div className={styles.actions}>
              <button type="button" className={styles.primaryBtn} onClick={() => router.push("/membership")}>Activate Account</button>
              <button type="button" className={styles.secondaryBtn} onClick={() => router.push("/withdraw")}>Withdraw Funds</button>
              <button type="button" className={styles.secondaryBtn} onClick={() => router.push("/tasks")}>Open Tasks</button>
            </div>
          </article>

          <article className={styles.card}>
            <h3>Referral & Trust</h3>
            <p className={styles.smallText}>Invite people with your secure referral link and grow your network.</p>
            <div className={styles.referralBox}>
              <input readOnly value={referralLink || "Referral link unavailable"} />
              <button type="button" onClick={handleCopyLink}>{copied ? "Copied" : "Copy"}</button>
            </div>
            <ul className={styles.trustList}>
              <li>Use only official activation channels.</li>
              <li>Never share your password with anyone.</li>
              <li>Contact support for suspicious activity.</li>
            </ul>
          </article>
        </section>

        <section className={styles.footerCard}>
          <div>
            <h4>Security & Session</h4>
            <p>Use logout to end your current session on this device.</p>
          </div>
          <button type="button" className={styles.dangerBtn} onClick={handleLogout}>Logout</button>
        </section>
      </main>
      <BottomNav />
    </>
  )
}
