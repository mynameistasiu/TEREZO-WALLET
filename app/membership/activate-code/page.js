"use client"
import { useState } from "react"
import Header from "../../../components/Header"
import BottomNav from "../../../components/BottomNav"
import styles from "../membership.module.css"
import { updateUserById } from "../../../lib/localData"

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

    if (entered !== DEFAULT_CODE) {
      setMessage({ type: "error", text: "Invalid activation code" })
      setLoading(false)
      return
    }

    const ok = activateLocally()
    if (!ok) {
      setMessage({ type: "error", text: "Activation failed. Please login again." })
      setLoading(false)
      return
    }
    updateUserById(userId, { isMember: true })
    setMessage({ type: "success", text: "Membership activated. Redirecting..." })
    setLoading(false)
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 900)
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
