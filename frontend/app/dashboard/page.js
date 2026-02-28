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
    const activatedFlag = localStorage.getItem("tw_wallet_activated") === "1"
    if (activatedFlag && !parsed.isMember) parsed.isMember = true
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
            isMember: Boolean(data.isMember || parsed.isMember || activatedFlag),
          }
          setUser((prev) => ({ ...prev, ...nextUser }))
          localStorage.setItem("user", JSON.stringify(nextUser))
          if (nextUser.isMember) localStorage.setItem("tw_wallet_activated", "1")
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
          <button type="button" className={styles.menuBtn}>☰</button>
          <h1 className={styles.brand}>Terezo <span>Wallet</span></h1>
          <div className={styles.utilityActions}>
            <Link href="/notifications" className={styles.utilityBtn}>🔔</Link>
            <Link href="/profile" className={styles.utilityBtn}>👤</Link>
            <button type="button" className={styles.utilityBtn} onClick={handleLogout}>⎋</button>
          </div>
        </section>

        <section className={styles.heroCard}>
          <div className={styles.heroLeft}>
            <p className={styles.greet}>Hello, {user.firstName || "User"} 👋</p>
            <p className={styles.balanceLabel}>Total Balance</p>
            <h2 className={styles.balanceValue}>{formatCurrency(availableBalance)}</h2>
            <span className={`${styles.statusChip} ${user.isMember ? styles.active : styles.inactive}`}>
              Wallet {user.isMember ? "Active" : "Inactive"}
            </span>

            <div className={styles.actionRow}>
              <Link href="/membership" className={styles.actionPrimary}>Activate Account</Link>
              <Link href="/withdraw" className={`${styles.actionSecondary} ${styles.actionWithdraw}`}>Withdraw</Link>
              <Link href="/tasks" className={styles.actionSecondary}>Tasks</Link>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.progressOrb}>
              <svg viewBox="0 0 160 160" className={styles.progressRing}>
                <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="9" />
                <circle cx="80" cy="80" r="72" fill="none" stroke="url(#goldGrad)" strokeWidth="9" strokeDasharray={`${dash} ${circumference}`} strokeLinecap="round" transform="rotate(-90 80 80)" />
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C69F3A" />
                    <stop offset="100%" stopColor="#FFD66B" />
                  </linearGradient>
                </defs>
                <text x="80" y="77" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="800">{progress}%</text>
                <text x="80" y="98" textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize="12">Progress</text>
              </svg>
            </div>
          </div>
        </section>

        <section className={styles.fundsSection}>
          <div className={styles.sectionHead}>
            <h3>Your Funds</h3>
            <span>View All</span>
          </div>
          <div className={styles.fundsGrid}>
            <article className={styles.fundCard}><small>Task Fund</small><strong>{formatCurrency(taskEarned)}</strong></article>
            <article className={styles.fundCard}><small>Pending</small><strong>{formatCurrency(user.pendingBalance)}</strong></article>
            <article className={styles.fundCard}><small>Bonus</small><strong>{formatCurrency(user.welcomeBonusClaimed ? 64000 : 0)}</strong></article>
            <article className={styles.fundCard}><small>Balance</small><strong>{formatCurrency(availableBalance)}</strong></article>
          </div>
        </section>

        <section className={styles.trackerSection}>
          <h3>Progress Tracker</h3>
          <div className={styles.trackerBar}>
            <div className={styles.trackerFill} style={{ width: `${progress}%` }} />
            {steps.map((step) => (
              <div key={step.label} className={styles.stepNode}>
                <span className={step.done ? styles.dotDone : styles.dotTodo}>{step.done ? "✓" : "🔒"}</span>
                <small>{step.label}</small>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.activationStrip}>
          <div>
            <h4>{user.isMember ? "Membership Active" : "Activate Membership"}</h4>
            <p>{user.isMember ? "Wallet unlocked for withdrawals and full features." : "Unlock withdrawal + more features."}</p>
          </div>
          <Link href={user.isMember ? "/withdraw" : "/membership"} className={styles.activationBtn}>
            {user.isMember ? "Withdraw" : "Enter Code"}
          </Link>
        </section>

        <section className={styles.dailyTasks}>
          <div className={styles.sectionHead}>
            <h3>Daily Tasks</h3>
            <Link href="/tasks">View All</Link>
          </div>
          <article className={styles.taskItem}>
            <div>
              <strong>Complete Social Task Milestones</strong>
              <p>Reward: {formatCurrency(taskEarned)} earned</p>
            </div>
            <Link href="/tasks" className={styles.taskStart}>Start</Link>
          </article>
          <article className={styles.taskItem}>
            <div>
              <strong>Monthly Performance Target</strong>
              <p>{targetPercent}% of {formatCurrency(monthlyTarget)} target</p>
            </div>
            <Link href="/tasks" className={styles.taskStart}>Open</Link>
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
