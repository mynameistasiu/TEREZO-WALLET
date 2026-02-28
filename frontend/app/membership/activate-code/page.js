"use client"
import { useState } from "react"
import Header from "../../../components/Header"
import BottomNav from "../../../components/BottomNav"
import styles from "../membership.module.css"
import { API_BASE } from "../../../config"
import { getApiErrorMessage, getNetworkErrorMessage, parseJsonSafe } from "../../../lib/apiError"

const DEFAULT_CODE = "GLS07032256"

export default function ActivateCodePage() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const activateLocally = () => {
    const stored = localStorage.getItem("user")
    if (!stored) return false
    const user = JSON.parse(stored)
    const updated = { ...user, isMember: true }
    localStorage.setItem("user", JSON.stringify(updated))
    localStorage.setItem("tw_wallet_activated", "1")
    return true
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    const entered = code.trim().toUpperCase()
    const stored = localStorage.getItem("user")
    const userId = stored ? JSON.parse(stored).id : null
    if (!userId) {
      setMessage({ type: "error", text: "You must be logged in to activate a code. Please login or register." })
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/membership/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: entered, userId }),
      })
      const data = await parseJsonSafe(response)

      const apiMessage = getApiErrorMessage(data, "")
      const alreadyActive = apiMessage === "User already has membership" || data?.message === "Membership already active"

      if (response.ok || alreadyActive) {
        if (data?.user) {
          const existing = stored ? JSON.parse(stored) : {}
          const merged = { ...existing, ...data.user, isMember: true }
          localStorage.setItem("user", JSON.stringify(merged))
          localStorage.setItem("tw_wallet_activated", "1")
        } else {
          activateLocally()
        }
        setMessage({ type: "success", text: "Membership activated. Redirecting..." })
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1200)
      } else {
        setMessage({ type: "error", text: getApiErrorMessage(data, "Invalid activation code") })
      }
    } catch (err) {
      setMessage({ type: "error", text: getNetworkErrorMessage(err, API_BASE) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className={styles.container}>
        <Header />
        <section className={styles.content}>
          <h1 className={styles.title}>Activate With Code</h1>
          <p className={styles.subtitle}>Enter your activation code to unlock withdrawals and set wallet status to Active.</p>

          {message.text && <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>}

          <form onSubmit={handleCodeSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Activation Code</label>
              <input className={styles.input} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code" required />
            </div>

            <button className={styles.btnSubmit} disabled={loading || !code}>
              {loading ? "Validating..." : "Activate Wallet"}
            </button>
          </form>

          <p className={styles.hint}>Need a code first? Open Purchase Activation Code from Activation Center.</p>
        </section>
      </main>
      <BottomNav />
    </>
  )
}
