"use client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import WelcomePopup from "../../components/WelcomePopup"
import Header from "../../components/Header"
import BottomNav from "../../components/BottomNav"
import styles from "./dashboard.module.css"
import { API_BASE } from "../../config"
import { getApiErrorMessage, getNetworkErrorMessage, parseJsonSafe } from "../../lib/apiError"

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount)

const readTaskState = () => {
  try {
    const raw = localStorage.getItem("tw_task_state")
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState({
    id: null,
    firstName: "User",
    balance: 0,
    pendingBalance: 0,
    isMember: false,
    welcomeBonusClaimed: false,
    tasksCompleted: 0,
  })
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [claimError, setClaimError] = useState("")
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      router.push("/auth/login")
      return
    }

    const parsed = JSON.parse(stored)
    setUser((prev) => ({ ...prev, ...parsed }))
    if (!parsed.welcomeBonusClaimed) setShowWelcomePopup(true)

    if (parsed.id) {
      fetch(`${API_BASE}/api/user/${parsed.id}/dashboard`)
        .then((r) => r.json())
        .then((data) => {
          if (!data) return
          const nextUser = {
            ...parsed,
            balance: Math.max(Number(parsed.balance || 0), Number(data.balance ?? 0)),
            pendingBalance: data.pendingBalance ?? parsed.pendingBalance,
          }
          setUser((prev) => ({ ...prev, ...nextUser }))
          localStorage.setItem("user", JSON.stringify(nextUser))
          setTransactions(data.recentTransactions || [])
        })
        .catch(() => setTransactions([]))
    }
  }, [router])

  const handleClaimBonus = async () => {
    setClaimError("")
    if (!user.id) {
      setClaimError("User not found. Please log in again.")
      return
    }

    setClaiming(true)
    try {
      const response = await fetch(`${API_BASE}/api/user/claim-welcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      })
      const data = await parseJsonSafe(response)

      if (!response.ok) {
        setClaimError(getApiErrorMessage(data, "Failed to claim bonus"))
        return
      }

      const updated = {
        ...user,
        balance: data.newBalance ?? user.balance + 64000,
        welcomeBonusClaimed: true,
      }
      setUser(updated)
      localStorage.setItem("user", JSON.stringify(updated))
      setShowWelcomePopup(false)
    } catch (error) {
      setClaimError(getNetworkErrorMessage(error, API_BASE))
    } finally {
      setClaiming(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("pendingUser")
    localStorage.removeItem("tw_task_state")
    sessionStorage.clear()
    router.replace("/auth/login")
    router.refresh()
    setTimeout(() => {
      if (typeof window !== "undefined") window.location.href = "/auth/login"
    }, 60)
  }

  const taskState = useMemo(() => (typeof window === "undefined" ? {} : readTaskState()), [user.balance, user.tasksCompleted, user.isMember])
  const firstThreeDone = Boolean(taskState.whatsapp_join && taskState.share_groups && taskState.telegram_follow)
  const finalDone = Boolean(taskState.final_claim)
  const taskEarned = (taskState.whatsapp_join ? 15000 : 0) + (taskState.share_groups ? 15000 : 0) + (taskState.telegram_follow ? 15000 : 0) + (taskState.final_claim ? 30000 : 0)
  const rewardTotal = (user.welcomeBonusClaimed ? 64000 : 0) + taskEarned
  const availableBalance = Math.max(Number(user.balance || 0), rewardTotal)

  const steps = [
    { label: "Account Created", done: true },
    { label: "Social Tasks", done: firstThreeDone },
    { label: "Wallet Activated", done: Boolean(user.isMember) },
    { label: "Final Claim", done: finalDone },
  ]

  const completedSteps = steps.filter((step) => step.done).length
  const progress = completedSteps * 25
  const circumference = 2 * Math.PI * 72
  const dash = (progress / 100) * circumference

  useEffect(() => {
    if (availableBalance > Number(user.balance || 0)) {
      const nextUser = { ...user, balance: availableBalance }
      setUser(nextUser)
      localStorage.setItem("user", JSON.stringify(nextUser))
    }
  }, [availableBalance, user])

  const monthlyTarget = 150000
  const targetPercent = Math.min(100, Math.round((availableBalance / monthlyTarget) * 100))

  return (
    <>
      <main className={styles.container}>
        <Header />

        <WelcomePopup
          userName={user.firstName}
          isOpen={showWelcomePopup}
          onClaim={handleClaimBonus}
          onLater={() => setShowWelcomePopup(false)}
          isClaiming={claiming}
          error={claimError}
        />

        <section className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Wallet Control Center</h1>
            <p className={styles.pageSub}>Track growth, complete milestones, and manage your wallet securely.</p>
          </div>
          <div className={styles.utilityActions}>
            <Link href="/profile" className={styles.utilityBtn}>Profile</Link>
            <Link href="/notifications" className={styles.utilityBtn}>Alerts</Link>
            <button type="button" className={styles.utilityBtn} onClick={handleLogout}>Logout</button>
          </div>
        </section>

        <section className={styles.heroCard}>
          <div className={styles.heroLeft}>
            <span className={`${styles.statusChip} ${user.isMember ? styles.active : styles.inactive}`}>
              Wallet {user.isMember ? "Active" : "Inactive"}
            </span>
            <p className={styles.balanceLabel}>Available Balance</p>
            <h2 className={styles.balanceValue}>{formatCurrency(availableBalance)}</h2>

            <div className={styles.metricRow}>
              <div className={styles.metricCard}>
                <span>Pending</span>
                <strong>{formatCurrency(user.pendingBalance)}</strong>
              </div>
              <div className={styles.metricCard}>
                <span>Task Earnings</span>
                <strong>{formatCurrency(taskEarned)}</strong>
              </div>
              <div className={styles.metricCard}>
                <span>Milestones</span>
                <strong>{completedSteps}/4</strong>
              </div>
            </div>

            <div className={styles.actionRow}>
              <Link href="/membership" className={styles.actionPrimary}>Activate Account</Link>
              <Link href="/withdraw" className={styles.actionSecondary}>Withdraw</Link>
              <Link href="/tasks" className={styles.actionSecondary}>Open Tasks</Link>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.progressCard}>
              <svg viewBox="0 0 160 160" className={styles.progressRing}>
                <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
                <circle cx="80" cy="80" r="72" fill="none" stroke="url(#goldGrad)" strokeWidth="8" strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" transform="rotate(-90 80 80)" />
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C69F3A" />
                    <stop offset="100%" stopColor="#FFD66B" />
                  </linearGradient>
                </defs>
                <text x="80" y="85" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="700">{progress}%</text>
              </svg>
              <div className={styles.stepList}>
                {steps.map((step) => (
                  <div key={step.label} className={styles.stepItem}>
                    <span className={step.done ? styles.dotDone : styles.dotTodo} />
                    <small>{step.label}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h3>Performance</h3>
            <div className={styles.statGrid}>
              <div><span>Monthly Target</span><strong>{formatCurrency(monthlyTarget)}</strong></div>
              <div><span>Progress</span><strong>{targetPercent}%</strong></div>
              <div><span>Task Earned</span><strong>{formatCurrency(taskEarned)}</strong></div>
              <div><span>Balance</span><strong>{formatCurrency(user.balance)}</strong></div>
              <div><span>Claimed Rewards</span><strong>{formatCurrency(rewardTotal)}</strong></div>
            </div>
            <div className={styles.targetTrack}><div className={styles.targetFill} style={{ width: `${targetPercent}%` }} /></div>
          </article>

          <article className={styles.card}>
            <h3>Next Recommended Step</h3>
            {!user.isMember && <p>Activate account to unlock full withdrawal features and complete wallet setup.</p>}
            {user.isMember && !finalDone && <p>Finish all task milestones to maximize your available earnings.</p>}
            {user.isMember && finalDone && <p>Great progress. Your wallet is fully configured for earning and withdrawals.</p>}
            <Link href={!user.isMember ? "/membership" : "/tasks"} className={styles.linkBtn}>Continue</Link>
          </article>

          <article className={styles.card}>
            <h3>Security Status</h3>
            <ul className={styles.securityList}>
              <li>Session active on this device</li>
              <li>Wallet state: {user.isMember ? "Verified Active" : "Inactive Pending Activation"}</li>
              <li>Use official channels for activation/payment proofs</li>
            </ul>
            <Link href="/profile" className={styles.linkBtn}>Manage Profile & Security</Link>
          </article>
        </section>

        <section className={styles.activitySection}>
          <h3>Recent Transactions</h3>
          {transactions.length === 0 && <div className={styles.empty}>No recent transactions yet.</div>}
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className={styles.txRow}>
              <div>
                <strong>{tx.type || "Transaction"}</strong>
                <small>{new Date(tx.date || Date.now()).toLocaleString()}</small>
              </div>
              <strong>{formatCurrency(tx.amount || 0)}</strong>
            </div>
          ))}
        </section>
      </main>

      <BottomNav />
    </>
  )
}
