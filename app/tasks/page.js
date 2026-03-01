"use client"
import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "../../components/Header"
import BottomNav from "../../components/BottomNav"
import styles from "./tasks.module.css"
import { addLocalTransaction, getCurrentUser, updateUserById } from "../../lib/localData"

const taskStorageKey = (userId) => `tw_task_state_${userId || "guest"}`

const TASKS = [
  {
    id: "whatsapp_join",
    title: "Join WhatsApp Group",
    description: "Join the official Terezo Wallet WhatsApp community.",
    reward: 15000,
    link: "https://chat.whatsapp.com/Eg9ptnZNyZo2tg27E7BZrF?mode=gi_t",
  },
  {
    id: "share_groups",
    title: "Share To 3 WhatsApp Groups",
    description: "Share the invite message to at least three WhatsApp groups.",
    reward: 15000,
    link: "https://wa.me/?text=I%20just%20joined%20Terezo%20Wallet.%20Create%20your%20account%20and%20start%20earning%20today.",
  },
  {
    id: "telegram_follow",
    title: "Follow On Telegram",
    description: "Join the official Telegram channel for updates and announcements.",
    reward: 15000,
    link: "https://t.me/+f3CJ2pgPv0s0NmQ0",
  },
  {
    id: "final_claim",
    title: "Final Task Claim",
    description: "Claim your final reward after completing the first three tasks.",
    reward: 30000,
  },
]

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value)

const initialTaskState = {
  whatsapp_join: false,
  share_groups: false,
  telegram_follow: false,
  final_claim: false,
  rewardsClaimed: {},
}

export default function Tasks() {
  const router = useRouter()
  const [taskState, setTaskState] = useState(initialTaskState)
  const [feedback, setFeedback] = useState({ type: "", text: "" })
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.replace("/auth/login")
      return
    }
    setCurrentUser(user)
    const key = taskStorageKey(user.id)
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        setTaskState({ ...initialTaskState, ...JSON.parse(stored) })
      } catch {
        setTaskState(initialTaskState)
      }
    }
  }, [router])

  const persistTaskState = (next) => {
    setTaskState(next)
    const key = taskStorageKey(currentUser?.id)
    localStorage.setItem(key, JSON.stringify(next))
  }

  const creditTaskReward = (taskId, reward) => {
    const userRaw = localStorage.getItem("user")
    if (!userRaw) return

    try {
      const user = JSON.parse(userRaw)
      const paidMap = taskState.rewardsClaimed || {}
      if (paidMap[taskId]) return

      const updatedUser = {
        ...user,
        balance: Number(user.balance || 0) + reward,
        tasksCompleted: Number(user.tasksCompleted || 0) + 1,
      }

      const nextState = {
        ...taskState,
        rewardsClaimed: { ...paidMap, [taskId]: true },
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))
      updateUserById(updatedUser.id, updatedUser)
      addLocalTransaction({ type: "TASK_REWARD", amount: reward, meta: taskId }, updatedUser.id)
      persistTaskState(nextState)
      setFeedback({ type: "success", text: `${formatCurrency(reward)} added to your Available Balance.` })
    } catch {
      // no-op for invalid local user data
    }
  }

  const markTaskComplete = (taskId) => {
    const task = TASKS.find((item) => item.id === taskId)
    if (!task) return
    if (taskState[taskId]) return

    const next = { ...taskState, [taskId]: true }
    persistTaskState(next)
    creditTaskReward(taskId, task.reward)
  }

  const handleExternalTask = (task) => {
    window.open(task.link, "_blank")
    markTaskComplete(task.id)
  }

  const firstThreeCompleted = taskState.whatsapp_join && taskState.share_groups && taskState.telegram_follow

  const handleFinalClaim = () => {
    if (!firstThreeCompleted) {
      setFeedback({ type: "error", text: "Complete the first three tasks before final claim." })
      return
    }
    markTaskComplete("final_claim")
    setTimeout(() => router.push("/dashboard"), 600)
  }

  const completedCount = useMemo(() => TASKS.filter((task) => taskState[task.id]).length, [taskState])
  const progress = (completedCount / 4) * 100
  const earned = TASKS.filter((task) => taskState[task.id]).reduce((sum, task) => sum + task.reward, 0)

  return (
    <>
      <main className={styles.container}>
        <Header />

        <section className={styles.content}>
          <h1 className={styles.title}>Task Center</h1>
          <p className={styles.subtitle}>Complete all 4 tasks to unlock full task rewards and progress faster in your dashboard.</p>

          <div className={styles.progressCard}>
            <div className={styles.progressTop}>
              <strong>{completedCount}/4 completed</strong>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.progressFoot}>
              <span>Total reward pool: {formatCurrency(75000)}</span>
              <span>Earned: {formatCurrency(earned)}</span>
            </div>
          </div>

          {feedback.text && <div className={`${styles.message} ${styles[feedback.type]}`}>{feedback.text}</div>}

          {completedCount === 4 && (
            <section className={styles.completedBanner}>
              <div className={styles.completedIcon}>✓</div>
              <div>
                <h3>All Tasks Completed</h3>
                <p>Great work. All task rewards are now in your Available Balance on dashboard.</p>
              </div>
            </section>
          )}

          <div className={styles.tasksList}>
            {TASKS.slice(0, 3).map((task) => (
              <article key={task.id} className={styles.taskCard}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <small>{formatCurrency(task.reward)} reward</small>
                </div>
                <button className={styles.taskBtn} onClick={() => handleExternalTask(task)} disabled={taskState[task.id]}>
                  {taskState[task.id] ? "Completed" : "Start Task"}
                </button>
              </article>
            ))}

            <article className={styles.taskCard}>
              <div>
                <h3>Final Claim</h3>
                <p>Claim this final task reward after completing the first 3 tasks.</p>
                <small>{formatCurrency(30000)} reward</small>
              </div>
              <button className={styles.taskBtn} onClick={handleFinalClaim} disabled={taskState.final_claim || !firstThreeCompleted}>
                {taskState.final_claim ? "Claimed" : "Claim Reward"}
              </button>
            </article>
          </div>

          <section className={styles.helpSection}>
            <h3>Trusted User Guidance</h3>
            <ul>
              <li>Each completed task is credited automatically to Available Balance.</li>
              <li>Final claim unlocks automatically after the first three tasks.</li>
              <li>Your dashboard tracker updates automatically with completed task steps.</li>
            </ul>
          </section>
        </section>
      </main>
      <BottomNav />
    </>
  )
}
