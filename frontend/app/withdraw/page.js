"use client"
import { useState, useEffect } from "react"
import { API_BASE } from "../../config"
import Link from "next/link"
import Header from "../../components/Header"
import BottomNav from "../../components/BottomNav"
import styles from "./withdraw.module.css"
import { getApiErrorMessage, getNetworkErrorMessage, parseJsonSafe } from "../../lib/apiError"

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value)

export default function WithdrawPage() {
  const [user, setUser] = useState({ isMember: false, balance: 0, id: null })
  const [formData, setFormData] = useState({ bankName: "", accountName: "", accountNumber: "", amount: "", reason: "" })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    if (!user.isMember) {
      setMessage({ type: "error", text: "Wallet is inactive. Activate account before withdrawing." })
      setLoading(false)
      return
    }

    if (Number(formData.amount) > Number(user.balance)) {
      setMessage({ type: "error", text: "Insufficient balance." })
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...formData, amount: Number(formData.amount) }),
      })
      const data = await parseJsonSafe(response)

      if (!response.ok) {
        setMessage({ type: "error", text: getApiErrorMessage(data, "Error processing withdrawal") })
        return
      }

      setMessage({ type: "success", text: "Withdrawal request submitted. Processing window: 24-72 hours." })
      setFormData({ bankName: "", accountName: "", accountNumber: "", amount: "", reason: "" })
    } catch (error) {
      setMessage({ type: "error", text: getNetworkErrorMessage(error, API_BASE) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className={styles.container}>
        <Header />

        {!user.isMember && (
          <section className={styles.gatingSection}>
            <div className={styles.gatingCard}>
              <h2 className={styles.gatingTitle}>Wallet Inactive</h2>
              <p className={styles.gatingText}>Your wallet must be active before withdrawal is enabled.</p>
              <Link href="/manual-payment" className={styles.btnActivate}>Activate Account</Link>
            </div>
          </section>
        )}

        {user.isMember && (
          <section className={styles.content}>
            <h1 className={styles.title}>Withdraw Funds</h1>
            <p className={styles.subtitle}>Fill your bank details correctly. Approved requests are sent to your account after review.</p>

            <div className={styles.statusCard}>
              <span>Wallet Status</span>
              <strong className={styles.activeStatus}>Active</strong>
              <small>Available Balance: {formatCurrency(user.balance)}</small>
            </div>

            {message.text && <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Bank Name</label>
                <select name="bankName" className={styles.input} value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} required>
                  <option value="">Select Bank</option>
                  <option value="GTBank">Guaranty Trust Bank</option>
                  <option value="Access">Access Bank</option>
                  <option value="FirstBank">First Bank</option>
                  <option value="UBA">United Bank for Africa</option>
                  <option value="Zenith">Zenith Bank</option>
                  <option value="Opay">Opay Bank</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Account Name</label>
                <input type="text" name="accountName" className={styles.input} value={formData.accountName} onChange={(e) => setFormData({ ...formData, accountName: e.target.value })} required />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Account Number</label>
                <input type="text" name="accountNumber" className={styles.input} value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} required />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Amount (NGN)</label>
                <input type="number" name="amount" className={styles.input} value={formData.amount} min="1000" max={user.balance} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Reason (Optional)</label>
                <textarea name="reason" className={styles.textarea} rows="3" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
              </div>

              <button type="submit" className={styles.btnSubmit} disabled={loading}>{loading ? "Processing..." : "Request Withdrawal"}</button>
            </form>
          </section>
        )}
      </main>
      <BottomNav />
    </>
  )
}
